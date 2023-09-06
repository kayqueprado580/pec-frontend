import Image from 'next/image'

const Logo = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<Image src="/img/pec-no-bg.png" alt="logo" width="300" height="300"/>
		</div>
	);
};

export default Logo;