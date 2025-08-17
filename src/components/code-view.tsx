import Prism from "prismjs";
import { useEffect } from "react";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";

import "./code-view/code-theme.css";

interface Props {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: Props) => {
  useEffect(() => {
    // Force re-highlight when code or language changes
    setTimeout(() => {
      Prism.highlightAll();
    }, 0);
  }, [code, lang]);

  // Map common extensions to Prism language identifiers
  const getLanguage = (lang: string) => {
    const langMap: { [key: string]: string } = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      sh: "bash",
      yml: "yaml",
      md: "markdown",
    };
    return langMap[lang] || lang;
  };

  const language = getLanguage(lang);

  return (
    <pre className="p-4 bg-transparent border-none rounded-none m-0 text-sm overflow-auto h-full">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(
            code,
            Prism.languages[language] || Prism.languages.text,
            language
          ),
        }}
      />
    </pre>
  );
};
