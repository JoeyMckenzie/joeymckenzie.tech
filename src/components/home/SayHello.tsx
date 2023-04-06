import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import React from 'react';
import Editor from 'react-simple-code-editor';

export default function SayHello(): JSX.Element {
  const [code, setCode] = React.useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  return (
    <div className="flex max-w-3xl rounded-md py-12">
      <Editor
        className="border-1 mx-auto rounded-lg border border-neutral-800"
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) =>
          Prism.highlight(code, Prism.languages.javascript, 'javascript')
        }
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    </div>
  );
}
