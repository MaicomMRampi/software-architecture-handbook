# 🧅 Arquiteturas em Camadas: Hexagonal, Onion e Clean

> **Módulo 03 · Design Patterns** — Arquiteturas que protegem as regras de negócio da infraestrutura por meio da inversão de dependência.

As arquiteturas em camadas são formas de organizar uma aplicação separando suas responsabilidades.

A ideia principal é evitar que tudo fique misturado.

Por exemplo, em uma API podemos ter:

```text
Requisição HTTP
      ↓
Controller
      ↓
Regra de negócio
      ↓
Banco de dados
```

Cada parte possui uma responsabilidade diferente.

Com o crescimento da aplicação, porém, simplesmente separar em camadas pode não ser suficiente. É aí que surgem arquiteturas como:

* **Arquitetura Hexagonal**
* **Onion Architecture**
* **Clean Architecture**

Apesar de possuírem nomes e estruturas diferentes, todas têm uma preocupação em comum:

> **Proteger as regras de negócio das partes externas da aplicação.**

---

# Arquitetura Hexagonal

A Arquitetura Hexagonal também é conhecida como **Ports and Adapters (Portas e Adaptadores)**.

A ideia foi proposta por Alistair Cockburn.

O principal objetivo é fazer com que a regra de negócio não dependa diretamente de coisas externas, como:

* banco de dados;
* API externa;
* framework;
* interface web;
* sistema de mensagens.

Podemos imaginar a aplicação assim:

```text
              API / HTTP
                  │
                  ↓
             ┌─────────┐
             │         │
 Banco ─────→│  REGRAS │←──── API externa
             │   DE    │
 Fila  ─────→│ NEGÓCIO │←──── CLI
             │         │
             └─────────┘
                  ↑
                  │
              Aplicação
```

O centro da aplicação contém as regras importantes.

As partes externas se conectam ao centro através de **portas e adaptadores**.

---

## O que são Portas?

Uma porta define **como a aplicação espera conversar com alguma coisa**.

Por exemplo, podemos definir que nossa aplicação precisa de um repositório de usuários:

```js
const userRepository = {
    findById: async (id) => {},
    save: async (user) => {}
}
```

A regra de negócio não precisa saber se os dados estão sendo armazenados no PostgreSQL, MongoDB ou outro banco.

Ela apenas sabe que existe uma forma de:

```text
buscar usuário
salvar usuário
```

Essa é a ideia da porta.

---

## O que são Adaptadores?

O adaptador é responsável por conectar uma tecnologia externa à porta esperada pela aplicação.

Por exemplo:

```text
Aplicação
    ↓
Porta
    ↓
Adapter PostgreSQL
    ↓
PostgreSQL
```

Se amanhã trocarmos PostgreSQL por outro banco, podemos criar outro adaptador.

A regra de negócio não precisa ser modificada.

---

## Exemplo simples

Imagine uma aplicação que precisa salvar usuários.

A regra de negócio pode receber o repositório como dependência:

```js
const createUserService = ({ userRepository }) => {

    const create = async (user) => {
        if (!user.email) {
            throw new Error("E-mail obrigatório")
        }

        return userRepository.save(user)
    }

    return {
        create
    }
}
```

O serviço não sabe como o usuário será salvo.

Podemos ter um adaptador PostgreSQL:

```js
const createUserRepository = ({ db }) => ({
    save: async (user) => {
        return db.query(
            `
            INSERT INTO users (name, email)
            VALUES ($1, $2)
            RETURNING *
            `,
            [user.name, user.email]
        )
    }
})
```

A regra de negócio continua independente do PostgreSQL.

### Entendendo de forma simples

A arquitetura hexagonal tenta fazer com que:

> **O negócio fique no centro e as tecnologias externas fiquem ao redor.**

---

# Onion Architecture

A **Onion Architecture** foi proposta por Jeffrey Palermo.

Ela possui uma ideia bastante parecida com a Arquitetura Hexagonal:

> **As regras de negócio devem ficar no centro e não devem depender das partes externas.**

O nome "Onion" vem justamente da representação em camadas, como uma cebola:

```text
┌─────────────────────────────────────┐
│       Infraestrutura / UI           │
│  ┌───────────────────────────────┐  │
│  │      Aplicação                │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │       Domínio           │  │  │
│  │  │                         │  │  │
│  │  │     Regras de negócio   │  │  │
│  │  │                         │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

Quanto mais para o centro, mais importante e mais estável é a aplicação.

---

## Camada de Domínio

É o coração da aplicação.

Aqui ficam as regras mais importantes do negócio.

Por exemplo:

```js
const calculateDiscount = (customer) => {
    if (customer.type === "premium") {
        return 0.20
    }

    return 0
}
```

Essa regra não deveria depender de:

* Express;
* PostgreSQL;
* React;
* RabbitMQ;
* HTTP.

Ela representa uma regra do negócio.

---

## Camada de Aplicação

A camada de aplicação coordena os casos de uso.

Por exemplo:

```text
Criar pedido
Cancelar pedido
Finalizar pedido
Consultar pedido
```

Um caso de uso pode utilizar regras do domínio:

```js
const createOrder = ({ orderRepository }) => {

    const execute = async (order) => {
        const discount = calculateDiscount(order.customer)

        const finalValue =
            order.total * (1 - discount)

        return orderRepository.save({
            ...order,
            total: finalValue
        })
    }

    return {
        execute
    }
}
```

---

## Camada de Infraestrutura

É onde ficam as tecnologias utilizadas pela aplicação.

Por exemplo:

```text
PostgreSQL
Redis
RabbitMQ
Express
APIs externas
Arquivos
Serviços de terceiros
```

Essas tecnologias ficam mais próximas da parte externa da arquitetura.

### Entendendo de forma simples

Imagine uma cebola.

O centro é o mais importante.

As camadas externas envolvem o centro.

Na Onion Architecture:

```text
Centro
 ↓
