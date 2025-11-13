import React from 'react';

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

export const HighlightedText = ({ text, highlight }: HighlightedTextProps) => {
  if (!highlight) return <>{text}</>;

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

  if (!indices.length) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let textIndex = 0;

  for (const idx of indices) {
    if (textIndex < idx) parts.push(text.slice(textIndex, idx)); // звичайний текст
    parts.push(
      <span key={idx} style={{ backgroundColor: 'yellow' }}>
        {text[idx]}
      </span>
    );
    textIndex = idx + 1;
  }

  if (textIndex < text.length) parts.push(text.slice(textIndex)); // решта тексту

  return <>{parts}</>;
};
