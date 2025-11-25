import Link from "next/link"
import styles from "@/styles/AddContact.module.css"
import { FaRegEye, FaRegEyeSlash, FaSpinner } from "react-icons/fa"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"

export default function Register() {
   const router = useRouter()
   const [showPass, setShowPass] = useState(false)
   const [isLoading, setIsLoading] = useState(false)
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: ""
   })
   const showPassHandler = () => setShowPass(!showPass)

   const registerHandler = async (event) => {
      event.preventDefault()

      setIsLoading(true)
      const res = await fetch("/api/auth/register", {
         method: "POST",
         body: JSON.stringify(formData),
         headers: {
            "Content-Type": "application/json"
         }
      })
      const data = await res.json()
      setIsLoading(false)

      if (res.status == 422 || res.status == 409 || res.status == 500) {
         return toast.error(data.message)
      }
      toast.success(data.message, { duration: 5000 })
      router.replace("/auth/login")
   }
   return (
      <div className={styles.container}>
         <form>
            <input
               onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
               type='text'
               placeholder='firstName'
            />
            <input
               onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
               type='text'
               placeholder='lastName'
            />
            <input
               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               type='text'
               placeholder='email'
            />
            <div className={styles.password}>
               <input
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  type={showPass ? "text" : "password"}
                  placeholder='password'
               />
               {showPass ? (
                  <FaRegEyeSlash size='20px' onClick={showPassHandler} />
               ) : (
                  <FaRegEye size='20px' onClick={showPassHandler} />
               )}
            </div>
            <button onClick={registerHandler}>
               register {isLoading && <FaSpinner className={styles.spin} />}
            </button>
            <div className={styles.notRegistered}>
               Already registered?
               <Link href='/auth/login'>
                  <span> Login</span>
               </Link>
            </div>
         </form>
      </div>
   )
}

// localhost:port/auth/register