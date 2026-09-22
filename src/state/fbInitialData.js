// ==========================================================================
// VOLVITECH HOSPITALITY OS — FOOD & BEVERAGE MASTER DATA & CAMP RECIPES
// Derived from Camp Catering Management (Breakfast, Lunch, Dinner, Scaling Engine)
// ==========================================================================

export const INITIAL_FB_CHEFS = [
  {
    id: 'chef-1',
    name: 'Jean-Luc Moreau',
    title: 'Executive Chef',
    rank: 'HEAD_CHEF',
    avatarInitials: 'JM',
    specialty: 'Contemporary French & Mediterranean, Menu Engineering',
    station: 'Central Pass & Operations',
    shift: 'Midday / Double Shift (07:00 – 16:30)',
    shiftCode: 'SHIFT_DAY',
    status: 'ON_DUTY',
    haccpCertified: true,
    experienceYrs: 18,
    phone: '+971 50 119 2831',
    activePrepCount: 4
  },
  {
    id: 'chef-2',
    name: 'Tariq Al-Hassan',
    title: 'Executive Sous Chef & Banqueting Master',
    rank: 'SOUS_CHEF',
    avatarInitials: 'TA',
    specialty: 'Bulk Catering, Khaleej Mandi & Kabsa, Banquet Logistics',
    station: 'Banquet & Bulk Kitchen',
    shift: 'Morning & Prep (06:00 – 15:30)',
    shiftCode: 'SHIFT_MORNING',
    status: 'ON_DUTY',
    haccpCertified: true,
    experienceYrs: 14,
    phone: '+971 52 443 9021',
    activePrepCount: 6
  },
  {
    id: 'chef-3',
    name: 'Ananya Sen',
    title: 'Chef de Partie — Tandoor & Indian Regional',
    rank: 'CDP',
    avatarInitials: 'AS',
    specialty: 'Hyderabadi Dum Biryani, Tandoori Marinades, Dal Bukhara',
    station: 'Tandoor & Clay Oven Bay',
    shift: 'Afternoon & Dinner Service (12:00 – 21:30)',
    shiftCode: 'SHIFT_DINNER',
    status: 'ON_DUTY',
    haccpCertified: true,
    experienceYrs: 11,
    phone: '+971 55 882 1092',
    activePrepCount: 5
  },
  {
    id: 'chef-4',
    name: 'Marco Moretti',
    title: 'Chef de Partie — Saucier & Hot Line',
    rank: 'CDP',
    avatarInitials: 'MM',
    specialty: 'Plancha Searing, Sauces, Steaks & Seafood Catch',
    station: 'Hot Kitchen Line #1',
    shift: 'Dinner Service (13:30 – 22:30)',
    shiftCode: 'SHIFT_DINNER',
    status: 'ON_DUTY',
    haccpCertified: true,
    experienceYrs: 9,
    phone: '+971 58 771 4455',
    activePrepCount: 3
  },
  {
    id: 'chef-5',
    name: 'Pierre Gagnon',
    title: 'Head Pastry Chef & Baker',
    rank: 'CDP',
    avatarInitials: 'PG',
    specialty: 'Viennoiserie, Sourdough Breads, Croissants & Patisserie',
    station: 'Bakery & Pastry Studio',
    shift: 'Early Morning Bake (04:30 – 13:00)',
    shiftCode: 'SHIFT_EARLY',
    status: 'ON_DUTY',
    haccpCertified: true,
    experienceYrs: 13,
    phone: '+971 50 334 1920',
    activePrepCount: 7
  },
  {
    id: 'chef-6',
    name: 'Fatima Al-Zahrani',
    title: 'Chef de Partie — Garde Manger & Mezze',
    rank: 'CDP',
    avatarInitials: 'FZ',
    specialty: 'Levantine Cold Mezze, Organic Salad Bars, Micro-greens',
    station: 'Salad & Cold Larder',
    shift: 'Morning & Lunch (06:30 – 15:00)',
    shiftCode: 'SHIFT_MORNING',
    status: 'ON_DUTY',
    haccpCertified: true,
    experienceYrs: 8,
    phone: '+971 56 612 8840',
    activePrepCount: 4
  },
  {
    id: 'chef-7',
    name: 'Rajesh Kumar',
    title: 'Commis Chef — Live Breakfast Stations',
    rank: 'COMMIS',
    avatarInitials: 'RK',
    specialty: 'Live Dosa Griddles, Omelettes, Ful Medames Prep',
    station: 'Live Display Kitchen',
    shift: 'Breakfast Shift (05:30 – 14:00)',
    shiftCode: 'SHIFT_MORNING',
    status: 'ON_DUTY',
    haccpCertified: true,
    experienceYrs: 5,
    phone: '+971 54 992 0183',
    activePrepCount: 2
  },
  {
    id: 'chef-8',
    name: 'Chen Wei',
    title: 'Wok Master & Asian Section',
    rank: 'CDP',
    avatarInitials: 'CW',
    specialty: 'Dim Sum, Hand-Pulled Noodles, High-Flame Wok Stir-Fry',
    station: 'Asian Wok Counter',
    shift: 'Evening & Late Night (16:00 – 00:30)',
    shiftCode: 'SHIFT_NIGHT',
    status: 'ON_BREAK',
    haccpCertified: true,
    experienceYrs: 10,
    phone: '+971 52 381 9904',
    activePrepCount: 0
  }
];

