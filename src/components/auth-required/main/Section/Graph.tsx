'use client';

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
import { COLORS, SCREENS } from '@/constants';
import { Button, Dropdown, Input } from '@/components';
import { useResponsive } from '@/hooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const data = {
  labels: [
    '2024-12-11',
    '2024-12-12',
    '2024-12-13',
    '2024-12-14',
    '2024-12-15',
    '2024-12-16',
  ],
  datasets: [
    {
      label: 'Views',
      data: [1032, 941, 513, 752, 469, 310],
      fill: true,
      backgroundColor: COLORS.TEXT.MAIN,
      borderColor: COLORS.PRIMARY.MAIN,
    },
  ],
};

export const Graph = () => {
  const width = useResponsive();
  const isMBI = width < SCREENS.MBI;

  return (
    <div className="w-full bg-bg-sub pb-7 max-MBI:pb-14 flex flex-col items-center px-8 gap-[30px]">
      <div className="flex items-center gap-5 max-MBI:gap-[10px] max-MBI:flex-col">
        <div className="flex items-center gap-[inherit]">
          <Input
            size={isMBI ? 'SMALL' : 'MEDIUM'}
            form="SMALL"
            placeholder="시작 날짜"
            type="date"
          />
          <span className="font-bold text-[20px] text-TEXT-MAIN">~</span>
          <Input
            size={isMBI ? 'SMALL' : 'MEDIUM'}
            form="SMALL"
            placeholder="종료 날짜"
            type="date"
          />
          <Dropdown options={['조회수', '좋아요', '댓글']} />
        </div>

        <Button size="SMALL">조회</Button>
      </div>
      <Line
        data={data}
        options={{
          responsive: true,
          animation: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              axis: 'x',
              grid: {
                color: COLORS.BORDER.SUB,
              },
            },
            y: {
              axis: 'y',
              grid: {
                color: COLORS.BORDER.SUB,
              },
            },
          },
        }}
        className="w-[100%_!important] h-[auto_!important] max-h-[300px]"
      />
    </div>
  );
};
