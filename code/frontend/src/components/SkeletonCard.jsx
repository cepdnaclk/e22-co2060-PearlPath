import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 sm:h-56 bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Location */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        
        {/* Amenities / Badges */}
        <div className="flex gap-2 mb-4">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
        
        <div className="mt-auto">
          {/* Price */}
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          
          {/* Button */}
          <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
