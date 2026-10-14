# API REST

Quando diferentes sistemas precisam trocar informações, uma das formas mais comuns de fazer isso atualmente é através de uma **API REST**.

REST significa **Representational State Transfer**.

Apesar do nome parecer complicado, a ideia é simples:

> **Uma API REST permite que sistemas se comuniquem através de requisições HTTP, seguindo algumas convenções.**

Por exemplo, imagine um sistema de vendas que precisa consultar os clientes de outro sistema:

```text
Sistema de Vendas
       |
       | HTTP
       v
    API REST
       |
       v
Banco de Dados
```

O sistema de vendas faz uma requisição e a API responde com os dados.

---

## O que é uma API?

**API** significa **Application Programming Interface**.

Uma API funciona como um **ponto de comunicação** entre aplicações.

Imagine um sistema de clientes que possui:

```text
Cadastrar cliente
Consultar cliente
Atualizar cliente
Excluir cliente
```

Outro sistema não precisa acessar diretamente o banco de dados.

Ele pode conversar com a API:

```text
Sistema A
   |
   | Requisição
   v
API de Clientes
   |
   v
Sistema de Clientes
```

Isso cria uma separação entre os sistemas.

---

# Como funciona uma API REST?

Uma API REST normalmente utiliza o protocolo **HTTP**.

As operações são representadas principalmente pelos métodos HTTP:

| Método   | Objetivo                        |
| -------- | ------------------------------- |
| `GET`    | Consultar dados                 |
| `POST`   | Criar dados                     |
| `PUT`    | Atualizar um recurso            |
| `PATCH`  | Alterar parcialmente um recurso |
| `DELETE` | Excluir um recurso              |

Por exemplo, uma API de clientes poderia possuir:

```text
GET    /clientes
GET    /clientes/10
POST   /clientes
PUT    /clientes/10
DELETE /clientes/10
```

Essas rotas representam **recursos**.

Nesse caso, o recurso principal é:

```text
/clientes
```

---

# Exemplo prático

Imagine uma API feita com Node.js e Express:

```js
app.get('/clientes/:id', async (req, res) => {
  const cliente = await buscarCliente(req.params.id)

  return res.json(cliente)
})
```

Quando alguém fizer:

```text
GET /clientes/10
```

A API pode responder:

```json
{
  "id": 10,
  "nome": "João",
  "email": "joao@email.com"
}
```

O sistema que fez a requisição recebe os dados e pode utilizá-los.

---

# API REST utiliza JSON?

É muito comum APIs REST utilizarem **JSON** para transportar informações.

Por exemplo:

```json
{
  "nome": "João",
  "email": "joao@email.com"
}
```

Mas REST não significa obrigatoriamente JSON.

O REST é um estilo arquitetural.

O JSON é apenas um formato muito utilizado para representar os dados.

---

# Status HTTP

A API também utiliza **status codes** para informar o resultado da requisição.

Alguns dos principais são:

| Código | Significado                       |
| ------ | --------------------------------- |
| `200`  | Requisição realizada com sucesso  |
| `201`  | Recurso criado                    |
| `204`  | Sucesso, sem conteúdo na resposta |
| `400`  | Requisição inválida               |
| `401`  | Não autenticado                   |
| `403`  | Sem permissão                     |
| `404`  | Recurso não encontrado            |
| `409`  | Conflito                          |
| `500`  | Erro interno do servidor          |

Por exemplo:

```js
return res.status(404).json({
  message: 'Cliente não encontrado'
})
```

O cliente recebe:

```text
404 Not Found
```

---

# API REST e recursos

Uma característica importante é pensar em **recursos**, e não em ações.

Por exemplo, em vez de criar:

```text
POST /cadastrarCliente
POST /buscarCliente
POST /deletarCliente
```

Uma API REST normalmente utiliza:

```text
POST   /clientes
GET    /clientes
DELETE /clientes/10
```

O método HTTP ajuda a indicar a operação.

```text
POST   /clientes       → criar
GET    /clientes       → consultar
PUT    /clientes/10    → atualizar
DELETE /clientes/10    → excluir
```

Isso deixa a API mais padronizada e previsível.

---

# Path Parameters

Podemos utilizar informações na própria URL.

Exemplo:

```text
GET /clientes/10
```

Nesse caso:

```text
10
```

é o identificador do cliente.

No Express:

```js
app.get('/clientes/:id', (req, res) => {
  const { id } = req.params

  return res.json({
    clienteId: id
  })
})
```

---

# Query Parameters

Também podemos enviar informações através da query string.

Exemplo:

```text
GET /clientes?cidade=Chapeco
```

Nesse caso:

```js
const { cidade } = req.query
```

Podemos utilizar query parameters para:

* filtros;
* paginação;
* ordenação;
* pesquisas.

Por exemplo:

```text
GET /clientes?cidade=Chapeco&page=2&limit=20
```

---

# Body

Quando precisamos enviar informações para a API, podemos utilizar o **body** da requisição.

Por exemplo:

```text
POST /clientes
```

Com:

```json
{
  "nome": "João",
  "email": "joao@email.com"
}
```

No Express:

