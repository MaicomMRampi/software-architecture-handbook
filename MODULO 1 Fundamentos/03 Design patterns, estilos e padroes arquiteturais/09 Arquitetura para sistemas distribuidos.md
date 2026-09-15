# Arquitetura para Sistemas Distribuídos

Quando um sistema cresce, é comum ele deixar de ser apenas uma aplicação. Passamos a ter vários sistemas, serviços, bancos de dados e aplicações diferentes que precisam trocar informações.

É nesse cenário que aparecem conceitos como **EAI, SOA e ESB**.

A ideia principal é entender **como diferentes sistemas podem se comunicar e trabalhar juntos**, mesmo quando foram desenvolvidos em tecnologias diferentes.

---

## 11.1. Enterprise Application Integration (EAI)

**Enterprise Application Integration (EAI)** significa **Integração de Aplicações Empresariais**.

Na prática, é um conjunto de técnicas e padrões utilizados para fazer **sistemas diferentes conversarem entre si**.

Imagine uma empresa que possui:

* um sistema de vendas;
* um sistema financeiro;
* um sistema de estoque;
* um sistema de atendimento;
* um sistema de logística.

Cada sistema pode ter sido desenvolvido por equipes diferentes, em tecnologias diferentes e até em épocas diferentes.

O problema é:

> Como fazer todos esses sistemas trocarem informações?

É justamente aí que entra o EAI.

### Exemplo

Imagine que um cliente faça uma compra:

```text
Sistema de Vendas
       |
       v
Sistema Financeiro
       |
       v
Sistema de Estoque
       |
       v
Sistema de Logística
```

Quando uma venda acontece, outros sistemas precisam saber disso.

O sistema de vendas pode enviar:

```json
{
  "pedido": 123,
  "cliente": 50,
  "valor": 299.90
}
```

O financeiro pode utilizar essas informações para registrar o pagamento.

O estoque pode baixar os produtos.

A logística pode iniciar o processo de entrega.

### O problema sem integração

Sem uma estratégia de integração, podemos acabar com algo assim:

```text
Vendas ------> Financeiro
  |               |
  v               v
Estoque ------> Logística
  |
  v
Atendimento
```

Com o crescimento da empresa, cada sistema começa a conhecer vários outros sistemas.

Isso aumenta o **acoplamento** e torna as mudanças mais difíceis.

### O objetivo do EAI

O EAI busca organizar essa comunicação.

A ideia é:

> **Integrar sistemas diferentes de maneira organizada e controlada.**

Isso pode envolver:

* APIs;
* mensageria;
* filas;
* eventos;
* transformação de dados;
* adaptadores;
* sistemas de integração.

### Uma analogia simples

Imagine uma empresa com funcionários falando idiomas diferentes.

Sem um mecanismo de tradução, cada funcionário precisaria aprender todos os idiomas.

Com uma estrutura de tradução, a comunicação fica muito mais organizada.

O EAI exerce um papel semelhante:

```text
Sistema A
    |
    v
Integração
    |
    +----> Sistema B
    |
    +----> Sistema C
    |
    +----> Sistema D
```

### Para memorizar

> **EAI = fazer sistemas diferentes conversarem.**

---

# 11.2. Service Oriented Architecture (SOA)

**Service Oriented Architecture (SOA)** significa **Arquitetura Orientada a Serviços**.

A ideia é organizar funcionalidades da empresa como **serviços independentes**, que podem ser utilizados por diferentes aplicações.

Em vez de colocar tudo dentro de uma única aplicação, podemos separar responsabilidades.

Por exemplo:

```text
                  +----------------+
                  | Serviço de     |
                  | Clientes       |
                  +----------------+
                         |
+-------------+    +----------------+    +-------------+
| Sistema     |--->| Serviço de     |<---| Sistema     |
| Vendas      |    | Pagamentos     |    | Atendimento |
+-------------+    +----------------+    +-------------+
                         |
                  +----------------+
                  | Serviço de     |
                  | Estoque        |
                  +----------------+
```

Cada serviço possui uma responsabilidade específica.

### Exemplo

Imagine uma empresa que possui:

