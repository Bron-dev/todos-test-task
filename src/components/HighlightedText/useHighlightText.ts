import { useMemo } from 'react';

export const useHighlightedText = (text: string, highlight: string) => {
  return useMemo(() => {
    if (!highlight) return [{ text, highlight: false }];

    const lowerText = text.toLowerCase();
    const lowerHighlight = highlight.toLowerCase();

    const indices: number[] = [];
    let lastIndex = -1;

    for (const char of lowerHighlight) {
      const index = lowerText.indexOf(char, lastIndex + 1);
      if (index === -1) break;
      indices.push(index);
      lastIndex = index;
    }

    if (!indices.length) return [{ text, highlight: false }];

    const parts: { text: string; highlight: boolean }[] = [];
    let textIndex = 0;

    for (const idx of indices) {
      if (textIndex < idx) parts.push({ text: text.slice(textIndex, idx), highlight: false });
      parts.push({ text: text[idx], highlight: true });
      textIndex = idx + 1;
    }

    if (textIndex < text.length) parts.push({ text: text.slice(textIndex), highlight: false });

    return parts;
  }, [text, highlight]);
};
