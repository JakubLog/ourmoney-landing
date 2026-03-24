import Image from 'next/image';
import { PortableText, type PortableTextComponents } from 'next-sanity';

type PortableTextValue = Parameters<typeof PortableText>[0]['value'];

const components: PortableTextComponents = {
  types: {
    image: ({
      value,
    }: {
      value: { url?: string; alt?: string; caption?: string };
    }) => {
      if (!value.url) return null;
      return (
        <figure className="my-10 -mx-4 md:-mx-12 not-prose">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#f0f0f0]">
            <Image
              src={value.url}
              alt={value.alt || value.caption || 'Article image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-[#141414]/40 mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },

  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-[2rem] text-[#141414] mt-12 mb-5 leading-tight not-prose">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-2xl text-[#141414] mt-10 mb-4 leading-snug not-prose">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-semibold text-lg text-[#141414] mt-8 mb-3 not-prose">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-base text-[#141414]/75 leading-[1.8] mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-[#bbff00] pl-6 my-10 not-prose">
        <p className="text-xl text-[#141414]/65 leading-relaxed">{children}</p>
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => <ul className="my-6 space-y-3 not-prose">{children}</ul>,
    number: ({ children }) => (
      <ol className="my-6 space-y-3 not-prose list-decimal list-outside pl-6">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-[#141414]/75 leading-[1.8]">
        <span
          className="mt-[0.6em] w-1.5 h-1.5 rounded-full bg-[#bbff00] shrink-0"
          aria-hidden="true"
        />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-[#141414]/75 leading-[1.8] pl-1">{children}</li>
    ),
  },

  marks: {
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith('http');
      return (
        <a
          href={value?.href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-[#141414] font-medium underline decoration-[#bbff00] decoration-2 underline-offset-[3px] hover:opacity-60 transition-opacity"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-[#141414]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-[#141414]/80">{children}</em>,
    code: ({ children }) => (
      <code className="bg-[#f0f0f0] text-[#141414] px-1.5 py-0.5 rounded text-[0.875em] font-mono before:content-none after:content-none">
        {children}
      </code>
    ),
  },
};

export function ArticlePortableText({ value }: { value: PortableTextValue }) {
  return <PortableText value={value} components={components} />;
}
