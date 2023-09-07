import React from 'react';

interface CardProps {
	title: string;
	value: string | number | undefined;
	borderColor: string;
}

const Card: React.FC<CardProps> = ({ title, value, borderColor }) => {
	let formattedValue: string | number | undefined;
	let textColorClass = 'text-gray-600';

	if (typeof value === 'number')
		formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	else
		formattedValue = value;

	if (value === 'Positivo')
		textColorClass = 'text-green-600'

	if (value === 'Negativo')
		textColorClass = 'text-red-600'

	const cardStyle = {
		borderColor: borderColor,
	};
	return (
		<div className={`border-2 mt-6 mb-4 ml-4 mr-4 rounded-lg shadow-md p-2 text-center`} style={cardStyle}>
			<h2 className="text-lg font-semibold text-gray-800">{title}</h2>
			<p className={`text-2xl font-bold mt-2 ${textColorClass}`}>{formattedValue}</p>
		</div>
	);
};

export default Card;
