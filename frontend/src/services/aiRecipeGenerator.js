// ==========================================================================
// VOLVITECH HOSPITALITY OS — AI RECIPE & INGREDIENT GENERATOR SYSTEM
// Autonomous Culinary Knowledge Engine, Pantry Inventory Semantic Mapper,
// Real-Time Macro Portion Ratios, and Interactive Quantity Scaling Engine
// ==========================================================================

import { INITIAL_FB_INGREDIENTS } from '../state/fbInitialData.js';

// Pre-compiled culinary master knowledge library across international gastronomy
export const CULINARY_KNOWLEDGE_BASE = {
  'butter chicken': {
    name: 'Murgh Makhani (Butter Chicken)',
    mealType: 'Dinner',
    category: 'Poultry & Regional Curries',
    cuisine: 'North Indian / Mughlai',
    leadStation: 'Tandoor & Clay Oven Bay',
    prepTimeMin: 35,
    portionSize: '400g Handi with fenugreek butter glaze',
    dietary: ['Halal', 'Gluten-Free'],
    description: 'Charred tandoor-roasted chicken simmered in a velvety reduction of vine tomatoes, fresh cream, butter, and sun-dried fenugreek leaves.',
    allergens: 'Contains Dairy (Milk, Butter, Cream). Nut-free.',
    haccpNotes: 'Chicken pre-marination at <4°C. Core simmer temp must exceed 82°C. Hot hold at >=65°C.',
    steps: [
      'Marinate boneless chicken cuts in yogurt, garlic, ginger and garam masala for minimum 4 hours at 2-4°C.',
      'Skewer and char in tandoor or high-heat salamander until edges caramelize (80% cooked).',
      'In a heavy-bottomed degchi, simmer pureed plum tomatoes with butter and cashew paste until oil splits.',
      'Blend in culinary heavy cream, roasted fenugreek (kasuri methi), and sea salt.',
      'Fold in the charred chicken cuts and simmer gently on low flame for 8 minutes until tender and glossy.'
    ],
    ingredients: [
      { name: 'Fresh Farm Chicken (Cut Pieces)', ingredientId: 'ing-chicken', unit: 'kg', qty_per_person: 0.22, unitCost: 26.00, store: 'Butchery Cold Walk-in' },
      { name: 'Vine-Ripened Plum Tomatoes', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.12, unitCost: 4.00, store: 'Vegetable Cool Store' },
      { name: 'Culinary Heavy Cooking Cream 35%', ingredientId: 'ing-cream', unit: 'litres', qty_per_person: 0.04, unitCost: 18.00, store: 'Kitchen Cold Store' },
      { name: 'Lactic Unsalted Butter Blocks', ingredientId: 'ing-butter', unit: 'kg', qty_per_person: 0.025, unitCost: 28.00, store: 'Kitchen Cold Store' },
      { name: 'Thick Plain Greek Yogurt', ingredientId: 'ing-yogurt', unit: 'kg', qty_per_person: 0.03, unitCost: 8.00, store: 'Kitchen Cold Store' },
      { name: 'Fresh Peeled Garlic Cloves', ingredientId: 'ing-garlic', unit: 'kg', qty_per_person: 0.01, unitCost: 15.00, store: 'Vegetable Cool Store' },
      { name: 'Pure Refined Sunflower Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.015, unitCost: 8.00, store: 'Central Dry Store' },
      { name: 'Chefs Special Garam Masala Blend', ingredientId: 'ing-spices-mixed', unit: 'kg', qty_per_person: 0.005, unitCost: 20.00, store: 'Spice Vault' },
      { name: 'Pure Evaporated Sea Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004, unitCost: 2.00, store: 'Central Dry Store' }
    ]
  },
  'mutton biryani': {
    name: 'Dum Pukht Royal Mutton Biryani',
    mealType: 'Dinner',
    category: 'Banquet Rice & Biryani',
    cuisine: 'Hyderabadi / Awadhi',
    leadStation: 'Banquet & Bulk Kitchen',
    prepTimeMin: 50,
    portionSize: '480g Copper Handi with burani raita',
    dietary: ['Halal', 'Gluten-Free'],
    description: 'Aged XXL basmati rice and prime mutton cuts slow-cooked under dough seal with saffron, brown onions, and whole spices.',
    allergens: 'Contains Dairy (Ghee, Yogurt).',
    haccpNotes: 'Meat seared to 78°C before dum assembly. Cook under dough seal at 120°C for 35 mins.',
    steps: [
      'Marinate bone-in mutton pieces with raw papaya, ginger-garlic paste, yogurt, and royal biryani spices for 6 hours.',
      'Parboil aged basmati rice to exactly 70% with whole spices and sea salt.',
      'Layer seared mutton base in heavy copper deg, top with aromatic rice, saffron milk, fried onions, and fresh mint.',
      'Seal lid hermetically with flour dough and slow-cook on dum for 45 minutes.',
      'Gently rest for 10 minutes before unsealing to preserve aromatic steam.'
    ],
    ingredients: [
      { name: 'Premium Tender Mutton Bone-in', ingredientId: 'ing-mutton', unit: 'kg', qty_per_person: 0.25, unitCost: 60.00, store: 'Butchery Cold Walk-in' },
      { name: 'Basmati Rice (XXL Aged)', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.15, unitCost: 6.00, store: 'Central Dry Store' },
      { name: 'Red Onions (Graded A)', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.08, unitCost: 3.00, store: 'Vegetable Cool Store' },
      { name: 'Thick Plain Greek Yogurt', ingredientId: 'ing-yogurt', unit: 'kg', qty_per_person: 0.04, unitCost: 8.00, store: 'Kitchen Cold Store' },
      { name: 'Pure Refined Sunflower Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.02, unitCost: 8.00, store: 'Central Dry Store' },
      { name: 'Royal Awadhi Biryani Masala', ingredientId: 'ing-biryani-masala', unit: 'kg', qty_per_person: 0.008, unitCost: 35.00, store: 'Spice Vault' },
      { name: 'Fresh Mountain Mint Leaves', ingredientId: 'ing-mint', unit: 'kg', qty_per_person: 0.005, unitCost: 15.00, store: 'Vegetable Cool Store' },
      { name: 'Pure Evaporated Sea Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.005, unitCost: 2.00, store: 'Central Dry Store' }
    ]
  },
  'penne alfredo': {
    name: 'Creamy Garlic Penne Alfredo with Parmesan',
    mealType: 'Lunch',
    category: 'Italian & Mediterranean',
    cuisine: 'Italian Contemporary',
    leadStation: 'Hot Kitchen Line #1',
    prepTimeMin: 20,
    portionSize: '380g Deep Ceramic Bowl with Garlic Toast',
    dietary: ['Vegetarian'],
    description: 'Al dente durum semolina penne enveloped in a rich emulsified emulsion of sweet butter, crushed garlic, heavy dairy cream, and aged parmesan.',
    allergens: 'Contains Dairy, Gluten.',
    haccpNotes: 'Pasta water held at rolling boil >=98°C. Cream sauce reduced above 74°C.',
    steps: [
      'Boil durum semolina penne in salted rolling water until al dente (9 minutes); reserve 50ml pasta starch water.',
      'In a sauté pan, gently melt unsalted butter over medium heat and sweat crushed garlic until fragrant without browning.',
      'Pour in heavy cooking cream and simmer gently for 3 minutes until reduced by one quarter.',
      'Toss pasta into cream sauce along with grated aged cheese blend and reserved starch water for glossy emulsification.',
      'Season with freshly cracked sea salt and chopped parsley; serve immediately with warm garlic toast.'
    ],
    ingredients: [
      { name: 'Durum Semolina Penne & Rigatoni', ingredientId: 'ing-pasta', unit: 'kg', qty_per_person: 0.14, unitCost: 8.00, store: 'Central Dry Store' },
      { name: 'Culinary Heavy Cooking Cream 35%', ingredientId: 'ing-cream', unit: 'litres', qty_per_person: 0.06, unitCost: 18.00, store: 'Kitchen Cold Store' },
      { name: 'Lactic Unsalted Butter Blocks', ingredientId: 'ing-butter', unit: 'kg', qty_per_person: 0.02, unitCost: 28.00, store: 'Kitchen Cold Store' },
      { name: 'Aged Cheddar & Mozzarella Blend', ingredientId: 'ing-cheese', unit: 'kg', qty_per_person: 0.035, unitCost: 45.00, store: 'Kitchen Cold Store' },
      { name: 'Fresh Peeled Garlic Cloves', ingredientId: 'ing-garlic', unit: 'kg', qty_per_person: 0.01, unitCost: 15.00, store: 'Vegetable Cool Store' },
      { name: 'White & Multi-Grain Toast Loaves', ingredientId: 'ing-bread', unit: 'pieces', qty_per_person: 1, unitCost: 1.00, store: 'Bakery Store' },
      { name: 'Pure Evaporated Sea Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004, unitCost: 2.00, store: 'Central Dry Store' }
    ]
  },
  'shakshuka': {
    name: 'Skillet Baked Shakshuka with Feta & Warm Pita',
    mealType: 'Breakfast',
    category: 'Arabic & Levantine',
    cuisine: 'Levantine / North African',
    leadStation: 'Live Display Kitchen',
    prepTimeMin: 18,
    portionSize: 'Cast Iron Skillet with 2 Eggs & 2 Pitas',
    dietary: ['Vegetarian', 'Halal'],
    description: 'Poached farm eggs in a spiced ragù of sweet bell peppers, ripe tomatoes, cumin, and cold-pressed olive oil, topped with crumbled cheese and fresh cilantro.',
    allergens: 'Contains Eggs, Dairy, Gluten.',
    haccpNotes: 'Egg yolk cooked to safe pasteurization or guest specification. Tomato base hot held at >=65°C.',
    steps: [
      'Heat extra virgin olive oil in a cast iron skillet over medium flame.',
      'Sauté diced red onions, minced garlic, and bell peppers until tender and sweet.',
      'Add crushed vine plum tomatoes, cumin, and sea salt; simmer until a thick ragù forms (8 minutes).',
      'Create small wells in the sauce and gently crack farm fresh eggs into each well.',
      'Cover skillet and simmer on low heat for 5-6 minutes until egg whites set and yolks remain silken.',
      'Crumble cheese over top and serve sizzling directly in skillet with warm pita bread.'
    ],
    ingredients: [
      { name: 'Farm Fresh Brown Eggs', ingredientId: 'ing-egg', unit: 'pieces', qty_per_person: 2, unitCost: 1.00, store: 'Pastry Chiller' },
      { name: 'Vine-Ripened Plum Tomatoes', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.15, unitCost: 4.00, store: 'Vegetable Cool Store' },
      { name: 'Red Onions (Graded A)', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.05, unitCost: 3.00, store: 'Vegetable Cool Store' },
      { name: 'Extra Virgin Spanish Olive Oil', ingredientId: 'ing-olive-oil', unit: 'litres', qty_per_person: 0.015, unitCost: 30.00, store: 'Central Dry Store' },
      { name: 'Fresh Peeled Garlic Cloves', ingredientId: 'ing-garlic', unit: 'kg', qty_per_person: 0.008, unitCost: 15.00, store: 'Vegetable Cool Store' },
      { name: 'Arabic Khubz / Pita Pockets', ingredientId: 'ing-pita', unit: 'pieces', qty_per_person: 2, unitCost: 2.00, store: 'Bakery Store' },
      { name: 'Aged Cheddar & Mozzarella Blend', ingredientId: 'ing-cheese', unit: 'kg', qty_per_person: 0.02, unitCost: 45.00, store: 'Kitchen Cold Store' },
      { name: 'Pure Evaporated Sea Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.003, unitCost: 2.00, store: 'Central Dry Store' }
    ]
  },
  'seafood paella': {
    name: 'Valencia Saffron Seafood Paella',
    mealType: 'Dinner',
    category: 'Seafood & Coastal',
    cuisine: 'Spanish / Mediterranean',
    leadStation: 'Hot Kitchen Line #1',
    prepTimeMin: 45,
    portionSize: '450g Cast Iron Paellera with lemon wedges',
    dietary: ['Halal', 'Gluten-Free'],
    description: 'Traditional bomba-style saffron rice cooked in rich seafood broth with jumbo tiger prawns, white fish fillets, crushed garlic, and sweet peas.',
    allergens: 'Contains Shellfish, Fish.',
    haccpNotes: 'Shellfish cooked to minimum core temperature of 74°C. Discard any damaged or unopened shells.',
    steps: [
      'In a wide paella pan, heat extra virgin olive oil and sear jumbo tiger prawns and hamour fillets for 2 minutes; set aside.',
      'Sauté finely minced onions, garlic, and diced tomatoes into a caramelized sofrito.',
      'Add basmati/bomba rice and toast grains in the sofrito for 2 minutes until translucent.',
      'Pour hot saffron seafood broth, season with sea salt, and simmer without stirring to create the golden socarrat crust.',
      'Arrange prawns and fish on top for final 6 minutes; garnish with lemon wedges.'
    ],
    ingredients: [
      { name: 'Jumbo Tiger Prawns (U-15 Headless)', ingredientId: 'ing-prawns', unit: 'kg', qty_per_person: 0.12, unitCost: 70.00, store: 'Fish Ice Well' },
      { name: 'Fresh Gulf Hamour & Kingfish Fillet', ingredientId: 'ing-fish', unit: 'kg', qty_per_person: 0.10, unitCost: 40.00, store: 'Fish Ice Well' },
      { name: 'Basmati Rice (XXL Aged)', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.12, unitCost: 6.00, store: 'Central Dry Store' },
      { name: 'Extra Virgin Spanish Olive Oil', ingredientId: 'ing-olive-oil', unit: 'litres', qty_per_person: 0.02, unitCost: 30.00, store: 'Central Dry Store' },
      { name: 'Vine-Ripened Plum Tomatoes', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.08, unitCost: 4.00, store: 'Vegetable Cool Store' },
      { name: 'Red Onions (Graded A)', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.04, unitCost: 3.00, store: 'Vegetable Cool Store' },
      { name: 'Fresh Peeled Garlic Cloves', ingredientId: 'ing-garlic', unit: 'kg', qty_per_person: 0.008, unitCost: 15.00, store: 'Vegetable Cool Store' },
      { name: 'Fresh Juicy Eureka Lemons', ingredientId: 'ing-lemon', unit: 'pieces', qty_per_person: 1, unitCost: 0.80, store: 'Vegetable Cool Store' },
      { name: 'Pure Evaporated Sea Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004, unitCost: 2.00, store: 'Central Dry Store' }
    ]
  },
  'classic beef burger': {
    name: 'Prime Wagyu Style Beef Burger & Brioche',
    mealType: 'Lunch',
    category: 'Grill & Burgers',
    cuisine: 'American Contemporary',
    leadStation: 'Hot Kitchen Line #1',
    prepTimeMin: 15,
    portionSize: '200g Patty with Golden Fries & Truffle Aioli',
    dietary: ['Halal'],
    description: 'Seared 200g prime minced beef patty with melted aged cheddar, crisp romaine, ripe tomato, and house brioche bun.',
    allergens: 'Contains Gluten, Dairy, Eggs.',
    haccpNotes: 'Beef patty cooked to internal temperature of 71°C or guest preference.',
    steps: [
      'Form seasoned minced beef patties without overworking to retain juiciness.',
      'Sear on heavy chrome plancha at 220°C for 3.5 minutes per side for medium doneness.',
      'Melt aged cheddar over patty during the final minute under basting dome.',
      'Toast brioche bun in butter on flat-top griddle.',
      'Assemble with crisp lettuce, sliced tomato, pickles, and chef burger relish.'
    ],
    ingredients: [
      { name: 'Premium Tender Mutton Bone-in', ingredientId: 'ing-mutton', unit: 'kg', qty_per_person: 0.20, unitCost: 60.00, store: 'Butchery Cold Walk-in' },
      { name: 'White & Multi-Grain Toast Loaves', ingredientId: 'ing-bread', unit: 'pieces', qty_per_person: 2, unitCost: 1.00, store: 'Bakery Store' },
      { name: 'Aged Cheddar & Mozzarella Blend', ingredientId: 'ing-cheese', unit: 'kg', qty_per_person: 0.035, unitCost: 45.00, store: 'Kitchen Cold Store' },
      { name: 'Crisp Romaine & Iceberg Lettuce', ingredientId: 'ing-lettuce', unit: 'kg', qty_per_person: 0.04, unitCost: 8.00, store: 'Vegetable Cool Store' },
      { name: 'Vine-Ripened Plum Tomatoes', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.05, unitCost: 4.00, store: 'Vegetable Cool Store' },
      { name: 'Lactic Unsalted Butter Blocks', ingredientId: 'ing-butter', unit: 'kg', qty_per_person: 0.015, unitCost: 28.00, store: 'Kitchen Cold Store' },
      { name: 'Washed Russet Potatoes', ingredientId: 'ing-potato', unit: 'kg', qty_per_person: 0.15, unitCost: 3.50, store: 'Vegetable Cool Store' },
      { name: 'Pure Refined Sunflower Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.03, unitCost: 8.00, store: 'Central Dry Store' },
      { name: 'Pure Evaporated Sea Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004, unitCost: 2.00, store: 'Central Dry Store' }
    ]
  },
  'falafel bowl': {
    name: 'Crispy Falafel & Tahini Mezze Bowl',
    mealType: 'Lunch',
    category: 'Arabic & Levantine',
    cuisine: 'Levantine / Vegan',
    leadStation: 'Salad & Cold Larder',
    prepTimeMin: 15,
    portionSize: '5 Golden Falafels with Hummus & Lebanese Salad',
    dietary: ['Vegetarian', 'Vegan', 'Halal'],
    description: 'Crispy herb-crusted chickpea falafels nestled on smooth silk hummus, chopped cucumber-tomato salad, pickled turnip, and nutty sesame tahini.',
    allergens: 'Contains Sesame, Gluten.',
    haccpNotes: 'Falafel deep-fried at 175°C until center exceeds 75°C.',
    steps: [
      'Blend soaked chickpeas with parsley, cilantro, garlic, onion, cumin, and sea salt into coarse paste.',
      'Portion with falafel scoop and deep-fry in clean vegetable oil at 175°C for 3.5 minutes until deeply golden.',
      'Spoon smooth hummus into shallow ceramic bowl and swirl with back of spoon.',
      'Top with hot falafels, diced cucumber, and vine tomatoes.',
      'Drizzle with lemon sesame tahini dressing and cold-pressed extra virgin olive oil.'
    ],
    ingredients: [
      { name: 'Kabuli Chickpeas (Garbanzo)', ingredientId: 'ing-chickpeas', unit: 'kg', qty_per_person: 0.15, unitCost: 8.00, store: 'Central Dry Store' },
      { name: 'Lebanese Pure Sesame Tahini Paste', ingredientId: 'ing-tahini', unit: 'kg', qty_per_person: 0.03, unitCost: 20.00, store: 'Central Dry Store' },
      { name: 'Pure Refined Sunflower Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.03, unitCost: 8.00, store: 'Central Dry Store' },
      { name: 'Fresh Peeled Garlic Cloves', ingredientId: 'ing-garlic', unit: 'kg', qty_per_person: 0.01, unitCost: 15.00, store: 'Vegetable Cool Store' },
      { name: 'Red Onions (Graded A)', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.04, unitCost: 3.00, store: 'Vegetable Cool Store' },
      { name: 'Lebanese Mini Cucumbers', ingredientId: 'ing-cucumber', unit: 'kg', qty_per_person: 0.06, unitCost: 4.00, store: 'Vegetable Cool Store' },
      { name: 'Vine-Ripened Plum Tomatoes', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.06, unitCost: 4.00, store: 'Vegetable Cool Store' },
      { name: 'Arabic Khubz / Pita Pockets', ingredientId: 'ing-pita', unit: 'pieces', qty_per_person: 1, unitCost: 2.00, store: 'Bakery Store' },
      { name: 'Fresh Juicy Eureka Lemons', ingredientId: 'ing-lemon', unit: 'pieces', qty_per_person: 1, unitCost: 0.80, store: 'Vegetable Cool Store' },
      { name: 'Pure Evaporated Sea Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004, unitCost: 2.00, store: 'Central Dry Store' }
    ]
  },
  'belgian waffles': {
    name: 'Crispy Belgian Liege Waffles with Honey & Berries',
    mealType: 'Breakfast',
    category: 'Bakery & Sweet',
    cuisine: 'Continental / European',
    leadStation: 'Bakery & Pastry Studio',
    prepTimeMin: 14,
    portionSize: '2 Thick Golden Waffles with Whipped Butter',
    dietary: ['Vegetarian'],
    description: 'Deep-pocketed golden yeast waffles with caramelized pearl sugar, whipped farm butter, wild blossom honey, and berry compote.',
    allergens: 'Contains Dairy, Gluten, Eggs.',
    haccpNotes: 'Waffle batter refrigerated at 2-4°C; griddle irons held at 200°C.',
    steps: [
      'Whisk stone-ground wheat flour, fresh milk, brown eggs, and melted butter into smooth batter.',
      'Fold in granulated sugar and let rest 10 minutes.',
      'Pour into cast iron waffle press preheated to 200°C and cook for 4 minutes until golden and crisp.',
      'Plate with quenelle of whipped butter, drizzle with wild honey, and finish with artisanal berry conserve.'
    ],
    ingredients: [
      { name: 'Stone-Ground Wheat Flour', ingredientId: 'ing-flour-wheat', unit: 'kg', qty_per_person: 0.12, unitCost: 4.00, store: 'Central Dry Store' },
      { name: 'Pasteurized Full Cream Fresh Milk', ingredientId: 'ing-milk', unit: 'litres', qty_per_person: 0.08, unitCost: 4.50, store: 'Pastry Chiller' },
      { name: 'Farm Fresh Brown Eggs', ingredientId: 'ing-egg', unit: 'pieces', qty_per_person: 1, unitCost: 1.00, store: 'Pastry Chiller' },
      { name: 'Lactic Unsalted Butter Blocks', ingredientId: 'ing-butter', unit: 'kg', qty_per_person: 0.025, unitCost: 28.00, store: 'Kitchen Cold Store' },
      { name: 'Refined Granulated Cane Sugar', ingredientId: 'ing-sugar', unit: 'kg', qty_per_person: 0.02, unitCost: 4.00, store: 'Central Dry Store' },
      { name: 'Wild Blossom Raw Honey', ingredientId: 'ing-honey', unit: 'kg', qty_per_person: 0.025, unitCost: 30.00, store: 'Central Dry Store' },
      { name: 'Artisanal Mixed Berry Conserve', ingredientId: 'ing-jam', unit: 'kg', qty_per_person: 0.03, unitCost: 15.00, store: 'Central Dry Store' }
    ]
  }
};

/**
 * AI Recipe Synthesizer Engine
 * Translates any dish request, culinary archetype, or chef parameters
 * into a complete, balanced Recipe Bill of Materials (BOM) linked to the pantry inventory.
 */
export class AiRecipeGenerator {
  /**
   * Auto-generate a standardized recipe with all ingredients, ratios, and costing
   */
  static generateRecipe({
    dishName = '',
    mealType = 'Lunch',
    cuisine = 'International',
    dietary = [],
    targetPax = 1,
    targetFoodCostPct = 28,
    chefNotes = ''
  }) {
    const rawName = dishName.trim();
    const cleanLower = rawName.toLowerCase();

    // 1. Check exact or fuzzy match in curated knowledge base
    let matchedArchetype = null;
    for (const key of Object.keys(CULINARY_KNOWLEDGE_BASE)) {
      if (cleanLower.includes(key) || key.includes(cleanLower)) {
        matchedArchetype = CULINARY_KNOWLEDGE_BASE[key];
        break;
      }
    }

    let recipeData;
    if (matchedArchetype) {
      recipeData = JSON.parse(JSON.stringify(matchedArchetype));
      if (rawName && !cleanLower.includes(matchedArchetype.name.toLowerCase())) {
        recipeData.name = rawName;
      }
      if (mealType) recipeData.mealType = mealType;
      if (dietary && dietary.length > 0) {
        recipeData.dietary = Array.from(new Set([...recipeData.dietary, ...dietary]));
      }
    } else {
      // 2. Synthesize dynamically using semantic culinary ratios
      recipeData = this._synthesizeDynamicRecipe(rawName, mealType, cuisine, dietary, chefNotes);
    }

    // 3. Ensure all ingredients have unitCost and are linked to pantry master
    recipeData.recipe = recipeData.ingredients.map(ing => {
      const pantryItem = INITIAL_FB_INGREDIENTS.find(p => p.id === ing.ingredientId || p.name.toLowerCase().includes(ing.name.toLowerCase()));
      const unitCost = ing.unitCost || pantryItem?.costPerUnit || 5.0;
      return {
        ...ing,
        ingredientId: pantryItem ? pantryItem.id : (ing.ingredientId || `ing-auto-${Date.now()}`),
        unitCost,
        store: pantryItem?.store || ing.store || 'Central Dry Store'
      };
    });
    delete recipeData.ingredients;

    // 4. Calculate BOM Standard Cost per portion (1 Pax base)
    const standardCost = recipeData.recipe.reduce((sum, item) => {
      return sum + (item.qty_per_person * item.unitCost);
    }, 0);
    recipeData.standardCost = +standardCost.toFixed(2);

    // 5. Calculate Suggested Selling Price based on target food cost %
    const targetFcRatio = Math.max(0.15, Math.min(0.50, (targetFoodCostPct || 28) / 100));
    recipeData.sellingPrice = +(recipeData.standardCost / targetFcRatio).toFixed(2);
    recipeData.foodCostPct = Math.round((recipeData.standardCost / recipeData.sellingPrice) * 100);

    // 6. Scale for requested target Pax quantity
    recipeData.targetPax = Math.max(1, targetPax || 1);
    recipeData.scaledRecipe = recipeData.recipe.map(item => ({
      ...item,
      scaledQty: +(item.qty_per_person * recipeData.targetPax).toFixed(3),
      totalCost: +(item.qty_per_person * recipeData.targetPax * item.unitCost).toFixed(2)
    }));
    recipeData.totalBatchCost = +(recipeData.standardCost * recipeData.targetPax).toFixed(2);

    return recipeData;
  }

  /**
   * Dynamic synthesis engine when dish is custom or not in static archetypes
   */
  static _synthesizeDynamicRecipe(dishName, mealType, cuisine, dietary, chefNotes) {
    const lower = (dishName || '').toLowerCase();
    const isVeg = dietary.includes('Vegetarian') || dietary.includes('Vegan') || lower.includes('veg') || lower.includes('paneer') || lower.includes('tofu');
    const isFish = lower.includes('fish') || lower.includes('salmon') || lower.includes('tuna') || lower.includes('prawn') || lower.includes('seafood') || lower.includes('shrimp');
    const isMutton = lower.includes('mutton') || lower.includes('lamb') || lower.includes('shank') || lower.includes('goat');
    const isChicken = !isVeg && !isFish && !isMutton && (lower.includes('chicken') || lower.includes('poultry') || !isVeg);
    const hasRice = lower.includes('rice') || lower.includes('biryani') || lower.includes('mandi') || lower.includes('pulao') || lower.includes('platter');
    const hasPasta = lower.includes('pasta') || lower.includes('spaghetti') || lower.includes('penne') || lower.includes('fettuccine') || lower.includes('noodle');

    let leadStation = 'Hot Kitchen Line #1';
    if (lower.includes('tandoor') || lower.includes('tikka') || lower.includes('kebab')) leadStation = 'Tandoor & Clay Oven Bay';
    else if (lower.includes('wok') || lower.includes('stir fry') || lower.includes('asian') || lower.includes('noodles')) leadStation = 'Asian Wok Counter';
    else if (mealType === 'Breakfast' || lower.includes('toast') || lower.includes('pancake') || lower.includes('croissant')) leadStation = 'Bakery & Pastry Studio';
    else if (lower.includes('salad') || lower.includes('mezze') || lower.includes('cold') || lower.includes('sandwich')) leadStation = 'Salad & Cold Larder';

    const ingredients = [];

    // Protein / Core Star
    if (isVeg) {
      if (lower.includes('paneer')) {
        ingredients.push({ name: 'Malai Cottage Cheese (Paneer)', ingredientId: 'ing-paneer', unit: 'kg', qty_per_person: 0.18, unitCost: 40.00, store: 'Kitchen Cold Store' });
      } else if (lower.includes('chickpea') || lower.includes('chana') || lower.includes('hummus')) {
        ingredients.push({ name: 'Kabuli Chickpeas (Garbanzo)', ingredientId: 'ing-chickpeas', unit: 'kg', qty_per_person: 0.15, unitCost: 8.00, store: 'Central Dry Store' });
      } else if (lower.includes('dal') || lower.includes('lentil')) {
        ingredients.push({ name: 'Toor & Moong Yellow Dal', ingredientId: 'ing-dal', unit: 'kg', qty_per_person: 0.10, unitCost: 7.00, store: 'Central Dry Store' });
      } else {
        ingredients.push({ name: 'Seasonal Mixed Vegetables', ingredientId: 'ing-veg-mixed', unit: 'kg', qty_per_person: 0.22, unitCost: 6.00, store: 'Vegetable Cool Store' });
      }
    } else if (isFish) {
      if (lower.includes('prawn') || lower.includes('shrimp')) {
        ingredients.push({ name: 'Jumbo Tiger Prawns (U-15 Headless)', ingredientId: 'ing-prawns', unit: 'kg', qty_per_person: 0.20, unitCost: 70.00, store: 'Fish Ice Well' });
      } else {
        ingredients.push({ name: 'Fresh Gulf Hamour & Kingfish Fillet', ingredientId: 'ing-fish', unit: 'kg', qty_per_person: 0.22, unitCost: 40.00, store: 'Fish Ice Well' });
      }
    } else if (isMutton) {
      ingredients.push({ name: 'Premium Tender Mutton Bone-in', ingredientId: 'ing-mutton', unit: 'kg', qty_per_person: 0.25, unitCost: 60.00, store: 'Butchery Cold Walk-in' });
    } else {
      ingredients.push({ name: 'Fresh Farm Chicken (Cut Pieces)', ingredientId: 'ing-chicken', unit: 'kg', qty_per_person: 0.22, unitCost: 26.00, store: 'Butchery Cold Walk-in' });
    }

    // Carbs / Grains / Breads
    if (hasRice) {
      ingredients.push({ name: 'Basmati Rice (XXL Aged)', ingredientId: 'ing-rice-basmati', unit: 'kg', qty_per_person: 0.14, unitCost: 6.00, store: 'Central Dry Store' });
    } else if (hasPasta) {
      ingredients.push({ name: 'Durum Semolina Penne & Rigatoni', ingredientId: 'ing-pasta', unit: 'kg', qty_per_person: 0.13, unitCost: 8.00, store: 'Central Dry Store' });
    } else if (mealType === 'Breakfast') {
      ingredients.push({ name: 'White & Multi-Grain Toast Loaves', ingredientId: 'ing-bread', unit: 'pieces', qty_per_person: 2, unitCost: 1.00, store: 'Bakery Store' });
      ingredients.push({ name: 'Farm Fresh Brown Eggs', ingredientId: 'ing-egg', unit: 'pieces', qty_per_person: 1, unitCost: 1.00, store: 'Pastry Chiller' });
    } else {
      ingredients.push({ name: 'Tandoori Garlic & Butter Naan Dough', ingredientId: 'ing-naan', unit: 'pieces', qty_per_person: 2, unitCost: 2.00, store: 'Tandoor Prep Chiller' });
    }

    // Aromatics & Base
    ingredients.push({ name: 'Red Onions (Graded A)', ingredientId: 'ing-onion', unit: 'kg', qty_per_person: 0.06, unitCost: 3.00, store: 'Vegetable Cool Store' });
    ingredients.push({ name: 'Vine-Ripened Plum Tomatoes', ingredientId: 'ing-tomato', unit: 'kg', qty_per_person: 0.05, unitCost: 4.00, store: 'Vegetable Cool Store' });
    ingredients.push({ name: 'Fresh Peeled Garlic Cloves', ingredientId: 'ing-garlic', unit: 'kg', qty_per_person: 0.008, unitCost: 15.00, store: 'Vegetable Cool Store' });

    // Cooking Fats & Dairy
    if (lower.includes('creamy') || lower.includes('butter') || lower.includes('makhani')) {
      ingredients.push({ name: 'Culinary Heavy Cooking Cream 35%', ingredientId: 'ing-cream', unit: 'litres', qty_per_person: 0.04, unitCost: 18.00, store: 'Kitchen Cold Store' });
      ingredients.push({ name: 'Lactic Unsalted Butter Blocks', ingredientId: 'ing-butter', unit: 'kg', qty_per_person: 0.02, unitCost: 28.00, store: 'Kitchen Cold Store' });
    } else if ((cuisine || '').includes('Italian') || (cuisine || '').includes('Mediterranean') || (cuisine || '').includes('Arabic')) {
      ingredients.push({ name: 'Extra Virgin Spanish Olive Oil', ingredientId: 'ing-olive-oil', unit: 'litres', qty_per_person: 0.018, unitCost: 30.00, store: 'Central Dry Store' });
    } else {
      ingredients.push({ name: 'Pure Refined Sunflower Oil', ingredientId: 'ing-oil', unit: 'litres', qty_per_person: 0.02, unitCost: 8.00, store: 'Central Dry Store' });
    }

    // Seasoning & Spices
    if (lower.includes('biryani')) {
      ingredients.push({ name: 'Royal Awadhi Biryani Masala', ingredientId: 'ing-biryani-masala', unit: 'kg', qty_per_person: 0.008, unitCost: 35.00, store: 'Spice Vault' });
    } else if (lower.includes('mandi')) {
      ingredients.push({ name: 'Yemeni Mandi Whole Spices', ingredientId: 'ing-mandi-spice', unit: 'kg', qty_per_person: 0.008, unitCost: 30.00, store: 'Spice Vault' });
    } else if ((cuisine || '').includes('Asian') || lower.includes('soy')) {
      ingredients.push({ name: 'Naturally Brewed Light Soy Sauce', ingredientId: 'ing-soy-sauce', unit: 'litres', qty_per_person: 0.015, unitCost: 15.00, store: 'Central Dry Store' });
    } else {
      ingredients.push({ name: 'Chefs Special Garam Masala Blend', ingredientId: 'ing-spices-mixed', unit: 'kg', qty_per_person: 0.005, unitCost: 20.00, store: 'Spice Vault' });
    }
    ingredients.push({ name: 'Pure Evaporated Sea Salt', ingredientId: 'ing-salt', unit: 'kg', qty_per_person: 0.004, unitCost: 2.00, store: 'Central Dry Store' });

    return {
      name: dishName || 'Chef Specialty Platter',
      mealType: mealType || 'Lunch',
      category: `${cuisine || 'Chef'} Specialty`,
      cuisine: cuisine || 'International',
      leadStation,
      prepTimeMin: 25,
      portionSize: `Standard Individual Portion (approx 420g)`,
      dietary: (dietary && dietary.length > 0) ? dietary : ['Halal'],
      description: `Chef-crafted ${dishName || 'signature preparation'} harmonizing authentic spices, fresh market ingredients, and master kitchen technique. ${chefNotes ? `Notes: ${chefNotes}` : ''}`.trim(),
      allergens: isVeg ? 'Contains Dairy (Check specific ingredients).' : 'Halal certified kitchen handling allergens.',
      haccpNotes: 'Store raw proteins under 4°C. Minimum core cook temperature 74°C. Hot hold >=63°C.',
      steps: [
        'Mise-en-place: Clean, trim, and portion all raw ingredients to uniform standard cuts.',
        'Preheat cooking station (pan / tandoor / wok / oven) to optimal searing temperature.',
        'Sauté base aromatics (garlic, onion) in hot oil/butter until fragrant and golden.',
        'Incorporate main ingredients, add seasonings and spices, and simmer or roast until core temperature is verified with calibrated probe.',
        'Plate artistically, garnish with fresh herbs, and serve immediately in heated serviceware.'
      ],
      ingredients
    };
  }

  /**
   * Recalculates all ingredient scaled quantities and costs when the user changes Pax or individual ingredient quantities
   */
  static scaleRecipe(recipe, targetPax = 1) {
    const pax = Math.max(1, targetPax);
    const scaledRecipe = (recipe.recipe || []).map(item => {
      const scaledQty = +(item.qty_per_person * pax).toFixed(3);
      const totalCost = +(scaledQty * (item.unitCost || 5.0)).toFixed(2);
      return {
        ...item,
        scaledQty,
        totalCost
      };
    });

    const standardCostPerPerson = +(recipe.recipe || []).reduce((sum, item) => sum + (item.qty_per_person * (item.unitCost || 5.0)), 0).toFixed(2);
    const totalBatchCost = +(standardCostPerPerson * pax).toFixed(2);

    return {
      ...recipe,
      targetPax: pax,
      standardCost: +standardCostPerPerson.toFixed(2),
      totalBatchCost,
      scaledRecipe
    };
  }
}
