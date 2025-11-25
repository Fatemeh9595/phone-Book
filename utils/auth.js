import { verify } from "jsonwebtoken"

export default function validatToken(context) {
   // get token from request header
   const { token } = context.req.cookies

   // check token exist
   if (!token) {
      return false
   }

   // verify token
   try {
      const payload = verify(token, process.env.JWT_SECRET)
      return payload
   } catch (error) {
      return false
   }
}