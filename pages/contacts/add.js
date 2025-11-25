import styles from "@/styles/AddContact.module.css"
import toast, { Toaster } from "react-hot-toast"
import { useState } from "react"
import { FaSpinner } from "react-icons/fa"
import validatToken from "@/utils/auth"

export default function AddContact({userId}) {
   const [loading, setLoading] = useState(false)
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      phone: ""
   })

   const addContacthandler = async (event) => {
      event.preventDefault()
      let errorMessage = ""
      const { firstName, lastName, age, gender, phone } = formData

      if (!firstName || !lastName || !age || !gender || !phone) {
         return toast.error("همه فیلدا رو باید پر بکنی")
      }

      // firstName Validation
      if (firstName.length < 3 || firstName.length > 15) {
         errorMessage += "نام باید بین 3 تا 15 کاراکتر باشه" + "\n"
      }

      // lastName Validation
      if (lastName.length < 3 || lastName.length > 15) {
         errorMessage += "فامیل باید بین 3 تا 15 کاراکتر باشه" + "\n"
      }

      // age Validation
      if (age < 18) {
         errorMessage += "سن باید بزرگتر یا مساوی با 18 باشه" + "\n"
      }

      // phone Validation
      if (phone.length > 11 || !phone.match(/09\d{9}/)) {
         errorMessage += "شماره تلفن معتبر نیست" + "\n"
      }

      if (errorMessage) {
         return toast.error(errorMessage)
      }

      setLoading(true)
      const res = await fetch("/api/contacts", {
         method: "POST",
         body: JSON.stringify({...formData , userId}),
         headers: {
            "Content-Type": "application/json"
         }
      })
      const data = await res.json()
      setLoading(false)

      if (res.status == 422) {
         return toast.error(data.message)
      }
      if (res.status == 500) {
         return toast.error(data.message)
      }
      toast.success("new contact added to db")
      setFormData({
         firstName: "",
         lastName: "",
         age: "",
         gender: "",
         phone: ""
      })
   }

   return (
      <>
         <Toaster position='top-right' />
         <div className={styles.container}>
            <form>
               <input
                  type='text'
                  placeholder='firstName'
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
               />
               <input
                  type='text'
                  placeholder='lastName'
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
               />
               <input
                  type='number'
                  placeholder='age'
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
               />
               <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
               >
                  <option value='' selected hidden disabled>
                     gender
                  </option>
                  <option value='male'>male</option>
                  <option value='female'>female</option>
               </select>
               <input
                  type='text'
                  placeholder='phone'
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
               />
               <button onClick={addContacthandler}>
                  add contact {loading ? <FaSpinner className={styles.spin} /> : ""}
               </button>
            </form>
         </div>
      </>
   )
}

export async function getServerSideProps(context) {
   const payload = validatToken(context)
   // console.log(payload);
   
   if(!payload){
      return { redirect : { destination : '/auth/login'} }
   }
   return {
      props: { userId : payload.userId}
   }
}