export const INITIAL_FB_INGREDIENTS = [
  // Rice & Grains
  { id: 'ing-rice-basmati', sku: 'ING-BASMATI-01', name: 'Basmati Rice (XXL Aged)', category: 'Rice & Grains', unit: 'kg', stock: 185.0, minPar: 50.0, costPerUnit: 6.00, store: 'Central Dry Store' },
  { id: 'ing-semolina', sku: 'ING-SEMOLINA-01', name: 'Semolina (Sooji Fine)', category: 'Rice & Grains', unit: 'kg', stock: 32.0, minPar: 10.0, costPerUnit: 5.00, store: 'Central Dry Store' },
  { id: 'ing-flour-wheat', sku: 'ING-FLOUR-WHEAT', name: 'Stone-Ground Wheat Flour', category: 'Rice & Grains', unit: 'kg', stock: 75.0, minPar: 20.0, costPerUnit: 4.00, store: 'Central Dry Store' },
  { id: 'ing-batter-rice', sku: 'ING-BATTER-RICE', name: 'Fermented Rice Batter', category: 'Rice & Grains', unit: 'kg', stock: 28.0, minPar: 10.0, costPerUnit: 5.00, store: 'Kitchen Cold Store' },
  { id: 'ing-batter-dosa', sku: 'ING-BATTER-DOSA', name: 'Artisanal Dosa Batter', category: 'Rice & Grains', unit: 'kg', stock: 34.0, minPar: 10.0, costPerUnit: 5.00, store: 'Kitchen Cold Store' },
  { id: 'ing-poha', sku: 'ING-POHA-01', name: 'Flattened Rice (Poha)', category: 'Rice & Grains', unit: 'kg', stock: 18.0, minPar: 8.0, costPerUnit: 6.00, store: 'Central Dry Store' },
  { id: 'ing-pasta', sku: 'ING-PASTA-01', name: 'Durum Semolina Penne & Rigatoni', category: 'Rice & Grains', unit: 'kg', stock: 45.0, minPar: 15.0, costPerUnit: 8.00, store: 'Central Dry Store' },

  // Meat & Poultry
  { id: 'ing-chicken', sku: 'ING-CHICKEN-FR', name: 'Fresh Farm Chicken (Cut Pieces)', category: 'Meat & Poultry', unit: 'kg', stock: 72.0, minPar: 35.0, costPerUnit: 26.00, store: 'Butchery Cold Walk-in' },
  { id: 'ing-mutton', sku: 'ING-MUTTON-BONE', name: 'Premium Tender Mutton Bone-in', category: 'Meat & Poultry', unit: 'kg', stock: 26.0, minPar: 12.0, costPerUnit: 60.00, store: 'Butchery Cold Walk-in' },
  { id: 'ing-lamb', sku: 'ING-LAMB-SHANK', name: 'Australian Lamb Shanks', category: 'Meat & Poultry', unit: 'kg', stock: 24.0, minPar: 10.0, costPerUnit: 65.00, store: 'Butchery Cold Walk-in' },
  { id: 'ing-fish', sku: 'ING-FISH-HAMOUR', name: 'Fresh Gulf Hamour & Kingfish Fillet', category: 'Meat & Poultry', unit: 'kg', stock: 32.0, minPar: 12.0, costPerUnit: 40.00, store: 'Fish Ice Well' },
  { id: 'ing-prawns', sku: 'ING-PRAWNS-TIGER', name: 'Jumbo Tiger Prawns (U-15 Headless)', category: 'Meat & Poultry', unit: 'kg', stock: 7.5, minPar: 10.0, costPerUnit: 70.00, store: 'Fish Ice Well' }, // LOW STOCK!

  // Dairy & Eggs
  { id: 'ing-egg', sku: 'ING-EGG-FARM', name: 'Farm Fresh Brown Eggs', category: 'Dairy & Eggs', unit: 'pieces', stock: 260, minPar: 80, costPerUnit: 1.00, store: 'Pastry Chiller' },
  { id: 'ing-milk', sku: 'ING-MILK-FULL', name: 'Pasteurized Full Cream Fresh Milk', category: 'Dairy & Eggs', unit: 'litres', stock: 52.0, minPar: 20.0, costPerUnit: 4.50, store: 'Pastry Chiller' },
  { id: 'ing-butter', sku: 'ING-BUTTER-UNSALT', name: 'Lactic Unsalted Butter Blocks', category: 'Dairy & Eggs', unit: 'kg', stock: 22.0, minPar: 10.0, costPerUnit: 28.00, store: 'Kitchen Cold Store' },
  { id: 'ing-cheese', sku: 'ING-CHEESE-CHED', name: 'Aged Cheddar & Mozzarella Blend', category: 'Dairy & Eggs', unit: 'kg', stock: 16.5, minPar: 8.0, costPerUnit: 45.00, store: 'Kitchen Cold Store' },
  { id: 'ing-yogurt', sku: 'ING-YOGURT-GREEK', name: 'Thick Plain Greek Yogurt', category: 'Dairy & Eggs', unit: 'kg', stock: 32.0, minPar: 12.0, costPerUnit: 8.00, store: 'Kitchen Cold Store' },
  { id: 'ing-cream', sku: 'ING-CREAM-HEAVY', name: 'Culinary Heavy Cooking Cream 35%', category: 'Dairy & Eggs', unit: 'litres', stock: 18.0, minPar: 8.0, costPerUnit: 18.00, store: 'Kitchen Cold Store' },
  { id: 'ing-paneer', sku: 'ING-PANEER-FRESH', name: 'Malai Cottage Cheese (Paneer)', category: 'Dairy & Eggs', unit: 'kg', stock: 19.0, minPar: 8.0, costPerUnit: 40.00, store: 'Kitchen Cold Store' },
  { id: 'ing-coconut-milk', sku: 'ING-COCO-MILK', name: 'Cold-Pressed Coconut Milk', category: 'Dairy & Eggs', unit: 'litres', stock: 24.0, minPar: 10.0, costPerUnit: 12.00, store: 'Central Dry Store' },

  // Vegetables
  { id: 'ing-onion', sku: 'ING-ONION-RED', name: 'Red Onions (Graded A)', category: 'Vegetables', unit: 'kg', stock: 135.0, minPar: 40.0, costPerUnit: 3.00, store: 'Vegetable Cool Store' },
  { id: 'ing-tomato', sku: 'ING-TOMATO-PLUM', name: 'Vine-Ripened Plum Tomatoes', category: 'Vegetables', unit: 'kg', stock: 95.0, minPar: 30.0, costPerUnit: 4.00, store: 'Vegetable Cool Store' },
  { id: 'ing-potato', sku: 'ING-POTATO-RUSSET', name: 'Washed Russet Potatoes', category: 'Vegetables', unit: 'kg', stock: 110.0, minPar: 30.0, costPerUnit: 3.50, store: 'Vegetable Cool Store' },
  { id: 'ing-veg-mixed', sku: 'ING-VEG-MIXED', name: 'Seasonal Mixed Vegetables', category: 'Vegetables', unit: 'kg', stock: 48.0, minPar: 20.0, costPerUnit: 6.00, store: 'Vegetable Cool Store' },
  { id: 'ing-lettuce', sku: 'ING-LETTUCE-ROMAINE', name: 'Crisp Romaine & Iceberg Lettuce', category: 'Vegetables', unit: 'kg', stock: 22.0, minPar: 8.0, costPerUnit: 8.00, store: 'Vegetable Cool Store' },
  { id: 'ing-cucumber', sku: 'ING-CUCUMBER-LEB', name: 'Lebanese Mini Cucumbers', category: 'Vegetables', unit: 'kg', stock: 26.0, minPar: 10.0, costPerUnit: 4.00, store: 'Vegetable Cool Store' },
  { id: 'ing-garlic', sku: 'ING-GARLIC-PEELED', name: 'Fresh Peeled Garlic Cloves', category: 'Vegetables', unit: 'kg', stock: 16.0, minPar: 6.0, costPerUnit: 15.00, store: 'Vegetable Cool Store' },
  { id: 'ing-chickpeas', sku: 'ING-CHICKPEAS-RAW', name: 'Kabuli Chickpeas (Garbanzo)', category: 'Vegetables', unit: 'kg', stock: 38.0, minPar: 15.0, costPerUnit: 8.00, store: 'Central Dry Store' },
  { id: 'ing-fava-beans', sku: 'ING-FAVA-BEANS', name: 'Dried Fava Beans (Ful)', category: 'Vegetables', unit: 'kg', stock: 30.0, minPar: 12.0, costPerUnit: 7.00, store: 'Central Dry Store' },
  { id: 'ing-dal', sku: 'ING-DAL-TOOR', name: 'Toor & Moong Yellow Dal', category: 'Vegetables', unit: 'kg', stock: 50.0, minPar: 20.0, costPerUnit: 7.00, store: 'Central Dry Store' },
  { id: 'ing-dal-urad', sku: 'ING-DAL-URAD', name: 'White Urad Dal Whole', category: 'Vegetables', unit: 'kg', stock: 22.0, minPar: 8.0, costPerUnit: 9.00, store: 'Central Dry Store' },

  // Spices & Condiments
  { id: 'ing-salt', sku: 'ING-SALT-SEA', name: 'Pure Evaporated Sea Salt', category: 'Spices & Condiments', unit: 'kg', stock: 48.0, minPar: 20.0, costPerUnit: 2.00, store: 'Central Dry Store' },
  { id: 'ing-spices-mixed', sku: 'ING-SPICE-MIXED', name: 'Chefs Special Garam Masala Blend', category: 'Spices & Condiments', unit: 'kg', stock: 14.0, minPar: 5.0, costPerUnit: 20.00, store: 'Spice Vault' },
  { id: 'ing-biryani-masala', sku: 'ING-BIRYANI-MAS', name: 'Royal Awadhi Biryani Masala', category: 'Spices & Condiments', unit: 'kg', stock: 15.0, minPar: 5.0, costPerUnit: 35.00, store: 'Spice Vault' },
  { id: 'ing-mandi-spice', sku: 'ING-MANDI-SPICE', name: 'Yemeni Mandi Whole Spices', category: 'Spices & Condiments', unit: 'kg', stock: 12.0, minPar: 5.0, costPerUnit: 30.00, store: 'Spice Vault' },
  { id: 'ing-kabsa-spice', sku: 'ING-KABSA-SPICE', name: 'Saudi Kabsa Traditional Spices', category: 'Spices & Condiments', unit: 'kg', stock: 12.0, minPar: 5.0, costPerUnit: 30.00, store: 'Spice Vault' },
  { id: 'ing-mint', sku: 'ING-HERB-MINT', name: 'Fresh Mountain Mint Leaves', category: 'Spices & Condiments', unit: 'kg', stock: 6.5, minPar: 3.0, costPerUnit: 15.00, store: 'Vegetable Cool Store' },
  { id: 'ing-sambar-powder', sku: 'ING-SAMBAR-POW', name: 'Madras Sambar Powder', category: 'Spices & Condiments', unit: 'kg', stock: 9.0, minPar: 4.0, costPerUnit: 25.00, store: 'Spice Vault' },

  // Beverages & Oils
  { id: 'ing-oil', sku: 'ING-OIL-SUNFLOWER', name: 'Pure Refined Sunflower Oil', category: 'Beverages & Oils', unit: 'litres', stock: 110.0, minPar: 35.0, costPerUnit: 8.00, store: 'Central Dry Store' },
  { id: 'ing-olive-oil', sku: 'ING-OIL-OLIVE', name: 'Extra Virgin Spanish Olive Oil', category: 'Beverages & Oils', unit: 'litres', stock: 28.0, minPar: 10.0, costPerUnit: 30.00, store: 'Central Dry Store' },
  { id: 'ing-soy-sauce', sku: 'ING-SOY-SAUCE', name: 'Naturally Brewed Light Soy Sauce', category: 'Beverages & Oils', unit: 'litres', stock: 16.0, minPar: 6.0, costPerUnit: 15.00, store: 'Central Dry Store' },

  // Miscellaneous & Breads
  { id: 'ing-parota', sku: 'ING-BREAD-PAROTA', name: 'Layered Malabar Parota (Semi-cooked)', category: 'Miscellaneous', unit: 'pieces', stock: 380, minPar: 120, costPerUnit: 1.50, store: 'Kitchen Freezer' },
  { id: 'ing-bread', sku: 'ING-BREAD-TOAST', name: 'White & Multi-Grain Toast Loaves', category: 'Miscellaneous', unit: 'pieces', stock: 160, minPar: 50, costPerUnit: 1.00, store: 'Bakery Store' },
  { id: 'ing-pita', sku: 'ING-BREAD-PITA', name: 'Arabic Khubz / Pita Pockets', category: 'Miscellaneous', unit: 'pieces', stock: 120, minPar: 40, costPerUnit: 2.00, store: 'Bakery Store' },
  { id: 'ing-naan', sku: 'ING-BREAD-NAAN', name: 'Tandoori Garlic & Butter Naan Dough', category: 'Miscellaneous', unit: 'pieces', stock: 140, minPar: 40, costPerUnit: 2.00, store: 'Tandoor Prep Chiller' },
  { id: 'ing-croissant', sku: 'ING-BAKERY-CROISS', name: 'All-Butter French Croissants', category: 'Miscellaneous', unit: 'pieces', stock: 75, minPar: 25, costPerUnit: 4.00, store: 'Bakery Store' },
  { id: 'ing-sugar', sku: 'ING-SUGAR-WHITE', name: 'Refined Granulated Cane Sugar', category: 'Miscellaneous', unit: 'kg', stock: 45.0, minPar: 15.0, costPerUnit: 4.00, store: 'Central Dry Store' },
  { id: 'ing-honey', sku: 'ING-HONEY-NATURAL', name: 'Wild Blossom Raw Honey', category: 'Miscellaneous', unit: 'kg', stock: 14.0, minPar: 5.0, costPerUnit: 30.00, store: 'Central Dry Store' },
  { id: 'ing-jam', sku: 'ING-JAM-BERRY', name: 'Artisanal Mixed Berry Conserve', category: 'Miscellaneous', unit: 'kg', stock: 15.0, minPar: 5.0, costPerUnit: 15.00, store: 'Central Dry Store' },
  { id: 'ing-lemon', sku: 'ING-LEMON-YELLOW', name: 'Fresh Juicy Eureka Lemons', category: 'Miscellaneous', unit: 'pieces', stock: 140, minPar: 40, costPerUnit: 0.80, store: 'Vegetable Cool Store' },
  { id: 'ing-tahini', sku: 'ING-TAHINI-SESAME', name: 'Lebanese Pure Sesame Tahini Paste', category: 'Miscellaneous', unit: 'kg', stock: 3.8, minPar: 6.0, costPerUnit: 20.00, store: 'Central Dry Store' }, // LOW STOCK!
  { id: 'ing-chutney-coco', sku: 'ING-CHUTNEY-COCO', name: 'Fresh Coconut Chutney Base', category: 'Miscellaneous', unit: 'kg', stock: 12.0, minPar: 5.0, costPerUnit: 12.00, store: 'Kitchen Cold Store' }
];

