import { JSX } from "solid-js";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: JSX.Element;
  color?: string;
}

const defaultColor = "text-gray-700 dark:text-gray-300";

const headingStyles = {
  1: `text-5xl font-bold mb-8 text-left`,
  2: `text-4xl font-bold mb-6 text-left`,
  3: `text-3xl font-bold mb-4 text-left`,
  4: `text-2xl font-bold mb-3 text-left`,
  5: `text-xl font-bold mb-2 text-left`,
  6: `text-lg font-bold mb-1 text-left`,
};

export default function Heading({ level, children, color }: HeadingProps) {
  const finalColor = color || defaultColor;

  const combinedClassName = `${headingStyles[level]} ${finalColor}`;

  switch (level) {
    case 1:
      return <h1 class={combinedClassName}>{children}</h1>;
    case 2:
      return <h2 class={combinedClassName}>{children}</h2>;
    case 3:
      return <h3 class={combinedClassName}>{children}</h3>;
    case 4:
      return <h4 class={combinedClassName}>{children}</h4>;
    case 5:
      return <h5 class={combinedClassName}>{children}</h5>;
    case 6:
      return <h6 class={combinedClassName}>{children}</h6>;
    default:
      return <h1 class={combinedClassName}>{children}</h1>;
  }
}
