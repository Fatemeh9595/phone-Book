import mongoose, { models, model, Schema } from "mongoose"

const contactSchema = new Schema({
   firstName: {
      type: String,
      trim: true,
      minLength: [3 , 'نام باید حداقل 3 کاراکتر باشه'],
      maxLength: [15 , 'نام باید حداکثر 15 کاراکتر باشه']
   },
   lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 15
   },
   age: {
      type: Number,
      min : [18 , 'سن باید بیشتر از 18 باشه']
   },
   gender: {
      type: String
   },
   phone: {
      type: String,
      trim: true,
      maxLength: [11 , 'شماره تلفن نباید بیشتر از 11 رقم باشه'],
      match: [/09\d{9}/ , 'شماره تلفن باید با 09 بشه و شامل 11 رقم باشه']
   },
   favorite : {
      type : Boolean,
      default : false
   },
   userId : {
      type : mongoose.Types.ObjectId,
      ref : 'User'
   }
})

const Contact = models.Contact || model("Contact", contactSchema)

export default Contact