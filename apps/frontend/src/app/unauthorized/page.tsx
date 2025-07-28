import React from 'react';

const Page = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
        <p className="mt-4 text-gray-700">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default Page;
