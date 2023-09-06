import React, { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-default-green text-white rounded-l hover:bg-default-green-2"
      >
        Anterior
      </button>
      <span className="px-4 py-2 bg-default-green text-white">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-default-green text-white rounded-r hover:bg-default-green-2"
      >
        Próximo
      </button>
    </div>
  );
};

export default Pagination;
