import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import { totalStats } from '@/lib/apis/dashboard.request';
import { GRAPH_OPTIONS } from '@/lib/constants/graph.constant';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { sidebarId, SidebarIdType } from '@/lib/constants/sidebar.constant';
import { COLORS } from '@/lib/constants/styles.constant';
import { convertDateToKST } from '@/lib/utils/datetime.util';
import { Modal as Layout } from '@/shared/Modal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

const datasets = {
  backgroundColor: COLORS.TEXT.MAIN,
  borderColor: COLORS.PRIMARY.MAIN,
};

const defaultData = {
  labels: [],
  datasets: [
    {
      label: 'default',
      data: [],
      ...datasets,
    },
  ],
};

export const Modal = ({ name }: { name: SidebarIdType }) => {
  const { data } = useQuery({
    queryKey: queryKeys.totalStats(name),
    queryFn: async () => await totalStats(name),
    select: (res) => ({
      labels: res.map((i) => convertDateToKST(i.date)?.short),
      datasets: [{ label: name, data: res.map((i) => i.value), ...datasets }],
    }),
  });

  return (
    <Layout
      title={sidebarId[name]}
      className="w-[1000px] max-w-full gap-1 max-TBL:w-[700px] max-MBI:w-full transition-all overflow-hidden"
    >
      <Line
        data={data || defaultData}
        options={GRAPH_OPTIONS}
        className="w-full !h-auto max-h-[300px]"
      />
      <span className="text-SUBTITLE-5 self-end text-PRIMARY-MAIN">
        * 7일 전까지의 데이터만 표시됩니다
      </span>
    </Layout>
  );
};
