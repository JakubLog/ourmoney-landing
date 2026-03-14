import { groq } from 'next-sanity';

export const POSTS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current) && language == $language]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    author,
    language,
  }
`;

export const POST_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug && language == $language][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    body,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    author,
    language,
    seo,
  }
`;
