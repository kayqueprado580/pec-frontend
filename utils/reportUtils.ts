export const getRandomColors = (count: number) => {
	const colors = [];
	for (let i = 0; i < count; i++) {
		colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
	}
	return colors;
};

export const formatCurrency = (value: number) => {
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	});
}