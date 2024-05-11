'use client'
import React from "react";
import { Add, Logout, Person, Search } from "@mui/icons-material";
import { SignInButton, SignOutButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function TopBar(){
  const route=useRouter();
  const [search, setSearch]= React.useState('');

  return(
    <div className="flex justify-between items-center mt-6">
      <div className="relative">
        <input
          type="text"
          className="search-bar"
          placeholder="Search posts, people, ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search
          className="search-icon"
          onClick={() => router.push(`/search/posts/${search}`)}
        />
      </div>

      <button
        className="create-post-btn"
        onClick={() => router.push("/create-post")}
      >
        <Add /> <p>Create A Post</p>
      </button>

      <div className="flex gap-3">
        <SignedIn>
          <SignInButton>
            <div className="flex cursor-pointer gap-4 items-center md:hidden">
              <Logout sx={{color:'white', fontSize:'32px'}}/>
            </div>
          </SignInButton>
        </SignedIn>
        <Link href='/'>
          <Image 
            src='/assets/phucmai.png' 
            alt='profile photo' 
            width={50} 
            height={50} 
            className='rounded-full md:hidden'
          />
        </Link>
      </div>
    </div>
  )
}