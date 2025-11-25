import Contact from "@/models/Contact"
import connectDB from "@/utils/connectDB"
import generateFilter from "@/utils/generateFilter"

export default async function handler(req, res) {
   await connectDB()

   if (req.method == "GET") {
      getHandler(req, res)
   } else if (req.method == "POST") {
      postHandler(req, res)
   } else {
      res.status(405).json({ message: "method not allowed" })
   }
}

async function getHandler(req, res) {
   const { gen, search, userId } = req.query
   const filter = generateFilter({ gen, search }, userId)
   const contacts = await Contact.find(filter)
   res.status(200).json(contacts)
}

async function postHandler(req, res) {
   try {
      await Contact.create(req.body)
      res.status(201).json({ message: "new contact added to db" })
   } catch (error) {
      if (error.name == "ValidationError") {
         let errorMessage = ""
         Object.values(error.errors).map((error) => (errorMessage += error.message + "\n"))
         return res.status(422).json({ message: errorMessage })
      }

      res.status(500).json({ message: "server error" })
   }
}

// localhost:port/api/contacts