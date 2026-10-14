# Padrões para Sistemas Distribuídos

Quando uma aplicação começa a crescer, é comum que ela deixe de ser um único sistema.

Podemos ter vários serviços trabalhando juntos:

```text
Sistema A
    ↓
Sistema B
    ↓
Sistema C
    ↓
Banco de dados
```

Também podemos ter serviços que precisam trocar informações por meio de mensagens.

É nesse cenário que entram os **padrões para sistemas distribuídos**.

Eles ajudam a resolver problemas como:

* Como um serviço envia uma mensagem para outro?
* Como vários serviços podem receber o mesmo evento?
* Como evitar que duas partes processem a mesma coisa ao mesmo tempo?
* Como organizar a comunicação entre diferentes sistemas?

Neste conteúdo:

| Padrão                        | Ideia principal                                              |
| ----------------------------- | ------------------------------------------------------------ |
| **Point-to-Point Channel**    | Uma mensagem é entregue para um consumidor                   |
| **Publish-Subscribe Channel** | Uma mensagem pode ser recebida por vários consumidores       |
| **Concurrency**               | Controlar o processamento simultâneo de mensagens ou tarefas |

---

# Point-to-Point Channel

O **Point-to-Point Channel** é um modelo de comunicação onde uma mensagem enviada para um canal será processada por **um consumidor**.

Podemos imaginar uma fila:

```text
Produtor
    │
    │ mensagem
    ↓
┌───────────────┐
│     FILA      │
│               │
│  Mensagem 1   │
│  Mensagem 2   │
│  Mensagem 3   │
└───────────────┘
       │
       ↓
   Consumidor
```

O produtor envia uma mensagem para a fila.

O consumidor pega a mensagem e processa.

Se existirem vários consumidores:

```text
             ┌──→ Consumidor A
             │
Produtor → FILA
             │
             ├──→ Consumidor B
             │
             └──→ Consumidor C
```

Uma determinada mensagem será entregue para **apenas um deles**.

Isso permite distribuir o trabalho.

---

## Exemplo

Imagine um sistema de processamento de pedidos.

Quando um pedido é criado, podemos enviar uma mensagem:

```js
const message = {
    orderId: 100,
    action: "process-order"
}
```

Essa mensagem entra em uma fila:

```text
Pedido criado
     ↓
   Fila
     ↓
Worker
     ↓
Processamento
```

Se tivermos três workers:

```text
                 ┌── Worker 1
                 │
Fila de pedidos ─┼── Worker 2
                 │
                 └── Worker 3
```

Cada pedido pode ser processado por um worker diferente.

Por exemplo:

```text
Pedido 1 → Worker 1
Pedido 2 → Worker 2
Pedido 3 → Worker 3
Pedido 4 → Worker 1
```

Isso permite distribuir o trabalho entre vários consumidores.

---

## Quando utilizar?

Esse padrão é interessante quando queremos:

* processar tarefas em segundo plano;
* distribuir trabalho entre vários workers;
* evitar que a mesma mensagem seja processada por vários consumidores;
* criar filas de processamento;
* desacoplar quem produz uma tarefa de quem executa essa tarefa.

Um exemplo comum seria:

```text
API
 ↓
Fila
 ↓
Workers
 ↓
Processamento
```

A API não precisa executar todo o trabalho imediatamente.

Ela coloca a tarefa na fila e pode continuar atendendo outras requisições.

---

## Analogia

Imagine uma fila de atendimento em um banco.

```text
Clientes
   ↓
Fila
   ↓
┌───────┬───────┬───────┐
│ Caixa │ Caixa │ Caixa │
└───────┴───────┴───────┘
```

Cada cliente é atendido por apenas um caixa.

Isso é parecido com o Point-to-Point Channel.

> **Point-to-Point = uma mensagem, um consumidor.**

---

# Publish-Subscribe Channel

O **Publish-Subscribe Channel**, também chamado de **Pub/Sub**, funciona de uma maneira diferente.

