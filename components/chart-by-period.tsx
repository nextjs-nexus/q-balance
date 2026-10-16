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
      <CartesianGrid stroke="#dce3d5" strokeDasharray="3 5" />
      <XAxis dataKey="day" stroke="#627169" tickLine={false} axisLine={false} />
      <YAxis stroke="#627169" tickLine={false} axisLine={false} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="income"
        stroke="#567535"
        strokeWidth={3}
      />
      <Line
        type="monotone"
        dataKey="expense"
        stroke="#8b6241"
        strokeWidth={3}
      />
    </LineChart>
  );
}
