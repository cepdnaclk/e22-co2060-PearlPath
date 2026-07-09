export const destinations = [
  {
    id: 1,
    name: 'Sigiriya Rock Fortress',
    location: 'Central Province',
    category: 'Historic',
    rating: 4.9,
    reviews: 1250,
    image: '/destinations/sigiriya.png',
    description: 'An ancient rock fortress and palace ruin surrounded by gardens, reservoirs, and other structures. Known as the Eighth Wonder of the World.',
    popular: true
  },
  {
    id: 2,
    name: 'Nine Arches Bridge',
    location: 'Ella',
    category: 'Landmark',
    rating: 4.8,
    reviews: 980,
    image: '/destinations/nine_arches.png',
    description: 'A massive viaduct bridge built entirely of solid rocks, bricks and cement without using a single piece of steel, set amidst lush green tea fields.',
    popular: true
  },
  {
    id: 3,
    name: 'Yala National Park',
    location: 'Southern Province',
    category: 'Nature & Wildlife',
    rating: 4.7,
    reviews: 2100,
    image: '/destinations/yala.png',
    description: 'The most visited and second largest national park in Sri Lanka, famous for its high density of leopards and elephants.',
    popular: true
  },
  {
    id: 4,
    name: 'Galle Fort',
    location: 'Galle',
    category: 'Historic',
    rating: 4.8,
    reviews: 1840,
    image: '/destinations/galle_fort.png',
    description: 'A historical, archaeological and architectural heritage monument originally built by the Portuguese in 1588.',
    popular: false
  },
  {
    id: 5,
    name: 'Temple of the Sacred Tooth',
    location: 'Kandy',
    category: 'Temple',
    rating: 4.9,
    reviews: 3200,
    image: '/destinations/kandy_temple.png',
    description: 'A Buddhist temple in the city of Kandy, housing the relic of the tooth of the Buddha. A UNESCO World Heritage site.',
    popular: false
  },
  {
    id: 6,
    name: 'Mirissa Beach',
    location: 'Southern Province',
    category: 'Beach',
    rating: 4.7,
    reviews: 1560,
    image: '/destinations/mirissa.png',
    description: 'A stunning crescent beach, famous for its vibrant nightlife, surfing, and incredible whale watching tours.',
    popular: false
  }
];

