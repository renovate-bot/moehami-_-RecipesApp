import Link from 'next/link';
import React from 'react'

const NavBar = () => {
  return (
    <nav className='flex flex-col justify-center p-6 h-[100px] bg-slate-800 w-full'>
        <Link className='text-white underline underline-offset-4' href='/recipe'>Recipes</Link>
    </nav>
  )
}

export default NavBar;

