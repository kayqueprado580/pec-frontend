import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data }) => {
	const chartRef = useRef(null);

	useEffect(() => {
		if (chartRef.current && data) {
			const ctx = chartRef.current.getContext('2d');
			new Chart(ctx, {
				type: 'pie',
				data: {
					labels: data.categoryName,
					datasets: [
						{
							data: data.totalAmount,
							backgroundColor: '#15df15',
						},
					],
				},
				options: {
					responsive: true,
				},
			});
		}
	}, [data]);

	return <canvas ref={chartRef} />;
};

export default PieChart;
