import { JSX } from "solid-js";

interface Props {
  children: JSX.Element;
  color?: string;
  alignCenter?: boolean;
  alignRight?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  justify?: boolean;
}

const defaultColor = "text-gray-700 dark:text-gray-300";

export default function Paragraph({
  children,
  color,
  alignCenter,
  alignRight,
  uppercase,
  lowercase,
  justify,
}: Props) {
  const finalColor = color || defaultColor;

  let alignmentClass = "";
  if (alignCenter) alignmentClass = "text-center";
  if (alignRight) alignmentClass = "text-right";
  if (justify) alignmentClass = "text-justify";

  let textTransformClass = "";
  if (uppercase) textTransformClass = "uppercase";
  if (lowercase) textTransformClass = "lowercase";

  const combinedClassName = `${finalColor} ${alignmentClass} ${textTransformClass} mt-4 mb-8 text-left`;

  return <p class={combinedClassName}>{children}</p>;
}
