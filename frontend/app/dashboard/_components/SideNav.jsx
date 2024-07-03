"use client"
import { House, LayoutIcon, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function SideNav() {

  const menuList=[
    {
      id:1,
      name:'Jadwal Teknisi',
      icon:House,
      path:'/dashboard'
    },
    {
      id:2,
      name:'Teknisi',
      icon:Users,
      path:'/dashboard/teknisi'
    },
  ]
  const path=usePathname();
  useEffect(()=> {
    console.path
  },[path])

  return (
    <div className='border shadow-md h-screen p-5 '>
      <Image src={'/logo.svg'}
      width={180}
      height={50}
      alg='logo' />

    <hr className='my-5'></hr>

    {menuList.map((menu,index)=>(
      <Link href={menu.path}>
          <h2 className={`flex items-center gap-3 text-md p-4
            text-slate-500
            hover:bg-primary
            hover:text-white
            cursor-pointer
            rounded-lg
            my-2
            ${path==menu.path&&'bg-primary text-white'}
            `}>
          <menu.icon/>
          {menu.name}
          </h2>
      </Link>
    ))}
      
      

    </div>
  )
}

export default SideNav