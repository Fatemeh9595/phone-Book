import ContactItem from "../../components/contact/contactitem"
import Contact from "@/models/Contact"
import connectDB from "@/utils/connectDB"
import styles from "@/styles/Contacts.module.css"
import toast, { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import validatToken from "@/utils/auth"
import generateFilter from "@/utils/generateFilter"
import { MdOutlineFavoriteBorder } from "react-icons/md"


export default function Contacts({ contactsList, userId }) {
   const [contacts, setContacts] = useState(contactsList)
   const [searchKey, setSearchKey] = useState("")
   const [searchGen, setSearchGen] = useState("")
   const [favStatus, setFavStatus] = useState(false)
   const router = useRouter()
   const { gen, search } = router.query

   useEffect(() => {
      gen ? setSearchGen(gen) : setSearchGen("")
      search ? setSearchKey(search) : setSearchKey("")
   }, [])

   const searchHandler = async () => {
      try {
         const res = await fetch(
            `/api/contacts?userId=${userId}&gen=${searchGen}&search=${searchKey}`
         )
         const data = await res.json()
         setContacts(data)
      } catch (error) {
         toast.error("server error")
      }
   }

   const showFavoriteHandler = () => {
      if (favStatus) {
         setContacts(contactsList)
      } else {
         const favoriteContacts = contacts.filter((contact) => contact.favorite == true)
         setContacts(favoriteContacts)
      }

      setFavStatus(!favStatus)
   }
   return (
      <>
         <Toaster position='top-right' />
         <div className={styles.searchContainer}>
            <input
               type='text'
               onChange={(e) => setSearchKey(e.target.value)}
               placeholder='enter name or family'
               value={searchKey}
            />
            <select onChange={(e) => setSearchGen(e.target.value)}>
               <option value='' selected={searchGen == ""}>
                  all
               </option>
               <option value='male' selected={searchGen == "male"}>
                  male
               </option>
               <option value='female' selected={searchGen == "female"}>
                  female
               </option>
            </select>
            <button onClick={searchHandler}>search</button>
            <MdOutlineFavoriteBorder
               size='35px'
               fill={favStatus ? "red" : "black"}
               onClick={showFavoriteHandler}
            />
         </div>
         {contacts.length > 0 && (
            <>
               {contacts.map((contact) => (
                  <ContactItem
                     key={contact._id}
                     {...contact}
                     contacts={contacts}
                     setContacts={setContacts}
                  />
               ))}
            </>
         )}
         {contacts.length == 0 && <p className={styles.noAudience}>There is no audience</p>}
      </>
   )
}

export async function getServerSideProps(context) {
   const payload = validatToken(context)
   if (!payload) {
      return { redirect: { destination: "/auth/login" } }
   }
   const userId = payload.userId
   const filter = generateFilter(context.query, userId)

   await connectDB()
   const contacts = await Contact.find(filter)

   return {
      props: { contactsList: JSON.parse(JSON.stringify(contacts)), userId }
   }
}