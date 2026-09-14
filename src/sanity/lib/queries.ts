import { groq } from 'next-sanity';

export const TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial" && language == $language] | order(order asc) {
    _id,
    name,
    context,
    quote,
    rating,
    "photoUrl": photo.asset->url,
  }
`;

export const POSTS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current) && (language == $language || (!(defined(language)) && $language == "pl"))]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "mainImageBlur": mainImage.asset->metadata.lqip,
    "authorName": author->name,
    category->{ title, "slug": slug.current },
    language,
    "estimatedWordCount": length(pt::text(body)),
  }
`;

export const RELATED_POSTS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current) && (language == $language || (!(defined(language)) && $language == "pl")) && _id != $currentId]
  | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "mainImageBlur": mainImage.asset->metadata.lqip,
    "authorName": author->name,
    category->{ title, "slug": slug.current },
    "estimatedWordCount": length(pt::text(body)),
  }
`;

export const POST_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug && (language == $language || (!(defined(language)) && $language == "pl"))][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    excerpt,
    body[]{ ..., _type == "image" => { ..., "url": asset->url, alt, caption } },
    "estimatedWordCount": length(pt::text(body)),
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "mainImageBlur": mainImage.asset->metadata.lqip,
    author->{ name, "slug": slug.current, "avatarUrl": avatar.asset->url, role, bio },
    category->{ title, "slug": slug.current },
    relatedFaq[]->{ question, answer },
    cta { heading, text, buttonLabel, buttonUrl },
    language,
    seo {
      title,
      description,
      canonical,
      "ogImageUrl": ogImage.asset->url,
      keywords,
      noIndex,
    },
    aiSeo {
      aiSummary,
      keyTakeaways,
    },
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      title,
      "slug": slug.current,
      language,
    },
  }
`;

export const AUTHORS_QUERY = groq`
  *[_type == "author" && (language == $language || (!(defined(language)) && $language == "pl"))] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    "avatarUrl": avatar.asset->url,
  }
`;

// Autor ma dokument per jezyk (plugin document-internationalization) z tym
// samym slugiem - bierzemy wersje w jezyku strony, a gdy jej nie ma, dowolna
// (w praktyce PL). Bez tego /en/author/* serwowalo polskie bio.
export const AUTHOR_QUERY = groq`
  *[_type == "author" && slug.current == $slug]
  | order(select(language == $language => 0, 1) asc)[0] {
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    "avatarUrl": avatar.asset->url,
  }
`;

export const AUTHOR_POSTS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current) && author->slug.current == $slug && (language == $language || (!(defined(language)) && $language == "pl"))]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "mainImageBlur": mainImage.asset->metadata.lqip,
    category->{ title, "slug": slug.current },
    "estimatedWordCount": length(pt::text(body)),
  }
`;

// Kategorie sa tlumaczone tak jak posty (translation.metadata), a slug jest
// jezykowy - dlatego projekcja zwraca `language` i `_translations`. Strona
// kategorii uzywa ich, zeby przekierowac wejscie na obcojezyczny slug i zeby
// hreflang wskazywal realne tlumaczenie, a nie ten sam dokument pod dwoma locale.
export const CATEGORY_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
      language,
    },
  }
`;

// $categorySlugs to slug kategorii razem ze slugami jej tlumaczen. Post bywa
// przypisany do kategorii w drugim jezyku (ta sama kategoria, inny dokument) -
// dopasowanie po calej grupie tlumaczen nie gubi go na liscie.
export const CATEGORY_POSTS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current) && category->slug.current in $categorySlugs
    && (language == $language || (!(defined(language)) && $language == "pl"))]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "mainImageBlur": mainImage.asset->metadata.lqip,
    "authorName": author->name,
    "estimatedWordCount": length(pt::text(body)),
  }
`;

// Tylko kategorie, ktore maja przypisany chocby jeden post - pusta kategoria
// w sitemapie to thin content
export const CATEGORIES_WITH_POSTS_QUERY = groq`
  *[_type == "category" && defined(slug.current)
    && count(*[_type == "blogPost" && defined(slug.current) && references(^._id)]) > 0] {
    title,
    "slug": slug.current,
    language,
  }
`;

export const POST_TRANSLATION_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug && language != $language][0] {
    _id,
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
      language,
    },
  }
`;
