import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

const DOCUMENT_TYPE_TO_TAGS: Record<string, string[]> = {
  blogPost: ['blog'],
  faqItem: ['faq', 'landing'],
  testimonial: ['landing'],
  author: ['blog'],
  category: ['blog'],
};

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const documentType = body?._type as string | undefined;

    const tags = documentType
      ? (DOCUMENT_TYPE_TO_TAGS[documentType] ?? ['blog'])
      : ['blog'];

    for (const tag of tags) {
      revalidateTag(tag);
    }

    return NextResponse.json({ revalidated: true, tags });
  } catch {
    return NextResponse.json({ message: 'Error parsing request body' }, { status: 400 });
  }
}
