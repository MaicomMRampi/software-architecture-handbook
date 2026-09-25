# GraphQL

**GraphQL** é uma tecnologia para criação de APIs que permite que o cliente **informe exatamente quais dados deseja receber**.

A ideia principal é diferente de uma API REST tradicional.

Em uma API REST, normalmente temos várias rotas:

```text
GET /clientes/10
GET /clientes/10/pedidos
GET /clientes/10/endereco
```

No GraphQL, normalmente existe um único endpoint, por exemplo:

```text
POST /graphql
```

E o cliente informa na própria requisição quais informações deseja.

---

# Qual problema o GraphQL tenta resolver?

Imagine que precisamos mostrar uma tela com:

```text
Cliente
├── nome
├── email
└── pedidos
    ├── número
    └── valor
```

Em REST, poderíamos precisar fazer várias requisições:

```text
GET /clientes/10
GET /clientes/10/pedidos
```

Dependendo da API, também poderíamos receber **dados que não precisamos**.

Por exemplo:

```json
{
  "id": 10,
  "nome": "João",
  "email": "joao@email.com",
  "telefone": "...",
  "endereco": "...",
  "dataNascimento": "...",
  "documento": "..."
}
```

Mas a tela precisava apenas de:

```text
nome
email
```

O GraphQL permite solicitar somente os campos necessários.

---

# Como funciona?

O cliente envia uma consulta chamada **query**:

```graphql
query {
  cliente(id: 10) {
    nome
    email
  }
}
```

A API pode responder:

```json
{
  "data": {
    "cliente": {
      "nome": "João",
      "email": "joao@email.com"
    }
  }
}
```

Perceba que o cliente pediu:

```text
nome
email
```

E recebeu:

```text
nome
email
```

Isso é uma das principais ideias do GraphQL:

> **O cliente define a estrutura dos dados que deseja receber.**

---

# GraphQL x REST

Imagine que precisamos consultar um cliente e seus pedidos.

### REST

Poderíamos ter:

```text
GET /clientes/10
```

Resposta:

```json
{
  "id": 10,
  "nome": "João",
  "email": "joao@email.com"
}
```

Depois:

```text
GET /clientes/10/pedidos
```

Resposta:

```json
[
  {
    "id": 100,
    "valor": 250
  },
  {
    "id": 101,
    "valor": 300
  }
]
```

São duas requisições.

### GraphQL

Podemos solicitar tudo em uma consulta:

```graphql
query {
  cliente(id: 10) {
    nome
    email
    pedidos {
      id
      valor
    }
  }
}
```

Resposta:

```json
{
  "data": {
    "cliente": {
      "nome": "João",
      "email": "joao@email.com",
      "pedidos": [
        {
          "id": 100,
          "valor": 250
        },
        {
          "id": 101,
          "valor": 300
        }
      ]
    }
  }
}
```

---

# Schema

Uma parte importante do GraphQL é o **Schema**.

O schema define quais dados e operações a API disponibiliza.

Por exemplo:

```graphql
type Cliente {
  id: ID!
  nome: String!
  email: String!
}

type Query {
  cliente(id: ID!): Cliente
}
```

Podemos interpretar assim:

```text
Cliente possui:
    id
    nome
    email

A API permite:
    consultar um cliente
```

O `!` significa que aquele campo é obrigatório, ou seja, não pode ser `null`.

---

# Query

A **Query** é utilizada para consultar informações.

Exemplo:

```graphql
query {
  clientes {
    id
    nome
    email
  }
}
```

Podemos pedir apenas:

```graphql
query {
  clientes {
    nome
  }
}
```

Ou:

```graphql
query {
  clientes {
    nome
    email
  }
}
```

A API retorna de acordo com o que foi solicitado.

---

# Mutation

Quando queremos alterar dados, utilizamos uma **Mutation**.

Por exemplo:

```graphql
mutation {
  criarCliente(
    nome: "João"
    email: "joao@email.com"
  ) {
    id
    nome
    email
  }
}
```

O servidor pode responder:

```json
{
  "data": {
    "criarCliente": {
      "id": "10",
      "nome": "João",
      "email": "joao@email.com"
    }
  }
}
```

De forma simples:

```text
Query
↓
Consultar

Mutation
↓
Alterar dados
```

---

# Resolver

O **resolver** é a função responsável por executar a lógica necessária para retornar um campo ou operação.

Por exemplo:

```js
const resolvers = {
  Query: {
    cliente: async (_, { id }) => {
      return buscarCliente(id)
    }
  }
}
```

Quando o cliente faz:

```graphql
query {
  cliente(id: 10) {
    nome
    email
  }
}
```

O resolver:

```js
cliente: async (_, { id }) => {
  return buscarCliente(id)
}
```

é responsável por buscar os dados.

Podemos imaginar:

```text
Cliente
   |
   | Query
   v
GraphQL
   |
   v
Resolver
   |
   v
Regra de negócio
   |
   v
Banco de dados
```

---

# Uma característica interessante: relacionamentos

GraphQL funciona muito bem quando existem dados relacionados.

Imagine:

```text
Cliente
 ├── nome
 ├── email
 └── pedidos
      ├── número
      ├── valor
      └── produtos
```

