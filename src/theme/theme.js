/** @jsxImportSource theme-ui */

export const theme = {
    fonts: {
      body: "EB Garamond, serif",
      heading: "EB Garamond, serif",
      monospace: "monospace",
    },
    fontSizes: [18, 21, 24, 36, 48],
    fontWeights: {
      body: 400,
      medium: 500,
      bold: 600,
      heading: 500,
    },
    lineHeights: {
      body: 1.25,
      heading: 1.125,
    },
    colors: {
      text: "#333",
      background: "#fff",
    },
    text: {
      heading: {
        fontFamily: "heading",
        lineHeight: "heading",
        fontWeight: "heading",
      },
      body: {
        fontFamily: "body",
        lineHeight: "body",
        fontWeight: "body",
      },
    },
    styles: {
      root: {
        fontFamily: "body",
        lineHeight: "body",
        fontWeight: "body",
        overflowWrap: "break-word",
        fontSize: 0,
      },
      h1: {
        variant: "text.heading",
        fontSize: 4,
      },
      h2: {
        variant: "text.body",
        fontSize: 3,
      },
      h3: {
        variant: "text.body",
        fontSize: 2,
      },
      h4: {
        variant: "text.body",
        fontSize: 1,
      },
      h5: {
        variant: "text.body",
        fontSize: 1,
      },
      p: {
        variant: "text.body",
        fontSize: 1,
      },
      ul: {
        variant: "text.body",
        fontSize: 1,
      },
      code: {
        fontFamily: "monospace",
        fontSize: "inherit",
      },
    },
  };