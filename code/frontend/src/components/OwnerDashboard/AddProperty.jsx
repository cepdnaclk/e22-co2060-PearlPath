import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, MapPin, Building, Star, FileText, DollarSign, Check, X, Trash2, Plus, Phone, MessageSquare } from 'lucide-react';
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
    rooms: '1',
    address: '',
    city: '',
    contactNumber: '',
    whatsappNumber: '',
    description: '',
    pricePerNight: '',
    amenities: []
  });

  const [imageUrls, setImageUrls] = useState(['']);
  const [brokenImageIndices, setBrokenImageIndices] = useState({});
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

  const handleUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    
    if (brokenImageIndices[index]) {
      setBrokenImageIndices(prev => {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      });
    }
  };

  const addUrlField = () => {
    setImageUrls(prev => [...prev, '']);
  };

  const removeUrlField = (indexToRemove) => {
    if (imageUrls.length === 1) {
      setImageUrls(['']);
    } else {
      setImageUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
    }
    
    setBrokenImageIndices(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        const intK = parseInt(k, 10);
        if (intK < indexToRemove) {
          next[intK] = prev[intK];
        } else if (intK > indexToRemove) {
          next[intK - 1] = prev[intK];
        }
      });
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validUrls = imageUrls.map(url => url.trim()).filter(url => url.startsWith('http://') || url.startsWith('https://'));
    if (validUrls.length === 0) {
      alert("Please provide at least one valid HTTP/HTTPS image URL under Property Photos.");
      return;
    }

    setIsPublished(true);
    
    try {
      const payload = {
        name: formData.propertyName,
        description: formData.description,
        pricePerNight: Number(formData.pricePerNight),
        location: formData.city,
        imageUrl: validUrls[0],
        images: validUrls,
        starRating: Number(formData.starRating),
        rooms: Number(formData.rooms),
        amenities: formData.amenities,
        contactNumber: formData.contactNumber,
        whatsappNumber: formData.whatsappNumber
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Rooms</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-gold/50 focus:border-sunset-gold transition-colors"
                  required
                />
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

          {/* Card: Contact Information for Tourists */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Phone size={20} className="text-green-600" />
              Contact Information for Pre-Booking Enquiries
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Tourists will use these details to call or message your hotel before booking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Phone size={16} className="text-sunset-orange" />
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-orange/50 focus:border-sunset-orange transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <MessageSquare size={16} className="text-emerald-500" />
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
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

          {/* Card 5: Image Uploads via URL */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UploadCloud size={20} className="text-blue-500" />
              Property Photos (URLs)
            </h2>
            
            <div className="space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {index === 0 ? "Primary Image URL (Required)" : `Additional Image URL #${index + 1}`}
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://images.unsplash.com/photo-... or Cloudinary/Imgur link"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors text-sm font-medium"
                      required={index === 0}
                    />
                  </div>
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="mt-5 p-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center shrink-0"
                      title="Remove image URL"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addUrlField}
                className="mt-2 flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
              >
                <Plus size={16} />
                Add Another Photo URL
              </button>
            </div>

            {/* Live Preview Grid */}
            {imageUrls.filter(url => url.trim().startsWith('http://') || url.trim().startsWith('https://')).length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Live Preview Grid</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => {
                    const trimmedUrl = url.trim();
                    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) return null;
                    const isBroken = brokenImageIndices[index];

                    return (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-center p-3 shadow-sm">
                        {isBroken ? (
                          <div className="flex flex-col items-center justify-center text-red-500 text-xs font-semibold px-2">
                            <X size={18} className="mb-1" />
                            <span>Invalid or broken image URL.</span>
                          </div>
                        ) : (
                          <img 
                            src={trimmedUrl} 
                            alt={`Preview ${index + 1}`} 
                            onError={() => setBrokenImageIndices(prev => ({ ...prev, [index]: true }))}
                            className="w-full h-full object-cover" 
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeUrlField(index)}
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                          title="Remove image URL"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    );
                  })}
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
