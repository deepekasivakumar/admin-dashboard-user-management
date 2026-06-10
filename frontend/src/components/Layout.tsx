import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home, Users, ChevronDown, Bell, LogOut } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const menuItems = [
    { icon: <Home size={18} />, label: 'Home', path: '/home' },
    { icon: <Users size={18} />, label: 'User Management', path: '/dashboard' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#eef2fc] border-r border-[#e2e8f0] flex flex-col h-full shrink-0 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
        {/* Logo area */}
        <div className="p-6 pb-8 flex items-center gap-3 text-blue-500">
          <Users size={36} />
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-tight">User</span>
            <span className="font-semibold text-lg leading-tight">Management</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${isActive
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            </div>
          ))}
        </nav>

        {/* Bottom Profile toggle */}
        <div className="relative p-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <button className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="m15 18-6-6 6-6" /></svg>
            </button>
          </div>
          
          {isProfileMenuOpen && (
            <div className="absolute bottom-16 left-4 right-4 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50">
              <button 
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setIsLogoutConfirmOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white m-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">

        {/* Top Navigation */}
        <header className="h-14 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-[#fdfdfd]">
          <div className="flex items-center text-sm text-gray-500">
            <Home size={14} className="mr-2 text-blue-500" />
            <span className="hover:text-blue-500 cursor-pointer">Home</span>
            {location.pathname !== '/home' && (
              <>
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-gray-900 font-medium">
                  {location.pathname === '/dashboard' ? 'User Management' : ''}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Bell size={18} className="text-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Admin</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden p-6 flex flex-col">
          <Outlet />
        </main>

      </div>

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        confirmText="Logout"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