```text
Serviço de Clientes
Serviço de Pedidos
Serviço de Pagamentos
Serviço de Estoque
```

O sistema de vendas não precisa conhecer como o pagamento é implementado.

Ele simplesmente utiliza o serviço:

```text
Sistema de Vendas
       |
       v
Serviço de Pagamentos
```

O serviço de pagamentos pode internamente utilizar:

```text
Banco de dados
API do banco
Gateway de pagamento
Regras de negócio
```

Mas essas informações ficam escondidas do sistema que está consumindo o serviço.

---

## Por que utilizar SOA?

Um dos principais objetivos é permitir que diferentes aplicações **reutilizem funcionalidades da empresa**.

Imagine que uma empresa tenha três sistemas:

```text
Sistema Web
Sistema Mobile
Sistema Interno
```

Todos precisam consultar clientes.

Em vez de cada sistema implementar sua própria lógica:

```text
Web ------> Banco
Mobile ---> Banco
Interno --> Banco
```

podemos ter:

```text
              +----------------+
Web --------->|                |
Mobile ------>| Serviço de    |
Interno ------>| Clientes      |
              +----------------+
```

Agora existe um serviço responsável por essa capacidade.

Isso também facilita a manutenção das regras.

---

## SOA não significa simplesmente "usar APIs"

Uma API pode fazer parte de uma arquitetura SOA, mas SOA é um conceito maior.

SOA envolve a organização das capacidades da empresa em **serviços bem definidos**, com contratos de comunicação e responsabilidades claras.

Por exemplo:

```text
Serviço de Clientes
    |
    +-- cadastrar cliente
    +-- consultar cliente
    +-- atualizar cliente
```

O consumidor conhece o **contrato** do serviço, mas não precisa conhecer sua implementação interna.

---

## SOA x Microservices

SOA e microsserviços possuem ideias parecidas, mas não são exatamente a mesma coisa.

Ambos trabalham com serviços, porém possuem objetivos e abordagens diferentes.

Uma arquitetura SOA tradicional pode possuir serviços maiores e compartilhados dentro de uma organização.

Microsserviços normalmente buscam serviços menores, mais independentes e com maior autonomia de implantação.

Por exemplo:

```text
SOA

             Sistema Empresarial
                    |
       +------------+------------+
       |            |            |
    Clientes     Estoque     Pagamentos
```

Enquanto uma arquitetura de microsserviços pode possuir:

```text
Microserviços

[Clientes]
[Pedidos]
[Pagamentos]
[Estoque]
[Notificações]
```

Não significa que um seja automaticamente melhor que o outro.

A escolha depende do problema, da organização e do nível de independência necessário.

### Para memorizar

> **SOA = organizar capacidades da empresa em serviços reutilizáveis.**

---

# 11.3. Enterprise Service Bus (ESB)

**Enterprise Service Bus (ESB)** significa **Barramento de Serviços Empresariais**.

O ESB é uma solução utilizada para **intermediar a comunicação entre diferentes sistemas e serviços**.

Uma forma simples de visualizar é imaginar uma central de comunicação:

```text
Sistema A
     |
     v
+-----------+
|    ESB    |
+-----------+
  |    |    |
  v    v    v
Sistema B  Sistema C  Sistema D
```

Em vez de cada sistema precisar conhecer todos os outros, eles podem se comunicar através do barramento.

---

## O que o ESB pode fazer?

Um ESB pode assumir várias responsabilidades relacionadas à integração.

Por exemplo:

### Roteamento

Decidir para qual sistema uma mensagem deve ir.

```text
Pedido criado
     |
     v
    ESB
     |
     +----> Financeiro
```

### Transformação

Um sistema pode enviar:

```json
{
  "customerId": 10
}
```

Enquanto outro espera:

```json
{
  "cliente": 10
}
```

O ESB pode realizar essa transformação durante a integração.

```text
Sistema A
   |
   | formato A
   v
  ESB
   |
   | formato B
   v
Sistema B
```

### Integração entre tecnologias diferentes

Por exemplo:

```text
Sistema antigo
     |
     | SOAP
     v
    ESB
     |
     | REST
     v
Sistema novo
```

