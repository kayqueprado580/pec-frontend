import React from 'react';

interface CardProps {
	title: string;
	value: string | number;
	borderColor: string;
}
const Card: React.FC<CardProps> = ({ title, value, borderColor }) => {
	return (
		<div className={`border-${borderColor} border-2 m-4 rounded-lg shadow-md p-4`}>
			<h2 className="text-lg font-semibold text-gray-800">{title}</h2>
			<p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
		</div>
	);
};

export default Card;
