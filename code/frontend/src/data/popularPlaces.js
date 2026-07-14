export const popularPlaces = [
  {
    id: 1,
    name: "Sigiriya Rock Fortress",
    lat: 7.9570,
    lng: 80.7603,
    category: "Historical",
    description: "Ancient palace and fortress complex with significant archaeological importance.",
    imageUrl: "https://images.unsplash.com/photo-1588598198321-1647240cebc8?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Kandy",
    lat: 7.2906,
    lng: 80.6337,
    category: "Cultural",
    description: "Home to the Temple of the Sacred Tooth Relic and beautiful tea plantations.",
    imageUrl: "https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Galle Fort",
    lat: 6.0286,
    lng: 80.2168,
    category: "Historical",
    description: "A Portuguese-built and Dutch-fortified 16th-century fort.",
    imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Ella",
    lat: 6.8667,
    lng: 80.0464, // Wait, Ella is 6.8667, 81.0466. Let me fix the coordinates later, I'll use 6.8711, 81.0494
    category: "Hill Country",
    description: "Famous for the Nine Arch Bridge and stunning mountain hikes.",
    imageUrl: "https://images.unsplash.com/photo-1620608518974-95eb6d2b3806?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Nuwara Eliya",
    lat: 6.9497,
    lng: 80.7828,
    category: "Hill Country",
    description: "Known as 'Little England' with its colonial buildings and lush tea estates.",
    imageUrl: "https://images.unsplash.com/photo-1588610582234-7228801d4a04?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Yala National Park",
    lat: 6.3683,
    lng: 81.5175,
    category: "Wildlife",
    description: "A vast area of forest, grassland and lagoons bordering the Indian Ocean, home to leopards and elephants.",
    imageUrl: "https://images.unsplash.com/photo-1601222448375-9e66ffeb79f4?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Mirissa",
    lat: 5.9483,
    lng: 80.4716,
    category: "Beach",
    description: "A picturesque beach town famous for whale watching and surfing.",
    imageUrl: "https://images.unsplash.com/photo-1579294247563-7186835150ff?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Anuradhapura",
    lat: 8.3114,
    lng: 80.4168,
    category: "Historical",
    description: "An ancient capital with well-preserved ruins of ancient Sri Lankan civilization.",
    imageUrl: "https://images.unsplash.com/photo-1625066465369-07340b10ec65?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Polonnaruwa",
    lat: 7.9403,
    lng: 81.0188,
    category: "Historical",
    description: "The second most ancient of Sri Lanka's kingdoms, packed with archaeological treasures.",
    imageUrl: "https://images.unsplash.com/photo-1584877025807-68b209e5124e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "Bentota",
    lat: 6.4289,
    lng: 80.0003,
    category: "Beach",
    description: "A resort town featuring a long stretch of beach and watersports on the Bentota Ganga.",
    imageUrl: "https://images.unsplash.com/photo-1627896157734-4bc972e3a1f1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 11,
    name: "Trincomalee",
    lat: 8.5874,
    lng: 81.2152,
    category: "Beach",
    description: "A major resort port city, known for its deep-water harbor and beautiful white sand beaches like Nilaveli.",
    imageUrl: "https://images.unsplash.com/photo-1616172605799-73a4b9fc07fb?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 12,
    name: "Jaffna",
    lat: 9.6615,
    lng: 80.0255,
    category: "Cultural",
    description: "The cultural capital of northern Sri Lanka, featuring unique Hindu temples and the Jaffna Fort.",
    imageUrl: "https://images.unsplash.com/photo-1615858602927-4c07921a2eb3?q=80&w=600&auto=format&fit=crop"
  }
];

// Fix Ella coordinates
popularPlaces[3].lat = 6.8711;
popularPlaces[3].lng = 81.0494;
