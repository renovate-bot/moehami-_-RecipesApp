"use client"

// import Link from 'next/link';
// import React from 'react'
// import ThemeSwitcher from './ThemeSwitcher';

// const NavBar = () => {
//   return (
//     <nav className='flex h-auto gap-5 items-center py-6 px-6 md:px-[50px] lg:px-[100px] bg-slate-800 w-full'>
//         <Link className='text-white underline underline-offset-4' href='/recipe'>Recipes</Link>
//         <Link className='text-white underline underline-offset-4' href='/search'>Search</Link>
//         <ThemeSwitcher />
//     </nav>
//   )
// }

// export default NavBar;

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const NavBar = () => {

  const [activeLink, setActiveLink] = useState<string>('/');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };
  
  return (
    <nav className='flex justify-between items-center py-6 px-6 md:px-[50px] lg:px-[100px] bg-slate-800 w-full shadow-lg'>
      {/* Logo/Branding */}
      <div className='text-2xl font-bold text-[#f26b5a]'>
        <Link 
          href='/' 
          className='hover:text-[#f78b6d] transition duration-300' 
          onClick={() => handleLinkClick('/')}>
          MyRecipes
        </Link>
      </div>

      {/* Navigation Links */}
      <div className='flex gap-8'>
        <Link 
          href='/recipe'
          className={`text-lg font-medium hover:text-[#f78b6d] transition duration-300 ${activeLink === '/recipe' ? 'text-[#f78b6d]' : 'text-white'} hover:text-[#f78b6d]'}`}
          aria-current="page"
          onClick={() => handleLinkClick('/recipe')}
        >
            Recipes
        </Link>
        <Link 
          href='/search'
          className={`text-lg font-medium hover:text-[#f78b6d] transition duration-300 ${activeLink === '/search' ? 'text-[#f78b6d]' : 'text-white'} hover:text-[#f78b6d]'}`}
          onClick={() => handleLinkClick('/search')}
        >
            Search
        </Link>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </nav>
  );
};

export default NavBar;


