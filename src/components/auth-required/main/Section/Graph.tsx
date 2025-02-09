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
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { COLORS, PATHS, SCREENS } from '@/constants';
import { Dropdown, Input } from '@/components';
import { useResponsive } from '@/hooks';
import { postDetail } from '@/apis';
import { PostDetailValue } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const datasets = {
  backgroundColor: COLORS.TEXT.MAIN,
  borderColor: COLORS.PRIMARY.MAIN,
};

const defaultData = {
  labels: [],
  datasets: [],
};

interface IProp {
  id: string;
  releasedAt: string;
}

export const Graph = ({ id, releasedAt }: IProp) => {
  const width = useResponsive();

  const isMBI = width < SCREENS.MBI;

  const [type, setType] = useState({
    start: '',
    end: '',
    type: 'View',
  });

  const { data: datas } = useQuery({
    queryKey: [PATHS.DETAIL, type],
    queryFn: async () => await postDetail(id, type.start, type.end),
    select: ({ post }) => ({
      labels: post.map((i) => i.date.split('T')[0]),
      datasets: [
        {
          label: type.type,
          data: post.map(
            (i) => i[`daily${type.type}Count` as keyof PostDetailValue],
          ),
          ...datasets,
        },
      ],
    }),
    enabled: !!type.start && !!type.end,
  });

  return (
    <div className="w-full bg-BG-SUB flex flex-col items-center px-[25px] pb-[30px] gap-[30px] max-MBI:px-5 max-MBI:pb-10">
      <div className="flex items-center gap-[20px] flex-wrap justify-center max-TBL:gap-[10px]">
        <Input
          size={isMBI ? 'SMALL' : 'MEDIUM'}
          form="SMALL"
          value={type.start}
          min={releasedAt.split('T')[0]}
          onChange={(e) => setType({ ...type, start: e.target.value })}
          placeholder="시작 날짜"
          type="date"
        />
        <span className="text-ST4 max-TBL:text-T5 text-TEXT-MAIN">~</span>
        <Input
          size={isMBI ? 'SMALL' : 'MEDIUM'}
          form="SMALL"
          value={type.end}
          min={type.start ? type.start : releasedAt.split('T')[0]}
          onChange={(e) => setType({ ...type, end: e.target.value })}
          placeholder="종료 날짜"
          type="date"
        />
        <Dropdown
          onChange={(e) => setType({ ...type, type: e as string })}
          defaultValue={'조회수'}
          options={[
            ['조회수', 'View'],
            ['좋아요', 'Like'],
          ]}
        />
      </div>
      <div className="w-full h-fit relative">
        {!datas && (
          <div className="absolute size-full bg-[#00000077] flex justify-center items-center backdrop-blur-sm rounded-sm">
            <span className="text-TEXT-MAIN">
              날짜를 선택해서 데이터를 확인하세요!
            </span>
          </div>
        )}
        <Line
          data={datas || defaultData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: 'nearest', intersect: false },
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
    </div>
  );
};
