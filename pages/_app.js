import Navbar from "@/components/navbar/navbar"
import "@/styles/globals.css"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

export default function App({ Component, pageProps }) {
   const [isAuth, setIsAuth] = useState(false)

   useEffect(() => {
      const isAuth = async () => {
         const res = await fetch("/api/auth/status")
         if (res.status == 401) {
            setIsAuth(false)
         } else {
            setIsAuth(true)
         }
      }
      isAuth()
   }, [])

   return (
      <>
         <Toaster position='top-right' />
         <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
         <Component {...pageProps} isAuth={isAuth} setIsAuth={setIsAuth} />
      </>
   )
}