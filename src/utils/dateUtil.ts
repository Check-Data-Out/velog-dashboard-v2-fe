const KST_DIFF = 9 * 60 * 60 * 1000;

export const convertDateToKST = (date?: string) => {
  if (date) {
    const converted = new Date(new Date(date).getTime() + KST_DIFF);
    return {
      short: `${converted.getFullYear()}-${converted.getMonth() + 1}-${converted.getDate()}`,
      full: converted,
    };
  }
};
