export const formatValue = (rawValue: string) => {
	let formatted = 'R$ ';

	const cleanedValue = rawValue.replace(/,/g, '');

	if (cleanedValue.length === 1) {
		formatted += `0,0${cleanedValue}`;
	} else if (cleanedValue.length === 2) {
		formatted += `0,${cleanedValue}`;
	} else {
		const cents = cleanedValue.slice(-2);
		const reais = cleanedValue.slice(0, -2);
		// const trimmedCents = cents.replace(/^0+/, '');
		const trimmedReais = reais.replace(/^0+/, '');

		formatted += `${trimmedReais}${cents ? ',' : ''}${cents}`;
	}

	return formatted;
};