import { GRAPH_OPTIONS, POST_GRAPH_OPTIONS } from '../graph.constant';

describe('graph.constant', () => {
  it('게시물 상세 그래프 옵션을 바꿔도 요약 모달 그래프가 영향받지 않아야 한다', () => {
    expect(POST_GRAPH_OPTIONS).not.toBe(GRAPH_OPTIONS);
    expect(POST_GRAPH_OPTIONS.plugins).not.toBe(GRAPH_OPTIONS.plugins);
    expect(POST_GRAPH_OPTIONS).toEqual(GRAPH_OPTIONS);
  });
});
