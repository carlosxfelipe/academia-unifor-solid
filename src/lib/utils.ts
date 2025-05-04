export const getRandomColor = (seed: number): string => {
  const colors = [
    "#F87171",
    "#FBBF24",
    "#34D399",
    "#60A5FA",
    "#A78BFA",
    "#F472B6",
    "#FCD34D",
    "#6EE7B7",
    "#93C5FD",
    "#C4B5FD",
    "#F9A8D4",
  ];
  return colors[seed % colors.length];
};
