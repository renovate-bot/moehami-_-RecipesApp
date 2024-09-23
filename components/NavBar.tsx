"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useAuth, useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NavBar = () => {

  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth(); // Hook to check authentication status
  const { user } = useUser(); // Get user data if signed in

  const [activeLink, setActiveLink] = useState<string>('/');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  // Disable body scroll when the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      // Cleanup the overflow style on unmount
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='flex z-50 justify-between items-center py-6 px-6 md:px-[50px] lg:px-[100px] bg-slate-950 w-full shadow-lg relative'>
      {/* Logo/Branding */}
      <div className='text-2xl font-bold text-custom-orange'>
        <Link 
          href='/' 
          className='hover:text-custom-orange transition duration-300' 
          onClick={() => handleLinkClick('/')}
        >
          MyRecipes
        </Link>
      </div>

      <div className='flex gap-5 items-center'>
        <SignedOut>
          <Link
            href="/sign-in"
            className="block md:inline-block text-lg font-medium text-white hover:text-custom-orange transition duration-300"
            onClick={() => handleLinkClick("/sign-in")}
          >
            <LogIn size={24} />
          </Link>
          <Link
            href="/sign-up"
            className="block md:inline-block text-lg font-medium text-white hover:text-custom-orange transition duration-300"
            onClick={() => handleLinkClick("/sign-up")}
            >
            <UserPlus size={24} />
          </Link>
        </SignedOut>

        {/* Show User Button and Sign Out if signed in */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />  
        </SignedIn>

        {/* Theme Switcher visible in mobile and desktop */}
        <div className='md:mt-0'>
          <ThemeSwitcher />
        </div>
      

        {/* Burger menu button (visible on small screens) */}
        <div className='md:hidden flex items-center z-[100]'>
          <button onClick={toggleMenu} className='text-white focus:outline-none'>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Navigation Links with animation */}
        <div
          className={`md:flex gap-8 fixed md:static top-0 h-screen sm:h-auto left-0 w-full md:w-auto bg-slate-800/95 md:bg-transparent transition-transform duration-300 ease-in-out ${
            isMenuOpen
              ? 'transform translate-x-0 opacity-100'
              : 'transform -translate-x-full opacity-0 md:opacity-100 md:translate-x-0'
          }`}
        >
          <div className='flex flex-col gap-4 justify-center items-center h-full md:flex-row md:gap-8 p-4 md:p-0'>
            <Link
              href='/recipe'
              className={`block md:inline-block text-4xl sm:text-lg font-medium hover:text-custom-orange transition duration-300 ${activeLink === '/recipe' || pathname.startsWith('/recipe/') ? 'text-custom-orange' : 'text-white'}`}
              onClick={() => handleLinkClick('/recipe')}
            >
              Recipes
            </Link>
            <Link
              href='/search'
              className={`block md:inline-block text-4xl sm:text-lg font-medium hover:text-custom-orange transition duration-300 ${activeLink === '/search' ? 'text-custom-orange' : 'text-white'}`}
              onClick={() => handleLinkClick('/search')}
            >
              Search
            </Link>
            <Link
              href='/blog'
              className={`block md:inline-block text-4xl sm:text-lg font-medium hover:text-custom-orange transition duration-300 ${activeLink === '/blog' || pathname.startsWith('/blog/') ? 'text-custom-orange' : 'text-white'}`}
              onClick={() => handleLinkClick('/blog')}
            >
              Blog
            </Link>
            <Link
              href='/favorite'
              className={`block md:inline-block text-4xl sm:text-lg font-medium hover:text-custom-orange transition duration-300 ${activeLink === '/favorite' ? 'text-custom-orange' : 'text-white'}`}
              onClick={() => handleLinkClick('/favorite')}
            >
              Favorites
            </Link>

            <SignedIn>
          
            <Link
              href="/mealplanner"
              className="block md:inline-block text-4xl sm:text-lg font-medium text-white hover:text-custom-orange transition duration-300"
              onClick={() => handleLinkClick("/mealplanner")}
              >
                Meal Planner
            </Link>
          </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;