import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Crown, 
  Menu, 
  X, 
  User, 
  Calendar, 
  Heart, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Compass,
  Gift
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBE3D5] shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B132B] to-[#1C2541] flex items-center justify-center shadow-md border border-[#C5A059]/40 group-hover:border-[#C5A059] transition-all">
              <Crown className="w-6 h-6 text-[#C5A059] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#0B132B]">
                Stay<span className="text-[#C5A059]">Ease</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#8C7A5B] font-semibold">
                Luxury Stays & Resorts
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-[#C5A059] ${
                isActive('/') ? 'text-[#C5A059]' : 'text-[#0B132B]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/hotels"
              className={`text-sm font-semibold transition-colors hover:text-[#C5A059] flex items-center gap-1.5 ${
                isActive('/hotels') ? 'text-[#C5A059]' : 'text-[#0B132B]'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Hotels
            </Link>
            <Link
              to="/offers"
              className={`text-sm font-semibold transition-colors hover:text-[#C5A059] flex items-center gap-1.5 ${
                isActive('/offers') ? 'text-[#C5A059]' : 'text-[#0B132B]'
              }`}
            >
              <Gift className="w-4 h-4" />
              Offers
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors hover:text-[#C5A059] ${
                isActive('/about') ? 'text-[#C5A059]' : 'text-[#0B132B]'
              }`}
            >
              About Us
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`text-sm font-semibold transition-colors hover:text-[#C5A059] flex items-center gap-1.5 ${
                  isActive('/dashboard') ? 'text-[#C5A059]' : 'text-[#0B132B]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                My Bookings
              </Link>
            )}
          </nav>

          {/* User Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-3 rounded-full hover:bg-[#F5EFE6] border border-transparent hover:border-[#C5A059]/30 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C5A059]/60"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-[#0B132B] line-clamp-1">{user.name}</p>
                    <p className="text-[10px] text-[#8C7A5B] font-medium uppercase tracking-wider">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#EBE3D5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-[#F0EAE1]">
                      <p className="text-xs text-stone-500">Signed in as</p>
                      <p className="text-sm font-bold text-[#0B132B] truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF7F2] hover:text-[#C5A059] transition-colors"
                    >
                      <User className="w-4 h-4 mr-3 text-stone-400" />
                      Customer Dashboard
                    </Link>

                    <Link
                      to="/dashboard?tab=bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF7F2] hover:text-[#C5A059] transition-colors"
                    >
                      <Calendar className="w-4 h-4 mr-3 text-stone-400" />
                      My Reservations
                    </Link>

                    <Link
                      to="/dashboard?tab=wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[#FAF7F2] hover:text-[#C5A059] transition-colors"
                    >
                      <Heart className="w-4 h-4 mr-3 text-stone-400" />
                      Wishlist & Saved
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm font-bold text-amber-700 bg-amber-50/70 hover:bg-amber-100 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 mr-3 text-amber-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-[#F0EAE1] my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#0B132B] hover:text-[#C5A059] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0B132B] to-[#1C2541] hover:from-[#1C2541] hover:to-[#2A375E] border border-[#C5A059]/40 hover:border-[#C5A059] shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  Join StayEase
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EBE3D5] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50"
          >
            Home
          </Link>
          <Link
            to="/hotels"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50"
          >
            Explore Hotels
          </Link>
          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50"
          >
            Offers & Deals
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50"
          >
            About Us
          </Link>

          {isAuthenticated ? (
            <>
              <div className="border-t border-stone-200 pt-3" />
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#C5A059]"
              >
                Customer Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-bold text-amber-700"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-4 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-stone-300 font-semibold text-stone-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-[#0B132B] text-white font-semibold"
              >
                Join StayEase
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
