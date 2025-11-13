import { useHighlightedText } from './useHighlightText.ts';

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

export const HighlightedText = ({ text, highlight }: HighlightedTextProps) => {
  const parts = useHighlightedText(text, highlight);

  return <>{parts}</>;
};
