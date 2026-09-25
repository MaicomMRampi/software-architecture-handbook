import express from 'express'
import {
  createProduct,
  allProducts,
  countProducts,
  getProductId,
  getProductName,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js'

const router = express.Router()

router.post('/product', createProduct)
router.get('/product/name/:name', getProductName)
router.get('/product/:id', getProductId)
router.put('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)

router.get('/allProducts', allProducts)
router.get('/countProducts', countProducts)

export default router



/* 
    CRUD: Criação (Create), Leitura (Read), Atualização (Update) e Exclusão
    (Delete).
    ▪ Contagem: Endpoint para retornar o número total de registros.
    ▪ Find All: Endpoint para retornar todos os registros. >>>>>>>>>>>>>>>>>>>>>>>>>>>>> ok 
    ▪ Find By ID: Endpoint para retornar um registro específico com base no
    ID.
    ▪ Find By Name: Endpoint para retornar registros que correspondam a
    um nome específico.
*/