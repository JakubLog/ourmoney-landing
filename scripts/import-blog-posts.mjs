/**
 * Import postow blogowych z ai-lib/content/blog/*.md prosto do Sanity.
 *
 * Zadne przeklejanie do Studio: skrypt parsuje blok pol na gorze pliku,
 * zamienia tresc markdown na Portable Text, wgrywa obraz glowny jako asset
 * i tworzy dokumenty `blogPost` wraz z powiazaniem tlumaczen (PL <-> EN).
 *
 * Uruchomienie:
 *   SANITY_API_WRITE_TOKEN=<token> node scripts/import-blog-posts.mjs
 *   node scripts/import-blog-posts.mjs --dry-run     (bez tokenu, tylko walidacja)
 *
 * Token: sanity.io/manage -> projekt -> API -> Tokens -> Editor.
 * Skrypt jest idempotentny - kazdy post ma staly _id z sluga, wiec ponowne
 * uruchomienie nadpisuje ten sam dokument zamiast tworzyc duplikat.
 */

import { createClient } from '@sanity/client';
import { createReadStream } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'ai-lib/content/blog');

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '1qxk83xl';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
// --print <slug> wypisuje gotowy dokument w JSON, do podejrzenia Portable Text
const PRINT_SLUG = process.argv[process.argv.indexOf('--print') + 1];

// Kategorie i autor istnieja juz w datasecie - dowiazujemy po slugu.
const DEFAULT_AUTHOR_SLUG = 'magda-nestorowicz';
const CATEGORY_SLUG_BY_LANGUAGE = {
  pl: 'finanse-w-zwiazku',
  en: 'finances-in-relationship',
};

// Limity z .claude/rules/seo-rules.md i ze schematu blogPost.
const LIMITS = {
  title: 80,
  excerpt: 200,
  'seo.title': 60,
  'seo.description': 155,
  'aiSeo.aiSummary': 300,
};

const key = () => crypto.randomBytes(6).toString('hex');

/* ---------------------------------------------------------------- parsowanie */

/**
 * Plik ma dwie czesci rozdzielone linia `---`: blok pol (lista `- **klucz:** wartosc`)
 * i tresc w markdown. Zwraca { fields, markdown }.
 */
function splitFile(input) {
  // Checkout na Windows (core.autocrlf) daje CRLF - normalizujemy do LF.
  const raw = input.replace(/\r\n/g, '\n');
  const separator = raw.indexOf('\n---\n');
  if (separator === -1) {
    throw new Error('Brak separatora `---` miedzy blokiem pol a trescia');
  }
  return {
    header: raw.slice(0, separator),
    markdown: raw.slice(separator + 5).trim(),
  };
}

function parseFields(header) {
  const fields = {};
  let lastListField = null;

  for (const line of header.split('\n')) {
    const field = line.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
    if (field) {
      const [, name, value] = field;
      fields[name] = value.trim();
      lastListField = value.trim() === '' ? name : null;
      if (lastListField) fields[lastListField] = [];
      continue;
    }
    // Pozycje listy pod polem bez wartosci, np. aiSeo.keyTakeaways
    const item = line.match(/^\s+(?:\d+\.|-)\s+(.*)$/);
    if (item && lastListField) fields[lastListField].push(item[1].trim());
  }

  return fields;
}

/** Inline markdown (**bold**, [tekst](href)) -> spany Portable Text + markDefs. */
function parseInline(text) {
  const children = [];
  const markDefs = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let cursor = 0;
  let match;

  const push = (value, marks) => {
    if (value) children.push({ _type: 'span', _key: key(), text: value, marks });
  };

  while ((match = pattern.exec(text)) !== null) {
    push(text.slice(cursor, match.index), []);
    if (match[1] !== undefined) {
      push(match[1], ['strong']);
    } else {
      const markKey = key();
      markDefs.push({ _type: 'link', _key: markKey, href: match[3] });
      push(match[2], [markKey]);
    }
    cursor = match.index + match[0].length;
  }
  push(text.slice(cursor), []);

  return { children, markDefs };
}

