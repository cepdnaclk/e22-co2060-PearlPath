import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, MapPin, Building, Star, FileText, DollarSign, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const AMENITIES_LIST = [
  'Free WiFi',
  'A/C',
  'Swimming Pool',
  'Ocean View',
  'Safari Arranged',
  'Breakfast Included',
  'Parking',
  'Restaurant',
  'Gym',
  'Spa',
  'Bar',
  'Airport Shuttle'
];

const AddProperty = () => {
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'Hotel',
    starRating: '3',
    address: '',
    city: '',
    description: '',
    pricePerNight: '',
    amenities: [],
    images: [] // Storing object URLs for preview here
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const isSelected = prev.amenities.includes(amenity);
      if (isSelected) {
        return { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files] 
    }));
  };

  const removeImage = (indexToRemove) => {
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPublished(true);
    
    try {
      const payload = {
        name: formData.propertyName,
        description: formData.description,
        pricePerNight: Number(formData.pricePerNight),
        location: formData.city,
        imageUrl: imagePreviews.length > 0 ? imagePreviews[0] : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
        starRating: Number(formData.starRating),
        amenities: formData.amenities
      };

      const response = await authFetch('http://127.0.0.1:3001/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error occurred');
      }

      setTimeout(() => {
        navigate('/hotels');
      }, 2000);
    } catch (error) {
      console.error("Error publishing property:", error);
      alert(`Failed to publish property: ${error.message}`);
      setIsPublished(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-outfit">
      <Navbar />

      {/* Top Hero Banner */}
      <div className="pt-28 pb-10 bg-sunset-dark text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Add New Property</h1>
          <p className="text-xl text-gray-300 font-light">List your hotel, villa, or resort on PearlPath to reach more tourists.</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Card 1: Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Building size={20} className="text-sunset-gold" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Name</label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="e.g. Sunset Royal Beach Resort"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-gold/50 focus:border-sunset-gold transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-gold/50 focus:border-sunset-gold transition-colors appearance-none bg-white"
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Villa">Villa</option>
                  <option value="Resort">Resort</option>
                  <option value="Cabana">Cabana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Star Rating</label>
                <div className="relative">
                  <select
                    name="starRating"
                    value={formData.starRating}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-gold/50 focus:border-sunset-gold transition-colors appearance-none bg-white pl-10"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>{star} Star</option>
                    ))}
                  </select>
                  <Star size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sunset-gold" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe what makes your property special..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-gold/50 focus:border-sunset-gold transition-colors resize-none"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Card 2: Location Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-sunset-teal" />
              Location Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Beach Road"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal/50 focus:border-sunset-teal transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">City / Location</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mirissa, Sri Lanka"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal/50 focus:border-sunset-teal transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Card 3: Amenities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Check size={20} className="text-sunset-orange" />
              Amenities & Facilities
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {AMENITIES_LIST.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${
                      isSelected 
                        ? 'border-sunset-orange bg-orange-50/50 text-sunset-orange shadow-sm' 
                        : 'border-gray-200 text-gray-600 hover:border-sunset-orange/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-sunset-orange border-sunset-orange text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    {amenity}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Card 4: Pricing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" />
              Pricing
            </h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price Per Night (LKR)</label>
              <div className="relative max-w-md">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">Rs.</span>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-colors text-lg font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Card 5: Image Uploads */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UploadCloud size={20} className="text-blue-500" />
              Property Photos
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">Drag & Drop your photos here</h3>
                <p className="text-sm text-gray-500">or click to browse from your computer</p>
                <p className="text-xs text-gray-400 mt-4">High-quality JPG or PNG. Max 5MB per image.</p>
              </div>
            </div>

            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected Images ({imagePreviews.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                      <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 pb-12">
            <button
              type="submit"
              disabled={isPublished}
              className={`w-full font-bold text-lg py-4 rounded-xl shadow-lg transform transition-all ${
                isPublished 
                  ? 'bg-green-500 text-white cursor-not-allowed scale-[0.99]' 
                  : 'bg-gradient-to-r from-sunset-orange to-sunset-gold text-white hover:shadow-orange-500/30 hover:-translate-y-1 focus:ring-4 focus:ring-orange-500/50'
              }`}
            >
              {isPublished ? '✓ Published Successfully' : 'Publish Property'}
            </button>
          </div>

        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddProperty;
