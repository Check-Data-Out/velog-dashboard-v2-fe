import { GRAPH_OPTIONS, POST_GRAPH_OPTIONS } from '../graph.constant';

describe('graph.constant', () => {
  it('게시물 상세 그래프만 라벨을 자동으로 숨기고 툴팁으로 값을 보여줘야 한다', () => {
    expect(POST_GRAPH_OPTIONS.plugins.datalabels.display).toBe('auto');
    expect(POST_GRAPH_OPTIONS.plugins.tooltip.enabled).toBe(true);

    // 요약 모달은 표시 기간이 짧아 모든 라벨을 그대로 노출함
    expect(GRAPH_OPTIONS.plugins.datalabels.display).toBe(true);
    expect(GRAPH_OPTIONS.plugins.tooltip.enabled).toBe(false);
  });
});
