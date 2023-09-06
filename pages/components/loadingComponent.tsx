import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 border-r-2 border-b-2"></div>
    </div>
  );
};

export default Loading;
