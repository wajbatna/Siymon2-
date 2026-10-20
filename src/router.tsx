import { useEffect, type ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { StoreLayout } from '@/layouts/StoreLayout';
import { NotFound } from '@/pages/NotFound';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage';
import { AdminDeliveryPage } from '@/pages/admin/AdminDeliveryPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminPromotionsPage } from '@/pages/admin/AdminPromotionsPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminRestaurantsPage } from '@/pages/admin/AdminRestaurantsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { AccountPage } from '@/pages/store/AccountPage';
import { CartPage } from '@/pages/store/CartPage';
import { CategoryPage } from '@/pages/store/CategoryPage';
import { CheckoutPage } from '@/pages/store/CheckoutPage';
import { Home } from '@/pages/store/Home';
import { LoginPage } from '@/pages/store/LoginPage';
import { Onboarding } from '@/pages/store/Onboarding';
import { OrderDetailPage } from '@/pages/store/OrderDetailPage';
import { OrderSuccessPage } from '@/pages/store/OrderSuccessPage';
import { OrdersPage } from '@/pages/store/OrdersPage';
import { ProductDetail } from '@/pages/store/ProductDetail';
import { RegisterPage } from '@/pages/store/RegisterPage';
import { SearchPage } from '@/pages/store/SearchPage';
import { useDataStore } from '@/store/useDataStore';
import { readJson } from '@/utils/storage';

function Bootstrap({ children }: { children: ReactNode }) {
  const hydrated = useDataStore((s) => s.hydrated);
  const init = useDataStore((s) => s.init);
  useEffect(() => {
    if (!hydrated) void init();
  }, [hydrated, init]);
  return <>{children}</>;
}

/** '/' replays the intro unless the visitor already completed onboarding. */
function IndexRoute() {
  const onboarded = readJson<boolean>('siymon.onboarded', false);
  return <Navigate to={onboarded ? '/home' : '/intro'} replace />;
}

export function AppRouter() {
  return (
    <HashRouter>
      <Bootstrap>
        <Routes>
          <Route path="/" element={<IndexRoute />} />
          <Route path="/intro" element={<Onboarding />} />

          <Route element={<StoreLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id/success" element={<OrderSuccessPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="restaurants" element={<AdminRestaurantsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="delivery" element={<AdminDeliveryPage />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </Bootstrap>
    </HashRouter>
  );
}
