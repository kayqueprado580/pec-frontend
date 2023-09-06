import Link from 'next/link';
import Image from 'next/image'

const Navbar = () => {

	const handleLogout = () => {
		sessionStorage.removeItem('accessToken');
		window.location.href = '/';
	};

	return (
		<nav className="bg-default-green p-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/" className="text-white text-xl font-bold hover:text-black">
					P.E.C
				</Link>

				<ul className="flex space-x-6">
					<li>
						<Link href="/loged/dashboard" className="text-white hover:underline hover:text-black">
							Dashboard
						</Link>
					</li>
					<li>
						<Link href="/loged/registers" className="text-white hover:underline hover:text-black">
							Registros
						</Link>
					</li>
					<li>
						<Link href="/loged/categories" className="text-white hover:underline hover:text-black">
							Categorias
						</Link>
					</li>
				</ul>

				<div className="flex space-x-6">
					<Link href="/loged/profile" className="text-white hover:underline">
						{/* <i className="fa fa-solid fa-lg fa-user  hover:bg-black"></i> */}
						<i className="fa-solid fa-user fa-lg hover:text-black"></i>
					</Link>
					<button
						onClick={handleLogout}
						className="text-white hover:underline cursor-pointer"
					>
						<i className="fa fa-sign-out fa-xl hover:text-black"></i>

					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
