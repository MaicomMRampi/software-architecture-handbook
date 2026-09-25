import { db } from "../config/dbConnect.js"
import { createProduc, allProductsModel, countProductsModel, findProductById, findProductByName, updateProductModel, deleteProductModel } from "../models/productModel.js"

export async function createProductService({ name, description, value }) {
  try {
    if (value <= 0) return { code: 400, message: `O valor deve ser maior que zero` }
    if (name.length < 6) return { code: 400, message: `O name deve ter mais de 5 caracteres` }

    const response = await createProduc({ name, description, value })

    return { code: 200, message: `Produto criado com sucesso!` }
  } catch (error) {

    if (error.code === '23505') {

      return { code: 400, message: `Já existe o produto inserido` }
    }
    throw new Error(`Erro interno do servidor:${error?.message}`)
  }
}

export async function allProductsService() {
  try {
    const response = await allProductsModel()
    return response.rows
  } catch (error) {
    console.log(`Erro ao buscar todos produtos:${error?.message}`)
    throw new Error(`Erro interno do servidor:${error?.message}`)
  }
}

export async function countProductsService() {
  try {
    const response = await countProductsModel()
    return response.rows
  } catch (error) {
    console.log(`Erro ao contar os produtos:${error?.message}`)
    throw new Error(`Erro interno do servidor:${error?.message}`)
  }
}

export async function getProductIdService(id) {
  const productId = Number(id)

  if (!Number.isInteger(productId) || productId <= 0) {
    return { code: 400, message: 'Id do produto inválido' }
  }

  const product = await findProductById(productId)

  if (!product.rows || product.rows.length === 0) {
    return { code: 404, message: 'Nenhum produto encontrado para o ID informado.' }
  }

  return { code: 200, data: product.rows[0] }
}

export async function getProductNameService(name) {
  const productName = name.trim().toUpperCase()

  if (!productName) {
    return { code: 400, message: 'Nome do produto é obrigatório' }
  }

  const product = await findProductByName(productName)

  if (!product.rows || product.rows.length === 0) {
    return { code: 404, message: 'Nenhum produto encontrado com o nome informado.' }
  }

  return { code: 200, data: product.rows, message: 'Produtos encontrados com sucesso.' }
}

export async function updateProductService(id, { name, description, value }) {
  const productId = Number(id)

  if (!Number.isInteger(productId) || productId <= 0) {
    return { code: 400, message: 'Id do produto inválido' }
  }

  const product = await findProductById(productId)

  if (!product.rows || product.rows.length === 0) {
    return { code: 404, message: 'Nenhum produto encontrado para o ID informado.' }
  }

  const updateData = {}

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 6) {
      return { code: 400, message: 'O nome deve ter mais de 5 caracteres' }
    }
    updateData.nome = name.trim().toUpperCase()
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim() === '') {
      return { code: 400, message: 'A descrição é obrigatória' }
    }
    updateData.descricao = description.trim()
  }

  if (value !== undefined) {
    const numericValue = Number(value)

    if (Number.isNaN(numericValue) || numericValue <= 0) {
      return { code: 400, message: 'O valor deve ser maior que zero' }
    }

    updateData.valor = numericValue
  }

  if (Object.keys(updateData).length === 0) {
    return { code: 400, message: 'Nenhum dado válido foi informado para atualização' }
  }

  const updatedProduct = await updateProductModel(productId, updateData)

  return { code: 200, message: 'Produto atualizado com sucesso!', data: updatedProduct.rows[0] }
}

export async function deleteProductService(id) {
  const productId = Number(id)

  if (!Number.isInteger(productId) || productId <= 0) {
    return { code: 400, message: 'Id do produto inválido' }
  }

  const product = await findProductById(productId)

  if (!product.rows || product.rows.length === 0) {
    return { code: 404, message: 'Nenhum produto encontrado para o ID informado.' }
  }

  const deletedProduct = await deleteProductModel(productId)

  return { code: 200, message: 'Produto excluído com sucesso!', data: deletedProduct.rows[0] }
}