Podemos solicitar tudo:

```graphql
query {
  cliente(id: 10) {
    nome
    email

    pedidos {
      numero
      valor

      produtos {
        nome
        quantidade
      }
    }
  }
}
```

A resposta segue praticamente a mesma estrutura:

```json
{
  "data": {
    "cliente": {
      "nome": "João",
      "email": "joao@email.com",
      "pedidos": [
        {
          "numero": 100,
          "valor": 500,
          "produtos": [
            {
              "nome": "Notebook",
              "quantidade": 1
            }
          ]
        }
      ]
    }
  }
}
```

Essa estrutura é uma das coisas que tornam o GraphQL interessante para aplicações com muitas relações entre dados.

---

# Overfetching e Underfetching

Dois problemas frequentemente associados a APIs são **overfetching** e **underfetching**.

## Overfetching

A API retorna mais informações do que o cliente precisa.

```text
Cliente precisa:

nome
email

API retorna:

nome
email
telefone
endereço
documento
pedidos
etc...
```

Existe excesso de dados.

---

## Underfetching

O cliente recebe poucos dados e precisa fazer outras requisições.

```text
1ª requisição
GET /cliente/10

2ª requisição
GET /cliente/10/pedidos

3ª requisição
GET /cliente/10/endereco
```

O GraphQL permite reduzir esses dois problemas em muitos cenários porque o cliente define os campos e relacionamentos que deseja buscar.

---

# GraphQL não substitui REST em qualquer situação

GraphQL e REST são abordagens diferentes para construção de APIs.

| REST                                      | GraphQL                                        |
| ----------------------------------------- | ---------------------------------------------- |
| Normalmente possui várias rotas           | Normalmente utiliza um endpoint                |
| Servidor define a estrutura das respostas | Cliente seleciona os campos                    |
| Fácil utilização com HTTP tradicional     | Possui linguagem própria de consulta           |
| Cache HTTP pode ser mais simples          | Cache pode exigir estratégias específicas      |
| Muito utilizado e conhecido               | Útil para dados complexos e variados           |
| Pode exigir várias requisições            | Pode buscar dados relacionados em uma consulta |

Não é uma questão de simplesmente trocar REST por GraphQL.

A escolha depende do sistema.

---

# GraphQL em sistemas distribuídos

GraphQL também pode ser utilizado como uma camada na frente de vários serviços.

Por exemplo:

```text
                    Frontend
                       |
                       v
                  GraphQL API
                       |
          +------------+------------+
          |            |            |
          v            v            v
    Serviço de     Serviço de    Serviço de
     Clientes       Pedidos       Produtos
```

O frontend conversa com o GraphQL.

O GraphQL pode buscar informações em diferentes serviços e montar uma resposta única.

Por exemplo:

```graphql
query {
  cliente(id: 10) {
    nome

    pedidos {
      numero
      valor

      produtos {
        nome
      }
    }
  }
}
```

Por trás dessa consulta podem existir várias chamadas:

```text
GraphQL
   |
   +----> Serviço de Clientes
   |
   +----> Serviço de Pedidos
   |
   +----> Serviço de Produtos
```

Para o frontend, tudo parece uma única consulta.

---

# Uma analogia simples

Imagine um restaurante.

### REST

Você faz pedidos separados:

```text
"Me traga o prato."

"Agora me traga a bebida."

"Agora me traga a sobremesa."
```

### GraphQL

Você entrega uma lista dizendo exatamente o que deseja:

```text
Quero:
- prato
- bebida
- sobremesa
```

O restaurante organiza o pedido e entrega tudo conforme solicitado.

A analogia não é perfeita, mas ajuda a lembrar da ideia principal:

> **No GraphQL, o cliente descreve os dados que deseja receber.**

---

# REST e GraphQL juntos

Não é necessário escolher uma única tecnologia para todo o sistema.

Podemos ter:

```text
                    Frontend
                       |
                       v
                  GraphQL API
                       |
              +--------+--------+
              |                 |
              v                 v
        API REST            Serviço
        existente           interno
```

Por exemplo, uma empresa pode ter APIs REST antigas e utilizar GraphQL como uma camada que organiza o acesso a essas APIs.

---

# Resumo

### API

> Interface que permite a comunicação entre sistemas.

### REST

> Estilo arquitetural muito utilizado para construir APIs através dos conceitos da web.

### GraphQL

> Tecnologia para APIs na qual o cliente especifica quais dados deseja receber.

### Query

> Consulta de dados.

### Mutation

> Alteração de dados.

### Schema

> Define os tipos, campos e operações disponíveis na API.

### Resolver

> Função que executa a lógica necessária para obter ou alterar os dados.

---

## Para guardar

```text
REST

Cliente
   |
   +----> GET /clientes/10
   |
   +----> GET /clientes/10/pedidos
   |
   +----> GET /clientes/10/endereco
```

```text
GraphQL

Cliente
   |
   | "Quero cliente + pedidos + endereço"
   v
GraphQL
   |
   v
Resposta personalizada
```

A ideia central é:

> **REST organiza a comunicação principalmente através de recursos e endpoints. GraphQL permite que o cliente descreva a estrutura dos dados que precisa.**
