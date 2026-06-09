import { Outlet, NavLink } from 'react-router-dom';
import { Building2, Home, Package, ShoppingCart, Users, ClipboardList, Settings, ChevronDown, Bell } from 'lucide-react';

export default function Layout() {
  const menuItems = [
    { icon: <Home size={18} />, label: 'Home', path: '/home' },
    { icon: <Package size={18} />, label: 'Items', path: '/items', hasDropdown: true },
    { icon: <ShoppingCart size={18} />, label: 'Sales', path: '/sales', hasDropdown: true },
    { icon: <Users size={18} />, label: 'Client Management', path: '/dashboard', active: true },
    { icon: <ClipboardList size={18} />, label: 'Purchase', path: '/purchase', hasDropdown: true },
    { icon: <Settings size={18} />, label: 'Masters Config', path: '/config', hasDropdown: true },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#eef2fc] border-r border-[#e2e8f0] flex flex-col h-full shrink-0 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
        {/* Logo area */}
        <div className="p-6 pb-8 flex items-center gap-3 text-blue-500">
          <Building2 size={36} />
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-tight">Aishwarya</span>
            <span className="font-semibold text-lg leading-tight">Infra</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                    item.active || isActive
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.hasDropdown && <ChevronDown size={14} className={item.active ? "text-white" : "text-gray-400"} />}
              </NavLink>
              
              {/* Submenu for active item mockup */}
              {(item.active || item.label === 'Client Management') && (
                <div className="ml-10 mt-1 mb-2 space-y-1 flex flex-col text-sm">
                  <a href="#" className="py-1.5 text-gray-500 hover:text-blue-500">Enquiries</a>
                  <a href="#" className="py-1.5 text-gray-500 hover:text-blue-500">Quotations</a>
                  <a href="#" className="py-1.5 text-gray-500 hover:text-blue-500">Sales Orders</a>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Profile toggle */}
        <div className="p-4 flex justify-between items-center">
          <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <button className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white m-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
        
        {/* Top Navigation */}
        <header className="h-14 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-[#fdfdfd]">
          <div className="flex items-center text-sm text-gray-500">
            <Home size={14} className="mr-2 text-blue-500" />
            <span className="hover:text-blue-500 cursor-pointer">Home</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Client Management</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Erode</span>
              <ChevronDown size={14} />
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <Bell size={18} className="text-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-sm text-gray-500">berry</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-white">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
