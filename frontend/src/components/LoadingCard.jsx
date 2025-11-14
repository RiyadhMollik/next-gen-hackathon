const LoadingCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-lg"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default LoadingCard;