Domínio
 ↓
Aplicação
 ↓
Infraestrutura
```

A regra principal é:

> **As dependências devem apontar para dentro.**

---

# Clean Architecture

A **Clean Architecture**, proposta por Robert C. Martin (Uncle Bob), também segue essa mesma ideia de proteger as regras de negócio.

Ela organiza o sistema em diferentes níveis de responsabilidade.

Uma representação comum é:

```text
┌─────────────────────────────────────┐
│        Frameworks / Drivers         │
│  ┌───────────────────────────────┐  │
│  │       Interface Adapters      │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │    Application          │  │  │
│  │  │    Business Rules       │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │      Entities     │  │  │  │
│  │  │  │                   │  │  │  │
│  │  │  │  Regras de negócio│  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

Quanto mais para o centro:

* menos dependências externas;
* mais importante para o negócio;
* mais estável deve ser o código.

---

## Entities

As Entities representam as regras mais importantes do negócio.

Por exemplo:

```js
const calculateFinalPrice = (product, quantity) => {

    if (quantity >= 10) {
        return product.price * 0.90
    }

    return product.price * quantity
}
```

Essa regra não precisa saber:

* quem chamou;
* qual banco está sendo utilizado;
* qual framework está sendo usado;
* se a aplicação é web ou mobile.

---

## Use Cases

Os Use Cases representam **o que a aplicação faz**.

Por exemplo:

```text
Cadastrar usuário
Criar pedido
Cancelar pedido
Gerar relatório
Calcular comissão
```

Um exemplo:

```js
const createOrder = ({
    orderRepository,
    paymentService
}) => {

    const execute = async (order) => {

        if (!order.items.length) {
            throw new Error("Pedido sem itens")
        }

        const savedOrder =
            await orderRepository.save(order)

        await paymentService.charge(
            savedOrder.total
        )

        return savedOrder
    }

    return {
        execute
    }
}
```

O Use Case coordena o processo, mas não precisa conhecer detalhes de implementação do banco ou do serviço de pagamento.

---

# Interface Adapters

Essa parte transforma informações entre o mundo externo e o formato que a aplicação entende.

Por exemplo:

```text
HTTP Request
     ↓
Controller
     ↓
Use Case
     ↓
Repository
```

O Controller recebe uma requisição HTTP e transforma os dados para o formato esperado pelo Use Case.

Depois, transforma o resultado em uma resposta HTTP.

---

# Frameworks e Infraestrutura

É a parte mais externa.

Aqui podem estar:

```text
Express
Next.js
PostgreSQL
RabbitMQ
Redis
Docker
APIs externas
```

Essas tecnologias podem mudar sem que as regras principais da aplicação precisem ser reescritas.

---

# Regra de Dependência

Um dos conceitos mais importantes da Clean Architecture é:

> **As dependências devem apontar para dentro.**

Por exemplo:

```text
PostgreSQL
     ↓
Repository
     ↓
Use Case
     ↓
Domain
```

O domínio não deveria depender diretamente do PostgreSQL.

O contrário é permitido:

```text
Infraestrutura → Aplicação → Domínio
```

Mas não:

```text
Domínio → PostgreSQL
```

---

# Hexagonal x Onion x Clean

Essas arquiteturas são bastante parecidas e é comum confundi-las.

Todas possuem uma preocupação central:

> **Proteger o núcleo da aplicação das tecnologias externas.**

Podemos comparar de forma simples:

| Arquitetura   | Principal ideia                                       |
| ------------- | ----------------------------------------------------- |
| **Hexagonal** | Portas e adaptadores ao redor do negócio              |
| **Onion**     | Camadas concêntricas com o domínio no centro          |
| **Clean**     | Separação de responsabilidades e regra de dependência |

Visualmente:

```text
Hexagonal

        Adapter
           ↓
      ┌─────────┐
      │ Negócio │
      └─────────┘
           ↑
        Adapter
```

```text
Onion

┌───────────────────┐
│ Infraestrutura    │
│  ┌─────────────┐  │
│  │ Aplicação   │  │
│  │  ┌───────┐  │  │
│  │  │Domínio│  │  │
│  │  └───────┘  │  │
│  └─────────────┘  │
└───────────────────┘
```

```text
Clean Architecture

Frameworks
    ↓
Adapters
    ↓
Use Cases
    ↓
Entities
```

