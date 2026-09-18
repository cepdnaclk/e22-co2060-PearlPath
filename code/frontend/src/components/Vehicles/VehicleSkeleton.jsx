import React from 'react';

const VehicleSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full animate-pulse">
      {/* Image Section */}
      <div className="relative h-48 bg-slate-200"></div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-slate-200 rounded w-16"></div>
          <div className="h-6 bg-slate-200 rounded w-20"></div>
          <div className="h-6 bg-slate-200 rounded w-12"></div>
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div className="w-full">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>

          <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSkeleton;
