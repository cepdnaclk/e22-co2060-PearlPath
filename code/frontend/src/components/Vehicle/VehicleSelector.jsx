import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { VehicleContext } from '../../context/VehicleContext';
import { Car, CheckCircle2, ChevronRight, User, Briefcase } from 'lucide-react';

const vehicles = [
  {
    id: 1,
    name: 'Toyota Prius',
    type: 'Hybrid Car',
    capacity: '4 Passengers',
    luggage: '2 Bags',
    price: 'From LKR 8,000/day',
    image: 'https://images.unsplash.com/photo-1590362891991-f20bc0810c27?q=80&w=600&auto=format&fit=crop',
    description: 'Eco-friendly and comfortable. Perfect for city tours and smooth rides.',
  },
  {
    id: 2,
    name: 'Nissan Caravan',
    type: 'Mini Van',
    capacity: '9 Passengers',
    luggage: '5 Bags',
    price: 'From LKR 15,000/day',
    image: 'https://images.unsplash.com/photo-1566869502699-2a912bb3e7cd?q=80&w=600&auto=format&fit=crop',
    description: 'Spacious and ideal for family trips or group tours across the island.',
  },
  {
    id: 3,
    name: 'Toyota Land Cruiser',
    type: 'Luxury SUV',
    capacity: '6 Passengers',
    luggage: '4 Bags',
    price: 'From LKR 25,000/day',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop',
    description: 'Ultimate luxury and power. Built for both comfort and off-road adventures.',
  },
  {
    id: 4,
    name: 'Suzuki Alto',
    type: 'Compact Car',
    capacity: '3 Passengers',
    luggage: '1 Bag',
    price: 'From LKR 5,000/day',
    image: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?q=80&w=600&auto=format&fit=crop',
    description: 'Economical and agile. Great for navigating narrow streets and short trips.',
  },
  {
    id: 5,
    name: 'Toyota Hiace',
    type: 'Commuter Van',
    capacity: '14 Passengers',
    luggage: '8 Bags',
    price: 'From LKR 18,000/day',
    image: 'https://images.unsplash.com/photo-1558221804-032043003043?q=80&w=600&auto=format&fit=crop',
    description: 'Large capacity van suitable for big groups and extensive luggage.',
  },
  {
    id: 6,
    name: 'Honda Vezel',
    type: 'Compact SUV',
    capacity: '4 Passengers',
    luggage: '3 Bags',
    price: 'From LKR 12,000/day',
    image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=600&auto=format&fit=crop',
    description: 'Stylish and comfortable with ample space for small families.',
  }
];

const VehicleSelector = () => {
  const { selectedVehicle, setSelectedVehicle } = useContext(VehicleContext);
  const navigate = useNavigate();

  const handleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset-gold to-sunset-orange">Ride</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our extensive fleet of comfortable, well-maintained vehicles to make your Sri Lankan journey unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => {
            const isSelected = selectedVehicle?.id === vehicle.id;
            return (
              <div 
                key={vehicle.id} 
                className={`bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${isSelected ? 'border-sunset-orange' : 'border-transparent'}`}
              >
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-sunset-orange uppercase tracking-wide">
                    {vehicle.type}
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-sunset-orange text-white p-1.5 rounded-full shadow-lg">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{vehicle.description}</p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm font-medium">
                      <User size={16} className="text-sunset-teal" />
                      <span>{vehicle.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm font-medium">
                      <Briefcase size={16} className="text-sunset-gold" />
                      <span>{vehicle.luggage}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-extrabold text-gray-900">{vehicle.price}</span>
                    <button 
                      onClick={() => handleSelect(vehicle)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
                        isSelected 
                        ? 'bg-sunset-orange text-white shadow-md' 
                        : 'bg-gray-100 text-gray-800 hover:bg-sunset-gold hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'} 
                      {!isSelected && <ChevronRight size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehicleSelector;
