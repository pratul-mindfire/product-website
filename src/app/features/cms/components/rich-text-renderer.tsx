import type { ElementType } from "react";

type RichTextNode = {
  children?: RichTextNode[];
  code?: boolean;
  image?: {
    url?: string;
    alternativeText?: string;
  };
  level?: number;
  text?: string;
  type?: string;
  url?: string;
};

type RichTextRendererProps = {
  content: unknown;
};

function renderInline(nodes?: RichTextNode[]) {
  return nodes?.map((node, index) => {
    const key = `${node.type ?? "text"}-${index}`;

    if (node.type === "link" && node.url) {
      return (
        <a key={key} href={node.url} className="underline underline-offset-4">
          {renderInline(node.children)}
        </a>
      );
    }

    if (node.text) {
      return node.code ? <code key={key}>{node.text}</code> : node.text;
    }

    return <span key={key}>{renderInline(node.children)}</span>;
  });
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (typeof content === "string") {
    return (
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  if (!Array.isArray(content)) {
    return null;
  }

  return (
    <div className="space-y-6 text-base leading-8 text-slate-700">
      {content.map((block, index) => {
        const node = block as RichTextNode;
        const key = `${node.type ?? "block"}-${index}`;

        switch (node.type) {
          case "heading": {
            const headingLevel = Math.min(Math.max(node.level ?? 2, 1), 6);
            const HeadingTag = `h${headingLevel}` as ElementType;
            return (
              <HeadingTag
                key={key}
                className="text-2xl font-semibold tracking-tight text-slate-950"
              >
                {renderInline(node.children)}
              </HeadingTag>
            );
          }
          case "quote":
            return (
              <blockquote
                key={key}
                className="border-l-4 border-slate-300 pl-4 italic text-slate-600"
              >
                {renderInline(node.children)}
              </blockquote>
            );
          case "list":
            return node.children?.[0]?.type === "list-item" ? (
              <ul key={key} className="list-disc space-y-2 pl-6">
                {node.children.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>
                    {renderInline(item.children)}
                  </li>
                ))}
              </ul>
            ) : null;
          case "paragraph":
          default:
            return <p key={key}>{renderInline(node.children)}</p>;
        }
      })}
    </div>
  );
}
