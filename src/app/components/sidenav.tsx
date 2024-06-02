import { DynamicWidget } from "./../lib/dynamic"; import React from 'react'
import logo from "./../assets/logo.png"
import Image from "next/image";
import Link from "next/link";


const SideNav = () => {
  return (
    <div className='w-[18rem] h-full z-10  bg-gray-400 rounded-r-md bg-clip-padding backdrop-blur-sm bg-opacity-30 border-r border-gray-800 drop-shadow-2xl flex flex-col justify-between items-center'>
      <div className="flex flex-col justify-start items-center gap-8">
        <div className="w-full h-[13rem] flex justify-center items-center">
          <Image src={logo} className="w-[15rem]" alt="logo_here" />
        </div>
        <div className="w-full h-[15rem] flex flex-col justify-start items-center gap-2">
          <Link href={"/"} className="bg-text/5 w-full h-[3rem] rounded-full text-left px-6 font-anton font-semibold flex items-center transition ease-in-out duration-300 hover:bg-background hover:text-primary border border-opacity-10 gap-1">
            <svg fill="currentColor" className="w-[1.5rem]" viewBox="-4.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>home</title> <path d="M19.469 12.594l3.625 3.313c0.438 0.406 0.313 0.719-0.281 0.719h-2.719v8.656c0 0.594-0.5 1.125-1.094 1.125h-4.719v-6.063c0-0.594-0.531-1.125-1.125-1.125h-2.969c-0.594 0-1.125 0.531-1.125 1.125v6.063h-4.719c-0.594 0-1.125-0.531-1.125-1.125v-8.656h-2.688c-0.594 0-0.719-0.313-0.281-0.719l10.594-9.625c0.438-0.406 1.188-0.406 1.656 0l2.406 2.156v-1.719c0-0.594 0.531-1.125 1.125-1.125h2.344c0.594 0 1.094 0.531 1.094 1.125v5.875z"></path> </g></svg>
            Home
          </Link>
          <Link href={"/products"} className="bg-text/5 w-full h-[3rem] rounded-full text-left px-6 font-anton font-semibold flex items-center transition ease-in-out duration-300 hover:bg-background hover:text-primary border border-opacity-10 gap-1">
            <svg fill="currentColor" className="w-[1.5rem]" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>folder</title> <path d="M11.875 9.719h9.531c0.531 0 1 0.469 1 1v13.219c0 0.531-0.469 0.969-1 0.969h-20.406c-0.531 0-1-0.438-1-0.969v-13.219c0-0.531 0.469-1 1-1h1.063l0.5-1.656c0-0.531 0.469-1 1-1h6.813c0.531 0 1 0.469 1 1z"></path> </g></svg>
            Products
          </Link>
          <Link href={"/settings"} className="bg-text/5 w-full h-[3rem] rounded-full text-left px-6 font-anton font-semibold flex items-center transition ease-in-out duration-300 hover:bg-background hover:text-primary border border-opacity-10 gap-1">
            <svg fill="currentColor" className="w-[1.5rem]" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>paramater</title> <path d="M12.938 7.469v1.156h9.469v1.875h-9.469v1.156c0 0.344-0.313 0.625-0.656 0.625h-2.156c-0.344 0-0.656-0.281-0.656-0.625v-1.156h-9.469v-1.875h9.469v-1.156c0-0.344 0.313-0.625 0.656-0.625h2.156c0.344 0 0.656 0.281 0.656 0.625zM3.906 13.281h2.219c0.344 0 0.594 0.281 0.594 0.625v1.156h15.688v1.844h-15.688v1.156c0 0.344-0.25 0.656-0.594 0.656h-2.219c-0.344 0-0.656-0.313-0.656-0.656v-1.156h-3.25v-1.844h3.25v-1.156c0-0.344 0.313-0.625 0.656-0.625zM16.063 19.719h2.219c0.344 0 0.625 0.281 0.625 0.625v1.156h3.5v1.844h-3.5v1.156c0 0.344-0.281 0.656-0.625 0.656h-2.219c-0.344 0-0.625-0.313-0.625-0.656v-1.156h-15.438v-1.844h15.438v-1.156c0-0.344 0.281-0.625 0.625-0.625z"></path> </g></svg>
            Settings
          </Link>
          <Link href={"/login"} className="bg-text/5 w-full h-[3rem] rounded-full text-left px-6 font-anton font-semibold flex items-center transition ease-in-out duration-300 hover:bg-background hover:text-primary border border-opacity-10 gap-1">
            <svg fill="currentColor" className="w-[1.5rem]" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>key</title> <path d="M9.938 20.25l-1.219-1.25s-3.469 1.344-6.969-2.125c-2.969-2.969-1.656-7.625 0.281-9.531 2.063-2.063 6.469-3.313 9.688-0.094s1.844 7.031 1.844 7.031l8.844 8.813-0.25 4.594-4.5 0.281-0.25-2.25-2.344-0.281-0.219-2.344-2.313-0.313-0.344-2.25zM3.25 8.594c-1.375 1.375-1.75 3.219-0.844 4.094 0.906 0.906 2.719 0.531 4.094-0.844s1.781-3.219 0.875-4.094c-0.875-0.906-2.75-0.531-4.125 0.844zM21.344 24.844l0.063-1.313-8.406-8.406-0.688 0.688z"></path> </g></svg>
            Login
          </Link>

        </div>
      </div>
      <div className="w-full flex items-center justify-center pb-[1rem]">
        <DynamicWidget />
      </div>
    </div>
  )
}

export default SideNav
// anton 