function block(style, text, listItem) {
  const { children, markDefs } = parseInline(text);
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs,
    children,
    ...(listItem ? { listItem, level: 1 } : {}),
  };
}

/**
 * Markdown -> Portable Text. Obslugiwany podzbior odpowiada temu, co renderuje
 * ArticlePortableText: h2, h3, h4, akapity, listy punktowane i numerowane,
 * pogrubienia i linki. Pierwszy naglowek h1 pomijamy, bo tytul renderuje strona.
 */
function markdownToPortableText(markdown) {
  const blocks = [];
  let paragraph = [];

  const flush = () => {
    if (paragraph.length) {
      blocks.push(block('normal', paragraph.join(' ')));
      paragraph = [];
    }
  };

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();

    if (line === '') {
      flush();
      continue;
    }
    if (line.startsWith('# ')) {
      flush();
      continue; // tytul h1 pomijamy
    }
    const heading = line.match(/^(#{2,4})\s+(.*)$/);
    if (heading) {
      flush();
      blocks.push(block(`h${heading[1].length}`, heading[2]));
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      flush();
      blocks.push(block('normal', bullet[1], 'bullet'));
      continue;
    }
    const numbered = line.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      flush();
      blocks.push(block('normal', numbered[1], 'number'));
      continue;
    }
    if (line.startsWith('> ')) {
      flush();
      blocks.push(block('blockquote', line.slice(2)));
      continue;
    }
    paragraph.push(line);
  }
  flush();

  return blocks;
}

/* ------------------------------------------------------------------ walidacja */