Apesar das representações diferentes, a ideia é muito semelhante.

---

# O ponto mais importante

Essas arquiteturas não existem simplesmente para criar mais pastas no projeto.

O objetivo é **controlar as dependências**.

Uma aplicação pode ter:

```text
Next.js
Node.js
PostgreSQL
RabbitMQ
Redis
```

Mas nenhuma dessas tecnologias deveria ser mais importante do que as regras do negócio.

Se amanhã trocarmos:

```text
PostgreSQL → MongoDB
RabbitMQ → Kafka
Express → Fastify
```

não deveríamos precisar reescrever toda a lógica da aplicação.

A arquitetura busca justamente facilitar esse tipo de mudança.

---

# Uma forma simples de entender

Imagine uma empresa.

```text
                EMPRESA
                   │
            ┌──────┴──────┐
            │             │
        Negócio       Tecnologia
            │             │
       Regras        Banco / API
       Processos      Framework
       Decisões       Mensageria
```

A empresa continua existindo mesmo se trocar o banco de dados ou o sistema utilizado.

Da mesma forma, uma aplicação bem estruturada deve conseguir trocar algumas tecnologias externas sem precisar mudar suas regras fundamentais.

> **O negócio deve ser mais importante do que a tecnologia utilizada para executá-lo.**

Essa é uma das ideias fundamentais por trás da Arquitetura Hexagonal, Onion Architecture e Clean Architecture.

---

## Estrutura de pastas de exemplo (Clean / Hexagonal em Node.js)

```text
src/
├── domain/                 # entidades e regras puras (sem dependências externas)
│   ├── entities/Pedido.ts
│   └── ports/PedidoRepository.ts      ← porta (interface)
├── application/            # casos de uso
│   └── use-cases/CriarPedido.ts
├── infra/                  # adaptadores de saída
│   ├── database/PrismaPedidoRepository.ts   ← implementa a porta
│   └── payment/StripeGateway.ts
└── interfaces/             # adaptadores de entrada
    └── http/PedidoController.ts
```

```ts
// application/use-cases/CriarPedido.ts — depende só da porta
export class CriarPedido {
  constructor(private repo: PedidoRepository) {}
  async executar(dados: NovoPedidoDTO) {
    const pedido = Pedido.criar(dados);   // regra de negócio no domínio
    await this.repo.salvar(pedido);
    return pedido;
  }
}
```

### Relação com DDD

Essas arquiteturas combinam bem com **Domain-Driven Design**: entidades, *value objects*, agregados e serviços de domínio ficam no centro; repositórios são portas; *bounded contexts* delimitam módulos ou microsserviços.

### Quando **não** usar

Para CRUDs simples ou protótipos, o custo de interfaces, DTOs e mapeamentos pode ser maior que o benefício. Uma arquitetura em camadas tradicional é suficiente.

---

## ✅ Pontos-chave

- Objetivo comum: **proteger o domínio** de frameworks, bancos e APIs externas.
- **Hexagonal:** portas (interfaces) e adaptadores (implementações), entrada e saída.
- **Onion:** camadas concêntricas — domínio no centro, infraestrutura fora.
- **Clean:** Entities → Use Cases → Interface Adapters → Frameworks.
- **Regra de dependência:** as dependências sempre apontam **para dentro** (DIP).

## ❓ Perguntas de revisão

<details><summary>1. O que é a regra de dependência da Clean Architecture?</summary>
O código das camadas internas não pode conhecer nada das externas; dependências de código-fonte só apontam para dentro, em direção às regras de negócio.
</details>

<details><summary>2. O que são portas e adaptadores?</summary>
Portas são interfaces definidas pelo núcleo da aplicação (ex.: PedidoRepository); adaptadores são implementações concretas que conectam o núcleo ao mundo externo (ex.: repositório Prisma, controller HTTP).
</details>

<details><summary>3. Qual princípio SOLID sustenta essas arquiteturas?</summary>
Dependency Inversion Principle (DIP).
</details>

<details><summary>4. Qual o benefício para testes?</summary>
Os casos de uso podem ser testados com implementações falsas das portas (em memória), sem banco, rede ou framework.
</details>

<details><summary>5. Quando essas arquiteturas podem ser exagero?</summary>
Em CRUDs simples, protótipos e MVPs com pouca regra de negócio, onde as abstrações custam mais do que protegem.
</details>

## 🔗 Relacionadas

- [Princípios SOLID (DIP)](../01%20Fundamentos%20em%20arquitetura%20de%20software/02%20Principios%20Solid.md)
- [04 GoF estruturais (Adapter)](04%20GoF%20padroes%20estruturais.md)
- [06 MVC, MVP, MVVM](06%20Padr%C3%B5es%20Arquiteturais.md)

## 📚 Referências

- COCKBURN, A. *Hexagonal Architecture*, 2005. https://alistair.cockburn.us/hexagonal-architecture/
- PALERMO, J. *The Onion Architecture*, 2008.
- MARTIN, R. C. *Arquitetura Limpa*. Alta Books, 2019.
- EVANS, E. *Domain-Driven Design*. Alta Books, 2016.
