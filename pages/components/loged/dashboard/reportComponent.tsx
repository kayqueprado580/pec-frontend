import React from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { formatCurrency, getRandomColors } from '../../../../utils/reportUtils';

interface ReportProps {
  report: {
    revenue: { categoryId: number; categoryName: string; totalAmount: number }[];
    expense: { categoryId: number; categoryName: string; totalAmount: number }[];
  };
  chartType: 'pie' | 'bar';
  isRevenue: boolean
}

const Report: React.FC<ReportProps> = ({ report, chartType, isRevenue }) => {
  let data = []

  if (!report) {
		return (
			<div className="border-collapse">
				<h2 className="pt-12 text-2xl font-bold mb-4 text-center">Sem dados no momento...</h2>
			</div>
		)
	}

  if (isRevenue) {
    data = report.revenue.map((item) => ({
      name: item.categoryName,
      total: item.totalAmount,
    }));
  } else {
    data = report.expense.map((item) => ({
      name: item.categoryName,
      total: item.totalAmount,
    }));
  }

  return (
    <div className="mt-6 mb-4 ml-2 mr-2 rounded-lg shadow-md p-2">
      <h2 className="text-center text-lg font-semibold text-gray-800">{isRevenue ? 'Receitas' : 'Despesas'}</h2>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="name" fill="#1288f7" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRandomColors(data.length)[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        ) : (
          <BarChart data={data}>
            <Bar dataKey="total" fill="#1288f7" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={isRevenue ? '#15df15' : '#F71212'} />
              ))}
            </Bar>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Report;
