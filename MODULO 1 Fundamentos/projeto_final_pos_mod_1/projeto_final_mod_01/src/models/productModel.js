import { db } from "../config/dbConnect.js";
import { initDB } from "../config/dbConnect.js";
initDB()

export async function createProduc({ name, value, description }) {
  const sqlInsert = `insert into produtos (nome, valor, descricao) values ($1, $2, $3)`
  return await db.query(sqlInsert, [name.toUpperCase().trim(), Number(value), description])
}

export async function allProductsModel() {
  const sqlAllProducts = `select * from produtos`
  return await db.query(sqlAllProducts)
}

export async function countProductsModel() {
  const slqCount = `select count(*) as total from produtos`
  return await db.query(slqCount)
}
export async function findProductById(id) {
  const slqCount = `select * from produtos where id = $1`
  return await db.query(slqCount, [id])
}

export async function findProductByName(name) {
  const sql = `select * from produtos where nome = $1`
  return await db.query(sql, [name])
}

export async function updateProductModel(id, data) {
  const fields = []
  const values = []

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${mapFieldName(key)} = $${fields.length + 1}`)
    values.push(value)
  })

  values.push(id)

  const sql = `update produtos set ${fields.join(', ')} where id = $${values.length} returning *`

  return await db.query(sql, values)
}

export async function deleteProductModel(id) {
  const sql = `delete from produtos where id = $1 returning *`
  return await db.query(sql, [id])
}

function mapFieldName(key) {
  const fields = {
    nome: 'nome',
    descricao: 'descricao',
    valor: 'valor'
  }

  return fields[key] || key
}