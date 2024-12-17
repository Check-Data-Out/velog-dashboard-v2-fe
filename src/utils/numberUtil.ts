export const parseNumber = (item: number) =>
  item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
