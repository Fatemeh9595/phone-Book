import Link from "next/link"
import styles from "@/styles/AddContact.module.css"
import { FaRegEye, FaRegEyeSlash, FaSpinner } from "react-icons/fa"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import validatToken from "@/utils/auth"

export default function Login({ setIsAuth }) {
   const [showPass, setShowPass] = useState(false)
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const router = useRouter()

   // Client-Side redirect to /Dashboard
   // useEffect(() => {
   //    const isAuth = async () => {
   //       const res = await fetch("/api/auth/status")
   //       if (res.status == 200) {
   //          router.replace("/dashboard")
   //       }
   //    }
   //    isAuth()
   // }, [])

   const showPassHandler = () => setShowPass(!showPass)

   const loginHandler = async (event) => {
      event.preventDefault()

      setIsLoading(true)
      const res = await fetch("/api/auth/login", {
         method: "POST",
         body: JSON.stringify({ email, password }),
         headers: {
            "Content-Type": "application/json"
         }
      })
      const data = await res.json()
      setIsLoading(false)

      if (res.status == 422 || res.status == 401 || res.status == 500) {
         return toast.error(data.message)
      }

      toast.success(data.message, { duration: 5000 })
      setIsAuth(true)
      router.replace("/dashboard")
   }

   return (
      <div className={styles.container}>
         <form>
            <input onChange={(e) => setEmail(e.target.value)} type='text' placeholder='email' />
            <div className={styles.password}>
               <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPass ? "text" : "password"}
                  placeholder='password'
               />
               {showPass ? (
                  <FaRegEyeSlash size='20px' onClick={showPassHandler} />
               ) : (
                  <FaRegEye size='20px' onClick={showPassHandler} />
               )}
            </div>
            <button onClick={loginHandler}>
               login {isLoading && <FaSpinner className={styles.spin} />}
            </button>
            <div className={styles.notRegistered}>
               Not registered?
               <Link href='/auth/register'>
                  <span> Create an acoount</span>
               </Link>
            </div>
         </form>
      </div>
   )
}

// Server-Side redirect to /Dashboard
export async function getServerSideProps(context) {
   const payload = validatToken(context)
   if (payload) {
      return {
         redirect: { destination: "/dashboard" }
      }
   }

   return {
      props: {}
   }
}
// localhost:port/auth/login