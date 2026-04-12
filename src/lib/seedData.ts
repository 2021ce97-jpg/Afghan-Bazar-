export const MOCK_SHOPS = [
  { 
    id: '1', 
    name: 'Rasool Zada Carpets', 
    image: 'https://picsum.photos/seed/carpets/800/600', 
    logo: 'https://picsum.photos/seed/logo1/200/200',
    category: 'Home & Decor',
    district: 'Najeeb Zarab',
    description: 'Authentic Afghan handmade carpets and rugs.',
    rating: 4.8,
    reviews: 124
  },
  { 
    id: '2', 
    name: 'Parwan Fresh Groceries', 
    image: 'https://picsum.photos/seed/groceries/800/600', 
    logo: 'https://picsum.photos/seed/logo2/200/200',
    category: 'Groceries',
    district: 'Parwan',
    description: 'Fresh fruits, vegetables, and daily groceries delivered fast.',
    rating: 4.5,
    reviews: 89
  },
  { 
    id: '3', 
    name: 'Kabul Dry Fruits Bazaar', 
    image: 'https://picsum.photos/seed/dryfruits/800/600', 
    logo: 'https://picsum.photos/seed/logo3/200/200',
    category: 'Food',
    district: 'Central Bazaar',
    description: 'Premium quality pistachios, almonds, saffron, and more.',
    rating: 4.9,
    reviews: 210
  },
  { 
    id: '4', 
    name: 'Chicken Street Fashion', 
    image: 'https://picsum.photos/seed/fashion/800/600', 
    logo: 'https://picsum.photos/seed/logo4/200/200',
    category: 'Clothing',
    district: 'Chicken Street',
    description: 'Traditional and modern Afghan clothing for men and women.',
    rating: 4.6,
    reviews: 156
  },
  { 
    id: '5', 
    name: 'Shar-e-Naw Mobiles', 
    image: 'https://picsum.photos/seed/mobiles/800/600', 
    logo: 'https://picsum.photos/seed/logo5/200/200',
    category: 'Electronics',
    district: 'Shar-e-Naw',
    description: 'Latest smartphones, accessories, and repair services.',
    rating: 4.3,
    reviews: 67
  },
  { 
    id: '6', 
    name: 'Kabul Auto Parts', 
    image: 'https://picsum.photos/seed/autoparts/800/600', 
    logo: 'https://picsum.photos/seed/logo6/200/200',
    category: 'Automotive',
    district: 'Industrial Area',
    description: 'Genuine spare parts for Toyota, Corolla, and more.',
    rating: 4.7,
    reviews: 92
  }
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    shopId: '1',
    title: 'Handwoven Red Afghan Rug (2x3m)',
    price: 15000,
    stock: 5,
    image: 'https://picsum.photos/seed/rug1/800/800',
    category: 'Home & Decor',
    variants: [
      { id: 'v1-1', size: '2x3m', price: 15000, stock: 5 },
      { id: 'v1-2', size: '3x4m', price: 25000, stock: 2 }
    ]
  },
  {
    id: 'p2',
    shopId: '3',
    title: 'Premium Herat Saffron',
    price: 2500,
    stock: 50,
    image: 'https://picsum.photos/seed/saffron/800/800',
    category: 'Food',
    variants: [
      { id: 'v2-1', size: '5g', price: 2500, stock: 50 },
      { id: 'v2-2', size: '10g', price: 4800, stock: 30 },
      { id: 'v2-3', size: '20g', price: 9000, stock: 10 }
    ]
  },
  {
    id: 'p3',
    shopId: '3',
    title: 'Roasted Pistachios (1kg)',
    price: 1200,
    stock: 120,
    image: 'https://picsum.photos/seed/pistachio/800/800',
    category: 'Food'
  },
  {
    id: 'p4',
    shopId: '4',
    title: 'Traditional Men\'s Perahan Tunban',
    price: 3500,
    stock: 20,
    image: 'https://picsum.photos/seed/clothes1/800/800',
    category: 'Clothing',
    variants: [
      { id: 'v4-1', size: 'M', color: 'White', price: 3500, stock: 10 },
      { id: 'v4-2', size: 'L', color: 'White', price: 3500, stock: 5 },
      { id: 'v4-3', size: 'M', color: 'Black', price: 3600, stock: 0 },
      { id: 'v4-4', size: 'L', color: 'Black', price: 3600, stock: 5 }
    ]
  },
  {
    id: 'p5',
    shopId: '5',
    title: 'iPhone 15 Pro Max Case',
    price: 500,
    stock: 200,
    image: 'https://picsum.photos/seed/case/800/800',
    category: 'Electronics',
    variants: [
      { id: 'v5-1', color: 'Clear', price: 500, stock: 100 },
      { id: 'v5-2', color: 'Black', price: 550, stock: 50 },
      { id: 'v5-3', color: 'Blue', price: 550, stock: 50 }
    ]
  },
  {
    id: 'p6',
    shopId: '2',
    title: 'Fresh Pomegranates (Kandahar) - 3kg',
    price: 450,
    stock: 30,
    image: 'https://picsum.photos/seed/pomegranate/800/800',
    category: 'Groceries'
  }
];
