import express from 'express'
import productRoute from './src/routes/productsRoute.js'

const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(productRoute)

app.listen(port, () => {
    console.log('Servidor rodando na porta', port)
})