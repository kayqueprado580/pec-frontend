import React, { useEffect } from 'react';

interface MessageAlertProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
	isMessageError: boolean;
}

const Alert: React.FC<MessageAlertProps> = ({ isOpen, onClose, message, isMessageError }) => {
	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			const modal = document.querySelector('.modal');
			if (modal && !modal.contains(event.target as Node)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscapeKey);
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('keydown', handleEscapeKey);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">

			<div className={`bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md max-w-md modal`}>
				<h2 className="text-xl font-semibold text-default-black mb-4">
					{isMessageError ? 'Erro' : 'Sucesso'}
				</h2>
				<p className={`text-sm text-gray-700 dark:text-gray-400`}>{message}</p>

				<button
					onClick={onClose}
					className="text-default-black hover:underline mt-4 cursor-pointer"
				>
					Fechar
				</button>
			</div>

		</div>
	);
};

export default Alert;