Aqui, um produtor publica uma mensagem e **vários consumidores podem receber essa mesma mensagem**.

```text
                 ┌──→ Serviço de e-mail
                 │
Publicador ──────┼──→ Serviço de estoque
                 │
                 └──→ Serviço de relatório
```

O produtor não precisa saber quem está interessado na mensagem.

Ele simplesmente publica um evento.

---

## Exemplo

Imagine que um pedido foi criado.

O sistema publica:

```js
const event = {
    type: "ORDER_CREATED",
    orderId: 100
}
```

Vários serviços podem estar interessados:

```text
                 ┌──→ Enviar e-mail
                 │
ORDER_CREATED ───┼──→ Atualizar estoque
                 │
                 └──→ Criar relatório
```

Todos podem receber o mesmo evento.

O serviço responsável pelo pedido não precisa conhecer diretamente esses outros serviços.

---

## Por que isso é útil?

Imagine que amanhã seja necessário adicionar outro comportamento:

```text
ORDER_CREATED
      ↓
Enviar para Analytics
```

No modelo Pub/Sub, podemos adicionar um novo consumidor sem precisar alterar quem publicou o evento.

Isso ajuda a diminuir o acoplamento entre os serviços.

---

## Point-to-Point x Publish-Subscribe

Essa é uma diferença importante.

### Point-to-Point

```text
Mensagem
   ↓
  Fila
   ↓
Um consumidor
```

Uma mensagem é processada por um consumidor.

### Publish-Subscribe

```text
             ┌──→ Consumidor A
             │
Mensagem ────┼──→ Consumidor B
             │
             └──→ Consumidor C
```

A mesma mensagem pode ser recebida por vários consumidores.

---

## Analogia

Imagine uma empresa.

### Point-to-Point

O gerente entrega um documento para um funcionário:

```text
Gerente
   ↓
Funcionário
```

Apenas aquele funcionário precisa executar a tarefa.

### Publish-Subscribe

O gerente envia um comunicado para vários setores:

```text
                ┌── Financeiro
                │
Comunicado ─────┼── RH
                │
                └── TI
```

Todos os setores interessados recebem a mesma informação.

> **Publish-Subscribe = uma mensagem, vários consumidores interessados.**

---

# Concurrency

O padrão relacionado à **Concurrency** trata de uma situação muito comum em sistemas distribuídos:

> **Várias coisas podem estar sendo executadas ao mesmo tempo.**

Por exemplo, imagine uma fila com várias mensagens:

```text
Mensagem 1
Mensagem 2
Mensagem 3
Mensagem 4
Mensagem 5
```

Podemos processar uma por vez:

```text
Mensagem 1 → termina
Mensagem 2 → termina
Mensagem 3 → termina
```

Ou podemos ter vários consumidores trabalhando simultaneamente:

```text
Mensagem 1 → Worker 1
Mensagem 2 → Worker 2
Mensagem 3 → Worker 3
```

Isso aumenta a capacidade de processamento.

---

## O problema da concorrência

Processar várias coisas ao mesmo tempo pode melhorar a velocidade, mas também pode criar problemas.

Imagine que temos apenas **uma unidade de um produto** no estoque.

Dois pedidos chegam praticamente ao mesmo tempo:

```text
Pedido A ──→ comprar produto
                   │
                   ↓
                Estoque = 1

Pedido B ──→ comprar produto
```

Se os dois processos consultarem o estoque antes de atualizá-lo, ambos podem enxergar:

```text
Estoque = 1
```

E os dois podem tentar realizar a compra.

Isso pode gerar uma inconsistência.

---

## Concorrência controlada

Por isso, sistemas distribuídos precisam controlar como as tarefas são executadas simultaneamente.

Podemos utilizar mecanismos como:

* filas;
* locks;
* transações;
* controle de concorrência;
* limites de consumidores;
* idempotência.

Por exemplo:

