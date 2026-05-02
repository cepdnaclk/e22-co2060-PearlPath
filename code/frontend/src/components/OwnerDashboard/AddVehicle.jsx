import React, { useState } from 'react';
import { Upload, Car, Users, DollarSign, Settings, Wind } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    makeModel: '',
    type: 'Car',
    seats: 4,
    pricePerDay: '',
    transmission: 'Auto',
    airConditioning: true,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { authFetch } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    try {
      const payload = {
        makeAndModel: formData.makeModel,
        vehicleType: formData.type,
        seats: Number(formData.seats),
        pricePerDay: Number(formData.pricePerDay),
        transmission: formData.transmission,
        hasAC: formData.airConditioning,
        images: imagePreview ? [imagePreview] : ["https://images.unsplash.com/photo-1590362891991-f776e747a58f?q=80&w=800&auto=format&fit=crop"]
      };

      await authFetch('http://127.0.0.1:3001/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          makeModel: '',
          type: 'Car',
          seats: 4,
          pricePerDay: '',
          transmission: 'Auto',
          airConditioning: true,
        });
        setImagePreview(null);
        window.location.href = '/vehicles'; // Redirect to see added vehicles
      }, 2000);
    } catch (err) {
      console.error("Error publishing vehicle:", err);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-outfit flex flex-col">
      <Navbar />

      {/* Top Hero Banner */}
      <div className="pt-28 pb-10 bg-sunset-dark text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Add Your Vehicle</h1>
          <p className="text-xl text-gray-300 font-light">Publish your vehicle to millions of tourists looking for transport.</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 py-10 pb-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vehicle Make & Model
                  </label>
                  <input
                    type="text"
                    name="makeModel"
                    required
                    value={formData.makeModel}
                    onChange={handleChange}
                    placeholder="e.g. Toyota Aqua 2018"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Car size={16} /> Vehicle Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange transition-colors"
                    >
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                      <option value="TukTuk">TukTuk</option>
                      <option value="Scooter">Scooter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Users size={16} /> Number of Seats
                    </label>
                    <input
                      type="number"
                      name="seats"
                      min="1"
                      max="60"
                      required
                      value={formData.seats}
                      onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <DollarSign size={16} /> Price / Day (LKR)
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      min="0"
                      required
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      placeholder="5000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Settings size={16} /> Transmission
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange transition-colors"
                    >
                      <option value="Auto">Auto</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        name="airConditioning"
                        checked={formData.airConditioning}
                        onChange={handleChange}
                        className="w-5 h-5 text-sunset-orange rounded border-slate-300 focus:ring-sunset-orange"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Wind size={20} className="text-sunset-orange" />
                      Air Conditioning (A/C) Included
                    </div>
                  </label>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vehicle Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl relative overflow-hidden group hover:border-sunset-orange transition-colors h-full min-h-[300px]">
                  {imagePreview ? (
                    <div className="absolute inset-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium px-4 py-2 bg-black/50 rounded-lg">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center flex flex-col items-center justify-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-sunset-orange transition-colors" />
                      <div className="flex text-sm text-slate-600">
                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-sunset-orange hover:text-sunset-gold focus-within:outline-none">
                          <span>Upload a file</span>
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSubmitted}
                className={`w-full sm:w-auto px-8 py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitted
                    ? 'bg-emerald-500 hover:bg-emerald-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-sunset-orange/50 hover:-translate-y-1'
                }`}
              >
                {isSubmitted ? (
                  <>Published Successfully</>
                ) : (
                  <>
                    <Car size={24} />
                    Publish Vehicle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