function validate(post) {
  const problems = [];

  for (const [field, max] of Object.entries(LIMITS)) {
    const value = field.includes('.')
      ? field.split('.').reduce((acc, part) => acc?.[part], post.doc)
      : post.doc[field];
    if (typeof value === 'string' && value.length > max) {
      problems.push(`${field}: ${value.length} znakow, limit ${max}`);
    }
  }
  if (/[^a-z0-9-]/.test(post.doc.slug.current)) {
    problems.push(`slug zawiera niedozwolone znaki: ${post.doc.slug.current}`);
  }
  const takeaways = post.doc.aiSeo?.keyTakeaways?.length ?? 0;
  if (takeaways < 3 || takeaways > 5) {
    problems.push(`aiSeo.keyTakeaways: ${takeaways} pozycji, oczekiwane 3-5`);
  }
  const internalLinks = post.markdown.match(/\]\(\/(pl|en)\//g)?.length ?? 0;
  if (internalLinks < 2) {
    problems.push(`za malo linkow wewnetrznych: ${internalLinks}, wymagane min. 2`);
  }

  return problems;
}

/* ----------------------------------------------------------------- budowanie */

function buildPost(file, raw) {
  const { header, markdown } = splitFile(raw);
  const fields = parseFields(header);
  const language = fields.language ?? 'pl';
  const slug = fields.slug;

  if (!slug) throw new Error(`${file}: brak pola slug`);

  const doc = {
    _id: `blogPost-${slug}`,
    _type: 'blogPost',
    title: fields.title,
    slug: { _type: 'slug', current: slug },
    language,
    publishedAt: fields.publishedAt ?? new Date().toISOString(),
    excerpt: fields.excerpt,
    body: markdownToPortableText(markdown),
    seo: {
      title: fields['seo.title'],
      description: fields['seo.description'],
      keywords: (fields['seo.keywords'] ?? '').split(',').map((k) => k.trim()).filter(Boolean),
      noIndex: false,
    },
    aiSeo: {
      aiSummary: fields['aiSeo.aiSummary'],
      keyTakeaways: fields['aiSeo.keyTakeaways'] ?? [],
    },
    cta: {
      heading: fields['cta.heading'],
      text: fields['cta.text'],
      buttonLabel: fields['cta.buttonLabel'],
      buttonUrl: fields['cta.buttonUrl'],
    },
  };

  return {
    file,
    markdown,
    doc,
    language,
    translationOf: fields.translationOf ?? null,
    image: fields.mainImage ?? null,
    imageAlt: fields['mainImage.alt'] ?? null,
  };
}

/* ------------------------------------------------------------------- import */

async function main() {
  const files = (await readdir(CONTENT_DIR))
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort();

  const posts = [];
  for (const file of files) {
    const raw = await readFile(path.join(CONTENT_DIR, file), 'utf8');
    posts.push(buildPost(file, raw));
  }

  if (process.argv.includes('--print')) {
    const wanted = posts.find((p) => p.doc.slug.current === PRINT_SLUG);
    if (!wanted) {
      console.error(`Nie znaleziono posta o slugu ${PRINT_SLUG}`);
      process.exit(1);
    }
    console.log(JSON.stringify(wanted.doc, null, 2));
    return;
  }

  let invalid = 0;
  for (const post of posts) {
    const problems = validate(post);
    console.log(`${problems.length ? 'BLAD ' : 'OK   '} ${post.file}`);
    for (const problem of problems) console.log(`       ${problem}`);
    invalid += problems.length ? 1 : 0;
  }
  if (invalid) {
    console.error(`\n${invalid} plikow nie przeszlo walidacji. Nic nie zostalo wyslane.`);
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log('\nDry run: walidacja przeszla, nic nie wyslano.');
    return;
  }
  if (!TOKEN) {
    console.error('\nBrak SANITY_API_WRITE_TOKEN. Ustaw token albo uruchom z --dry-run.');
    process.exit(1);
  }

  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2026-03-14',
    token: TOKEN,
    useCdn: false,
  });

  // Autor i kategorie sa juz w datasecie - pobieramy ich _id raz.
  const [authorId, categoryIds] = await Promise.all([
    client.fetch('*[_type=="author" && slug.current==$slug][0]._id', {
      slug: DEFAULT_AUTHOR_SLUG,
    }),
    client.fetch('*[_type=="category"]{ "slug": slug.current, _id }'),
  ]);
  const categoryIdBySlug = Object.fromEntries(categoryIds.map((c) => [c.slug, c._id]));

  // Ten sam obraz obsluguje wersje PL i EN - wgrywamy go raz na plik.
  const assetIdByFile = new Map();
  async function uploadImage(relativePath) {
    if (assetIdByFile.has(relativePath)) return assetIdByFile.get(relativePath);
    const absolute = path.join(CONTENT_DIR, relativePath);
    const asset = await client.assets.upload('image', createReadStream(absolute), {
      filename: path.basename(relativePath),
    });
    assetIdByFile.set(relativePath, asset._id);
    console.log(`  wgrano obraz ${relativePath} -> ${asset._id}`);
    return asset._id;
  }

  const transaction = client.transaction();

  for (const post of posts) {
    const doc = { ...post.doc };

    if (post.image) {
      doc.mainImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: await uploadImage(post.image) },
        alt: post.imageAlt ?? post.doc.title,
      };
    }
    if (authorId) {
      doc.author = { _type: 'reference', _ref: authorId };
    }
    const categoryId = categoryIdBySlug[CATEGORY_SLUG_BY_LANGUAGE[post.language]];
    if (categoryId) {
      doc.category = { _type: 'reference', _ref: categoryId };
    }

    transaction.createOrReplace(doc);
  }

  // Powiazanie tlumaczen w formacie wtyczki document-internationalization,
  // zgodnym z dokumentami translation.metadata, ktore juz sa w datasecie.
  for (const post of posts.filter((p) => p.translationOf)) {
    const source = posts.find((p) => p.doc.slug.current === post.translationOf);
    if (!source) {
      console.warn(`  pominieto powiazanie tlumaczen: brak ${post.translationOf}`);
      continue;
    }
    transaction.createOrReplace({
      _id: `translation-metadata-${source.doc.slug.current}`,
      _type: 'translation.metadata',
      schemaTypes: ['blogPost'],
      translations: [source, post].map((p) => ({
        _key: key(),
        _type: 'internationalizedArrayReferenceValue',
        language: p.language,
        value: { _type: 'reference', _ref: p.doc._id },
      })),
    });
  }

  await transaction.commit();
  console.log(`\nZaimportowano ${posts.length} postow do ${PROJECT_ID}/${DATASET}.`);
  console.log('Odswiez cache landingu: POST /api/revalidate (tag "blog").');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
