export default function generateFilter({ gen, search }, userId) {
   const filter = { userId }
   if (gen == "male" || gen == "female") {
      filter.gender = gen
   }
   if (search) {
      filter.$or = [{ firstName: search }, { lastName: search }]
   }
   return filter
}