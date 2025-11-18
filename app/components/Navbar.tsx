"use client";

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Heart, Bell, Settings, LogOut, User, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export function Navbar({ title = "HealthCare Portal", subtitle }: NavbarProps) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDashboardLink = () => {
    if (session?.user?.role === 'provider') return '/provider';
    if (session?.user?.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link href={session ? getDashboardLink() : '/'} className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">{title}</span>
            </Link>
            {subtitle && (
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {subtitle}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          {session ? (
            <div className="hidden md:flex items-center space-x-4">
              {/* Navigation Links */}
              <div className="flex items-center space-x-4">
                {session.user.role === 'provider' && (
                  <>
                    <Link 
                      href="/provider" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/provider/patients" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Patients
                    </Link>
                    <Link 
                      href="/provider/schedule" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Schedule
                    </Link>
                  </>
                )}
                
                {session.user.role === 'patient' && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/goals" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Goals
                    </Link>
                    <Link 
                      href="/appointments" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Appointments
                    </Link>
                  </>
                )}
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {getInitials(session.user.name || 'U')}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-700 font-medium text-sm">{session.user.name}</p>
                    <p className="text-gray-500 text-xs capitalize">{session.user.role}</p>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/auth/signin" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {session ? (
              <>
                {/* User Info */}
                <div className="flex items-center px-3 py-2 border-b">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium text-sm">
                      {getInitials(session.user.name || 'U')}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">{session.user.name}</p>
                    <p className="text-gray-500 text-xs capitalize">{session.user.role}</p>
                  </div>
                </div>

                {/* Navigation Links */}
                {session.user.role === 'provider' && (
                  <>
                    <Link href="/provider" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                      Dashboard
                    </Link>
                    <Link href="/provider/patients" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                      Patients
                    </Link>
                    <Link href="/provider/schedule" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                      Schedule
                    </Link>
                  </>
                )}

                {session.user.role === 'patient' && (
                  <>
                    <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                      Dashboard
                    </Link>
                    <Link href="/goals" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                      Goals
                    </Link>
                    <Link href="/appointments" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                      Appointments
                    </Link>
                  </>
                )}

                <Link href="/profile" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </Link>
                <Link href="/settings" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                  Settings
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}