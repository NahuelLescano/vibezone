'use client'
import React from "react";
import { sidebarLinks } from "@constants";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomBar(){
  const pathname=usePathname()
  return(
    <div className="flex bottom-0 z-20 bg-dark-1 px-6 py-3 items-center  justify-between md:hidden">
      {sidebarLinks.map((link)=>{
        const isActive= pathname === link.route
        return(
          <Link key={link.label} href={link.route}
          className={`flex gap-2 items-center rounded-lg py-2 px-4 ${
            isActive && "bg-purple-1"
          }`}
          >
            {link.icon}<p className="text-small-medium text-light-1 max-sm:hidden">{link.label}</p>
          </Link>
        )
      })}
    </div>
  )
}