export const INITIAL_FB_DISHES = [
  // ==================== BREAKFAST DISHES ====================
  {
    id: 'dish-bf-1',
    name: 'Aloo Parota with Curd & Pickle',
    mealType: 'Breakfast',
    category: 'Indian & Regional',
    portionSize: '3 pcs with condiment tray',
    sellingPrice: 12.50,
    prepTimeMin: 15,
    leadStation: 'Tandoor & Clay Oven Bay',
    dietary: ['Vegetarian', 'Halal'],
    description: 'Crisp griddled whole wheat flatbreads stuffed with spiced mashed potatoes, ginger and coriander.',
    standardCost: 2.38,
    foodCostPct: 19.0,
    recipe: [
      { name: 'Parota', ingredientId: 'ing-parota', unit: 'pieces', qty_per_person: 3 },
      { name: 'Potato', ingredientId: 'ing-potato', unit: 'kg', qty_per_person: 0.1 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.03 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.015 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.003 }
    ]
  },
  {
    id: 'dish-bf-2',
    name: 'Golden Dosa with Chutney & Sambar',
    mealType: 'Breakfast',
    category: 'South Indian Breakfast',
    portionSize: '2 Crispy Dosas with bowls',
    sellingPrice: 14.00,
    prepTimeMin: 12,
    leadStation: 'Live Display Kitchen',
    dietary: ['Vegetarian', 'Gluten-Free', 'Halal'],
    description: 'Crispy fermented rice and lentil crepe served with freshly grated coconut chutney and aromatic drumstick sambar.',
    standardCost: 2.65,
    foodCostPct: 18.9,
    recipe: [
      { name: 'Dosa Batter', ingredientId: 'ing-batter-dosa', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.01 },
      { name: 'Coconut Chutney', ingredientId: 'ing-chutney-coco', unit: 'kg', qty_per_person: 0.03 },
      { name: 'Sambar Powder', ingredientId: 'ing-sambar-powder', unit: 'kg', qty_per_person: 0.005 },
      { name: 'Dal', ingredientId: 'ing-dal', unit: 'kg', qty_per_person: 0.03 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.02 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.02 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.003 }
    ]
  },
  {
    id: 'dish-bf-3',
    name: 'Farm Fresh Egg Omelette & Toast',
    mealType: 'Breakfast',
    category: 'Continental & Live Eggs',
    portionSize: '3-Egg Folded Omelette + 2 Toasts',
    sellingPrice: 13.00,
    prepTimeMin: 10,
    leadStation: 'Live Display Kitchen',
    dietary: ['Non-Veg', 'Halal'],
    description: 'Fluffy 3-egg omelette with sautéed shallots, bell peppers, melted cheddar, served with browned brioche toasts.',
    standardCost: 2.15,
    foodCostPct: 16.5,
    recipe: [
      { name: 'Egg', ingredientId: 'ing-egg', unit: 'pieces', qty_per_person: 2 },
      { name: 'Bread', ingredientId: 'ing-bread', unit: 'pieces', qty_per_person: 2 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.01 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.05 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.002 }
    ]
  },
  {
    id: 'dish-bf-4',
    name: 'Traditional Ful Medames & Warm Khubz',
    mealType: 'Breakfast',
    category: 'Arabic & Levantine',
    portionSize: '1 Deep Bowl with olive oil drizzle',
    sellingPrice: 14.50,
    prepTimeMin: 10,
    leadStation: 'Salad & Cold Larder',
    dietary: ['Vegetarian', 'Vegan', 'Halal'],
    description: 'Slow-simmered fava beans infused with cumin, crushed garlic, lemon, cold-pressed virgin olive oil and warm khubz bread.',
    standardCost: 2.30,
    foodCostPct: 15.9,
    recipe: [
      { name: 'Fava Beans', ingredientId: 'ing-fava-beans', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Olive Oil', ingredientId: 'ing-olive-oil', unit: 'litres', qty_per_person: 0.015 },
      { name: 'Garlic', ingredientId: 'ing-garlic', unit: 'kg', qty_per_person: 0.005 },
      { name: 'Bread', ingredientId: 'ing-pita', unit: 'pieces', qty_per_person: 2 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.003 }
    ]
  },
  {
    id: 'dish-bf-5',
    name: 'Golden Brioche French Toast & Honey',
    mealType: 'Breakfast',
    category: 'Bakery & Sweet',
    portionSize: '2 Thick Brioche Slices',
    sellingPrice: 15.00,
    prepTimeMin: 14,
    leadStation: 'Bakery & Pastry Studio',
    dietary: ['Vegetarian'],
    description: 'Vanilla custard-soaked brioche seared golden in rich farm butter, finished with wild honey and cinnamon dust.',
    standardCost: 2.45,
    foodCostPct: 16.3,
    recipe: [
      { name: 'Bread', ingredientId: 'ing-bread', unit: 'pieces', qty_per_person: 2 },
      { name: 'Egg', ingredientId: 'ing-egg', unit: 'pieces', qty_per_person: 1 },
      { name: 'Milk', ingredientId: 'ing-milk', unit: 'litres', qty_per_person: 0.05 },
      { name: 'Butter', ingredientId: 'ing-butter', unit: 'kg', qty_per_person: 0.01 },
      { name: 'Sugar', ingredientId: 'ing-sugar', unit: 'kg', qty_per_person: 0.005 }
    ]
  },
  {
    id: 'dish-bf-6',
    name: 'Steamed Idli & Crispy Medu Vada',
    mealType: 'Breakfast',
    category: 'South Indian Breakfast',
    portionSize: '3 Idlis + 2 Vadas + 2 Chutneys',
    sellingPrice: 12.00,
    prepTimeMin: 15,
    leadStation: 'Banquet & Bulk Kitchen',
    dietary: ['Vegetarian', 'Halal'],
    description: 'Pillow-soft fermented rice cakes and golden urad dal fritters accompanied by coconut chutney and piping hot sambar.',
    standardCost: 2.10,
    foodCostPct: 17.5,
    recipe: [
      { name: 'Rice Batter', ingredientId: 'ing-batter-rice', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Urad Dal', ingredientId: 'ing-dal-urad', unit: 'kg', qty_per_person: 0.05 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.01 },
      { name: 'Coconut Chutney', ingredientId: 'ing-chutney-coco', unit: 'kg', qty_per_person: 0.03 }
    ]
  },

  // ==================== LUNCH DISHES ====================
  {
    id: 'dish-ln-1',
    name: 'Royal Awadhi Chicken Biryani',
    mealType: 'Lunch',
    category: 'Banquet Rice & Biryani',
    portionSize: '450g Platter with Raita & Mirchi Salan',
    sellingPrice: 28.00,
    prepTimeMin: 35,
    leadStation: 'Tandoor & Clay Oven Bay',
    dietary: ['Halal', 'Gluten-Free'],
    description: 'Long-grain aged basmati rice dum-cooked with tender chicken cuts, saffron, caramelized onions and whole royal spices.',
    standardCost: 6.85,
    foodCostPct: 24.5,
    recipe: [
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Chicken', ingredientId: 'ing-chicken', unit: 'kg', qty_per_person: 0.2 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.08 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.04 },
      { name: 'Yogurt', ingredientId: 'ing-yogurt', unit: 'kg', qty_per_person: 0.03 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.03 },
      { name: 'Biryani Masala', ingredientId: 'ing-biryani-masala', unit: 'kg', qty_per_person: 0.008 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.005 },
      { name: 'Mint Leaves', ingredientId: 'ing-mint', unit: 'kg', qty_per_person: 0.005 }
    ]
  },
  {
    id: 'dish-ln-2',
    name: 'Traditional Yemeni Chicken Mandi',
    mealType: 'Lunch',
    category: 'Arabian Heritage',
    portionSize: 'Half Chicken on Fragrant Spiced Rice',
    sellingPrice: 29.50,
    prepTimeMin: 40,
    leadStation: 'Banquet & Bulk Kitchen',
    dietary: ['Halal', 'Gluten-Free'],
    description: 'Authentic pit-smoked spiced chicken served atop dry-roasted basmati rice with spicy tomato daqoos and garlic sauce.',
    standardCost: 6.95,
    foodCostPct: 23.6,
    recipe: [
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Chicken', ingredientId: 'ing-chicken', unit: 'kg', qty_per_person: 0.2 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.06 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.04 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.02 },
      { name: 'Mandi Spice Mix', ingredientId: 'ing-mandi-spice', unit: 'kg', qty_per_person: 0.008 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.005 }
    ]
  },
  {
    id: 'dish-ln-3',
    name: 'Chicken Shawarma Rice Platter',
    mealType: 'Lunch',
    category: 'Levantine Specialties',
    portionSize: 'Large Platter with Garlic Toum & Pickles',
    sellingPrice: 24.00,
    prepTimeMin: 20,
    leadStation: 'Hot Kitchen Line #1',
    dietary: ['Halal'],
    description: 'Rotisserie carved marinated chicken strips laid across saffron yellow rice, drizzled with nutty sesame tahini and crisp salad.',
    standardCost: 5.60,
    foodCostPct: 23.3,
    recipe: [
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Chicken', ingredientId: 'ing-chicken', unit: 'kg', qty_per_person: 0.18 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.04 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.03 },
      { name: 'Tahini', ingredientId: 'ing-tahini', unit: 'kg', qty_per_person: 0.02 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.02 },
      { name: 'Lettuce', ingredientId: 'ing-lettuce', unit: 'kg', qty_per_person: 0.02 }
    ]
  },
  {
    id: 'dish-ln-4',
    name: 'Coastal Hamour Fish Curry & Steamed Rice',
    mealType: 'Lunch',
    category: 'Seafood Classics',
    portionSize: '220g Fish Fillet in Coconut Gravy',
    sellingPrice: 29.00,
    prepTimeMin: 22,
    leadStation: 'Hot Kitchen Line #1',
    dietary: ['Halal', 'Gluten-Free'],
    description: 'Fresh local Hamour fish gently simmered in velvety coconut milk, fresh curry leaves, kokum and shallot reduction.',
    standardCost: 7.35,
    foodCostPct: 25.3,
    recipe: [
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Fish', ingredientId: 'ing-fish', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.05 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.05 },
      { name: 'Coconut Milk', ingredientId: 'ing-coconut-milk', unit: 'litres', qty_per_person: 0.05 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.02 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004 }
    ]
  },
  {
    id: 'dish-ln-5',
    name: 'Comforting Tadka Dal & Fragrant Basmati',
    mealType: 'Lunch',
    category: 'Vegetarian Classics',
    portionSize: 'Deep Copper Bowl + Steamed Rice',
    sellingPrice: 18.00,
    prepTimeMin: 18,
    leadStation: 'Banquet & Bulk Kitchen',
    dietary: ['Vegetarian', 'Gluten-Free', 'Halal'],
    description: 'Yellow lentils tempered with ghee, cumin seeds, garlic, dried red chilies and fresh cilantro. Served with cumin-scented rice.',
    standardCost: 3.45,
    foodCostPct: 19.2,
    recipe: [
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Dal', ingredientId: 'ing-dal', unit: 'kg', qty_per_person: 0.08 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.03 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.03 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.01 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004 }
    ]
  },

  // ==================== DINNER DISHES ====================
  {
    id: 'dish-dn-1',
    name: 'Slow-Braised Lamb Shank Mandi',
    mealType: 'Dinner',
    category: 'Signature Roasts & Mandi',
    portionSize: 'Whole 450g Lamb Shank on Rice',
    sellingPrice: 42.00,
    prepTimeMin: 45,
    leadStation: 'Banquet & Bulk Kitchen',
    dietary: ['Halal', 'Chef Signature'],
    description: 'Fall-off-the-bone tender Australian lamb shank slow-braised for 6 hours with cardamom, cloves, dried lime, on saffron mandi rice.',
    standardCost: 11.20,
    foodCostPct: 26.7,
    recipe: [
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Lamb', ingredientId: 'ing-lamb', unit: 'kg', qty_per_person: 0.22 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.06 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.04 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.02 },
      { name: 'Mandi Spice Mix', ingredientId: 'ing-mandi-spice', unit: 'kg', qty_per_person: 0.008 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.005 }
    ]
  },
  {
    id: 'dish-dn-2',
    name: 'Gulf Spiced Chicken Kabsa',
    mealType: 'Dinner',
    category: 'Arabian Heritage',
    portionSize: 'Half Chicken Platter with Fried Nuts',
    sellingPrice: 30.00,
    prepTimeMin: 35,
    leadStation: 'Hot Kitchen Line #1',
    dietary: ['Halal', 'Gluten-Free'],
    description: 'National Arabian rice specialty infused with black loomi lime, cinnamon quills, toasted pine nuts and golden fried chicken.',
    standardCost: 7.10,
    foodCostPct: 23.7,
    recipe: [
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Chicken', ingredientId: 'ing-chicken', unit: 'kg', qty_per_person: 0.2 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.05 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.05 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.02 },
      { name: 'Kabsa Spice Mix', ingredientId: 'ing-kabsa-spice', unit: 'kg', qty_per_person: 0.008 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.005 }
    ]
  },
  {
    id: 'dish-dn-3',
    name: 'Grand Hyderabadi Mutton Biryani',
    mealType: 'Dinner',
    category: 'Banquet Rice & Biryani',
    portionSize: '500g Handi with Boiled Egg & Gravy',
    sellingPrice: 36.00,
    prepTimeMin: 40,
    leadStation: 'Tandoor & Clay Oven Bay',
    dietary: ['Halal', 'Chef Signature'],
    description: 'Succulent cuts of prime goat meat marinated in spiced yogurt and layered under par-cooked aged basmati rice.',
    standardCost: 9.80,
    foodCostPct: 27.2,
    recipe: [
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Mutton', ingredientId: 'ing-mutton', unit: 'kg', qty_per_person: 0.2 },
      { name: 'Onion', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.08 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.04 },
      { name: 'Yogurt', ingredientId: 'ing-yogurt', unit: 'kg', qty_per_person: 0.03 },
      { name: 'Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.03 },
      { name: 'Biryani Masala', ingredientId: 'ing-biryani-masala', unit: 'kg', qty_per_person: 0.008 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.005 }
    ]
  },
  {
    id: 'dish-dn-4',
    name: 'Garlic Butter Jumbo Tiger Prawns & Rice',
    mealType: 'Dinner',
    category: 'Seafood Classics',
    portionSize: '6 Jumbo Grilled Prawns with Pilaf',
    sellingPrice: 46.00,
    prepTimeMin: 20,
    leadStation: 'Hot Kitchen Line #1',
    dietary: ['Halal', 'Gluten-Free'],
    description: 'Flame-seared U-15 jumbo prawns tossed in French farm butter, chopped parsley, roasted garlic confit and lemon juice.',
    standardCost: 12.80,
    foodCostPct: 27.8,
    recipe: [
      { name: 'Prawns', ingredientId: 'ing-prawns', unit: 'kg', qty_per_person: 0.16 },
      { name: 'Basmati Rice', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.12 },
      { name: 'Butter', ingredientId: 'ing-butter', unit: 'kg', qty_per_person: 0.02 },
      { name: 'Garlic', ingredientId: 'ing-garlic', unit: 'kg', qty_per_person: 0.01 },
      { name: 'Olive Oil', ingredientId: 'ing-olive-oil', unit: 'litres', qty_per_person: 0.015 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.003 }
    ]
  },
  {
    id: 'dish-dn-5',
    name: 'Rich Shahi Paneer Butter Masala & Naan',
    mealType: 'Dinner',
    category: 'Vegetarian Classics',
    portionSize: 'Deep Ceramic Bowl + 2 Butter Naans',
    sellingPrice: 24.00,
    prepTimeMin: 20,
    leadStation: 'Tandoor & Clay Oven Bay',
    dietary: ['Vegetarian', 'Halal'],
    description: 'Fresh artisanal cottage cheese cubes immersed in a rich velvet tomato, butter, and cashew nut makhani gravy.',
    standardCost: 5.60,
    foodCostPct: 23.3,
    recipe: [
      { name: 'Paneer', ingredientId: 'ing-paneer', unit: 'kg', qty_per_person: 0.15 },
      { name: 'Butter', ingredientId: 'ing-butter', unit: 'kg', qty_per_person: 0.02 },
      { name: 'Tomato', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.1 },
      { name: 'Cream', ingredientId: 'ing-cream', unit: 'litres', qty_per_person: 0.03 },
      { name: 'Naan', ingredientId: 'ing-naan', unit: 'pieces', qty_per_person: 2 },
      { name: 'Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004 }
    ]
  }
];

export const INITIAL_FB_WEEKLY_PLAN = [
  // 0: Sunday
  {
    dayIndex: 0,
    dayName: 'Sunday',
    breakfastDishes: ['dish-bf-1', 'dish-bf-3', 'dish-bf-5'],
    lunchDishes: ['dish-ln-1', 'dish-ln-5', 'dish-ln-3'],
    dinnerDishes: ['dish-dn-2', 'dish-dn-5', 'dish-dn-4'],
    expectedPax: { breakfast: 190, lunch: 250, dinner: 320 }
  },
  // 1: Monday
  {
    dayIndex: 1,
    dayName: 'Monday',
    breakfastDishes: ['dish-bf-2', 'dish-bf-4', 'dish-bf-6'],
    lunchDishes: ['dish-ln-2', 'dish-ln-4', 'dish-ln-5'],
    dinnerDishes: ['dish-dn-1', 'dish-dn-3', 'dish-dn-5'],
    expectedPax: { breakfast: 175, lunch: 230, dinner: 290 }
  },
  // 2: Tuesday (Today - 8 Sep 2026)
  {
    dayIndex: 2,
    dayName: 'Tuesday',
    breakfastDishes: ['dish-bf-1', 'dish-bf-2', 'dish-bf-3'],
    lunchDishes: ['dish-ln-1', 'dish-ln-2', 'dish-ln-4'],
    dinnerDishes: ['dish-dn-1', 'dish-dn-2', 'dish-dn-3', 'dish-dn-5'],
    expectedPax: { breakfast: 185, lunch: 240, dinner: 310 }
  },
  // 3: Wednesday
  {
    dayIndex: 3,
    dayName: 'Wednesday',
    breakfastDishes: ['dish-bf-4', 'dish-bf-5', 'dish-bf-6'],
    lunchDishes: ['dish-ln-3', 'dish-ln-4', 'dish-ln-5'],
    dinnerDishes: ['dish-dn-2', 'dish-dn-4', 'dish-dn-5'],
    expectedPax: { breakfast: 180, lunch: 235, dinner: 300 }
  },
  // 4: Thursday
  {
    dayIndex: 4,
    dayName: 'Thursday',
    breakfastDishes: ['dish-bf-1', 'dish-bf-3', 'dish-bf-4'],
    lunchDishes: ['dish-ln-1', 'dish-ln-3', 'dish-ln-5'],
    dinnerDishes: ['dish-dn-1', 'dish-dn-3', 'dish-dn-4'],
    expectedPax: { breakfast: 185, lunch: 260, dinner: 340 }
  },
  // 5: Friday
  {
    dayIndex: 5,
    dayName: 'Friday',
    breakfastDishes: ['dish-bf-2', 'dish-bf-5', 'dish-bf-6'],
    lunchDishes: ['dish-ln-1', 'dish-ln-2', 'dish-ln-4'],
    dinnerDishes: ['dish-dn-1', 'dish-dn-2', 'dish-dn-4'],
    expectedPax: { breakfast: 210, lunch: 280, dinner: 380 }
  },
  // 6: Saturday
  {
    dayIndex: 6,
    dayName: 'Saturday',
    breakfastDishes: ['dish-bf-1', 'dish-bf-2', 'dish-bf-5'],
    lunchDishes: ['dish-ln-2', 'dish-ln-3', 'dish-ln-5'],
    dinnerDishes: ['dish-dn-1', 'dish-dn-3', 'dish-dn-5'],
    expectedPax: { breakfast: 220, lunch: 270, dinner: 360 }
  }
];

export const INITIAL_FB_MEAL_SESSIONS = [
  {
    id: 'sess-bf',
    code: 'BREAKFAST',
    title: 'Breakfast Service',
    timeSlot: '06:30 AM – 10:30 AM',
    startTime: '06:30',
    endTime: '10:30',
    status: 'COMPLETED',
    leadChef: 'Chef Rajesh Kumar & Chef Pierre Gagnon',
    station: 'Live Display Kitchen & Bakery',
    forecastPax: 185,
    ordered: 180,
    served: 174,
    noShows: 6,
    walkIns: 12,
    dishesPlanned: ['Aloo Parota with Curd', 'Golden Dosa & Sambar', 'Farm Egg Omelette & Toast'],
    readinessScore: 100
  },
  {
    id: 'sess-ln',
    code: 'LUNCH',
    title: 'Lunch Service (Active)',
    timeSlot: '12:00 PM – 03:00 PM',
    startTime: '12:00',
    endTime: '15:00',
    status: 'ACTIVE_SERVICE',
    leadChef: 'Chef Marco Moretti & Chef Ananya Sen',
    station: 'Hot Kitchen Line & Tandoor Bay',
    forecastPax: 240,
    ordered: 235,
    served: 198,
    noShows: 4,
    walkIns: 15,
    dishesPlanned: ['Royal Chicken Biryani', 'Yemeni Chicken Mandi', 'Hamour Fish Curry & Rice'],
    readinessScore: 98
  },
  {
    id: 'sess-dn',
    code: 'DINNER',
    title: 'Dinner Service (Evening)',
    timeSlot: '07:00 PM – 10:30 PM',
    startTime: '19:00',
    endTime: '22:30',
    status: 'UPCOMING_PREP',
    leadChef: 'Chef Jean-Luc Moreau & Chef Tariq Al-Hassan',
    station: 'All Kitchen Stations (Full Brigade)',
    forecastPax: 310,
    ordered: 295,
    served: 0,
    noShows: 0,
    walkIns: 0,
    dishesPlanned: ['Lamb Shank Mandi', 'Gulf Chicken Kabsa', 'Mutton Biryani', 'Shahi Paneer'],
    readinessScore: 92
  }
];

export const INITIAL_FB_MEAL_LOGS = [
  { id: 'log-1', timestamp: '01:24 PM', guestName: 'Mr. James Harrison', roomNumber: '402', mealType: 'Lunch', dishName: 'Royal Chicken Biryani (x2)', pax: 2, status: 'SERVED', verifiedBy: 'RFID Room Card' },
  { id: 'log-2', timestamp: '01:18 PM', guestName: 'Ambassador Al-Mansoor', roomNumber: '303', mealType: 'Lunch', dishName: 'Yemeni Chicken Mandi', pax: 1, status: 'SERVED', verifiedBy: 'Direct Order Dispatch' },
  { id: 'log-3', timestamp: '01:05 PM', guestName: 'Dr. Aris Thorne', roomNumber: '405', mealType: 'Lunch', dishName: 'Coastal Hamour Fish Curry', pax: 1, status: 'SERVED', verifiedBy: 'Butler Handshake' },
  { id: 'log-4', timestamp: '12:52 PM', guestName: 'Lady Eleanor Vance', roomNumber: '401', mealType: 'Lunch', dishName: 'Tadka Dal & Basmati Rice', pax: 1, status: 'SERVED', verifiedBy: 'RFID Room Card' },
  { id: 'log-5', timestamp: '12:40 PM', guestName: 'Sir William Sterling', roomNumber: '502', mealType: 'Lunch', dishName: 'Royal Chicken Biryani (x3)', pax: 3, status: 'SERVED', verifiedBy: 'Suite Butler Dispatch' },
  { id: 'log-6', timestamp: '12:31 PM', guestName: 'Marcus Aurel', roomNumber: '301', mealType: 'Lunch', dishName: 'Chicken Shawarma Rice Platter', pax: 2, status: 'SERVED', verifiedBy: 'POS Terminal' },
  { id: 'log-7', timestamp: '12:15 PM', guestName: 'Anna Becker', roomNumber: '202', mealType: 'Lunch', dishName: 'Coastal Hamour Fish Curry', pax: 1, status: 'SERVED', verifiedBy: 'RFID Room Card' }
];

export function getInitialFbState() {
  return {
    chefs: JSON.parse(JSON.stringify(INITIAL_FB_CHEFS)),
    ingredients: JSON.parse(JSON.stringify(INITIAL_FB_INGREDIENTS)),
    menuDishes: JSON.parse(JSON.stringify(INITIAL_FB_DISHES)),
    weeklyPlan: JSON.parse(JSON.stringify(INITIAL_FB_WEEKLY_PLAN)),
    mealSessions: JSON.parse(JSON.stringify(INITIAL_FB_MEAL_SESSIONS)),
    mealLogs: JSON.parse(JSON.stringify(INITIAL_FB_MEAL_LOGS)),
    groceryRequisitions: [
      {
        id: 'greq-101',
        reqNumber: 'REQ-FB-2026-8812',
        createdAt: '8 Sep • 09:15 AM',
        requestedBy: 'Chef Tariq Al-Hassan',
        urgency: 'HIGH',
        status: 'PENDING_APPROVAL',
        items: [
          { name: 'Jumbo Tiger Prawns (U-15)', qty: 25, unit: 'kg', estCost: 1750 },
          { name: 'Lebanese Pure Sesame Tahini', qty: 15, unit: 'kg', estCost: 300 }
        ],
        totalEstCost: 2050,
        justification: 'Critical par breach in fish ice well & cold larder store ahead of dinner banquet.'
      }
    ],
    ramadanMode: false,
    selectedDayIndex: 2 // Tuesday
  };
}
