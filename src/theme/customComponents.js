import { Themed } from "@theme-ui/mdx";
import { urlFor } from "../utils/urlFor";
// // `components` object passed to PortableText

export const customComponents = {
  block: {
    normal: ({ children }) => <Themed.p>{children}</Themed.p>,
    h1: ({ children }) => <Themed.h1>{children}</Themed.h1>,
    h2: ({ children }) => <Themed.h2>{children}</Themed.h2>,
    h3: ({ children }) => <Themed.h3>{children}</Themed.h3>,
    h4: ({ children }) => <Themed.h4>{children}</Themed.h4>,
    h5: ({ children }) => <Themed.h5>{children}</Themed.h5>,
    h6: ({ children }) => <h6>{children}</h6>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    pre: ({ children }) => <pre>{children}</pre>,
  },
  list: {
    bullet: ({ children }) => (
      <Themed.ul className="mt-xl">{children}</Themed.ul>
    ),
    number: ({ children }) => (
      <Themed.ol className="mt-lg">{children}</Themed.ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li style={{}}>{children}</li>,
    number: ({ children }) => <li style={{}}>{children}</li>,
  },
  marks: {
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong>{children}</strong>,
    center: ({ children }) => <div className="centerText">{children}</div>,
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" && "noindex nofollow"}
        >
          {children}
        </a>
      );
    },
    underline: ({ children }) => <u>{children}</u>,
    strikethrough: ({ children }) => <s>{children}</s>,
  },
  types: {
    image: ({ value }) => <img src={urlFor(value).url()} alt="" />,
    embed: ({ value }) => <iframe src={value.embedurl} frameborder="0" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"></iframe>,    
    callToAction: ({ value, isInline }) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
      ),
  },
};
