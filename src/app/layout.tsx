import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ProviderWrapper from "./components/dynamic-wrapper";
import Header from "./components/header";
import SideNav from "./components/sidenav";
import { ContextProvider } from './context/context';
const inter = Inter({ subsets: ["latin"] });
import { initMoralis } from './lib/moralis';
import Grid from "./assets/grid.svg"
import Image from "next/image";
initMoralis();
export const metadata: Metadata = {
  title: "N3T WORTH GAME",
  description: "Get Your Net Worth Seemlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative h-[100vh] bg-background overflow-x-hidden">
        <ContextProvider>
          <ProviderWrapper>
            <div className='absolute left-[-15rem] top-0'>
              <Image src={Grid} alt="Grid" className="invert" width={1000} height={1000} />
            </div>
            <div className='absolute right-[-35rem] top-[-10rem]'>
              <Image src={Grid} alt="Grid" className="invert" width={1000} height={1000} />
            </div>
            <div className='absolute animate-bounce-slow opacity-70 left-[15rem] top-[30rem]'>
              <div className={`bg-text w-[8rem] h-[8rem] rounded-2xl rotate-[30deg]`} />
            </div>
            <div className='absolute animate-bounce-slow-late opacity-70 right-[-2rem] top-[15rem]'>
              <div className={`bg-text w-[8rem] h-[8rem] rounded-2xl rotate-[30deg]`} />
            </div>
            <div className="flex h-full">
              <div className="hidden lg:block">
                <SideNav />
              </div>
              <div className="flex-1">
                <div className="lg:hidden">
                  <Header />
                </div>

                {/* Your other content or children components */}
                {children}
              </div>
            </div>
          </ProviderWrapper>
        </ContextProvider>
      </body>
    </html>
  );
}
