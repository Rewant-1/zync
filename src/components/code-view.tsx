"use client";

import { useEffect, useMemo, useState } from "react";
import "./code-view/code-theme.css";

type PrismType = typeof import("prismjs");
type PrismGrammar = import("prismjs").Grammar;
let prismPromise: Promise<PrismType> | null = null;

const languageLoaders: Record<string, () => Promise<unknown>> = {
  javascript: () => import("prismjs/components/prism-javascript"),
  typescript: () => import("prismjs/components/prism-typescript"),
  jsx: () => import("prismjs/components/prism-jsx"),
  tsx: () => import("prismjs/components/prism-tsx"),
  css: () => import("prismjs/components/prism-css"),
  json: () => import("prismjs/components/prism-json"),
  python: () => import("prismjs/components/prism-python"),
  bash: () => import("prismjs/components/prism-bash"),
  markdown: () => import("prismjs/components/prism-markdown"),
  yaml: () => import("prismjs/components/prism-yaml"),
};

async function loadPrismAndLanguage(lang: string): Promise<PrismType> {
  if (!prismPromise) {
    prismPromise = import("prismjs");
  }
  const Prism = await prismPromise;
  const loader = languageLoaders[lang];
  if (loader) {
    try {
      await loader();
    } catch {
      // best-effort — ignore missing language module
    }
  }
  return Prism;
}

interface Props {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: Props) => {
  const [html, setHtml] = useState<string>("");

  const normalized = useMemo(() => {
    const map: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      sh: "bash",
      yml: "yaml",
      md: "markdown",
    };
    const l = (lang || "").toLowerCase();
    return map[l] || l || "text";
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    // Only run on client
    if (typeof window === "undefined") return;
    loadPrismAndLanguage(normalized).then((Prism) => {
      if (cancelled) return;
      try {
  const languages = Prism.languages as unknown as Record<string, PrismGrammar>;
        const grammar = languages[normalized];
        const highlighted = grammar
          ? Prism.highlight(code, grammar, normalized)
          : code;
        setHtml(highlighted);
      } catch {
        setHtml("");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code, normalized]);

  return (
    <pre className="p-4 bg-transparent border-none rounded-none m-0 text-sm overflow-auto h-full">
      {html ? (
        <code
          className={`language-${normalized}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <code className={`language-${normalized}`}>{code}</code>
      )}
    </pre>
  );
};
