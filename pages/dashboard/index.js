import User from "@/models/User"
import connectDB from "@/utils/connectDB"
import styles from "@/styles/Dashboard.module.css"
import validatToken from "@/utils/auth"

export default function Dashboard({ user }) {
   return (
      <div className={styles.container}>
         <h1>
            Hi {user.firstName} {user.lastName}
         </h1>
         <h2>Welocme To Dashboard</h2>
      </div>
   )
}
// localhost:port/dashboard

export async function getServerSideProps(context) {
   const payload = validatToken(context)
   if (!payload) {
      return { redirect: { destination: "/auth/login" } }
   }

   // get user info from database
   await connectDB()
   const user = await User.findOne({ email: payload.email }).select("firstName lastName -_id")

   return {
      props: {
         user: JSON.parse(JSON.stringify(user))
      }
   }
}