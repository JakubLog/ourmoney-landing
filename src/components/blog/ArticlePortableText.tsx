import Image from 'next/image';
import { PortableText, type PortableTextComponents } from 'next-sanity';
import { withAppLocale } from '@/lib/appLinks';

type PortableTextValue = Parameters<typeof PortableText>[0]['value'];

const createComponents = (locale: string): PortableTextComponents => ({
  types: {
    image: ({
      value,
    }: {
      value: { url?: string; alt?: string; caption?: string };
    }) => {
      if (!value.url) return null;
      return (
        <figure className="my-10 -mx-4 md:-mx-12 not-prose">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-surface-2">
            <Image
              src={value.url}
              alt={value.alt || value.caption || 'Article image'}
              title={value.alt || value.caption || undefined}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-dark/40 mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },

  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-[2rem] text-dark mt-12 mb-6 leading-tight not-prose">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-2xl text-dark mt-10 mb-4 leading-snug not-prose">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-semibold text-lg text-dark mt-8 mb-3 not-prose">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-base text-dark/75 leading-[1.8] mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-accent pl-6 my-10 not-prose">
        <p className="text-xl text-dark/65 leading-relaxed">{children}</p>
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
      <li className="flex items-start gap-3 text-dark/75 leading-[1.8]">
        <span
          className="mt-[0.6em] w-1.5 h-1.5 rounded-full bg-accent shrink-0"
          aria-hidden="true"
        />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-dark/75 leading-[1.8] pl-1">{children}</li>
    ),
  },

  marks: {
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith('http');
      // Linki w tresci artykulu moga prowadzic do aplikacji - niosa locale dalej
      const href = value?.href ? withAppLocale(value.href, locale) : undefined;
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-dark font-medium underline decoration-accent decoration-2 underline-offset-[3px] hover:opacity-60 transition-opacity"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-dark">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-dark/80">{children}</em>,
    code: ({ children }) => (
      <code className="bg-surface-2 text-dark px-2 py-1 rounded text-[0.875em] font-mono before:content-none after:content-none">
        {children}
      </code>
    ),
  },
});

// Locale sa tylko dwa - budujemy mape komponentow raz, nie przy kazdym renderze
const componentsByLocale = new Map<string, PortableTextComponents>();

function getComponents(locale: string): PortableTextComponents {
  let components = componentsByLocale.get(locale);
  if (!components) {
    components = createComponents(locale);
    componentsByLocale.set(locale, components);
  }
  return components;
}

export function ArticlePortableText({
  value,
  locale = 'pl',
}: {
  value: PortableTextValue;
  locale?: string;
}) {
  return <PortableText value={value} components={getComponents(locale)} />;
}
