import { models, model, Schema } from "mongoose"

const userSchema = new Schema({
   firstName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 15,
      required: true
   },
   lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 15,
      required: true
   },
   email: {
      type: String,
      unique: true,
      required: true
   },
   password: {
      type: String,
      required: true,
      minLength: 8,
   },
   role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
   }
})

const User = models.User || model("User", userSchema)

export default User