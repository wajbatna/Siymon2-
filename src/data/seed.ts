import type {
  AppSettings,
  Category,
  Coupon,
  Customer,
  DbShape,
  Driver,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  Restaurant,
  User,
} from '@/types';
import { daysAgoIso } from '@/utils/format';
import { mulberry32 } from '@/utils/id';

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export const seedCategories: Category[] = [
  { id: 'c-burgers', slug: 'burgers', name: 'Burgers', icon: 'Sandwich', image: 'images/burger-classic.jpg', color: '#F59E0B', visible: true, order: 1 },
  { id: 'c-pizza', slug: 'pizza', name: 'Pizza', icon: 'Pizza', image: 'images/pizza-pepperoni.jpg', color: '#EF4444', visible: true, order: 2 },
  { id: 'c-sushi', slug: 'sushi', name: 'Sushi', icon: 'Fish', image: 'images/sushi-platter.jpg', color: '#EC4899', visible: true, order: 3 },
  { id: 'c-hotdogs', slug: 'hotdogs', name: 'Hot Dogs', icon: 'Drumstick', image: 'images/hotdog-classic.jpg', color: '#F97316', visible: true, order: 4 },
  { id: 'c-moroccan', slug: 'moroccan', name: 'Moroccan Food', icon: 'CookingPot', image: 'images/tagine-chicken.jpg', color: '#7650E8', visible: true, order: 5 },
  { id: 'c-desserts', slug: 'desserts', name: 'Desserts', icon: 'CakeSlice', image: 'images/chocolate-cake.jpg', color: '#A855F7', visible: true, order: 6 },
  { id: 'c-drinks', slug: 'drinks', name: 'Drinks', icon: 'CupSoda', image: 'images/juice-orange.jpg', color: '#10B981', visible: true, order: 7 },
  { id: 'c-healthy', slug: 'healthy', name: 'Healthy Food', icon: 'Salad', image: 'images/salad-green.jpg', color: '#22C55E', visible: true, order: 8 },
];

/* ------------------------------------------------------------------ */
/* Restaurants                                                         */
/* ------------------------------------------------------------------ */

export const seedRestaurants: Restaurant[] = [
  { id: 'r-burgers', name: 'Burger Republic', cuisine: ['Burgers', 'Fast Food'], image: 'images/burger-midnight.jpg', address: '12 Blvd Mohammed V, Casablanca', phone: '+212 522 110 220', rating: 4.7, deliveryTime: '25-35 min', openingHours: '11:00 - 23:30', active: true, featured: true },
  { id: 'r-pizza', name: 'Pizza Palazzo', cuisine: ['Pizza', 'Italian'], image: 'images/pizza-margherita.jpg', address: '45 Rue des Fleurs, Casablanca', phone: '+212 522 330 440', rating: 4.6, deliveryTime: '30-40 min', openingHours: '12:00 - 23:00', active: true, featured: true },
  { id: 'r-sushi', name: 'Sakura Sushi', cuisine: ['Sushi', 'Japanese'], image: 'images/sushi-platter.jpg', address: '8 Anfa Place, Casablanca', phone: '+212 522 550 660', rating: 4.8, deliveryTime: '35-45 min', openingHours: '12:00 - 22:30', active: true, featured: true },
  { id: 'r-moroccan', name: 'Dar Siymon', cuisine: ['Moroccan', 'Tagine', 'Couscous'], image: 'images/moroccan-feast.jpg', address: '23 Rue Ibn Batouta, Old Medina, Casablanca', phone: '+212 522 770 880', rating: 4.9, deliveryTime: '40-55 min', openingHours: '11:30 - 22:00', active: true, featured: true },
  { id: 'r-grill', name: 'Atlas Grill', cuisine: ['Grill', 'Moroccan', 'BBQ'], image: 'images/grill-closeup.jpg', address: '77 Av. Hassan II, Casablanca', phone: '+212 522 990 100', rating: 4.5, deliveryTime: '30-45 min', openingHours: '12:00 - 23:30', active: true, featured: false },
  { id: 'r-healthy', name: 'Green & Go', cuisine: ['Healthy', 'Salads', 'Poke'], image: 'images/poke-bowl.jpg', address: '5 Cd Ghandi, Casablanca', phone: '+212 522 120 130', rating: 4.6, deliveryTime: '20-30 min', openingHours: '09:00 - 21:00', active: true, featured: false },
  { id: 'r-sweets', name: 'Sweet Corner', cuisine: ['Desserts', 'Coffee', 'Juices'], image: 'images/chocolate-cake.jpg', address: '31 Bd Zerktouni, Casablanca', phone: '+212 522 140 150', rating: 4.7, deliveryTime: '20-30 min', openingHours: '08:00 - 23:00', active: true, featured: false },
  { id: 'r-italian', name: 'Casa Napoli', cuisine: ['Italian', 'Pasta', 'Pizza'], image: 'images/pasta-tomato.jpg', address: '14 Rue Pasteur, Casablanca', phone: '+212 522 160 170', rating: 4.4, deliveryTime: '30-40 min', openingHours: '12:00 - 22:30', active: true, featured: false },
];

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

const size3 = (small: number, medium: number, large: number) => [
  { id: 's', label: 'Small', delta: 0 },
  { id: 'm', label: 'Medium', delta: medium - small },
  { id: 'l', label: 'Large', delta: large - small },
];

const noSizes = () => [{ id: 'reg', label: 'Regular', delta: 0 }];

