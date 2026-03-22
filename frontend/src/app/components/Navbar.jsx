import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='bg-gray-800 text-white p-4 flex justify-between items-center '>
      <div className="logo">
        <h1>Slack Clone</h1>
      </div>
      <div className="links gap-5 flex">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/login">Login</Link>
      </div>
    </div>
  )
}

export default Navbar
