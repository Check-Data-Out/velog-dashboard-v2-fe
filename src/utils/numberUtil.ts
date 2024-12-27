export const parseNumber = (item: number) =>
  item ? item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
