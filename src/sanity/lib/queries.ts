import { groq } from 'next-sanity';

export const TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial" && language == $language] | order(order asc) {
    _id,
    name,
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

export const AUTHOR_QUERY = groq`
  *[_type == "author" && slug.current == $slug][0] {
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
