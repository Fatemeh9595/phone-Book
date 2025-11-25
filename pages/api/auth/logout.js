import { serialize } from "cookie"

export default async function handler(req, res) {
   if (req.method != "GET") {
      return res.status(405).json({ message: "Method Not Allowed" })
   }

   try {
      res.setHeader(
         "Set-Cookie",
         serialize("token", "", {
            httpOnly: true, //XSS
            path: "/",
            maxAge: 0,
            sameSite: "strict" //CSRF
         })
      )
      return res.status(200).json({ message: "User Logged Out Successfully" })
   } catch (error) {
      res.status(500).json({ message: "server error" })
   }
}

// localhost:port/api/auth/logout