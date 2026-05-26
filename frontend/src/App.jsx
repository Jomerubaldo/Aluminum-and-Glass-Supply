import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Layers,
  Truck,
  Wrench,
  BarChart2,
  FileText,
  Menu,
  X,
} from 'lucide-react';

import DashboardPage from '@/pages/dashboard/DashboardPage';
import CustomerPage from '@/pages/customer/CustomerPage';
import ProductPage from '@/pages/product/ProductPage';
import SupplierPage from '@/pages/supplier/SupplierPage';
import MaterialPage from '@/pages/material/MaterialPage';
import OrderPage from '@/pages/order/OrderPage';
import InstallationPage from '@/pages/installation/InstallationPage';
import SalesPage from '@/pages/sales/SalesPage';
import ReportPage from '@/pages/report/ReportPage';
import ModeToggle from './components/mode-toggle';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customers', label: 'Customer', icon: Users },
  { to: '/orders', label: 'Order', icon: ShoppingCart },
  { to: '/installations', label: 'Installation', icon: Wrench },
  { to: '/products', label: 'Product', icon: Package },
  { to: '/materials', label: 'Material', icon: Layers },
  { to: '/suppliers', label: 'Supplier', icon: Truck },
  { to: '/sales', label: 'Sales', icon: BarChart2 },
  { to: '/reports', label: 'Report', icon: FileText },
];

const Sidebar = ({ open, onClose }) => (
  <>
    {open && (
      <div
        className="fixed inset-0 z-20 bg-black/40 lg:hidden"
        onClick={onClose}
      />
    )}

    <aside
      className={`
        fixed top-0 left-0 z-30 h-full w-60 bg-card border-r border-border shadow-sm
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
      `}
    >
      <div className="p-5 border-b border-border shadow-sm flex items-center justify-between">
        <div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Aluminum & Glass
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Sales & Order Management System
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border flex justify-between items-center">
        <p className="text-[11px] text-muted-foreground text-center">
          AGSSOM 2026
        </p>
        <ModeToggle className="mt-3 flex justify-center" />
      </div>
    </aside>
  </>
);

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-sm font-semibold">AGSSOM</h1>
        </header>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/installations" element={<InstallationPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/materials" element={<MaterialPage />} />
          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
