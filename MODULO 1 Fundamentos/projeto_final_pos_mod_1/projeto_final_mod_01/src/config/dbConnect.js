import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
export const db = new Pool({
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
})

db.connect((err) => {
  if (err) {
    console.log('Erro ao conectar ao banco de dados', err)
  } else {
    console.log('Connectado ao banco de dados com sucesso')
  }
})

export async function initDB() {
  const sql = `
    CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL unique,
      descricao TEXT NOT NULL,
      valor NUMERIC(10, 2) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(sql);
  console.log("tabela de produtos criada com sucesso");
}