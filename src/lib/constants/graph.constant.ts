import { COLORS } from './styles.constant';

export const GRAPH_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: 'nearest', intersect: false },
  layout: { padding: { top: 40, bottom: 10, left: 15, right: 15 } },
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
      font: { size: 12, weight: 'normal' },
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

/**
 * 게시물 상세 그래프 전용 옵션.
 * 전체 기간을 선택하면 데이터가 수백 개까지 늘어나므로 겹치는 라벨은 숨기고, 대신 툴팁으로 값을 확인함.
 */
export const POST_GRAPH_OPTIONS = {
  ...GRAPH_OPTIONS,
  plugins: {
    ...GRAPH_OPTIONS.plugins,
    tooltip: { enabled: true },
    datalabels: { ...GRAPH_OPTIONS.plugins.datalabels, display: 'auto' },
  },
} as const;
