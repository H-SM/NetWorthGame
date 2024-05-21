import { useRouter } from "next/navigation"
import Link from "next/link"

const MainNav = () => {
    return (
        <div className="flex items-center justify-center">
            <Link href={"/"} className="ml-6" >Home</Link>
            <Link href={"/info"} className="ml-6">Info</Link>
            <Link href={"/login"} className="ml-6">Login</Link>
            <Link href={"/settings"} className="ml-6">Settings</Link>
        </div>
    )
}

export default MainNav
