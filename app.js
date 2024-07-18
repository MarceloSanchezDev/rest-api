const express = require('express')
const { validMovie, validatePartialMovie } = require('./eschema.js')
const cors = require('cors')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT ?? 3000
// todos los recursos que sean MOVIES se identifican con esta url
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filterMovies = movies.filter(movie => movie.genre.some(g => g.toLocaleLowerCase() === genre.toLocaleLowerCase()))
    return res.json(filterMovies)
  }
  res.json(movies)
})
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ mesagge: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validMovie(req.body)
  if (result.error) {
    return res.status(400).json({ mesagge: JSON.parse(result.error.message) })
  }

  const newMovie =
   {
     id: crypto.randomUUID(),
     ...req.body
   }
  movies.push(newMovie)
  res.status(201).json({ newMovie })
})
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ mesagge: 'movie not found' })
  }
  movies.splice(movieIndex, 1)
  return res.status(204).json({ mesagge: 'movie deleted' })
})
app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
