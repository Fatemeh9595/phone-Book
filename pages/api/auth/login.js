import User from "@/models/User"
import connectDB from "@/utils/connectDB"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { serialize } from "cookie"

export default async function handler(req, res) {
   // check method
   if (req.method != "POST") {
      return res.status(405).json({ message: "Method Not Allowed" })
   }

   try {
      //simple validation
      const { email, password } = req.body
      if (!email.trim() || !password.trim()) {
         return res.status(422).json({ message: "All Fields are required" })
      }
      const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      if (!regexEmail.test(email)) {
         return res.status(422).json({ message: "email invalid" })
      }

      //connect to db
      await connectDB()

      //check email exist
      const user = await User.findOne({ email })
      if (!user) {
         return res.status(401).json({ message: "email or password invalid" })
      }

      //compare password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
         return res.status(401).json({ message: "email or password invalid" })
      }

      //generate token
      const token = jwt.sign({ email: user.email, userId : user._id , role: user.role }, process.env.JWT_SECRET, {
         expiresIn: "2h"
      })

      //set cookie
      res.setHeader(
         "Set-Cookie",
         serialize("token", token, {
            httpOnly: true, //XSS
            path: "/",
            maxAge: 60 * 60 * 2,
            sameSite: "strict" //CSRF
         })
      )

      res.status(200).json({ message: "User Login successfully", token })
   } catch (err) {
      res.status(500).json({ message: "server error" })
   }
}
// localhost:port/api/auth/register