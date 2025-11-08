import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />

        {/* SEO Meta Tags */}
        <meta name="title" property="og:title" content="George Lordos" />
        <meta
          name="image"
          property="og:image"
          content="https://cdn.sanity.io/images/ynmpcv7c/production/897fe9dabb6a232dce448fe130e3f06a06950c2c-1419x1418.jpg?rect=386,177,790,764"
        />
        <meta
          name="description"
          property="og:description"
          content="I specialize in the design of robust planetary architecture for the Moon and Mars."
        />
        <meta name="url" property="og:url" content="https://georgelordos.com/" />
        <meta name="image:width" property="og:image:width" content="400" />
        <meta name="image:height" property="og:image:height" content="400" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="George Lordos" />
        <meta
          name="twitter:description"
          content="I specialize in the design of robust planetary architecture for the Moon and Mars."
        />
        <meta
          name="twitter:image"
          content="https://cdn.sanity.io/images/ynmpcv7c/production/897fe9dabb6a232dce448fe130e3f06a06950c2c-1419x1418.jpg?rect=386,177,790,764"
        />
        <meta name="twitter:image:alt" content="Picture of George Lordos" />
        <meta name="twitter:image:width" content="400" />
        <meta name="twitter:image:height" content="400" />

        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4CQKF2KD2M"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4CQKF2KD2M');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
