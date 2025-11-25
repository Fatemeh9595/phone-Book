import { verify } from "jsonwebtoken"

export default async function handler(req, res) {
   if (req.method != "GET") {
      return res.status(405).json({ message: "Method Not Allowed" })
   }

   const { token } = req.cookies

   if (!token) {
      return res.status(401).json({ message: "unauthorized" })
   }

   //verify token
   try {
      verify(token, process.env.JWT_SECRET)
      return res.status(200).json({ message: "authenticated" })
   } catch (error) {
      return res.status(401).json({ message: "unauthorized" })
   }
}

// localhost:port/api/auth/status