export const seedProducts: Product[] = [
  // ---- Burgers (Burger Republic)
  { id: 'p-01', name: 'Siymon Classic Burger', description: 'Flame-grilled beef patty, melted cheddar, crispy lettuce, vine tomato and our secret Siymon sauce in a toasted brioche bun.', categoryId: 'c-burgers', restaurantId: 'r-burgers', price: 55, image: 'images/burger-classic.jpg', rating: 4.8, ratingCount: 324, prepTime: 20, calories: 640, tags: ['popular', 'bestseller'], featured: true, available: true, sizes: size3(55, 68, 79), extras: [{ id: 'x1', label: 'Extra cheese', price: 8 }, { id: 'x2', label: 'Extra patty', price: 18 }, { id: 'x3', label: 'Crispy bacon', price: 12 }, { id: 'x4', label: 'Jalapeños', price: 5 }], createdAt: daysAgoIso(210) },
  { id: 'p-02', name: 'Double Smash Burger', description: 'Two smashed beef patties, double American cheese, caramelized onions, pickles and smoked mayo.', categoryId: 'c-burgers', restaurantId: 'r-burgers', price: 75, image: 'images/burger-double.jpg', rating: 4.7, ratingCount: 218, prepTime: 22, calories: 890, tags: ['popular'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x1', label: 'Extra cheese', price: 8 }, { id: 'x2', label: 'Truffle sauce', price: 10 }], createdAt: daysAgoIso(180) },
  { id: 'p-03', name: 'Midnight Black Burger', description: 'Charcoal brioche bun, grilled chicken fillet, ember-roasted peppers, raclette cheese and chili ketchup.', categoryId: 'c-burgers', restaurantId: 'r-burgers', price: 69, image: 'images/burger-midnight.jpg', rating: 4.6, ratingCount: 96, prepTime: 24, calories: 720, tags: ['new'], featured: true, available: true, sizes: noSizes(), extras: [{ id: 'x1', label: 'Extra cheese', price: 8 }, { id: 'x5', label: 'Onion rings', price: 14 }], createdAt: daysAgoIso(12) },
  { id: 'p-04', name: 'Crispy Chicken Burger', description: 'Buttermilk-fried chicken thigh, slaw, pickles and honey-mustard dressing in a potato bun.', categoryId: 'c-burgers', restaurantId: 'r-burgers', price: 59, image: 'images/burger-chicken.jpg', rating: 4.5, ratingCount: 187, prepTime: 18, calories: 610, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x6', label: 'Spicy coating', price: 0 }, { id: 'x1', label: 'Extra cheese', price: 8 }], createdAt: daysAgoIso(150) },
  { id: 'p-05', name: 'Charcoal BBQ Bun', description: 'Smoked beef patty glazed in BBQ bourbon sauce, charred black bun, red onion and aged cheddar.', categoryId: 'c-burgers', restaurantId: 'r-burgers', price: 65, oldPrice: 79, image: 'images/burger-black.jpg', rating: 4.4, ratingCount: 74, prepTime: 20, calories: 700, tags: ['offer'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x2', label: 'Extra patty', price: 18 }], createdAt: daysAgoIso(90) },
  { id: 'p-06', name: 'Crispy Chicken Bucket (6 pcs)', description: 'Six pieces of golden crispy chicken, hand-breaded with Moroccan spices, served with coleslaw and fries.', categoryId: 'c-burgers', restaurantId: 'r-burgers', price: 89, image: 'images/chicken-crispy.jpg', rating: 4.6, ratingCount: 143, prepTime: 25, calories: 1240, tags: ['bestseller'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x7', label: 'Extra fries', price: 15 }, { id: 'x8', label: 'Garlic dip', price: 6 }], createdAt: daysAgoIso(120) },
  { id: 'p-07', name: 'Beef Street Tacos (3 pcs)', description: 'Three soft-shell tacos with seasoned beef, avocado, tomato salsa and melted cheese.', categoryId: 'c-burgers', restaurantId: 'r-burgers', price: 49, image: 'images/tacos.jpg', rating: 4.3, ratingCount: 58, prepTime: 16, calories: 520, tags: ['new'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x9', label: 'Extra guac', price: 9 }], createdAt: daysAgoIso(20) },

  // ---- Pizza
  { id: 'p-10', name: 'Pepperoni Blaze', description: 'San Marzano tomato, fior di latte, double pepperoni and a drizzle of hot honey on a 48h-leavened dough.', categoryId: 'c-pizza', restaurantId: 'r-pizza', price: 95, image: 'images/pizza-pepperoni.jpg', rating: 4.8, ratingCount: 412, prepTime: 25, calories: 980, tags: ['popular', 'bestseller'], featured: true, available: true, sizes: size3(95, 115, 135), extras: [{ id: 'x1', label: 'Extra cheese', price: 12 }, { id: 'x10', label: 'Extra pepperoni', price: 15 }, { id: 'x11', label: 'Olives', price: 6 }], createdAt: daysAgoIso(240) },
  { id: 'p-11', name: 'Margherita Classica', description: 'Tomato, fresh mozzarella, basil and extra-virgin olive oil. The timeless Neapolitan original.', categoryId: 'c-pizza', restaurantId: 'r-pizza', price: 75, image: 'images/pizza-margherita.jpg', rating: 4.7, ratingCount: 356, prepTime: 22, calories: 820, tags: ['popular'], featured: true, available: true, sizes: size3(75, 92, 109), extras: [{ id: 'x1', label: 'Extra cheese', price: 12 }, { id: 'x12', label: 'Fresh basil', price: 4 }], createdAt: daysAgoIso(240) },
  { id: 'p-12', name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, parmesan and smoked scamorza on a white base with cracked black pepper.', categoryId: 'c-pizza', restaurantId: 'r-pizza', price: 105, image: 'images/pizza-quattro.jpg', rating: 4.6, ratingCount: 189, prepTime: 25, calories: 1050, tags: [], featured: false, available: true, sizes: size3(105, 125, 145), extras: [{ id: 'x13', label: 'Walnuts', price: 8 }], createdAt: daysAgoIso(200) },
  { id: 'p-13', name: 'Cheesy Pull Pizza', description: 'Double cheese pull pizza with ham, oregano and a golden stuffed crust.', categoryId: 'c-pizza', restaurantId: 'r-pizza', price: 85, oldPrice: 99, image: 'images/pizza-cheese.jpg', rating: 4.5, ratingCount: 132, prepTime: 24, calories: 940, tags: ['offer'], featured: false, available: true, sizes: size3(85, 102, 119), extras: [{ id: 'x14', label: 'Stuffed crust', price: 10 }], createdAt: daysAgoIso(160) },
  { id: 'p-14', name: 'Penne Pomodoro', description: 'Al dente penne in a slow-cooked cherry tomato and basil sauce, finished with parmesan.', categoryId: 'c-pizza', restaurantId: 'r-italian', price: 70, image: 'images/pasta-tomato.jpg', rating: 4.4, ratingCount: 87, prepTime: 18, calories: 640, tags: ['new'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x15', label: 'Grilled chicken', price: 20 }], createdAt: daysAgoIso(15) },

  // ---- Sushi
  { id: 'p-20', name: 'Salmon Feast Platter', description: '24 pieces of chef-selected sushi: salmon nigiri, California rolls, spicy tuna maki and avocado uramaki.', categoryId: 'c-sushi', restaurantId: 'r-sushi', price: 165, image: 'images/sushi-platter.jpg', rating: 4.9, ratingCount: 267, prepTime: 30, calories: 860, tags: ['popular', 'bestseller'], featured: true, available: true, sizes: size3(165, 210, 260), extras: [{ id: 'x16', label: 'Extra wasabi', price: 5 }, { id: 'x17', label: 'Soy & ginger set', price: 8 }], createdAt: daysAgoIso(190) },
  { id: 'p-21', name: 'Salmon Nigiri (4 pcs)', description: 'Four hand-pressed nigiri with Norwegian salmon and a touch of sesame.', categoryId: 'c-sushi', restaurantId: 'r-sushi', price: 85, image: 'images/sushi-nigiri.jpg', rating: 4.7, ratingCount: 141, prepTime: 15, calories: 320, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x16', label: 'Extra wasabi', price: 5 }], createdAt: daysAgoIso(170) },
  { id: 'p-22', name: 'Salmon Maki Rolls (8 pcs)', description: 'Eight delicate maki rolls with fresh salmon, cucumber and pickled daikon.', categoryId: 'c-sushi', restaurantId: 'r-sushi', price: 75, image: 'images/sushi-maki.jpg', rating: 4.6, ratingCount: 98, prepTime: 15, calories: 380, tags: ['new'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x17', label: 'Soy & ginger set', price: 8 }], createdAt: daysAgoIso(9) },
  { id: 'p-23', name: 'Premium Sushi Box', description: 'A curated box of salmon roses, fashion sandwiches and California rolls garnished with microgreens.', categoryId: 'c-sushi', restaurantId: 'r-sushi', price: 145, image: 'images/sushi-premium.jpg', rating: 4.8, ratingCount: 176, prepTime: 28, calories: 720, tags: ['bestseller'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x16', label: 'Extra wasabi', price: 5 }, { id: 'x17', label: 'Soy & ginger set', price: 8 }], createdAt: daysAgoIso(140) },

  // ---- Hot dogs
  { id: 'p-30', name: 'Classic Street Hot Dog', description: 'Grilled frankfurter in a soft bun with crispy onions, ketchup and mustard — street-cart style.', categoryId: 'c-hotdogs', restaurantId: 'r-burgers', price: 32, image: 'images/hotdog-classic.jpg', rating: 4.3, ratingCount: 89, prepTime: 10, calories: 420, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x18', label: 'Extra sausage', price: 12 }, { id: 'x19', label: 'Cheese sauce', price: 7 }], createdAt: daysAgoIso(130) },
  { id: 'p-31', name: 'Gourmet Loaded Dog', description: 'Beef sausage, cheddar sauce, crunchy lettuce, zig-zag mustard and smoked paprika mayo.', categoryId: 'c-hotdogs', restaurantId: 'r-burgers', price: 42, image: 'images/hotdog-gourmet.jpg', rating: 4.5, ratingCount: 112, prepTime: 12, calories: 560, tags: ['popular'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x18', label: 'Extra sausage', price: 12 }, { id: 'x20', label: 'Crispy onions', price: 5 }], createdAt: daysAgoIso(110) },
  { id: 'p-32', name: 'Mustard & Greens Dog', description: 'Herb sausage with leafy greens, honey mustard and pickled cabbage.', categoryId: 'c-hotdogs', restaurantId: 'r-burgers', price: 36, image: 'images/hotdog-mustard.jpg', rating: 4.2, ratingCount: 64, prepTime: 10, calories: 470, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x19', label: 'Cheese sauce', price: 7 }], createdAt: daysAgoIso(80) },
  { id: 'p-33', name: 'Hot Dog Combo (4 pcs)', description: 'Four assorted hot dogs — classic, mustard, tomato-onion and loaded — perfect for sharing.', categoryId: 'c-hotdogs', restaurantId: 'r-burgers', price: 99, oldPrice: 120, image: 'images/hotdog-combo.jpg', rating: 4.6, ratingCount: 77, prepTime: 15, calories: 1680, tags: ['offer'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x21', label: 'Fries for the table', price: 20 }], createdAt: daysAgoIso(45) },

  // ---- Moroccan food
  { id: 'p-40', name: 'Chicken Tagine with Olives', description: 'Slow-cooked chicken in a saffron-ginger sauce with green olives and preserved lemon, served in a clay tagine.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 95, image: 'images/tagine-chicken.jpg', rating: 4.9, ratingCount: 388, prepTime: 40, calories: 780, tags: ['popular', 'bestseller'], featured: true, available: true, sizes: size3(95, 130, 165), extras: [{ id: 'x22', label: 'Moroccan bread', price: 6 }, { id: 'x23', label: 'Extra olives & lemon', price: 10 }], createdAt: daysAgoIso(300) },
  { id: 'p-41', name: 'Kefta Tagine with Chickpeas', description: 'Spiced beef kefta simmered with chickpeas, olives and a rich tomato-cumin sauce.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 85, image: 'images/tagine-kefta.jpg', rating: 4.7, ratingCount: 214, prepTime: 35, calories: 690, tags: ['popular'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x22', label: 'Moroccan bread', price: 6 }, { id: 'x24', label: 'Add eggs', price: 8 }], createdAt: daysAgoIso(260) },
  { id: 'p-42', name: 'Lamb Tagine with Prunes', description: 'Melt-in-the-mouth lamb shoulder with caramelized prunes, almonds and a hint of cinnamon.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 110, image: 'images/tagine-lamb.jpg', rating: 4.8, ratingCount: 176, prepTime: 45, calories: 860, tags: [], featured: true, available: true, sizes: noSizes(), extras: [{ id: 'x22', label: 'Moroccan bread', price: 6 }, { id: 'x25', label: 'Toasted almonds', price: 9 }], createdAt: daysAgoIso(230) },
  { id: 'p-43', name: 'Tagine with Preserved Lemon', description: 'Country-style chicken tagine with olives and preserved lemon, finished with fresh coriander.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 92, image: 'images/tagine-lemon.jpg', rating: 4.6, ratingCount: 121, prepTime: 40, calories: 740, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x22', label: 'Moroccan bread', price: 6 }], createdAt: daysAgoIso(190) },
  { id: 'p-44', name: 'Seven-Vegetable Tagine', description: 'A garden tagine of seasonal vegetables, chickpeas and raisins in a smoky paprika broth. Fully vegan.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 78, image: 'images/tagine-veggie.jpg', rating: 4.5, ratingCount: 83, prepTime: 35, calories: 520, tags: ['new'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x22', label: 'Moroccan bread', price: 6 }], createdAt: daysAgoIso(7) },
  { id: 'p-45', name: 'Royal Couscous', description: 'Friday-style couscous with lamb, chicken, merguez and seven vegetables, topped with caramelized onions and raisins.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 105, image: 'images/couscous-royal.jpg', rating: 4.9, ratingCount: 301, prepTime: 45, calories: 920, tags: ['bestseller'], featured: true, available: true, sizes: size3(105, 140, 175), extras: [{ id: 'x26', label: 'Extra merguez', price: 18 }, { id: 'x27', label: 'Lben (buttermilk)', price: 10 }], createdAt: daysAgoIso(280) },
  { id: 'p-46', name: 'Couscous with Vegetables', description: 'Steamed semolina with a colorful medley of carrots, zucchini, turnips and chickpeas.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 82, image: 'images/couscous-veggie.jpg', rating: 4.6, ratingCount: 142, prepTime: 40, calories: 640, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x27', label: 'Lben (buttermilk)', price: 10 }], createdAt: daysAgoIso(220) },
  { id: 'p-47', name: 'Couscous Tfaya', description: 'Sweet-savory couscous crowned with tfaya — caramelized onions, raisins and cinnamon — plus tender chicken.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 88, image: 'images/couscous-tfaya.jpg', rating: 4.7, ratingCount: 96, prepTime: 42, calories: 780, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x25', label: 'Toasted almonds', price: 9 }], createdAt: daysAgoIso(170) },
  { id: 'p-48', name: 'Harira of the Day', description: 'The beloved Moroccan soup: tomato, lentils, chickpeas and fresh herbs, served with dates.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 35, image: 'images/harira.jpg', rating: 4.7, ratingCount: 254, prepTime: 12, calories: 280, tags: ['popular'], featured: false, available: true, sizes: size3(35, 48, 60), extras: [{ id: 'x28', label: 'Dates (3 pcs)', price: 5 }, { id: 'x29', label: 'Chebakia', price: 8 }], createdAt: daysAgoIso(300) },
  { id: 'p-49', name: 'Harira Bowl with Dates & Figs', description: 'A cozy rustic bowl of harira garnished with cilantro, served with dates and dried figs.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 38, image: 'images/harira-bowl.jpg', rating: 4.6, ratingCount: 88, prepTime: 12, calories: 310, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x28', label: 'Dates (3 pcs)', price: 5 }], createdAt: daysAgoIso(120) },
  { id: 'p-50', name: 'Mixed Grill Skewers', description: 'Charcoal-grilled chicken skewers marinated in chermoula, served with grilled vegetables and khobz.', categoryId: 'c-moroccan', restaurantId: 'r-grill', price: 98, image: 'images/grill-skewers.jpg', rating: 4.7, ratingCount: 197, prepTime: 30, calories: 720, tags: ['popular'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x30', label: 'Chimichurri', price: 8 }, { id: 'x22', label: 'Moroccan bread', price: 6 }], createdAt: daysAgoIso(150) },
  { id: 'p-51', name: 'Half Grilled Chicken', description: 'Half chicken marinated in lemon-garlic and grilled over charcoal, with fries and salad.', categoryId: 'c-moroccan', restaurantId: 'r-grill', price: 72, image: 'images/grill-chicken.jpg', rating: 4.5, ratingCount: 133, prepTime: 32, calories: 810, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x7', label: 'Extra fries', price: 15 }], createdAt: daysAgoIso(140) },
  { id: 'p-52', name: 'Grill Platter for Two', description: 'A generous sharing platter: chicken skewers, kefta, merguez and grilled corn with three dips.', categoryId: 'c-moroccan', restaurantId: 'r-grill', price: 150, oldPrice: 175, image: 'images/grill-platter.jpg', rating: 4.8, ratingCount: 104, prepTime: 38, calories: 1560, tags: ['offer'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x30', label: 'Chimichurri', price: 8 }], createdAt: daysAgoIso(60) },
  { id: 'p-53', name: 'Moroccan Mint Tea (glass)', description: 'Gunpowder green tea brewed with fresh mint and sugar, poured the traditional way.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 22, image: 'images/mint-tea.jpg', rating: 4.8, ratingCount: 221, prepTime: 8, calories: 90, tags: ['popular'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x31', label: 'Extra mint', price: 0 }], createdAt: daysAgoIso(300) },
  { id: 'p-54', name: 'Mint Tea Pot (to pour)', description: 'A full silver teapot of Moroccan mint tea — serves 4 glasses, poured high for the perfect foam.', categoryId: 'c-moroccan', restaurantId: 'r-moroccan', price: 45, image: 'images/mint-tea-pour.jpg', rating: 4.9, ratingCount: 76, prepTime: 10, calories: 360, tags: [], featured: false, available: true, sizes: noSizes(), extras: [], createdAt: daysAgoIso(200) },

  // ---- Desserts
  { id: 'p-60', name: 'Molten Chocolate Cake', description: 'Warm dark-chocolate fondant with a flowing heart, served with vanilla ice cream.', categoryId: 'c-desserts', restaurantId: 'r-sweets', price: 48, image: 'images/chocolate-cake.jpg', rating: 4.9, ratingCount: 289, prepTime: 18, calories: 520, tags: ['popular', 'bestseller'], featured: true, available: true, sizes: noSizes(), extras: [{ id: 'x32', label: 'Extra ice cream scoop', price: 12 }, { id: 'x33', label: 'Berry coulis', price: 8 }], createdAt: daysAgoIso(210) },
  { id: 'p-61', name: 'Chocolate Lava Slice', description: 'A moody slice of layered chocolate cake with rich ganache filling.', categoryId: 'c-desserts', restaurantId: 'r-sweets', price: 42, image: 'images/chocolate-lava.jpg', rating: 4.7, ratingCount: 154, prepTime: 10, calories: 460, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x33', label: 'Berry coulis', price: 8 }], createdAt: daysAgoIso(160) },
  { id: 'p-62', name: 'Layered Chocolate Slice', description: 'Three layers of cocoa sponge and silky cream, finished with chocolate shards.', categoryId: 'c-desserts', restaurantId: 'r-sweets', price: 45, image: 'images/chocolate-slice.jpg', rating: 4.6, ratingCount: 91, prepTime: 10, calories: 480, tags: ['new'], featured: false, available: true, sizes: noSizes(), extras: [], createdAt: daysAgoIso(6) },
  { id: 'p-63', name: 'Ice Cream Cone Deluxe', description: 'Two scoops with chocolate drizzle and sprinkles in a crispy waffle cone.', categoryId: 'c-desserts', restaurantId: 'r-sweets', price: 28, image: 'images/icecream-cone.jpg', rating: 4.5, ratingCount: 176, prepTime: 5, calories: 320, tags: ['popular'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x34', label: 'Extra drizzle', price: 4 }], createdAt: daysAgoIso(140) },
  { id: 'p-64', name: 'Double Scoop Cones', description: 'Vanilla and strawberry scoops in wafer cones — a nostalgic pair.', categoryId: 'c-desserts', restaurantId: 'r-sweets', price: 32, image: 'images/icecream-scoops.jpg', rating: 4.4, ratingCount: 67, prepTime: 5, calories: 360, tags: [], featured: false, available: true, sizes: noSizes(), extras: [], createdAt: daysAgoIso(100) },
  { id: 'p-65', name: 'Buttermilk Pancake Stack', description: 'Fluffy stack of blueberry-banana walnut pancakes with warm maple syrup pouring over.', categoryId: 'c-desserts', restaurantId: 'r-sweets', price: 52, image: 'images/pancakes.jpg', rating: 4.8, ratingCount: 203, prepTime: 20, calories: 640, tags: ['bestseller'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x35', label: 'Extra maple syrup', price: 6 }, { id: 'x36', label: 'Whipped cream', price: 7 }], createdAt: daysAgoIso(130) },
  { id: 'p-66', name: 'Berry Pancakes', description: 'Large pancake stack with banana, strawberry, blueberry, butter and maple syrup.', categoryId: 'c-desserts', restaurantId: 'r-sweets', price: 58, oldPrice: 68, image: 'images/pancakes-berries.jpg', rating: 4.7, ratingCount: 118, prepTime: 22, calories: 700, tags: ['offer'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x36', label: 'Whipped cream', price: 7 }], createdAt: daysAgoIso(50) },

  // ---- Drinks
  { id: 'p-70', name: 'Berry Fruit Smoothie', description: 'A blended glass of red fruits, banana and yogurt — thick, cold and refreshing.', categoryId: 'c-drinks', restaurantId: 'r-sweets', price: 32, image: 'images/smoothie-fruits.jpg', rating: 4.6, ratingCount: 143, prepTime: 8, calories: 240, tags: ['popular'], featured: false, available: true, sizes: size3(32, 40, 48), extras: [{ id: 'x37', label: 'Protein scoop', price: 10 }], createdAt: daysAgoIso(150) },
  { id: 'p-71', name: 'Fresh Orange Juice', description: 'Two glasses of pure squeezed orange juice with ice — no sugar added.', categoryId: 'c-drinks', restaurantId: 'r-sweets', price: 25, image: 'images/juice-orange.jpg', rating: 4.7, ratingCount: 231, prepTime: 6, calories: 180, tags: ['bestseller'], featured: false, available: true, sizes: size3(25, 32, 38), extras: [], createdAt: daysAgoIso(220) },
  { id: 'p-72', name: 'Mixed Fruit Juice Trio', description: 'Three fresh juices — red, green and orange — made to order from seasonal fruit.', categoryId: 'c-drinks', restaurantId: 'r-sweets', price: 45, image: 'images/juice-mixed.jpg', rating: 4.5, ratingCount: 87, prepTime: 10, calories: 320, tags: [], featured: false, available: true, sizes: noSizes(), extras: [], createdAt: daysAgoIso(120) },
  { id: 'p-73', name: 'Orange Splash', description: 'Fresh orange juice poured over ice with a splash of sparkling water and mint.', categoryId: 'c-drinks', restaurantId: 'r-sweets', price: 28, image: 'images/juice-splash.jpg', rating: 4.4, ratingCount: 54, prepTime: 6, calories: 160, tags: ['new'], featured: false, available: true, sizes: noSizes(), extras: [], createdAt: daysAgoIso(5) },
  { id: 'p-74', name: 'Squeezed Orange Fresh', description: 'Whole oranges squeezed in front of you, served chilled with citrus zest.', categoryId: 'c-drinks', restaurantId: 'r-sweets', price: 26, image: 'images/juice-fresh.jpg', rating: 4.5, ratingCount: 72, prepTime: 6, calories: 170, tags: [], featured: false, available: true, sizes: noSizes(), extras: [], createdAt: daysAgoIso(95) },
  { id: 'p-75', name: 'Café Latte', description: 'Double espresso with velvety steamed milk and hand-poured latte art.', categoryId: 'c-drinks', restaurantId: 'r-sweets', price: 24, image: 'images/coffee-latte.jpg', rating: 4.6, ratingCount: 165, prepTime: 7, calories: 120, tags: ['popular'], featured: false, available: true, sizes: size3(24, 28, 32), extras: [{ id: 'x38', label: 'Extra shot', price: 6 }, { id: 'x39', label: 'Oat milk', price: 5 }], createdAt: daysAgoIso(180) },
  { id: 'p-76', name: 'Cappuccino', description: 'Classic Italian cappuccino with a thick foam crown and cocoa dust.', categoryId: 'c-drinks', restaurantId: 'r-sweets', price: 26, image: 'images/coffee-cappuccino.jpg', rating: 4.5, ratingCount: 121, prepTime: 7, calories: 110, tags: [], featured: false, available: true, sizes: size3(26, 30, 34), extras: [{ id: 'x38', label: 'Extra shot', price: 6 }], createdAt: daysAgoIso(170) },

  // ---- Healthy
  { id: 'p-80', name: 'Green Goddess Salad', description: 'Mixed greens, avocado, cucumber and herbs with a creamy green-goddess dressing.', categoryId: 'c-healthy', restaurantId: 'r-healthy', price: 62, image: 'images/salad-green.jpg', rating: 4.6, ratingCount: 132, prepTime: 12, calories: 340, tags: ['popular'], featured: true, available: true, sizes: size3(62, 76, 90), extras: [{ id: 'x15', label: 'Grilled chicken', price: 20 }, { id: 'x40', label: 'Avocado', price: 12 }], createdAt: daysAgoIso(160) },
  { id: 'p-81', name: 'Diet Green Bowl', description: 'A light bowl of leafy greens, seeds and citrus vinaigrette — under 300 calories.', categoryId: 'c-healthy', restaurantId: 'r-healthy', price: 55, image: 'images/salad-diet.jpg', rating: 4.4, ratingCount: 76, prepTime: 10, calories: 280, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x41', label: 'Boiled egg', price: 6 }], createdAt: daysAgoIso(140) },
  { id: 'p-82', name: 'Grilled Chicken Salad', description: 'The viral green goddess salad upgraded with char-grilled chicken and mixed greens.', categoryId: 'c-healthy', restaurantId: 'r-healthy', price: 72, image: 'images/salad-chicken.jpg', rating: 4.7, ratingCount: 188, prepTime: 15, calories: 460, tags: ['bestseller'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x40', label: 'Avocado', price: 12 }], createdAt: daysAgoIso(110) },
  { id: 'p-83', name: 'Rainbow Salad Plates', description: 'A colorful overhead spread of fresh vegetables, grains and herbs — eat the rainbow.', categoryId: 'c-healthy', restaurantId: 'r-healthy', price: 58, image: 'images/salad-mixed.jpg', rating: 4.5, ratingCount: 64, prepTime: 12, calories: 380, tags: ['new'], featured: false, available: true, sizes: noSizes(), extras: [], createdAt: daysAgoIso(4) },
  { id: 'p-84', name: 'Salmon Poke Bowl', description: 'Sushi rice, marinated salmon, avocado, edamame and vegetables with sesame dressing.', categoryId: 'c-healthy', restaurantId: 'r-healthy', price: 88, image: 'images/poke-salmon.jpg', rating: 4.8, ratingCount: 174, prepTime: 15, calories: 520, tags: ['popular'], featured: true, available: true, sizes: size3(88, 104, 120), extras: [{ id: 'x40', label: 'Avocado', price: 12 }, { id: 'x42', label: 'Spicy mayo', price: 6 }], createdAt: daysAgoIso(90) },
  { id: 'p-85', name: 'Smoked Salmon Poke', description: 'Steamed rice topped with smoked salmon, cucumber, carrots and spring onion.', categoryId: 'c-healthy', restaurantId: 'r-healthy', price: 82, image: 'images/poke-bowl.jpg', rating: 4.6, ratingCount: 92, prepTime: 14, calories: 480, tags: [], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x42', label: 'Spicy mayo', price: 6 }], createdAt: daysAgoIso(70) },
  { id: 'p-86', name: 'Spicy Sockeye Poke', description: 'Luxury poke bowl with spicy wild sockeye salmon, held together with umami seasoning.', categoryId: 'c-healthy', restaurantId: 'r-healthy', price: 92, oldPrice: 105, image: 'images/poke-spicy.jpg', rating: 4.7, ratingCount: 81, prepTime: 15, calories: 540, tags: ['offer'], featured: false, available: true, sizes: noSizes(), extras: [{ id: 'x43', label: 'Tobiko', price: 10 }], createdAt: daysAgoIso(30) },
];

/* ------------------------------------------------------------------ */
/* Customers, drivers, coupons, users, settings                        */
/* ------------------------------------------------------------------ */

export const seedCustomers: Customer[] = [
  { id: 'cu-1', name: 'Youssef El Amrani', email: 'demo@siymon.ma', phone: '+212 661 234 567', address: '12 Rue des Fleurs, Maârif, Casablanca', joinedAt: daysAgoIso(320), status: 'active', ordersCount: 0, totalSpent: 0 },
  { id: 'cu-2', name: 'Salma Benali', email: 'salma@example.ma', phone: '+212 662 118 220', address: '45 Bd Anfa, Casablanca', joinedAt: daysAgoIso(280), status: 'active', ordersCount: 0, totalSpent: 0 },
  { id: 'cu-3', name: 'Mehdi Ouazzani', email: 'mehdi@example.ma', phone: '+212 663 445 901', address: '8 Rue Ibn Sina, Agdal, Rabat', joinedAt: daysAgoIso(240), status: 'active', ordersCount: 0, totalSpent: 0 },
  { id: 'cu-4', name: 'Imane Tazi', email: 'imane@example.ma', phone: '+212 664 772 310', address: '23 Av. Moulay Youssef, Casablanca', joinedAt: daysAgoIso(190), status: 'active', ordersCount: 0, totalSpent: 0 },
  { id: 'cu-5', name: 'Omar Berrada', email: 'omar@example.ma', phone: '+212 665 903 415', address: '77 Bd Zerktouni, Casablanca', joinedAt: daysAgoIso(150), status: 'active', ordersCount: 0, totalSpent: 0 },
  { id: 'cu-6', name: 'Khadija Mansouri', email: 'khadija@example.ma', phone: '+212 666 214 887', address: '5 Rue Atlas, Marrakech', joinedAt: daysAgoIso(120), status: 'active', ordersCount: 0, totalSpent: 0 },
  { id: 'cu-7', name: 'Reda Chraibi', email: 'reda@example.ma', phone: '+212 667 556 129', address: '31 Cd Ghandi, Casablanca', joinedAt: daysAgoIso(80), status: 'blocked', ordersCount: 0, totalSpent: 0 },
  { id: 'cu-8', name: 'Nadia Filali', email: 'nadia@example.ma', phone: '+212 668 330 774', address: '14 Rue Pasteur, Tanger', joinedAt: daysAgoIso(40), status: 'active', ordersCount: 0, totalSpent: 0 },
];

export const seedDrivers: Driver[] = [
  { id: 'd-1', name: 'Hicham Rami', phone: '+212 670 111 222', vehicle: 'Scooter — Yamaha NMAX', plate: 'A-48215-6', available: true, activeDeliveries: 2, completedDeliveries: 412, rating: 4.9, zone: 'Maârif / Anfa' },
  { id: 'd-2', name: 'Adil Ziani', phone: '+212 670 333 444', vehicle: 'Scooter — Honda PCX', plate: 'A-51902-6', available: true, activeDeliveries: 1, completedDeliveries: 356, rating: 4.8, zone: 'City center' },
  { id: 'd-3', name: 'Mounir Kabbaj', phone: '+212 670 555 666', vehicle: 'Bicycle — e-bike', plate: '—', available: false, activeDeliveries: 0, completedDeliveries: 198, rating: 4.7, zone: 'Old Medina' },
  { id: 'd-4', name: 'Said Lahlou', phone: '+212 670 777 888', vehicle: 'Van — Renault Kangoo', plate: 'A-63310-6', available: true, activeDeliveries: 3, completedDeliveries: 289, rating: 4.6, zone: 'Ain Diab / Corniche' },
  { id: 'd-5', name: 'Tarik Naciri', phone: '+212 670 999 000', vehicle: 'Scooter — Vespa GTS', plate: 'A-44780-6', available: false, activeDeliveries: 0, completedDeliveries: 154, rating: 4.5, zone: 'Gauthier / Racine' },
  { id: 'd-6', name: 'Hamza Sekkat', phone: '+212 671 123 456', vehicle: 'Scooter — Yamaha Aerox', plate: 'A-59044-6', available: true, activeDeliveries: 1, completedDeliveries: 97, rating: 4.8, zone: 'Sidi Maârouf' },
];

export const seedCoupons: Coupon[] = [
  { id: 'cp-1', code: 'SIYMON10', type: 'percent', value: 10, minOrder: 100, expiresAt: daysAgoIso(-60), active: true, usageCount: 132 },
  { id: 'cp-2', code: 'WELCOME20', type: 'percent', value: 20, minOrder: 150, expiresAt: daysAgoIso(-30), active: true, usageCount: 48 },
  { id: 'cp-3', code: 'DELIVERY15', type: 'fixed', value: 15, minOrder: 80, expiresAt: daysAgoIso(-90), active: true, usageCount: 76 },
  { id: 'cp-4', code: 'SUMMER25', type: 'percent', value: 25, minOrder: 200, expiresAt: daysAgoIso(10), active: false, usageCount: 210 },
];

export const seedUsers: User[] = [
  { id: 'cu-1', name: 'Youssef El Amrani', email: 'demo@siymon.ma', password: 'demo1234', role: 'customer', phone: '+212 661 234 567', address: '12 Rue des Fleurs, Maârif, Casablanca' },
  { id: 'u-admin', name: 'SIYMON Admin', email: 'admin@siymon.ma', password: 'admin1234', role: 'admin', phone: '+212 522 000 000' },
];

export const seedSettings: AppSettings = {
  brandName: 'SIYMON',
  tagline: 'Delicious food, delivered to your door.',
  currency: 'MAD',
  currencySymbol: 'MAD',
  deliveryFee: 15,
  freeDeliveryThreshold: 200,
  email: 'hello@siymon.ma',
  phone: '+212 522 000 000',
  address: 'Twin Center, Bd Zerktouni, Casablanca, Morocco',
  facebook: 'https://facebook.com/siymon',
  instagram: 'https://instagram.com/siymon',
  twitter: 'https://twitter.com/siymon',
  theme: 'purple',
};

/* ------------------------------------------------------------------ */
/* Seeded demo orders (deterministic)                                  */
/* ------------------------------------------------------------------ */

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

function buildSeedOrders(): Order[] {
  const rand = mulberry32(20261020);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const orders: Order[] = [];
  const pool = seedProducts.filter((p) => p.available);

  for (let i = 0; i < 46; i += 1) {
    const age = Math.floor(rand() * 58); // days ago
    const hour = 11 + Math.floor(rand() * 11);
    const created = daysAgoIso(age, hour, Math.floor(rand() * 60));
    const customer = pick(seedCustomers);
    const itemCount = 1 + Math.floor(rand() * 3);
    const items: OrderItem[] = [];
    for (let k = 0; k < itemCount; k += 1) {
      const product = pick(pool);
      if (items.some((it) => it.productId === product.id)) continue;
      const qty = 1 + Math.floor(rand() * 2);
      items.push({
        key: `seed-${i}-${k}`,
        productId: product.id,
        name: product.name,
        image: product.image,
        unitPrice: product.price,
        basePrice: product.price,
        qty,
        size: product.sizes[0],
        extras: [],
      });
    }
    const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
    const deliveryFee = subtotal >= seedSettings.freeDeliveryThreshold ? 0 : seedSettings.deliveryFee;
    const total = subtotal + deliveryFee;

    let status: OrderStatus;
    if (age === 0) status = pick(['pending', 'confirmed', 'preparing'] as OrderStatus[]);
    else if (age === 1) status = pick(['preparing', 'out_for_delivery', 'delivered'] as OrderStatus[]);
    else status = rand() < 0.08 ? 'cancelled' : 'delivered';

    const reached = status === 'cancelled' ? 1 : STATUS_FLOW.indexOf(status) + 1;
    const timeline = STATUS_FLOW.slice(0, reached).map((s, idx) => ({
      status: s,
      at: new Date(new Date(created).getTime() + idx * 12 * 60000).toISOString(),
    }));
    if (status === 'cancelled') {
      timeline.push({ status: 'cancelled', at: new Date(new Date(created).getTime() + 20 * 60000).toISOString() });
    }

    const d = new Date(created);
    orders.push({
      id: `SYM-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${1000 + i}`,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      items,
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      status,
      paymentMethod: pick(['cash', 'card', 'wallet'] as PaymentMethod[]),
      paymentStatus: status === 'cancelled' ? 'refunded' : status === 'delivered' ? 'paid' : 'pending',
      createdAt: created,
      updatedAt: timeline[timeline.length - 1].at,
      driverId: status === 'out_for_delivery' || status === 'delivered' ? pick(seedDrivers).id : null,
      timeline,
      source: 'seed',
    });
  }

  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Rebuild customer aggregates from seeded orders. */
function withCustomerStats(customers: Customer[], orders: Order[]): Customer[] {
  return customers.map((c) => {
    const mine = orders.filter((o) => o.customerId === c.id && o.status !== 'cancelled');
    return {
      ...c,
      ordersCount: mine.length,
      totalSpent: Math.round(mine.reduce((s, o) => s + o.total, 0)),
    };
  });
}

export function buildSeedDb(): DbShape {
  const orders = buildSeedOrders();
  return {
    version: 1,
    categories: seedCategories,
    products: seedProducts,
    restaurants: seedRestaurants,
    orders,
    customers: withCustomerStats(seedCustomers, orders),
    drivers: seedDrivers,
    coupons: seedCoupons,
    users: seedUsers,
    settings: seedSettings,
  };
}
