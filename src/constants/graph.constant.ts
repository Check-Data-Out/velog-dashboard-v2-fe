import { COLORS } from './colors.constant';

export const graphOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: 'nearest', intersect: false },
  layout: {
    padding: {
      top: 40,
      bottom: 10,
      left: 15,
      right: 15,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    datalabels: {
      display: true,
      color: COLORS.TEXT.MAIN,
      backgroundColor: COLORS.BG.MAIN,
      borderColor: COLORS.BORDER.SUB,
      borderWidth: 1,
      borderRadius: 4,
      padding: 4,
      font: {
        size: 12,
        weight: 'normal',
      },
      formatter: (value: number) => value.toString(),
      anchor: 'end',
      align: 'top',
    },
  },
  scales: {
    x: { axis: 'x', grid: { color: COLORS.BORDER.SUB }, ticks: { precision: 0 } },
    y: { axis: 'y', grid: { color: COLORS.BORDER.SUB }, ticks: { precision: 0 } },
  },
} as const;
