const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie tittle must be a string',
    required_error: 'Movie title is required.'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string().url({
    message: 'poster must be a valid URL'
  }),
  genre: z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']), {
    required_error: 'Movie genre si required.',
    invalid_type_error: 'Movie genre must be an array of enum Genre'
  })
})
function validMovie (object) {
  return movieSchema.safeParse(object)
}
function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}
module.exports = {
  validMovie,
  validatePartialMovie
}
