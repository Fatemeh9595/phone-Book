import User from "@/models/User"
import connectDB from "@/utils/connectDB"
import bcrypt from "bcrypt"

export default async function handler(req, res) {
   // check method
   if (req.method != "POST") {
      return res.status(405).json({ message: "Method Not Allowed" })
   }

   try {
      //simple validation
      const { firstName, lastName, email, password } = req.body
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
         return res.status(422).json({ message: "All Fields are required" })
      }
      if (password.length < 8 || password.length > 20) {
         return res
            .status(422)
            .json({ message: "password length must be betweeb 8 and 20 character" })
      }
      const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      if (!regexEmail.test(email)) {
         return res.status(422).json({ message: "email invalid" })
      }

      //connect to db
      await connectDB()

      //check email exist
      const isUserExist = await User.findOne({ email })
      if (isUserExist) {
         return res.status(409).json({ message: "email is already in use" })
      }

      //hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      const countUsers = await User.countDocuments()

      //register
      await User.create({
         ...req.body,
         password: hashedPassword,
         role: countUsers > 0 ? "user" : "admin"
      })
      res.status(201).json({ message: "User Registered successfully" })
   } catch (err) {
      res.status(500).json({ message: "server error" })
   }
}
// localhost:port/api/auth/register