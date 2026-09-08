export const formatDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  // Get local year, month, day to avoid UTC timezone shifts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};