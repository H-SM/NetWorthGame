import { useRouter } from "next/navigation"
import Link from "next/link"

const MainNav = () => {
    return (
        <div className="flex items-center justify-center w-fit h-full">
            <Link href={"/"} className="ml-6" >Home</Link>
            <Link href={"/products"} className="ml-6">Products</Link>
            <Link href={"/settings"} className="ml-6">Settings</Link>
            <Link href={"/login"} className="ml-6">Login</Link>
        </div>
    )
}

export default MainNav
