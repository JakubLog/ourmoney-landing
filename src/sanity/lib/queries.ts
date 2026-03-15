import { groq } from 'next-sanity';

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
    "authorName": author->name,
    category->{ title, "slug": slug.current },
    language,
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
    "authorName": author->name,
    category->{ title, "slug": slug.current },
  }
`;

export const POST_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug && (language == $language || (!(defined(language)) && $language == "pl"))][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    body[]{ ..., _type == "image" => { ..., "url": asset->url, alt, caption } },
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
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