O ESB pode ajudar a conectar tecnologias diferentes.

### Orquestração

Também pode coordenar uma sequência de operações:

```text
Pedido
  |
  v
ESB
  |
  +----> Validar cliente
  |
  +----> Registrar pagamento
  |
  +----> Baixar estoque
  |
  +----> Enviar pedido para logística
```

---

# Como EAI, SOA e ESB se relacionam?

Esses três conceitos estão relacionados, mas representam coisas diferentes.

Uma forma simples de entender:

```text
EAI
 |
 | "Precisamos integrar nossos sistemas."
 |
 v
SOA
 |
 | "Vamos organizar funcionalidades
 |  como serviços."
 |
 v
ESB
 |
 | "Vamos usar um barramento para
 |  facilitar a comunicação entre eles."
```

Mas eles não são obrigatoriamente dependentes uns dos outros.

Podemos ter EAI sem SOA.

Podemos ter SOA sem necessariamente utilizar um ESB.

E podemos integrar sistemas utilizando outras tecnologias, como:

* APIs REST;
* mensageria;
* RabbitMQ;
* Kafka;
* eventos;
* gateways;
* conectores.

---

# Exemplo completo

Imagine uma empresa de telecomunicações.

Ela possui:

```text
Sistema Comercial
Sistema de Clientes
Sistema Financeiro
Sistema de Estoque
Sistema de Atendimento
```

Um cliente contrata um plano.

O fluxo poderia ser:

```text
                  +-------------------+
                  | Sistema Comercial |
                  +---------+---------+
                            |
                            v
                       +---------+
                       |   ESB   |
                       +----+----+
                            |
            +---------------+---------------+
            |               |               |
            v               v               v
       +---------+     +---------+     +---------+
       | Cliente |     |Financeiro|    | Estoque |
       +---------+     +---------+     +---------+
                            |
                            v
                     +-------------+
                     | Atendimento |
                     +-------------+
```

Nesse cenário:

**EAI** representa a preocupação geral de integrar os sistemas.

**SOA** representa a organização dessas capacidades como serviços.

**ESB** pode ser utilizado como mecanismo central para intermediar a comunicação.

---

# EAI x SOA x ESB

| Conceito | Ideia principal                                     |
| -------- | --------------------------------------------------- |
| **EAI**  | Integrar aplicações diferentes                      |
| **SOA**  | Organizar funcionalidades como serviços             |
| **ESB**  | Intermediar a comunicação entre sistemas e serviços |

Uma maneira ainda mais simples:

```text
EAI = O problema
SOA = Uma forma de organizar a solução
ESB = Uma tecnologia/arquitetura de integração que pode ajudar nessa solução
```

---

# Uma analogia para entender os três

Imagine uma cidade.

Existem várias empresas:

```text
Banco
Hospital
Mercado
Transportadora
```

### EAI

É a necessidade de fazer essas empresas conseguirem trocar informações.

### SOA

É organizar determinadas capacidades dessas empresas como serviços que podem ser utilizados.

### ESB

É como uma central de transporte/comunicação que ajuda a encaminhar as informações entre os diferentes participantes.

---

# Resumo

### Enterprise Application Integration — EAI

> **Integra sistemas diferentes.**

O foco está no problema de comunicação entre aplicações.

---

### Service Oriented Architecture — SOA

> **Organiza funcionalidades como serviços.**

O foco está em disponibilizar capacidades da empresa através de serviços reutilizáveis.

---

### Enterprise Service Bus — ESB

> **Intermedeia a comunicação entre sistemas e serviços.**

Pode realizar tarefas como:

* roteamento;
* transformação de mensagens;
* integração;
* orquestração;
* comunicação entre tecnologias diferentes.

---

## Para guardar

```text
EAI
"Como faço esses sistemas conversarem?"

SOA
"Como organizo as funcionalidades da empresa
em serviços reutilizáveis?"

ESB
"Como posso intermediar e organizar
a comunicação entre esses sistemas?"
```

O ponto mais importante é não confundir os três: **EAI trata da integração, SOA trata da organização em serviços e ESB pode ser utilizado como mecanismo para facilitar essa integração.**
