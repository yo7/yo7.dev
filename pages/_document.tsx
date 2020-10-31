import Document, { NextScript } from "next/document"
import { Html, Head, Main } from "next/document"

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta property="og:type" content="website" />
          <meta
            property="description"
            content="Personal website on web development"
          />
          <meta
            property="og:description"
            content="Personal website on web development"
          />
          <meta name="twitter:card" content="summary" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
