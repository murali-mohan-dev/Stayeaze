import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting StayEase database seeding...');

  // Clear existing records in proper dependency order
  await prisma.serviceRequest.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomCategory.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing database tables.');

  // Create Users
  const passwordHash = await bcrypt.hash('admin123', 10);
  const customerPasswordHash = await bcrypt.hash('customer123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'StayEase Executive Admin',
      email: 'admin@stayease.com',
      password: passwordHash,
      phone: '+91 98765 43210',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      name: 'Aditya Kashyap',
      email: 'customer@stayease.com',
      password: customerPasswordHash,
      phone: '+91 98123 45678',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Priya Nambiar',
      email: 'priya.nambiar@example.com',
      password: customerPasswordHash,
      phone: '+91 97234 56789',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Vikramaditya Rathore',
      email: 'vikram.rathore@example.com',
      password: customerPasswordHash,
      phone: '+91 96345 67890',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('👤 Created demo users (Admin & Customers).');

  // Create Coupons
  const validUntilDate = new Date();
  validUntilDate.setFullYear(validUntilDate.getFullYear() + 2);

  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: '10% off your first luxury stay with StayEase',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minBookingAmount: 3000,
        maxDiscount: 1500,
        validUntil: validUntilDate,
        isActive: true,
      },
      {
        code: 'STAYEASE20',
        description: 'Special 20% discount on select weekend getaways',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minBookingAmount: 6000,
        maxDiscount: 3500,
        validUntil: validUntilDate,
        isActive: true,
      },
      {
        code: 'LUXURY5000',
        description: 'Flat ₹5,000 savings on royal suites and presidential villas',
        discountType: 'FIXED',
        discountValue: 5000,
        minBookingAmount: 22000,
        maxDiscount: 5000,
        validUntil: validUntilDate,
        isActive: true,
      },
      {
        code: 'FESTIVE15',
        description: 'Festive season discount: 15% off across premier hotels',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minBookingAmount: 8000,
        maxDiscount: 2500,
        validUntil: validUntilDate,
        isActive: true,
      },
    ],
  });

  console.log('🎟️ Created promotional coupons.');

  // Hotels Data (10 Luxury Hotels across India)
  const hotelsData = [
    {
      name: 'The Grand Palace Resort & Spa',
      tagline: 'Timeless Royal Elegance & Serenity',
      description: 'Nestled along the golden sands and tranquil waters, The Grand Palace Resort & Spa offers bespoke luxury with classical architecture, lush royal gardens, world-class ayurvedic wellness, and private beach cabanas.',
      address: 'Sinquerim Beach Road, Candolim',
      city: 'Goa',
      state: 'Goa',
      starRating: 5,
      ratingScore: 4.9,
      reviewCount: 148,
      startingPrice: 8500,
      featured: true,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      contactEmail: 'concierge@grandpalacegoa.com',
      contactPhone: '+91 832 249 8000',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Private Beach', 'Infinity Pool', 'Ayurvedic Spa', 'Fine Dining Restaurant', '24/7 Butler Service', 'Valet Parking', 'High-Speed Wi-Fi', 'Cocktail Lounge'],
      categories: [
        {
          name: 'Deluxe Sea View Suite',
          description: 'Spacious ocean-facing sanctuary with private sun terrace and Italian marble ensuite.',
          basePrice: 8500,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'California King',
          sizeSqFt: 480,
          totalRooms: 12,
          images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
          ],
          amenities: ['Ocean View', 'Balcony', 'King Bed', 'Nespresso Machine', 'Complimentary Breakfast', 'Mini Bar', 'Bathtub'],
        },
        {
          name: 'Premier Garden Villa',
          description: 'Secluded villa surrounded by tropical frangipani with private plunge pool and open-air rain shower.',
          basePrice: 12500,
          capacityAdults: 3,
          capacityChildren: 2,
          bedType: 'King Bed + Daybed',
          sizeSqFt: 720,
          totalRooms: 8,
          images: [
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
          ],
          amenities: ['Private Plunge Pool', 'Tropical Garden', 'Rain Shower', 'Espresso Machine', 'Butler On-Call', 'Smart TV'],
        },
        {
          name: 'Executive Beachfront Haven',
          description: 'Direct step-out onto sandy shores with panoramic sunset views and dedicated personal host.',
          basePrice: 16800,
          capacityAdults: 3,
          capacityChildren: 2,
          bedType: 'Super King Bed',
          sizeSqFt: 890,
          totalRooms: 6,
          images: [
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80',
          ],
          amenities: ['Direct Beach Access', 'Jacuzzi', 'Curated Wine Cellar', '24h Room Service', 'Lounge Access'],
        },
        {
          name: 'Royal Presidential Villa',
          description: 'Ultimate beachfront opulence with private infinity pool, chef pantry, dining salon, and chauffeur service.',
          basePrice: 28500,
          capacityAdults: 4,
          capacityChildren: 3,
          bedType: '2 King Master Bedrooms',
          sizeSqFt: 1450,
          totalRooms: 3,
          images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
          ],
          amenities: ['Private Infinity Pool', 'Chauffeur Service', 'Dedicated Butler', 'Gourmet Kitchen', 'Sound System', 'Champagne on Arrival'],
        },
      ],
    },
    {
      name: 'The Oberoi Sky Garden Hotel',
      tagline: 'Modern Oasis in the Silicon Valley of India',
      description: 'Towering over MG Road in the heart of Bengaluru, The Oberoi Sky Garden offers award-winning rooftop dining, centuries-old raintrees, landscaped cascading gardens, and state-of-the-art tech conveniences.',
      address: '37-39 MG Road, Ashok Nagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      starRating: 5,
      ratingScore: 4.8,
      reviewCount: 215,
      startingPrice: 7200,
      featured: true,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      contactEmail: 'stay.bengaluru@oberoisky.com',
      contactPhone: '+91 80 2558 5858',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Sky Garden Rooftop', 'Heated Lap Pool', 'Fitness Center', 'Executive Club Lounge', 'Award-Winning Spa', 'EV Charging', 'High-Speed Wi-Fi', '24/7 Business Center'],
      categories: [
        {
          name: 'Executive Deluxe Room',
          description: 'Contemporary tech-enabled room featuring floor-to-ceiling windows overlooking garden courtyard.',
          basePrice: 7200,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 420,
          totalRooms: 15,
          images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
          ],
          amenities: ['Garden View', 'Work Desk', 'Smart Lights', 'Complimentary Breakfast', 'Rain Shower'],
        },
        {
          name: 'Premier Garden Suite',
          description: 'Elegantly furnished with rich teak accents, private balcony, and plush seating alcove.',
          basePrice: 9800,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 580,
          totalRooms: 10,
          images: [
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
          ],
          amenities: ['Private Balcony', 'Deep Soaking Tub', 'Pillow Menu', 'Cocktail Hour Access'],
        },
        {
          name: 'Club Skyline Suite',
          description: 'Exclusive high-floor suite with uninterrupted skyline vistas and VIP Lounge privileges.',
          basePrice: 13500,
          capacityAdults: 3,
          capacityChildren: 1,
          bedType: 'Super King Bed',
          sizeSqFt: 750,
          totalRooms: 8,
          images: [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
          ],
          amenities: ['Skyline View', 'VIP Lounge Access', 'Airport Pickup Included', 'Evening Canapés'],
        },
        {
          name: 'Kohinoor Presidential Suite',
          description: 'Grand luxury with dedicated meeting salon, private steam room, and handcrafted Indian art collections.',
          basePrice: 24000,
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: 'King Master Bedroom',
          sizeSqFt: 1300,
          totalRooms: 2,
          images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
          ],
          amenities: ['Steam Room', 'Dining Salon', 'Chauffeur BMW Transfer', 'Dedicated Butler'],
        },
      ],
    },
    {
      name: 'Taj Gateway Heritage Marine',
      tagline: 'Iconic Arabian Sea Waterfront Grandeur',
      description: 'Overlooking the majestic Arabian Sea and Gateway of India, this architectural marvel combines neoclassical splendor with contemporary Indian hospitality and Michelin-standard gourmet dining.',
      address: 'Apollo Bunder, Colaba',
      city: 'Mumbai',
      state: 'Maharashtra',
      starRating: 5,
      ratingScore: 4.9,
      reviewCount: 310,
      startingPrice: 11000,
      featured: true,
      checkInTime: '15:00',
      checkOutTime: '12:00',
      contactEmail: 'stay.mumbai@tajmarine.com',
      contactPhone: '+91 22 6665 3366',
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Sea View Rooms', 'Harbor Cruise Facility', 'Jiva Spa', 'Seafront Infinity Pool', '7 Gourmet Restaurants', 'Historical Heritage Tour'],
      categories: [
        {
          name: 'Heritage City Room',
          description: 'Charming colonial touches paired with high ceilings and city views.',
          basePrice: 11000,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 400,
          totalRooms: 14,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['High Ceilings', 'City View', 'Marble Bath', 'Complimentary High Tea'],
        },
        {
          name: 'Grand Sea View Suite',
          description: 'Front-row seats to the Arabian Sea and historic ships gliding into harbor.',
          basePrice: 16500,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'California King',
          sizeSqFt: 620,
          totalRooms: 10,
          images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Direct Sea View', 'Free Harbor Tour', 'Jacuzzi', 'Afternoon High Tea'],
        },
        {
          name: 'Colaba Luxury Suite',
          description: 'Sprawling living room with original artwork and antique rosewood furnishing.',
          basePrice: 22000,
          capacityAdults: 3,
          capacityChildren: 2,
          bedType: 'King Bed',
          sizeSqFt: 880,
          totalRooms: 5,
          images: ['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Living Salon', 'Walk-in Wardrobe', 'Pravasi Butler', 'Balcony'],
        },
        {
          name: 'The Heritage Presidential Sanctuary',
          description: 'Legendary suite preferred by international dignitaries with private security wing.',
          basePrice: 38000,
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: 'Master Suite',
          sizeSqFt: 1600,
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Private Security Wing', 'Dining Room', 'Grand Piano', 'Personal Chef'],
        },
      ],
    },
    {
      name: 'Rambagh Royal Haveli & Spa',
      tagline: 'The Jewel of the Pink City',
      description: 'Step into royal Rajput royalty in this 19th-century palace hotel featuring hand-carved marble pillars, resident peacocks roaming lush courtyards, and polo lounge evenings.',
      address: 'Bhawani Singh Road, Rambagh',
      city: 'Jaipur',
      state: 'Rajasthan',
      starRating: 5,
      ratingScore: 4.9,
      reviewCount: 189,
      startingPrice: 9500,
      featured: true,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      contactEmail: 'royalty@rambaghhaveli.com',
      contactPhone: '+91 141 238 5700',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Peacock Courtyards', 'Polo Bar', 'Indoor Marble Pool', 'Royal Spa Treatments', 'Vintage Car Ride', 'Folk Music Evenings'],
      categories: [
        {
          name: 'Palace Room',
          description: 'Ornate Rajasthani arches with traditional jharokhas and courtyards views.',
          basePrice: 9500,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'Royal Four-Poster Bed',
          sizeSqFt: 450,
          totalRooms: 12,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Jharokha Seating', 'Four Poster Bed', 'Courtyard View', 'Welcome Garland'],
        },
        {
          name: 'Historical Rajput Suite',
          description: 'Spacious suite adorned with authentic miniature paintings and gold leaf filigree.',
          basePrice: 14000,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 650,
          totalRooms: 8,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Silk Upholstery', 'Private Balcony', 'Vintage Car Tour', 'Butler'],
        },
        {
          name: 'Maharaja Royal Suite',
          description: 'Opulent suite formerly occupied by royal courtiers, with sunken marble bath.',
          basePrice: 21000,
          capacityAdults: 3,
          capacityChildren: 2,
          bedType: 'King Bed',
          sizeSqFt: 920,
          totalRooms: 4,
          images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Sunken Marble Bath', 'Terrace View', 'Personal Chauffeur', 'Royal Dining'],
        },
        {
          name: 'Suryavanshi Presidential Suite',
          description: 'Grand regal living with private rooftop terrace overlooking the Aravalli hills.',
          basePrice: 35000,
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: '2 King Bedrooms',
          sizeSqFt: 1500,
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Rooftop Terrace', 'Private Jacuzzi', 'Royal Musician Performance', 'Chef Service'],
        },
      ],
    },
    {
      name: 'The Imperial Lutyens Sanctuary',
      tagline: 'Art Deco Luxury in the National Capital',
      description: 'An oasis of calm in New Delhi, featuring museum-grade colonial and British-Indian artwork, French patisseries, manicured palm lawns, and unmatched diplomatic proximity.',
      address: 'Janpath Lane, Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      starRating: 5,
      ratingScore: 4.7,
      reviewCount: 240,
      startingPrice: 6800,
      featured: false,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      contactEmail: 'luxury@imperialdelhi.com',
      contactPhone: '+91 11 2334 1234',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Art Gallery', 'Palm Garden', 'Heated Outdoor Pool', 'Steam & Sauna', 'French Bakery', 'Concierge Tour Desk'],
      categories: [
        {
          name: 'Deco Heritage Room',
          description: 'High teak ceilings and warm parquet wooden floors with vintage rotary phones.',
          basePrice: 6800,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'Queen Bed',
          sizeSqFt: 380,
          totalRooms: 15,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Art Deco Decor', 'Garden View', 'Tea Station', 'Marble Bath'],
        },
        {
          name: 'Imperial Garden Suite',
          description: 'Serene suite looking out onto four acres of emerald palm lawns.',
          basePrice: 9500,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 540,
          totalRooms: 10,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Palm Garden View', 'Espresso Machine', 'High Tea Access', 'Bathtub'],
        },
        {
          name: 'Diplomatic Club Suite',
          description: 'Tailored for senior delegates with secure meeting area and private cocktail bar.',
          basePrice: 14200,
          capacityAdults: 3,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 780,
          totalRooms: 6,
          images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Meeting Room', 'Private Bar', 'Fast Airport Express Transfer', 'Lounge'],
        },
        {
          name: 'Viceroy Presidential Suite',
          description: 'Sprawling art-adorned suite with private study, grand dining table for 8, and sauna.',
          basePrice: 26000,
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: 'Master Suite',
          sizeSqFt: 1400,
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Private Sauna', '8-Seat Dining', 'Antique Piano', 'Personal Valet'],
        },
      ],
    },
    {
      name: 'Lake Pichola Waterside Resort',
      tagline: 'Floating Fairy Tale on Udaipur Waters',
      description: 'Reachable by ornate wooden boats, this white marble palace shimmers on Lake Pichola with majestic views of the City Palace, Jag Mandir, and sunset over the Aravalli mountains.',
      address: 'Pichola Island, Lake Pichola',
      city: 'Udaipur',
      state: 'Rajasthan',
      starRating: 5,
      ratingScore: 4.9,
      reviewCount: 275,
      startingPrice: 12000,
      featured: true,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      contactEmail: 'lake@picholaresort.com',
      contactPhone: '+91 294 242 8800',
      images: [
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Private Boat Transfer', 'Lake-Facing Infinity Pool', 'Rooftop Sunset Dining', 'Royal Spa', 'Folk Puppet Performances', 'Stargazing Lounge'],
      categories: [
        {
          name: 'Lake View Deluxe Room',
          description: 'Romantic room overlooking the shimmering lake waters and illuminated palaces.',
          basePrice: 12000,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 460,
          totalRooms: 10,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Lake View', 'Boat Transfer Included', 'Complimentary Wine', 'Rain Shower'],
        },
        {
          name: 'Mewar Heritage Suite',
          description: 'Intricately painted ceiling frescos with stained glass jharokhas framing lake sunsets.',
          basePrice: 17500,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'Royal King Bed',
          sizeSqFt: 680,
          totalRooms: 6,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Stained Glass Balcony', 'Jacuzzi with Lake View', 'Butler Service', 'Sunset Cruise'],
        },
        {
          name: 'Jag Mandir View Suite',
          description: 'Corner suite offering dual vistas of historic island palaces and mountain ranges.',
          basePrice: 23000,
          capacityAdults: 3,
          capacityChildren: 2,
          bedType: 'Super King Bed',
          sizeSqFt: 860,
          totalRooms: 4,
          images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Dual Lake Views', 'Private Candlelit Terrace', 'Royal Masseur', 'Chauffeur'],
        },
        {
          name: 'Maharana Presidential Palace Villa',
          description: 'Exclusive multi-room pavilion with heated private outdoor pool on the water.',
          basePrice: 42000,
          capacityAdults: 4,
          capacityChildren: 3,
          bedType: '2 King Master Bedrooms',
          sizeSqFt: 1750,
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Private Heated Pool', 'Private Boat & Captain', 'Dedicated Royal Chef', 'Champagne Bar'],
        },
      ],
    },
    {
      name: 'ITC Kakatiya Nizam Court',
      tagline: 'Deccani Royalty Meets Modern Grandeur',
      description: 'Celebrating the legendary culinary and architectural heritage of the Nizams, featuring signature Dum Pukht cuisine, tranquil lotus ponds, and exquisite stone sculptures.',
      address: 'Begumpet Main Road',
      city: 'Hyderabad',
      state: 'Telangana',
      starRating: 5,
      ratingScore: 4.8,
      reviewCount: 165,
      startingPrice: 5900,
      featured: false,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      contactEmail: 'stay@itckakatiya.com',
      contactPhone: '+91 40 2340 0132',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Dum Pukht Restaurant', 'Kaya Kalp Spa', 'Outdoor Pool', '24h Coffee Shop', 'Helipad Access', 'Conference Centre'],
      categories: [
        {
          name: 'Executive Pearl Room',
          description: 'Spacious room reflecting Deccani finesse with ergonomic workspace and plush king bedding.',
          basePrice: 5900,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 410,
          totalRooms: 16,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Ergonomic Desk', 'City View', 'Complimentary Breakfast', 'High-Speed Wi-Fi'],
        },
        {
          name: 'Towers Club Suite',
          description: 'Executive club level suite with complimentary evening cocktails and hors d\'oeuvres.',
          basePrice: 8400,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 590,
          totalRooms: 10,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Club Lounge Access', 'Airport Transfer', 'Cocktail Hours', 'Bathtub'],
        },
        {
          name: 'Nizami Heritage Suite',
          description: 'Adorned with Bidri ware artifacts and silver filigree mirrors with separate parlor.',
          basePrice: 12800,
          capacityAdults: 3,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 810,
          totalRooms: 5,
          images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Separate Parlor', 'Bidri Decor', 'Butler Service', 'Steam Shower'],
        },
        {
          name: 'Asaf Jahi Presidential Suite',
          description: 'The pinnacle of regal Hyderabad hospitality with private boardroom and banquet dining.',
          basePrice: 22000,
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: 'Master Suite',
          sizeSqFt: 1350,
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Private Boardroom', 'Banquet Dining', 'Personal Chef', 'Luxury Car Service'],
        },
      ],
    },
    {
      name: 'The Leela Palace Seaside Marina',
      tagline: 'Chettinad Grandeur by the Bay of Bengal',
      description: 'The city\'s only seafront palace hotel, inspired by the grand Chettinad architecture, boasting opulent marble corridors, infinity views of the Bay, and world-class patisseries.',
      address: 'Adyar Seaface, MRC Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      starRating: 5,
      ratingScore: 4.8,
      reviewCount: 198,
      startingPrice: 7800,
      featured: true,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      contactEmail: 'reservations.chennai@theleela.com',
      contactPhone: '+91 44 3366 1234',
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Bay View Rooms', 'Olympic-Length Pool', 'ESPA Spa', 'Chettinad Dining', '24h Fitness Center', 'Private Marina Boardwalk'],
      categories: [
        {
          name: 'Deluxe City View Room',
          description: 'Elegant woodwork with brass accents and sweeping views of the vibrant Chennai skyline.',
          basePrice: 7800,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 430,
          totalRooms: 14,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['City Skyline View', 'Marble Bath', 'Bose Sound', 'Tea/Coffee Bar'],
        },
        {
          name: 'Grand Sea Facing Premier',
          description: 'Floor-to-ceiling glass gazing directly out onto the breaking waves of the Bay of Bengal.',
          basePrice: 10800,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 590,
          totalRooms: 10,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Panoramic Bay View', 'Deep Soaking Tub', 'Breakfast Included', 'Balcony'],
        },
        {
          name: 'Chettinad Royal Suite',
          description: 'Authentic teak pillars, Athangudi handmade tiles, and private study lounge.',
          basePrice: 15900,
          capacityAdults: 3,
          capacityChildren: 2,
          bedType: 'Super King Bed',
          sizeSqFt: 840,
          totalRooms: 5,
          images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Handcrafted Tiles', 'Study Lounge', 'Butler Service', 'Airport Chauffeur'],
        },
        {
          name: 'Presidential Oceanfront Residence',
          description: 'Palatial 2-bedroom residence with private terrace jacuzzi overlooking the sea.',
          basePrice: 29000,
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: '2 King Master Bedrooms',
          sizeSqFt: 1550,
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Terrace Jacuzzi', 'Oceanfront Dining', 'Private Chef', 'Dedicated Butler'],
        },
      ],
    },
    {
      name: 'Kumarakom Backwaters Retreat',
      tagline: 'Tranquil Ayurvedic Sanctuary in Gods Own Country',
      description: 'Spread across 25 acres of lush coconut groves on the serene shores of Vembanad Lake, featuring traditional heritage cottages, houseboat cruises, and authentic Ayurvedic therapies.',
      address: 'Vembanad Lake Shore, Kumarakom',
      city: 'Kochi',
      state: 'Kerala',
      starRating: 5,
      ratingScore: 4.9,
      reviewCount: 172,
      startingPrice: 6500,
      featured: false,
      checkInTime: '13:00',
      checkOutTime: '11:00',
      contactEmail: 'ayurveda@kumarakomretreat.com',
      contactPhone: '+91 481 252 5010',
      images: [
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Houseboat Cruises', 'Ayurvedic Wellness Spa', 'Meandering Pool', 'Lotus Ponds', 'Organic Garden Dining', 'Yoga Pavilion'],
      categories: [
        {
          name: 'Heritage Canal Villa',
          description: 'Traditional wooden Kerala architecture rebuilt with open-to-sky shower and lotus canal frontage.',
          basePrice: 6500,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 460,
          totalRooms: 12,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Canal View', 'Open-Air Shower', 'Yoga Mat', 'Fresh Herbal Tea'],
        },
        {
          name: 'Lakeview Pool Villa',
          description: 'Direct lake frontage with private plunge pool set in fragrant spice garden.',
          basePrice: 11200,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 690,
          totalRooms: 8,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Private Pool', 'Lakefront Deck', 'Daily Sunset Cruise', 'Hammock'],
        },
        {
          name: 'Luxury Floating Kettuvallam Suite',
          description: 'Traditional thatched houseboat anchored on tranquil waters with private captain and cook.',
          basePrice: 16500,
          capacityAdults: 2,
          capacityChildren: 2,
          bedType: 'King Bed',
          sizeSqFt: 750,
          totalRooms: 4,
          images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Floating Houseboat', 'Private Captain', 'All Meals Included', 'Backwater Tour'],
        },
        {
          name: 'Royal Vembanad Presidential Haven',
          description: 'Sprawling master villa with private infinity pool merging seamlessly with the backwaters.',
          basePrice: 27500,
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: '2 King Bedrooms',
          sizeSqFt: 1400,
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Private Infinity Pool', 'Daily Ayurvedic Massages', 'Dedicated Chef', 'Speedboat Transfer'],
        },
      ],
    },
    {
      name: 'Amarvilas Mughal Splendor',
      tagline: 'Unobstructed Views of the Monument of Love',
      description: 'Located just 600 meters from the Taj Mahal, every single guest room and suite enjoys direct, breathtaking views of the monument, surrounded by terraced lawns, fountains, and reflection pools.',
      address: 'Taj East Gate Road, Fatehabad',
      city: 'Agra',
      state: 'Uttar Pradesh',
      starRating: 5,
      ratingScore: 4.9,
      reviewCount: 320,
      startingPrice: 13500,
      featured: true,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      contactEmail: 'concierge@amarvilasagra.com',
      contactPhone: '+91 562 223 1515',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Taj Mahal View from All Rooms', 'Tiered Blue Pools', 'Mughal Spa', 'Electric Golf Carts to Monument', 'Private Candlelit Balcony Dining', 'Telescopes in Suites'],
      categories: [
        {
          name: 'Premier Taj View Room',
          description: 'Wake up to the sun illuminating the ivory marble dome through oversized bay windows.',
          basePrice: 13500,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'King Bed',
          sizeSqFt: 450,
          totalRooms: 12,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Direct Taj Mahal View', 'Marble Bathroom', 'Complimentary Buggy', 'Mini Bar'],
        },
        {
          name: 'Deluxe Taj View with Balcony',
          description: 'Private open-air balcony equipped with brass telescope for intimate monument gazing.',
          basePrice: 18000,
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: 'California King',
          sizeSqFt: 600,
          totalRooms: 8,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Private Balcony', 'Brass Telescope', 'Champagne on Arrival', 'Bathtub'],
        },
        {
          name: 'Mughal Luxury Suite',
          description: 'Elaborate mother-of-pearl inlay work, silk hand-tufted carpets, and grand lounge.',
          basePrice: 25000,
          capacityAdults: 3,
          capacityChildren: 2,
          bedType: 'Super King Bed',
          sizeSqFt: 880,
          totalRooms: 4,
          images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Mother of Pearl Inlay', 'Candlelit Dinner on Terrace', 'VIP Guide', 'Butler'],
        },
        {
          name: 'Kohinoor Taj Presidential Palace',
          description: 'Bespoke grand suite with unobstructed panoramic terrace, master bedroom, and dining salon.',
          basePrice: 45000,
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: '2 King Master Bedrooms',
          sizeSqFt: 1800,
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80'],
          amenities: ['Unobstructed Taj Panorama', 'Private Open-Air Terrace', 'Personal Chef', 'BMW Transfer'],
        },
      ],
    },
  ];

  const createdHotels = [];

  for (const hData of hotelsData) {
    const hotel = await prisma.hotel.create({
      data: {
        name: hData.name,
        tagline: hData.tagline,
        description: hData.description,
        address: hData.address,
        city: hData.city,
        state: hData.state,
        country: 'India',
        starRating: hData.starRating,
        ratingScore: hData.ratingScore,
        reviewCount: hData.reviewCount,
        startingPrice: hData.startingPrice,
        featured: hData.featured,
        checkInTime: hData.checkInTime,
        checkOutTime: hData.checkOutTime,
        contactEmail: hData.contactEmail,
        contactPhone: hData.contactPhone,
        images: JSON.stringify(hData.images),
        amenities: JSON.stringify(hData.amenities),
      },
    });

    createdHotels.push(hotel);

    // Create room categories and physical rooms
    for (const catData of hData.categories) {
      const category = await prisma.roomCategory.create({
        data: {
          hotelId: hotel.id,
          name: catData.name,
          description: catData.description,
          basePrice: catData.basePrice,
          capacityAdults: catData.capacityAdults,
          capacityChildren: catData.capacityChildren,
          bedType: catData.bedType,
          sizeSqFt: catData.sizeSqFt,
          totalRooms: catData.totalRooms,
          images: JSON.stringify(catData.images),
          amenities: JSON.stringify(catData.amenities),
        },
      });

      // Create individual room entities for availability tracking
      const roomsToCreate = [];
      for (let i = 1; i <= catData.totalRooms; i++) {
        roomsToCreate.push({
          hotelId: hotel.id,
          categoryId: category.id,
          roomNumber: `${category.name.substring(0, 3).toUpperCase()}-${100 + i}`,
          floor: 1 + Math.floor(i / 10),
          status: 'AVAILABLE',
        });
      }
      await prisma.room.createMany({ data: roomsToCreate });
    }
  }

  console.log(`🏨 Seeded ${createdHotels.length} luxury hotels with full room categories and rooms.`);

  // Create Sample Bookings & Payments for Demo Customer
  const firstHotel = createdHotels[0];
  const firstCategory = await prisma.roomCategory.findFirst({ where: { hotelId: firstHotel.id } });

  const secondHotel = createdHotels[1];
  const secondCategory = await prisma.roomCategory.findFirst({ where: { hotelId: secondHotel.id } });

  const thirdHotel = createdHotels[3];
  const thirdCategory = await prisma.roomCategory.findFirst({ where: { hotelId: thirdHotel.id } });

  if (firstCategory && secondCategory && thirdCategory) {
    // 1. Upcoming confirmed booking
    const checkIn1 = new Date();
    checkIn1.setDate(checkIn1.getDate() + 7);
    const checkOut1 = new Date();
    checkOut1.setDate(checkOut1.getDate() + 10);
    const nights1 = 3;
    const subtotal1 = firstCategory.basePrice * nights1;
    const taxes1 = Math.round(subtotal1 * 0.18);
    const total1 = subtotal1 + taxes1;

    const booking1 = await prisma.booking.create({
      data: {
        bookingReference: 'SE-2025-849201',
        userId: demoCustomer.id,
        hotelId: firstHotel.id,
        categoryId: firstCategory.id,
        checkInDate: checkIn1,
        checkOutDate: checkOut1,
        nights: nights1,
        numRooms: 1,
        numGuests: 2,
        guestName: demoCustomer.name,
        guestEmail: demoCustomer.email,
        guestPhone: demoCustomer.phone || '+91 98123 45678',
        specialRequests: 'High floor preferred, airport pickup requested.',
        selectedRoomNumbers: 'DEL-101',
        roomPrice: firstCategory.basePrice,
        extraServicesPrice: 0,
        taxes: taxes1,
        discountAmount: 0,
        totalAmount: total1,
        status: 'CONFIRMED',
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking1.id,
        amount: total1,
        currency: 'INR',
        method: 'CREDIT_CARD',
        transactionId: 'TXN-STAY-17088921890',
        status: 'SUCCESS',
      },
    });

    // Sample Service Request for booking 1
    await prisma.serviceRequest.create({
      data: {
        bookingId: booking1.id,
        hotelId: firstHotel.id,
        userId: demoCustomer.id,
        roomNumber: 'DEL-101',
        serviceType: 'AIRPORT_PICKUP',
        details: 'Flight 6E-241 arriving at Dabolim airport around 13:45.',
        status: 'ACCEPTED',
      },
    });

    await prisma.serviceRequest.create({
      data: {
        bookingId: booking1.id,
        hotelId: firstHotel.id,
        userId: demoCustomer.id,
        roomNumber: 'DEL-101',
        serviceType: 'EXTRA_TOWELS',
        details: 'Extra organic cotton bath sheets and lavender aromatherapy spray.',
        status: 'PENDING',
      },
    });

    // 2. Past completed booking
    const checkIn2 = new Date();
    checkIn2.setDate(checkIn2.getDate() - 30);
    const checkOut2 = new Date();
    checkOut2.setDate(checkOut2.getDate() - 28);
    const nights2 = 2;
    const subtotal2 = secondCategory.basePrice * nights2;
    const taxes2 = Math.round(subtotal2 * 0.12);
    const discount2 = 1000;
    const total2 = subtotal2 + taxes2 - discount2;

    const booking2 = await prisma.booking.create({
      data: {
        bookingReference: 'SE-2025-391204',
        userId: demoCustomer.id,
        hotelId: secondHotel.id,
        categoryId: secondCategory.id,
        checkInDate: checkIn2,
        checkOutDate: checkOut2,
        nights: nights2,
        numRooms: 1,
        numGuests: 2,
        guestName: demoCustomer.name,
        guestEmail: demoCustomer.email,
        guestPhone: demoCustomer.phone || '+91 98123 45678',
        selectedRoomNumbers: 'EXE-102',
        roomPrice: secondCategory.basePrice,
        extraServicesPrice: 0,
        taxes: taxes2,
        discountAmount: discount2,
        totalAmount: total2,
        status: 'CHECKED_OUT',
        couponCode: 'WELCOME10',
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking2.id,
        amount: total2,
        currency: 'INR',
        method: 'UPI',
        transactionId: 'TXN-STAY-17072019482',
        status: 'SUCCESS',
      },
    });

    // 3. Past booking from another user for Jaipur
    const checkIn3 = new Date();
    checkIn3.setDate(checkIn3.getDate() - 14);
    const checkOut3 = new Date();
    checkOut3.setDate(checkOut3.getDate() - 11);
    const nights3 = 3;
    const subtotal3 = thirdCategory.basePrice * nights3;
    const taxes3 = Math.round(subtotal3 * 0.18);
    const total3 = subtotal3 + taxes3;

    const booking3 = await prisma.booking.create({
      data: {
        bookingReference: 'SE-2025-502914',
        userId: user3.id,
        hotelId: thirdHotel.id,
        categoryId: thirdCategory.id,
        checkInDate: checkIn3,
        checkOutDate: checkOut3,
        nights: nights3,
        numRooms: 1,
        numGuests: 2,
        guestName: user3.name,
        guestEmail: user3.email,
        guestPhone: user3.phone || '+91 96345 67890',
        selectedRoomNumbers: 'PAL-105',
        roomPrice: thirdCategory.basePrice,
        extraServicesPrice: 0,
        taxes: taxes3,
        discountAmount: 0,
        totalAmount: total3,
        status: 'CHECKED_OUT',
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking3.id,
        amount: total3,
        currency: 'INR',
        method: 'CREDIT_CARD',
        transactionId: 'TXN-STAY-17079491028',
        status: 'SUCCESS',
      },
    });

    console.log('📅 Seeded demo reservations, simulated payments, and service requests.');
  }

  // Seed Reviews
  await prisma.review.createMany({
    data: [
      {
        userId: demoCustomer.id,
        hotelId: firstHotel.id,
        rating: 5,
        title: 'Unbelievable ocean vistas and royal service!',
        comment: 'Our stay at The Grand Palace was sheer perfection. The sunset from our balcony was mesmerizing, and the staff anticipated our every need. Will certainly return!',
      },
      {
        userId: user2.id,
        hotelId: firstHotel.id,
        rating: 5,
        title: 'Best luxury beach resort in Goa',
        comment: 'Exquisite food at the seaside restaurant, spotlessly clean rooms, and the private cabana service made our anniversary trip unforgettable.',
      },
      {
        userId: user3.id,
        hotelId: secondHotel.id,
        rating: 5,
        title: 'Peaceful luxury in the middle of Bangalore',
        comment: 'The lush cascading greenery makes you forget you are in the city center. Excellent executive lounge and wonderful spa therapies.',
      },
      {
        userId: user2.id,
        hotelId: thirdHotel.id,
        rating: 5,
        title: 'Felt like true royalty in Jaipur!',
        comment: 'The peacocks greeting you in the courtyard in the morning, along with the magnificent Rajput architecture and personalized hospitality, was out of this world.',
      },
    ],
  });

  // Seed Wishlist for demo customer
  await prisma.wishlist.createMany({
    data: [
      { userId: demoCustomer.id, hotelId: firstHotel.id },
      { userId: demoCustomer.id, hotelId: secondHotel.id },
    ],
  });

  console.log('⭐ Seeded reviews and wishlist entries.');
  console.log('✅ StayEase Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
