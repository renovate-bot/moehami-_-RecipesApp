import Link from 'next/link';
import React from 'react'
import ThemeSwitcher from './ThemeSwitcher';

const NavBar = () => {
  return (
    <nav className='flex h-auto gap-5 items-center py-6 px-6 md:px-[50px] lg:px-[100px] bg-slate-800 w-full'>
        <Link className='text-white underline underline-offset-4' href='/recipe'>Recipes</Link>
        <Link className='text-white underline underline-offset-4' href='/search'>Search</Link>
        <ThemeSwitcher />
    </nav>
  )
}

export default NavBar;

