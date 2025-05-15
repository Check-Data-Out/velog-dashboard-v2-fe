const KST_DIFF = 9 * 60 * 60 * 1000;

export const convertDateToKST = (date?: string) => {
  if (!date) return;
  const converted = new Date(new Date(date).getTime() + KST_DIFF);

  const year = converted.getFullYear();
  const month = (converted.getMonth() + 1).toString().padStart(2, '0');
  const day = converted.getDate().toString().padStart(2, '0');
  const hours = converted.getHours().toString().padStart(2, '0');
  const minutes = converted.getMinutes().toString().padStart(2, '0');
  const seconds = converted.getSeconds().toString().padStart(2, '0');

  return {
    short: `${converted.getFullYear()}-${(converted.getMonth() + 1).toString().padStart(2, '0')}-${converted.getDate().toString().padStart(2, '0')}`,
    iso: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`,
    full: converted,
  };
};
