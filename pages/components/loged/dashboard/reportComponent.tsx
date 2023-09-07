import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { getRandomColors } from '../../../../utils/reportUtils';

interface ReportProps {
	report: {
		revenue: { categoryId: number; categoryName: string; totalAmount: number }[];
		expense: { categoryId: number; categoryName: string; totalAmount: number }[];
	};
	chartType: 'pie' | 'bar';
}

const Report: React.FC<ReportProps> = ({ report, chartType }) => {
	const chartData = {
		labels: report.revenue.map((item) => item.categoryName),
		datasets: [
			{
				data: report.revenue.map((item) => item.totalAmount),
				backgroundColor: chartType === 'pie' ? getRandomColors(report.revenue.length) : '#1288f7',
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="mt-6 mb-4 ml-4 mr-4 rounded-lg shadow-md p-2">
			<h2 className="text-lg font-semibold text-gray-800">Relatório</h2>
			{chartType === 'pie' ? (
				<Pie data={chartData} options={chartOptions} />
			) : (
				<Bar data={chartData} options={chartOptions} />
			)}
		</div>
	);
};

export default Report;
