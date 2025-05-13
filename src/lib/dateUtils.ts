export const formatDateForInput = (date: string): string => {
  if (!date) return "";
  if (date.includes("-")) return date; // já está no formato ISO
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (date: string): string => {
  if (!date) return "";

  if (date.includes("-")) {
    // ISO: yyyy-mm-dd
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  if (date.includes("/")) {
    // Já está no formato brasileiro
    return date;
  }

  return date;
};
