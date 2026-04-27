import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Languages, DollarSign } from 'lucide-react';

const TourGuideCard = ({ guide }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col sm:flex-row group h-full">
      
      {/* Image Section */}
      <div className="sm:w-2/5 relative overflow-hidden h-48 sm:h-auto">
        <img 
          src={guide.profilePictureUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"} 
          alt={guide.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-800 font-bold text-sm">{guide.experienceYears} yrs exp</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 sm:w-3/5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-sunset-teal transition-colors">
              {guide.name}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-sunset-orange">LKR {guide.pricePerDay || 0}</span>
              <span className="text-xs text-gray-500 font-medium">per day</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-gray-600 mb-4 text-sm font-medium">
            <MapPin size={16} className="text-sunset-teal shrink-0" />
            <span>{guide.location}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-5 leading-relaxed">
            {guide.bio || "No biography provided."}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {guide.languages && guide.languages.slice(0, 3).map((lang, index) => (
              <span key={index} className="flex items-center gap-1 bg-teal-50 text-sunset-teal px-2.5 py-1 rounded-md text-xs font-bold border border-teal-100">
                <Languages size={12} />
                {lang}
              </span>
            ))}
            {guide.languages && guide.languages.length > 3 && (
              <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-100">
                +{guide.languages.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <Link 
            to={`/tour-guide/${guide.id}`}
            className="w-full text-center bg-gradient-to-r from-sunset-dark to-sunset-teal text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm"
          >
            View Profile & Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourGuideCard;
