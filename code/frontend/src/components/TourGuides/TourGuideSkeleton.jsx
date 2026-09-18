import React from 'react';

const TourGuideSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row h-full animate-pulse">
      {/* Image Section */}
      <div className="sm:w-2/5 relative h-48 sm:h-auto bg-gray-200">
      </div>

      {/* Content Section */}
      <div className="p-6 sm:w-3/5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>

          <div className="flex items-center gap-1.5 mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>

          <div className="space-y-2 mb-5">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideSkeleton;
