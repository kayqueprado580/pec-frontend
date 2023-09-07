
export const isValidString = (value: string) => {
	if (!value.trim()) {
		return false
	} else {
		return true
	}
};

export const isValidEmail = (value: string) => {
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	if (!emailPattern.test(value)) {
		return false;
	}
	return true;
}

export const isValidPassword = (value: string) => {
	const passowrdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/;
	if (!passowrdPattern.test(value)) {
		return false;
	}
	return true;
}