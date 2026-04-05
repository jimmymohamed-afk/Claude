import { Link, Routes, Route, NavLink } from 'react-router-dom';
import { Home, LayoutGrid, UtensilsCrossed, Palette, Settings, Database, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useMenu } from '../../context/MenuContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/categories', label: 'Categories', icon: LayoutGrid, end: false },
  { to: '/admin/items', label: 'Menu Items', icon: UtensilsCrossed, end: false },
  { to: '/admin/theme', label: 'Theme', icon: Palette, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
  { to: '/admin/data', label: 'Data', icon: Database, end: false },
];

function Dashboard() {
  const { state } = useMenu();
  const totalItems = state.items.length;
  const availableItems = state.items.filter(i => i.available).length;
  const featuredItems = state.items.filter(i => i.featured).length;
  const lastEdited = new Date(state.lastModified).toLocaleString();

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h2 className="text-2xl font-heading font-bold text-text-main mb-1">Dashboard</h2>
      <p className="text-text-main/50 text-sm mb-6">Last edited: {lastEdited}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Categories', value: state.categories.length },
          { label: 'Menu Items', value: totalItems },
          { label: 'Available', value: availableItems },
          { label: 'Featured', value: featuredItems },
        ].map(stat => (
          <div key={stat.label} className="bg-surface rounded-card p-4 border border-black/5">
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-text-main/60 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/items" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-card hover:opacity-90 transition-opacity">
          + Add Item
        </Link>
        <Link to="/admin/categories" className="px-4 py-2 bg-surface border border-black/15 text-text-main text-sm font-medium rounded-card hover:bg-bg transition-colors">
          + Add Category
        </Link>
        <Link to="/admin/theme" className="px-4 py-2 bg-surface border border-black/15 text-text-main text-sm font-medium rounded-card hover:bg-bg transition-colors">
          Customize Theme
        </Link>
        <Link to="/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-surface border border-black/15 text-text-main text-sm font-medium rounded-card hover:bg-bg transition-colors">
          Preview Menu ↗
        </Link>
      </div>

      <div className="mt-8 p-4 bg-accent/10 rounded-card border border-accent/20">
        <p className="text-sm text-text-main/70">
          <strong className="text-text-main">Tip:</strong> Use the sidebar to manage categories, items, and design. All changes are saved automatically.
        </p>
      </div>
    </div>
  );
}

// Placeholder pages — will be replaced with full implementations
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6 md:p-8">
    <h2 className="text-2xl font-heading font-bold text-text-main mb-2">{title}</h2>
    <p className="text-text-main/50 text-sm">Full {title.toLowerCase()} management coming soon.</p>
  </div>
);

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-4 px-2">
        <span className="text-xs font-semibold text-text-main/40 uppercase tracking-wider">Admin Panel</span>
      </div>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-card text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-text-main/70 hover:bg-bg hover:text-text-main'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
      <div className="mt-4 pt-4 border-t border-black/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-card text-sm font-medium text-text-main/70 hover:bg-bg hover:text-text-main transition-colors"
        >
          <Home size={18} />
          View Menu
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-bg font-body flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-surface border-r border-black/10 flex-shrink-0">
        <NavLinks />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 h-full bg-surface border-r border-black/10 flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 text-text-main/50 hover:text-text-main"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            <NavLinks />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-surface border-b border-black/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-text-main/70 hover:text-text-main"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-heading font-semibold text-text-main">Admin Panel</span>
        </div>

        <main className="flex-1 overflow-auto text-text-main">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<PlaceholderPage title="Categories" />} />
            <Route path="items" element={<PlaceholderPage title="Menu Items" />} />
            <Route path="theme" element={<PlaceholderPage title="Theme Editor" />} />
            <Route path="settings" element={<PlaceholderPage title="Restaurant Settings" />} />
            <Route path="data" element={<PlaceholderPage title="Data Manager" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
