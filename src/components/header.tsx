// import { MainNav } from "./main-nav";
// import UserButton from "./user-button";
import { DynamicWidget } from "./../app/lib/dynamic";
import MainNav from "./header/MainNav";

export default function Header() {
    return (
        <header className="flex justify-center border-b">
            <div className="flex items-center justify-between w-full h-16 sm:px-6">
                <MainNav />
                <div className="w-full flex items-center justify-center">
                    <DynamicWidget />

                </div>
                <div className="bg-white/5 w-[15rem] h-full">

                </div>
                {/* <UserButton /> */}
            </div>
        </header>
    );
}