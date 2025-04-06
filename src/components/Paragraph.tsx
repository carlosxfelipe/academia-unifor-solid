import { JSX } from "solid-js";

interface ParagraphProps {
  children: JSX.Element;
}

export default function Paragraph({ children }: ParagraphProps) {
  return (
    <p class="mt-4 mb-8 text-gray-700 dark:text-gray-300 text-left">
      {children}
    </p>
  );
}
