import { Themed } from '@theme-ui/mdx';

// // `components` object passed to PortableText

export const customComponents = {
    block: {
      normal: ({ children }) => <Themed.p>{children}</Themed.p>,
      h1: ({ children }) => <h1>{children}</h1>,
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
      h4: ({ children }) => <h4>{children}</h4>,
      h5: ({ children }) => <h5>{children}</h5>,
      h6: ({ children }) => <h6>{children}</h6>,
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
      pre: ({ children }) => <pre>{children}</pre>,
    },
    list: {
      bullet: ({ children }) => <ul className="mt-xl">{children}</ul>,
      number: ({ children }) => <ol className="mt-lg">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li style={{ listStyleType: "disclosure-closed" }}>{children}</li>
      ),
      number: ({ children }) => (
        <li style={{ listStyleType: "disclosure-closed" }}>{children}</li>
      ),
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
      callToAction: ({ value, isInline }) =>
        isInline ? (
          <a href={value.url}>{value.text}</a>
        ) : (
          <div className="callToAction">{value.text}</div>
        ),
    },
  };
  