```js
app.post('/clientes', async (req, res) => {
  const { nome, email } = req.body

  const cliente = await criarCliente({
    nome,
    email
  })

  return res.status(201).json(cliente)
})
```

---

# API REST e autenticação

Uma API pode exigir autenticação para permitir o acesso aos seus recursos.

Um exemplo bastante comum é utilizar um token:

```text
Sistema A
    |
    | Authorization: Bearer TOKEN
    v
API REST
    |
    v
Validação
    |
    v
Recurso
```

Por exemplo:

```text
Authorization: Bearer eyJhbGciOi...
```

A API verifica o token antes de permitir o acesso.

Existem diferentes formas de autenticação, como:

* JWT;
* OAuth 2.0;
* API Keys;
* sessões.

---

# Stateless

Uma característica importante do REST é o conceito de **stateless**.

Significa que cada requisição deve possuir as informações necessárias para que o servidor consiga processá-la.

Por exemplo:

```text
Requisição 1
GET /clientes/10
Authorization: Bearer TOKEN
```

Depois:

```text
Requisição 2
GET /clientes/20
Authorization: Bearer TOKEN
```

O servidor não deve depender de informações temporárias armazenadas de uma requisição anterior para entender a próxima.

Isso facilita a distribuição da aplicação.

Por exemplo:

```text
             Load Balancer
              /         \
             v           v
         API 1         API 2
```

Uma requisição pode chegar na API 1 e outra na API 2 sem depender de uma sessão local específica.

---

# API REST dentro de sistemas distribuídos

É aqui que a API REST se conecta diretamente com o assunto de **arquitetura de sistemas distribuídos**.

Imagine:

```text
                    API REST
                       |
          +------------+------------+
          |            |            |
          v            v            v
      Clientes      Pedidos      Estoque
       Service       Service      Service
```

Cada serviço pode disponibilizar APIs para que outros sistemas consumam suas funcionalidades.

Por exemplo:

```text
Sistema de Vendas
       |
       | POST /pedidos
       v
Serviço de Pedidos
       |
       | GET /clientes/10
       v
Serviço de Clientes
```

Assim, diferentes partes do sistema conseguem se comunicar.

---

# REST x SOAP

REST e SOAP são formas diferentes de comunicação entre sistemas.

| REST                        | SOAP                                                     |
| --------------------------- | -------------------------------------------------------- |
| Estilo arquitetural         | Protocolo                                                |
| Normalmente utiliza HTTP    | Pode utilizar diferentes protocolos                      |
| Muito comum com JSON        | Tradicionalmente utiliza XML                             |
| Geralmente mais simples     | Possui especificações mais rígidas                       |
| Muito utilizado em APIs web | Muito utilizado em integrações corporativas tradicionais |

Um exemplo REST:

```http
GET /clientes/10
```

Resposta:

```json
{
  "id": 10,
  "nome": "João"
}
```

Um serviço SOAP normalmente trabalha com mensagens XML estruturadas.

---

# REST x EAI x SOA x ESB

Esses conceitos podem aparecer juntos, mas não significam a mesma coisa.

```text
EAI
↓
Problema de integração entre sistemas

SOA
↓
Organização das funcionalidades em serviços

ESB
↓
Intermediação da comunicação entre serviços

REST
↓
Uma forma de disponibilizar e consumir APIs através de princípios REST
```

Por exemplo:

```text
Sistema A
    |
    | HTTP / REST
    v
Serviço de Clientes
    |
    | HTTP / REST
    v
Serviço de Pedidos
```

Ou, em uma arquitetura que utilize ESB:

```text
Sistema A
    |
    | REST
    v
   ESB
    |
    | REST / SOAP / outro formato
    v
Sistema B
```

---

# Uma analogia simples

Imagine um restaurante.

O **cliente** é uma aplicação.

O **garçom** é a API.

A **cozinha** é o sistema que possui os dados e regras.

O cliente não entra na cozinha para pegar os dados diretamente.

Ele faz um pedido:

```text
Cliente
   |
   | "Quero o cliente 10"
   v
API
   |
   v
Sistema
```

A API recebe a solicitação, conversa com o sistema e devolve uma resposta.

---

# Resumo

**API**:

> Uma interface que permite que sistemas se comuniquem.

**REST**:

> Um estilo arquitetural para construir APIs utilizando conceitos e padrões da web.

**HTTP**:

> O protocolo normalmente utilizado para essa comunicação.

**JSON**:

> Um formato muito comum para transportar os dados.

Uma API REST pode ser visualizada assim:

```text
             REQUISIÇÃO
                  |
                  v
        +-------------------+
        |      API REST     |
        +-------------------+
                  |
                  v
          Regras de negócio
                  |
                  v
              Banco/API
                  |
                  v
             RESPOSTA
```

### Para guardar

```text
GET     → buscar
POST    → criar
PUT     → atualizar
PATCH   → alterar parte
DELETE  → excluir

200 → sucesso
201 → criado
400 → requisição inválida
401 → não autenticado
403 → sem permissão
404 → não encontrado
500 → erro no servidor
```

A ideia central é:

> **API REST cria uma forma padronizada para que aplicações possam acessar recursos e trocar informações através da web.**
