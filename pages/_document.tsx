import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { firstValueFrom, from } from 'rxjs';

class CustomDocument extends Document {
  static getInitialProps(context: DocumentContext) {
    return firstValueFrom(from(Document.getInitialProps(context)));
  }

  render() {
    return (
      <Html lang="en-US" className="h-full">
        <Head />
        <body className="h-full bg-white dark:bg-stone-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