export const beautifulPlaces = [
  {
    _id: 'place1',
    name: 'Sigiriya Rock Fortress',
    location: 'Sigiriya',
    image: '/destinations/sigiriya.png',
    imageUrl: '/destinations/sigiriya.png',
    rating: '4.9',
    description: 'An ancient rock fortress and palace ruin situated in the central Matale District of Sri Lanka. It is a UNESCO World Heritage Site.',
    amenities: ['Historical Site', 'Hiking', 'Photography', 'Viewpoint'],
    price: 'Ticketed',
    activities: [
      { name: 'Lion Rock Climb', icon: 'Mountain', desc: 'Ascend the 1,200 steps to the summit of the iconic rock fortress.' },
      { name: 'Ancient Pidurangala Temple', icon: 'Compass', desc: 'Visit the nearby temple and climb Pidurangala Rock for a stunning panoramic view of Sigiriya.' },
      { name: 'Village Tour & Cooking Class', icon: 'Coffee', desc: 'Experience traditional Sri Lankan rural life and learn to cook authentic dishes.' }
    ]
  },
  {
    _id: 'place2',
    name: 'Nine Arches Bridge',
    location: 'Ella',
    image: '/destinations/nine_arches.png',
    imageUrl: '/destinations/nine_arches.png',
    rating: '4.8',
    description: 'The Nine Arches Bridge also called the Bridge in the Sky, is a viaduct bridge in Sri Lanka. It is one of the best examples of colonial-era railway construction in the country.',
    amenities: ['Sightseeing', 'Photography', 'Nature Walk'],
    price: 'Free',
    activities: [
      { name: 'Little Adam\'s Peak Hike', icon: 'Mountain', desc: 'Enjoy a relatively easy hike with breathtaking views of the Ella Gap.' },
      { name: 'Nine Arches Train Watching', icon: 'Camera', desc: 'Catch the famous blue train passing over the historic colonial-era viaduct.' },
      { name: 'Ravana Falls Viewpoint', icon: 'Waves', desc: 'Visit one of the widest waterfalls in the country, steeped in ancient legend.' }
    ]
  },
  {
    _id: 'place3',
    name: 'Yala National Park',
    location: 'Yala',
    image: '/destinations/yala.png',
    imageUrl: '/destinations/yala.png',
    rating: '4.7',
    description: 'Yala is the most visited and second largest national park in Sri Lanka, bordering the Indian Ocean. Known for its high density of leopards.',
    amenities: ['Safari', 'Wildlife', 'Photography', 'Nature Tour'],
    price: 'Ticketed',
    activities: [
      { name: 'Morning Leopard Safari', icon: 'Compass', desc: 'Embark on a guided 4x4 safari to spot leopards, elephants, and exotic birds.' },
      { name: 'Beachfront Safari Camping', icon: 'Home', desc: 'Spend a luxurious night under the stars bordering the wilderness and ocean.' },
      { name: 'Elephant Transit Home', icon: 'Heart', desc: 'Visit nearby conservation center where orphaned baby elephants are rehabilitated.' }
    ]
  },
  {
    _id: 'place4',
    name: 'Galle Dutch Fort',
    location: 'Galle',
    image: '/destinations/galle_fort.png',
    imageUrl: '/destinations/galle_fort.png',
    rating: '4.8',
    description: 'Galle Fort, in the Bay of Galle on the south west coast of Sri Lanka, was built first in 1588 by the Portuguese.',
    amenities: ['Historical Site', 'Shopping', 'Dining', 'Sunset View'],
    price: 'Free',
    activities: [
      { name: 'Historic Rampart Walk', icon: 'Compass', desc: 'Stroll along the historic fort walls at sunset for stunning ocean views.' },
      { name: 'Dutch Colonial Architecture Tour', icon: 'Building', desc: 'Explore cobblestone streets, old churches, and the iconic Galle Lighthouse.' },
      { name: 'Boutique Shopping & Dining', icon: 'Coffee', desc: 'Browse local gems, spice shops, and dine at upscale cafes within the fort.' }
    ]
  },
  {
    _id: 'place5',
    name: 'Temple of the Tooth',
    location: 'Kandy',
    image: '/destinations/kandy_temple.png',
    imageUrl: '/destinations/kandy_temple.png',
    rating: '4.9',
    description: 'Sri Dalada Maligawa or the Temple of the Sacred Tooth Relic is a Buddhist temple in the city of Kandy, Sri Lanka.',
    amenities: ['Religious Site', 'Cultural', 'Museum'],
    price: 'Ticketed',
    activities: [
      { name: 'Tooth Relic Ceremony', icon: 'Lock', desc: 'Observe the traditional puja offerings and view the golden casket housing the relic.' },
      { name: 'Royal Botanical Gardens', icon: 'Compass', desc: 'Explore the vast, scenic gardens in Peradeniya, home to a collection of orchids.' },
      { name: 'Kandyan Cultural Dance', icon: 'Music', desc: 'Watch a vibrant, rhythmic performance featuring acrobats, drummers, and firewalkers.' }
    ]
  },
  {
    _id: 'place6',
    name: 'Mirissa Beach',
    location: 'Mirissa',
    image: '/destinations/mirissa.png',
    imageUrl: '/destinations/mirissa.png',
    rating: '4.7',
    description: 'Mirissa and its breathtaking sandy beach pretty much transforms your dreams and visions of a tropical paradise into an everyday reality.',
    amenities: ['Beach', 'Surfing', 'Whale Watching', 'Nightlife'],
    price: 'Free',
    activities: [
      { name: 'Whale & Dolphin Watching', icon: 'Compass', desc: 'Take a boat trip to spot blue whales, sperm whales, and spinner dolphins.' },
      { name: 'Coconut Tree Hill Sunset', icon: 'Camera', desc: 'Walk up the famous palm-fringed cliffside dome for panoramic sunset photos.' },
      { name: 'Surfing at Mirissa Reef', icon: 'Waves', desc: 'Enjoy excellent surf breaks suitable for both beginners and experienced surfers.' }
    ]
  }
];
