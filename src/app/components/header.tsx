// import { MainNav } from "./main-nav";
// import UserButton from "./user-button";
import { DynamicWidget } from "./../lib/dynamic";
import MainNav from "./header/MainNav";

export default function Header() {
    return (
        <header className="flex items-center justify-between w-full h-16 sm:px-6 border-b">
            
                <MainNav />
                <div className="w-full flex items-center justify-center">
                    <DynamicWidget />
                </div>
                <div className="bg-white/5 w-[50rem] h-full">

                </div>
                {/* <UserButton /> */}
        </header>
    );
}