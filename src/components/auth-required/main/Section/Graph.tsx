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
    <div className="w-full bg-BG-SUB flex flex-col items-center px-[25px] pb-[30px] gap-[30px] max-MBI:px-5 max-MBI:pb-10">
      <div className="flex items-center gap-5 justify-center flex-wrap max-MBI:flex-col max-TBL:gap-[10px]">
        <div className="flex items-center gap-[inherit] flex-wrap justify-center">
          <Input
            size={isMBI ? 'SMALL' : 'MEDIUM'}
            form="SMALL"
            placeholder="시작 날짜"
            type="date"
          />
          <span className="text-ST4 max-TBL:text-T5 text-TEXT-MAIN">~</span>
          <Input
            size={isMBI ? 'SMALL' : 'MEDIUM'}
            form="SMALL"
            placeholder="종료 날짜"
            type="date"
          />
          <Dropdown
            onChange={() => {}}
            defaultValue={'조회수'}
            options={['조회수', '좋아요', '댓글']}
          />
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
