import Link from "next/link"
import { MdAddBox, MdSpaceDashboard } from "react-icons/md"
import { PiListNumbersBold } from "react-icons/pi"
import { CgLogIn, CgLogOut } from "react-icons/cg"
import styles from "./navbar.module.css"
import { useRouter } from "next/router"
import toast from "react-hot-toast"

export default function Navbar({ isAuth, setIsAuth }) {
   const { route } = useRouter()

   const logoutHandler = async () => {
      const res = await fetch("/api/auth/logout")
      if (res.status == 200) {
         toast.success("User Logged Out Successfully")
         setIsAuth(false)
         route.replace("/")
      } else {
         toast.error("error")
      }
   }

   return (
      <div className={styles.navbar}>
         <div className={styles.menu}>
            {isAuth ? (
               <Link href='/' onClick={logoutHandler}>
                  <CgLogOut color={route == "/auth/login" ? "#03aa03" : "black"} /> Logout
               </Link>
            ) : (
               <Link href='/auth/login'>
                  <CgLogIn color={route == "/auth/login" ? "#03aa03" : "black"} /> Login
               </Link>
            )}

            {isAuth && (
               <Link href='/contacts/add'>
                  <MdAddBox color={route == "/contacts/add" ? "#03aa03" : "black"} /> Add Contact
               </Link>
            )}

            {isAuth && (
               <Link href='/contacts'>
                  <PiListNumbersBold color={route == "/contacts" ? "#03aa03" : "black"} /> Contatcts
               </Link>
            )}

            {isAuth && (
               <Link href='/dashboard'>
                  <MdSpaceDashboard color={route == "/dashboard" ? "#03aa03" : "black"} /> Dashboard
               </Link>
            )}
         </div>
      </div>
   )
}