'use client';

import { CartesianGrid, LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

type AllTransactionsType = {
  day: string,
  income: number,
  expense: number
}[];

type AllTransactionsTypeProps = {
  all_transactions: AllTransactionsType;
};

export default function ChartByPeriod({all_transactions}: AllTransactionsTypeProps) {
  return (
    <LineChart
      data={all_transactions}
      style={{ width: '100%', maxWidth: '100%', height: 'clamp(16rem, 45vw, 32rem)' }}
      responsive      
      margin={{
        top: 10,
        right: 12,
        left: -4,
        bottom: 0,
      }}
    >
      <CartesianGrid />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="income"
        stroke="#346538"
        strokeWidth={3}
      />
      <Line
        type="monotone"
        dataKey="expense"
        stroke="#9F2F2D"
        strokeWidth={3}
      />
    </LineChart>
  );
}
