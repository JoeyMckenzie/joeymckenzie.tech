import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class CustomDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    return await Document.getInitialProps(context);
  }

  render() {
    return (
      <Html className="h-full bg-gray-100">
        <Head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
