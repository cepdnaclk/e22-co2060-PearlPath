import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Languages, Mail, Currency, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const TourGuideDetails = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/tour-guides/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGuide({
            id: data._id,
            name: data.name,
            location: data.location,
            pricePerDay: data.pricePerDay || 0,
            experienceYears: data.experienceYears || 0,
            languages: data.languages || ["English"],
            bio: data.bio || "No biography provided.",
            profilePictureUrl: data.profilePictureUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
            contactEmail: data.contactEmail || data.userId?.email
          });
        }
      } catch (error) {
        console.error("Failed to fetch tour guide:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuide();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
       <Navbar />
       <div className="flex-1 flex items-center justify-center">Loading...</div>
       <Footer />
    </div>
  );

  if (!guide) return (
     <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
       <Navbar />
       <div className="flex-1 flex items-center justify-center">Guide not found.</div>
       <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
      <Navbar />
      
      <div className="pt-28 pb-10 bg-sunset-dark text-white relative overflow-hidden">
         <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
         <div className="max-w-4xl mx-auto px-4 relative z-10 flex items-center gap-4">
             <Link to="/tour-guides" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all text-white">
                <ArrowLeft size={20} />
             </Link>
             <h1 className="text-3xl font-extrabold">Tour Guide Profile</h1>
         </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
         <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            
            {/* Left side Image */}
            <div className="w-full md:w-2/5 md:h-auto h-72 relative">
               <img src={guide.profilePictureUrl} alt={guide.name} className="w-full h-full object-cover" />
               <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h2 className="text-3xl font-black text-white drop-shadow-md">{guide.name}</h2>
                  <div className="flex items-center gap-1 text-white/90 mt-1 font-medium">
                     <MapPin size={16} className="text-sunset-gold" />
                     <span>{guide.location}</span>
                  </div>
               </div>
            </div>

            {/* Right side Details */}
            <div className="w-full md:w-3/5 p-8 flex flex-col">
                
                {/* Stats row */}
                <div className="flex flex-wrap gap-4 mb-8">
                   <div className="bg-orange-50 px-4 py-3 rounded-2xl flex-1 border border-orange-100">
                       <span className="text-xs text-orange-600 font-bold uppercase tracking-wider block mb-1">Rate</span>
                       <span className="text-xl font-black text-sunset-orange">LKR {guide.pricePerDay} <span className="text-sm text-gray-500 font-medium">/ day</span></span>
                   </div>
                   <div className="bg-teal-50 px-4 py-3 rounded-2xl flex-1 border border-teal-100">
                       <span className="text-xs text-teal-700 font-bold uppercase tracking-wider block mb-1">Experience</span>
                       <span className="text-xl font-black text-sunset-teal">{guide.experienceYears} Years</span>
                   </div>
                </div>

                <div className="mb-6">
                   <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                       <ShieldCheck size={20} className="text-sunset-teal" />
                       About Me
                   </h3>
                   <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      {guide.bio}
                   </p>
                </div>

                <div className="mb-8">
                   <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                       <Languages size={20} className="text-sunset-teal" />
                       Languages Fluent In
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {guide.languages.map((l, i) => (
                         <span key={i} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-gray-200">
                            {l}
                         </span>
                      ))}
                   </div>
                </div>

                <div className="mt-auto">
                   <a 
                      href={`mailto:${guide.contactEmail || ''}`}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sunset-dark to-sunset-teal text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                   >
                     <Send size={18} />
                     Contact Local Expert
                   </a>
                </div>
            </div>

         </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourGuideDetails;
