import { create } from 'zustand';
import { categoryService, type CategoryInput } from '@/services/categoryService';
import { customerService } from '@/services/customerService';
import { resetDb } from '@/services/db';
import { driverService } from '@/services/driverService';
import { orderService } from '@/services/orderService';
import { productService, type ProductInput } from '@/services/productService';
import { promotionService, type CouponInput } from '@/services/promotionService';
import { restaurantService, type RestaurantInput } from '@/services/restaurantService';
import { settingsService } from '@/services/settingsService';
import type {
  AppSettings,
  Category,
  Coupon,
  Customer,
  Driver,
  Order,
  OrderStatus,
  Product,
  Restaurant,
} from '@/types';
import { setCurrencySymbol } from '@/utils/format';

interface DataState {
  hydrated: boolean;
  categories: Category[];
  products: Product[];
  restaurants: Restaurant[];
  orders: Order[];
  customers: Customer[];
  drivers: Driver[];
  coupons: Coupon[];
  settings: AppSettings;

  init: () => Promise<void>;
  // products
  addProduct: (input: ProductInput) => Promise<void>;
  editProduct: (id: string, patch: Partial<ProductInput>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // categories
  addCategory: (input: CategoryInput) => Promise<void>;
  editCategory: (id: string, patch: Partial<CategoryInput>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (ids: string[]) => Promise<void>;
  // restaurants
  addRestaurant: (input: RestaurantInput) => Promise<void>;
  editRestaurant: (id: string, patch: Partial<RestaurantInput>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  // orders
  setOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  refreshOrders: () => Promise<void>;
  // customers / drivers / coupons
  setCustomerStatus: (id: string, status: Customer['status']) => Promise<void>;
  toggleDriver: (id: string) => Promise<void>;
  addCoupon: (input: CouponInput) => Promise<void>;
  editCoupon: (id: string, patch: Partial<CouponInput>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  // settings
  saveSettings: (patch: Partial<AppSettings>) => Promise<void>;
  resetDemoData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set) => ({
  hydrated: false,
  categories: [],
  products: [],
  restaurants: [],
  orders: [],
  customers: [],
  drivers: [],
  coupons: [],
  settings: {
    brandName: 'SIYMON',
    tagline: 'Delicious food, delivered to your door.',
    currency: 'MAD',
    currencySymbol: 'MAD',
    deliveryFee: 15,
    freeDeliveryThreshold: 200,
    email: 'hello@siymon.ma',
    phone: '+212 522 000 000',
    address: 'Twin Center, Bd Zerktouni, Casablanca, Morocco',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    theme: 'purple',
  },

  init: async () => {
    const [categories, products, restaurants, orders, customers, drivers, coupons, settings] =
      await Promise.all([
        categoryService.list(),
        productService.list(),
        restaurantService.list(),
        orderService.list(),
        customerService.list(),
        driverService.list(),
        promotionService.list(),
        settingsService.get(),
      ]);
    setCurrencySymbol(settings.currencySymbol);
    set({ hydrated: true, categories, products, restaurants, orders, customers, drivers, coupons, settings });
  },

  addProduct: async (input) => set({ products: await productService.create(input) }),
  editProduct: async (id, patch) => set({ products: await productService.update(id, patch) }),
  deleteProduct: async (id) => set({ products: await productService.remove(id) }),

  addCategory: async (input) => set({ categories: await categoryService.create(input) }),
  editCategory: async (id, patch) => set({ categories: await categoryService.update(id, patch) }),
  deleteCategory: async (id) => set({ categories: await categoryService.remove(id) }),
  reorderCategories: async (ids) => set({ categories: await categoryService.reorder(ids) }),

  addRestaurant: async (input) => set({ restaurants: await restaurantService.create(input) }),
  editRestaurant: async (id, patch) => set({ restaurants: await restaurantService.update(id, patch) }),
  deleteRestaurant: async (id) => set({ restaurants: await restaurantService.remove(id) }),

  setOrderStatus: async (id, status) => set({ orders: await orderService.updateStatus(id, status) }),
  refreshOrders: async () => set({ orders: await orderService.list(), customers: await customerService.list() }),

  setCustomerStatus: async (id, status) => set({ customers: await customerService.updateStatus(id, status) }),
  toggleDriver: async (id) => set({ drivers: await driverService.toggleAvailable(id) }),

  addCoupon: async (input) => set({ coupons: await promotionService.create(input) }),
  editCoupon: async (id, patch) => set({ coupons: await promotionService.update(id, patch) }),
  deleteCoupon: async (id) => set({ coupons: await promotionService.remove(id) }),

  saveSettings: async (patch) => {
    const settings = await settingsService.update(patch);
    setCurrencySymbol(settings.currencySymbol);
    set({ settings });
  },

  resetDemoData: async () => {
    resetDb();
    set({ hydrated: false });
    await useDataStore.getState().init();
  },
}));

/* Convenience selectors */
export const selectCategoryById = (id: string) => (s: DataState) =>
  s.categories.find((c) => c.id === id);
export const selectRestaurantById = (id: string) => (s: DataState) =>
  s.restaurants.find((r) => r.id === id);