```text
                 ┌── Worker 1
                 │
Fila ────────────┼── Worker 2
                 │
                 └── Worker 3
```

Podemos definir quantos workers podem processar mensagens ao mesmo tempo.

Se tivermos:

```text
Concurrency = 3
```

significa que podemos ter até três tarefas sendo processadas simultaneamente.

---

## Concorrência não é simplesmente "fazer tudo ao mesmo tempo"

Esse é um ponto importante.

A ideia de concorrência é **gerenciar várias tarefas que podem estar acontecendo ao mesmo tempo**.

Precisamos pensar:

* Quantas tarefas podem executar simultaneamente?
* Existe algum recurso compartilhado?
* Duas tarefas podem alterar o mesmo dado?
* A ordem de processamento importa?
* Uma mensagem pode ser processada novamente?
* O sistema consegue suportar a quantidade de processamento?

---

## Analogia

Imagine uma cozinha.

Com apenas um cozinheiro:

```text
Pedido 1
   ↓
Pedido 2
   ↓
Pedido 3
```

Os pedidos são processados um de cada vez.

Com três cozinheiros:

```text
Pedido 1 → Cozinheiro 1
Pedido 2 → Cozinheiro 2
Pedido 3 → Cozinheiro 3
```

O restaurante consegue atender mais pedidos ao mesmo tempo.

Porém, se os três cozinheiros tentarem utilizar o mesmo ingrediente limitado, será necessário controlar o acesso a esse recurso.

Essa é uma das preocupações da concorrência.

> **Concurrency = permitir processamento simultâneo sem perder o controle sobre os recursos compartilhados.**

---

# Comparando os padrões

| Padrão                | Pergunta que ele ajuda a responder                     |
| --------------------- | ------------------------------------------------------ |
| **Point-to-Point**    | "Quem vai processar esta mensagem?"                    |
| **Publish-Subscribe** | "Quem precisa receber este evento?"                    |
| **Concurrency**       | "Quantas coisas podem ser processadas ao mesmo tempo?" |

---

# Visualizando os três

### Point-to-Point

```text
Produtor
   ↓
 Fila
   ↓
Consumidor
```

**Uma mensagem → um consumidor**

---

### Publish-Subscribe

```text
                 ┌──→ Serviço A
                 │
Publicador ──────┼──→ Serviço B
                 │
                 └──→ Serviço C
```

**Uma mensagem → vários consumidores**

---

### Concurrency

```text
                 ┌──→ Worker 1
                 │
Fila ────────────┼──→ Worker 2
                 │
                 └──→ Worker 3
```

**Várias tarefas → processamento simultâneo**

---

# Relação com sistemas reais

Esses conceitos aparecem frequentemente em arquiteturas que utilizam:

```text
API
 ↓
RabbitMQ / Kafka
 ↓
Workers / Serviços
 ↓
Banco de dados
```

Por exemplo, em um sistema de pedidos:

```text
                    Pedido criado
                         │
                         ↓
                  Publish / Queue
                    /     |      \
                   /      |       \
                  ↓       ↓        ↓
             Pagamento Estoque  Notificação
                  │       │        │
                  ↓       ↓        ↓
              Processamento independente
```

Dentro de cada serviço, ainda podemos utilizar filas e múltiplos workers para aumentar a capacidade de processamento.

Por isso, esses padrões são importantes quando começamos a trabalhar com **mensageria, microsserviços, processamento assíncrono e sistemas distribuídos**.

---

# Resumo

Os três conceitos podem ser lembrados desta maneira:

> **Point-to-Point:** uma mensagem é destinada a um consumidor.

> **Publish-Subscribe:** uma mensagem pode interessar a vários consumidores.

> **Concurrency:** várias tarefas podem ser processadas simultaneamente, desde que o acesso aos recursos seja controlado.

O objetivo desses padrões é ajudar a construir sistemas onde diferentes partes possam **se comunicar, distribuir trabalho e processar tarefas de forma organizada e segura**.
