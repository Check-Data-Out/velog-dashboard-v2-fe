import { Line } from 'react-chartjs-2';
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
import { Modal as Layout } from '@/components';
import { COLORS } from '@/constants';

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

export const table = {
  totalViews: '전체 조회수 통계',
  totalLikes: '전체 좋아요 통계',
  totalPosts: '총 게시글 통계',
};

const datasets = {
  backgroundColor: COLORS.TEXT.MAIN,
  borderColor: COLORS.PRIMARY.MAIN,
};

const defaultData = {
  labels: [
    '2025-03-01',
    '2025-03-02',
    '2025-03-03',
    '2025-03-04',
    '2025-03-05',
    '2025-03-06',
    '2025-03-07',
  ],
  datasets: [
    {
      label: 'Temp',
      data: [10, 11, 14, 23, 36, 50, 79],
      ...datasets,
    },
  ],
};

export const Modal = ({ name }: { name: keyof typeof table }) => {
  return (
    <Layout
      title={table[name]}
      className="w-[1100px] max-TBL:w-[800px] max-MBI:w-[500px] transition-all overflow-hidden"
    >
      <Line
        data={defaultData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: 'nearest', intersect: false },
          layout: {
            padding: {
              top: 30,
              bottom: 10,
              left: 10,
              right: 10,
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
        }}
        className="w-full h-[auto_!important] max-h-[300px]"
      />
    </Layout>
  );
};
