# Arquitetura Orientada a Eventos (Event-Driven Architecture - EDA)

## 📌 Visão Geral
A **Arquitetura Orientada a Eventos (EDA)** é um padrão de design de software em que a captura, comunicação, processamento e reação a **eventos** são o núcleo do sistema. 

Em sistemas tradicionais (como REST/HTTP síncronos), os componentes conversam diretamente via chamada e resposta. Em EDA, a comunicação é assíncrona: quem produz a informação apenas **notifica** que algo aconteceu, sem se preocupar com quem vai processar ou quando isso será feito.

---

## 🍔 Analogia da Vida Real: O Restaurante Fast-Food

Imagine como funciona a cozinha de uma rede de fast-food moderna:

1. **O Evento:** Você faz o pedido no caixa e paga. O sistema gera um fato imutável: **`Pedido #104 Criado`**.
2. **O Event Broker (Barramento):** Essa ordem é enviada para as telas de exibição da cozinha.
3. **Consumidores Independentes:**
   * O **Chapeiro** vê o evento na tela dele e começa a fritar o hambúrguer.
   * O **Atendente de Bebidas** vê o mesmo evento na tela dele e enche o copo de refrigerante.
   * O **Painel do Cliente** atualiza o status para "Em Preparação".

> **O Ponto-Chave:** O caixa não foi até a chapa dar ordens diretas para o chapeiro nem esperou o hambúrguer ficar pronto para atender o próximo cliente. Ele apenas registrou o **evento**, e os setores reagem no próprio ritmo.

---

## 🏗️ Principais Componentes

| Componente | Função | Exemplo |
| :--- | :--- | :--- |
| **Event Producer (Emissor)** | Detecta uma mudança de estado e publica o evento. | Microserviço de Pagamentos |
| **Event (Evento)** | Registro imutável de um fato passado (`OrderPlaced`, `UserRegistered`). | JSON contendo payload do pedido |
| **Event Broker (Barramento)** | Middleware responsável por receber, armazenar e rotear os eventos. | Apache Kafka, RabbitMQ, AWS EventBridge |
| **Event Consumer (Receptor)** | Serviço que escuta eventos de seu interesse e executa uma ação. | Serviço de Notificação/E-mail |

---

## 🗝️ Conceitos Fundamentais

* **Evento é um fato imutável:** Representa algo no passado. Não pode ser alterado ou cancelado, apenas neutralizado por um novo evento (ex: `PaymentApproved` seguido por `PaymentRefunded`).
* **Desacoplamento:** O emissor não sabe quem é o receptor, quantos receptores existem ou se eles estão online.
* **Consistência Eventual:** O sistema não garante que todos os dados estarão atualizados em tempo real absoluto em todos os nós, mas garante que eventualmente todos estarão sincronizados.

---

## 🔄 Padrões Arquiteturais Relacionados

* **Pub/Sub (Publish/Subscribe):** Canal onde emissores publicam mensagens em um tópico e múltiplos assinantes recebem cópias simultâneas.
* **Event Sourcing:** Em vez de salvar apenas o estado atual do banco de dados, armazena-se a sequência inteira de eventos que levaram a esse estado.
* **CQRS (Command Query Responsibility Segregation):** Separação clara entre as operações de escrita (comandos) e leitura (consultas), frequentemente alimentada por eventos.

---

## ⚖️ Prós e Contras

### ✅ Vantagens
* **Alta Escalabilidade:** Componentes podem escalar independentemente.
* **Resiliência e Tolerância a Falhas:** Se o consumidor de e-mails cair, a fila acumula os eventos e os reprocessa quando o serviço retornar, sem perda de dados.
* **Facilidade de Extensão:** Para adicionar uma nova funcionalidade (ex: enviar SMS), basta criar um novo consumidor que escute os mesmos eventos, sem alterar o código existente.

### ❌ Desafios
* **Complexidade de Debugging:** Rastrear o fluxo de uma requisição através de múltiplos eventos exige ferramentas de *Distributed Tracing* (ex: Jaeger, Zipkin).
* **Gerenciamento de Estado:** Tratar eventos fora de ordem ou duplicados exige a implementação de lógica **idempotente**.

---

## 🛠️ Tecnologias Populares
* **Message Brokers / Event Streaming:** Apache Kafka, RabbitMQ, Apache Pulsar, Redis Pub/Sub.
* **Cloud Native Services:** AWS EventBridge / SNS / SQS, GCP Pub/Sub, Azure Event Grid.