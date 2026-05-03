import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";

// Only set up the image builder if a client is available
const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const urlFor = (source: any) => builder?.image(source).auto("format") ?? null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ptComponents: any = {
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: any) => {
      const src = urlFor(value)?.width(900).url();
      if (!src) return null;
      return (
        <figure className="my-8">
          <img
            src={src}
            alt={value.alt ?? ""}
            className="w-full rounded-2xl object-cover"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-white/40 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-extrabold text-white mt-10 mb-4 leading-tight">{children}</h1>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-white mt-8 mb-3 leading-tight">{children}</h2>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-white mt-6 mb-2 leading-snug">{children}</h3>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normal: ({ children }: any) => (
      <p className="text-white/75 leading-relaxed mb-5">{children}</p>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-purple-500/70 pl-5 py-1 my-6 italic text-white/60">
        {children}
      </blockquote>
    ),
  },
  marks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    strong: ({ children }: any) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    em: ({ children }: any) => <em className="italic text-white/80">{children}</em>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: ({ children }: any) => (
      <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300 text-sm font-mono">
        {children}
      </code>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-1.5 mb-5 text-white/75 ml-2">{children}</ul>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-1.5 mb-5 text-white/75 ml-2">{children}</ol>
    ),
  },
  listItem: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bullet: ({ children }: any) => <li className="text-white/75 leading-relaxed">{children}</li>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    number: ({ children }: any) => <li className="text-white/75 leading-relaxed">{children}</li>,
  },
};

export function PortableTextRenderer({ content }: { content: PortableTextBlock[] }) {
  return (
    <div className="portable-text">
      <PortableText value={content} components={ptComponents} />
    </div>
  );
}
