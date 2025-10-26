import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="canonical" href="https://www.azlok.com" />
        <link rel="sitemap" type="application/xml" href="https://www.azlok.com/sitemap.xml" />
        <link rel="alternate" hrefLang="en" href="https://www.azlok.com" />
        <link rel="alternate" hrefLang="en-us" href="https://www.azlok.com" />
        <link rel="alternate" hrefLang="en-in" href="https://www.azlok.com" />
        <link rel="alternate" hrefLang="x-default" href="https://www.azlok.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
