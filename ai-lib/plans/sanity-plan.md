1. Sanity — dane projektu

  - Project ID: 1qxk83xl
  - Dataset: production
  - API version: 2025-02-19 (lub nowszy)
  - Domena: ourmoney.pl
  - Języki: pl (domyślny), en

  ---
  2. Zapytania GROQ

  Pojedynczy artykuł (strona /blog/[slug])

  *[_type == "blogPost" && language == $language && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage { asset->, alt },
    body[]{ ..., _type == "image" => { asset->, alt } },
    author->{ name, slug, avatar { asset-> }, role, bio },
    category->{ title, slug },
    relatedFaq[]->{ question, answer },
    seo {
      title,
      description,
      canonical,
      ogImage { asset-> },
      keywords,
      noIndex
    },
    aiSeo {
      aiSummary,
      keyTakeaways
    },
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      title, slug, language
    }
  }

  Lista artykułów (strona /blog)

  *[_type == "blogPost" && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage { asset->, alt },
    author->{ name, avatar { asset-> } },
    category->{ title, slug }
  }

  Artykuły po kategorii (strona /blog/kategoria/[slug])

  *[_type == "blogPost" && language == $language && category->slug.current == $categorySlug] | order(publishedAt     
  desc) {
    _id, title, slug, publishedAt, excerpt,
    mainImage { asset->, alt },
    author->{ name, avatar { asset-> } }
  }

  FAQ na stronę główną

  *[_type == "faqItem" && language == $language] | order(order asc) {
    question, answer
  }

  Opinie na stronę główną

  *[_type == "testimonial" && language == $language] | order(order asc) {
    name, quote, rating
  }

  ---
  3. Meta tagi HTML — <head>

  Na każdej stronie artykułu generuj w <head>:

  <title>{seo.title}</title>
  <meta name="description" content="{seo.description}" />
  <meta name="keywords" content="{seo.keywords (join ', ')}" />

  <!-- Canonical — użyj seo.canonical jeśli ustawiony, inaczej bieżący URL -->
  <link rel="canonical" href="{seo.canonical || 'https://ourmoney.pl/blog/' + slug.current}" />

  <!-- Alternate languages — z _translations -->
  <link rel="alternate" hreflang="pl" href="https://ourmoney.pl/blog/{translations.pl.slug}" />
  <link rel="alternate" hreflang="en" href="https://ourmoney.pl/en/blog/{translations.en.slug}" />
  <link rel="alternate" hreflang="x-default" href="https://ourmoney.pl/blog/{translations.pl.slug}" />

  <!-- No index (warunkowy) -->
  {seo.noIndex && <meta name="robots" content="noindex, nofollow" />}

  <!-- Open Graph -->
  <meta property="og:title" content="{seo.title}" />
  <meta property="og:description" content="{seo.description}" />
  <meta property="og:image" content="{seo.ogImage.asset.url}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="{canonical URL}" />
  <meta property="og:locale" content="{language == 'pl' ? 'pl_PL' : 'en_US'}" />
  <meta property="article:published_time" content="{publishedAt}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{seo.title}" />
  <meta name="twitter:description" content="{seo.description}" />
  <meta name="twitter:image" content="{seo.ogImage.asset.url}" />

  ---
  4. JSON-LD Structured Data

  Na stronie artykułu umieść wszystkie poniższe bloki JSON-LD w <head>:

  4a. Article + Person (autor)

  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{title}",
    "description": "{seo.description}",
    "image": "{mainImage.asset.url}",
    "datePublished": "{publishedAt}",
    "dateModified": "{_updatedAt || publishedAt}",
    "url": "{canonical URL}",
    "inLanguage": "{language}",
    "keywords": "{seo.keywords (join ', ')}",
    "author": {
      "@type": "Person",
      "name": "{author.name}",
      "jobTitle": "{author.role}",
      "description": "{author.bio}",
      "image": "{author.avatar.asset.url}",
      "url": "https://ourmoney.pl/autor/{author.slug.current}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OurMoney",
      "url": "https://ourmoney.pl",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ourmoney.pl/logo.png"
      }
    }
  }

  4b. BreadcrumbList (z category)

  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Blog",
        "item": "https://ourmoney.pl/blog"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "{category.title}",
        "item": "https://ourmoney.pl/blog/kategoria/{category.slug.current}"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "{title}"
      }
    ]
  }

  4c. FAQPage (z relatedFaq)

  Generuj tylko jeśli relatedFaq ma przynajmniej 1 element:

  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "{relatedFaq[0].question}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "{relatedFaq[0].answer}"
        }
      }
      // ... kolejne elementy relatedFaq
    ]
  }

  ---
  5. AI SEO — osadzanie w HTML

  Pola aiSeo służą do tego, żeby AI-agenty (ChatGPT, Perplexity, Google SGE) mogły łatwo wyciągnąć i zacytować       
  kluczowe informacje z artykułu. Osadź je na stronie w następujący sposób:

  5a. AI Summary — widoczna sekcja TL;DR

  Renderuj na górze artykułu (pod tytułem, przed body) jako wyróżniony blok:

  <aside class="tldr" aria-label="Streszczenie">
    <strong>W skrócie:</strong>
    <p>{aiSeo.aiSummary}</p>
  </aside>

  5b. Key Takeaways — widoczna sekcja

  Renderuj jako listę pod TL;DR lub na końcu artykułu:

  <section class="key-takeaways" aria-label="Kluczowe wnioski">
    <h2>Kluczowe wnioski</h2>
    <ul>
      <li>{aiSeo.keyTakeaways[0]}</li>
      <li>{aiSeo.keyTakeaways[1]}</li>
      <!-- ... -->
    </ul>
  </section>

  5c. Ukryte meta-dane dla crawlerów AI

  Dodatkowo, w <head> umieść meta tagi, które AI-crawlery czytają:

  <!-- Streszczenie dla AI -->
  <meta name="summary" content="{aiSeo.aiSummary}" />

  <!-- Dodatkowe dane strukturalne dla agentów AI -->
  <meta name="article:key_takeaways" content="{aiSeo.keyTakeaways (join ' | ')}" />

  ---
  6. Powiązane FAQ — renderowanie na stronie

  Jeśli artykuł ma relatedFaq, renderuj sekcję FAQ na końcu artykułu (przed komentarzami / footer):

  <section class="article-faq">
    <h2>Najczęściej zadawane pytania</h2>
    {relatedFaq.map(faq => (
      <details>
        <summary>{faq.question}</summary>
        <p>{faq.answer}</p>
      </details>
    ))}
  </section>

  Użyj <details>/<summary> — jest semantyczny, dostępny, i Google rozumie go jako FAQ.

  ---
  7. Tłumaczenia — przełącznik języka

  Z pola _translations zbuduj przełącznik:

  <nav aria-label="Zmień język">
    {_translations
      .filter(t => t.language !== currentLanguage)
      .map(t => (
        <a href="/{t.language === 'pl' ? '' : t.language + '/'}blog/{t.slug.current}">
          {t.language === 'pl' ? 'Polski' : 'English'}
        </a>
      ))
    }
  </nav>

  Pamiętaj: jeśli _translations jest puste lub nie zawiera danego języka, nie pokazuj linku do tego języka.

  ---
  8. Strona autora (/autor/[slug])

  Zapytanie GROQ:

  {
    "author": *[_type == "author" && slug.current == $slug][0]{
      name, slug, avatar { asset-> }, role, bio
    },
    "posts": *[_type == "blogPost" && language == $language && author->slug.current == $slug] | order(publishedAt    
  desc) {
      title, slug, publishedAt, excerpt, mainImage { asset->, alt },
      category->{ title, slug }
    }
  }

  JSON-LD dla strony autora:

  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "{author.name}",
      "jobTitle": "{author.role}",
      "description": "{author.bio}",
      "image": "{author.avatar.asset.url}"
    }
  }

  ---
  9. Checklist przed wdrożeniem

  - Każdy artykuł ma <title>, <meta description>, <link rel="canonical">
  - Każdy artykuł ma <link rel="alternate" hreflang> dla PL i EN
  - JSON-LD Article z rozwiązanym author (Person) na każdej stronie artykułu
  - JSON-LD BreadcrumbList z rozwiązaną category na każdej stronie artykułu
  - JSON-LD FAQPage generowany warunkowo (tylko gdy relatedFaq niepuste)
  - Sekcja TL;DR (aiSeo.aiSummary) widoczna na stronie
  - Sekcja kluczowych wniosków (aiSeo.keyTakeaways) widoczna na stronie
  - <meta name="summary"> w <head>
  - Sekcja FAQ renderowana z <details>/<summary>
  - Przełącznik języków z _translations
  - noIndex — warunkowy <meta name="robots" content="noindex">
  - Obrazki z alt text (mainImage + inline w body)
  - Zwaliduj structured data na https://search.google.com/test/rich-results