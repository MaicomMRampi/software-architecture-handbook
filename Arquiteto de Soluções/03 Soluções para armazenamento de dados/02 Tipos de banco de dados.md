# 🗃️ Tipos de Banco de Dados e suas Características

> Por que existem bancos tão diferentes, como classificá-los em dois eixos e quando usar cada um.

**Trilha 3: Bancos de Dados e Armazenamento** · Referência: *Database System Concepts* (Silberschatz, Korth & Sudarshan)

---

## 📌 Sumário

- [Antes de tudo: dois eixos, não um](#-antes-de-tudo-dois-eixos-não-um)
- [Eixo 1: transacional x analítico](#-eixo-1-transacional-oltp-x-analítico-olap)
- [Eixo 2: o modelo de dados](#-eixo-2-o-modelo-de-dados)
  - [Relacional (SQL)](#1-relacional-sql)
  - [NoSQL](#2-nosql)
  - [NewSQL](#3-newsql-o-híbrido)
- [Mergulho no NoSQL: os 4 tipos](#-mergulho-no-nosql-os-quatro-tipos)
- [SQL x NoSQL](#-sql-x-nosql-lado-a-lado)
- [O teorema CAP](#-o-teorema-cap-por-que-não-dá-para-ter-tudo)
- [Como escolher](#-como-escolher-um-guia-prático)
- [No seu dia a dia](#-no-seu-dia-a-dia-node-nestjs-postgresql)
- [Leituras no Silberschatz](#-leituras-no-silberschatz)

---

## 🧭 Antes de tudo: dois eixos, não um

O erro mais comum é achar que "tipo de banco" é uma lista única. Na verdade, um banco é classificado por **duas perguntas independentes**:

```
Eixo 1 — PARA QUÊ serve?          │  Eixo 2 — COMO organiza os dados?
  ├─ Transacional (OLTP)          │    ├─ Relacional (SQL)
  └─ Analítico (OLAP)             │    ├─ NoSQL
                                  │    └─ NewSQL
```

Os dois eixos se cruzam. O **PostgreSQL** é **transacional** (eixo 1) **e relacional** (eixo 2). O **BigQuery** é **analítico** e usa SQL. O **MongoDB** é **transacional** e **NoSQL**. Entender que são eixos separados evita a confusão clássica de achar que "SQL = transacional" e "NoSQL = analítico", o que não é verdade.

---

## ⚡ Eixo 1: transacional (OLTP) x analítico (OLAP)

Este eixo é sobre **o propósito** do banco. (Visto em detalhe no README anterior; aqui vai o resumo.)

**Analogia:** o **caixa do supermercado** (OLTP) registra cada compra na hora, rápido e certo. O **departamento de inteligência** (OLAP) pega o histórico de todas as compras e descobre padrões.

| | Transacional (OLTP) | Analítico (OLAP) |
|---|---|---|
| **Foco** | Operações do dia a dia em tempo real | Análise de histórico, relatórios |
| **Operação** | CRUD rápido, poucos registros | Leitura pesada, milhões de registros |
| **Escrita** | Intensa e constante | Rara (cargas periódicas) |
| **Exemplos** | PostgreSQL, MySQL, SQL Server, Oracle | BigQuery, Redshift, Snowflake |

> **A frase:** OLTP **registra** o agora; OLAP **entende** o passado.

---

## 🧱 Eixo 2: o modelo de dados

Este eixo é sobre **como os dados são estruturados e consultados**. São três grandes famílias.

### 1. Relacional (SQL)

**O que é:** os dados vivem em **tabelas** (linhas e colunas), com **relações** entre elas definidas por chaves. A linguagem é o **SQL**. O **esquema** (a estrutura das tabelas) é definido **antes** de inserir dados.

**Analogia:** uma **planilha de Excel muito disciplinada e interligada**. Cada aba é uma tabela, cada linha um registro, e as abas se referenciam por um código em comum (a chave). A disciplina é a força: nada entra fora do formato.

**Características:**
- **Esquema rígido** (schema-on-write): a estrutura é definida antes. Toda linha da tabela `usuarios` tem as mesmas colunas.
- **ACID forte:** ideal para dados que não podem ter inconsistência.
- **Relações e JOINs:** você cruza tabelas facilmente (pedido → cliente → endereço).
- **Normalização:** evita repetir dados, guardando cada informação em um só lugar.

**Quando usar:** quando os dados têm **estrutura bem definida** e **relações claras**, e a **consistência é crítica**: sistemas financeiros, ERPs, e-commerce, a maioria dos sistemas de gestão.

**Ferramentas:** PostgreSQL, MySQL, SQL Server, Oracle, MariaDB.

**Exemplo real:** o seu sistema de gestão. Um `pedido` referencia um `cliente`, que tem vários `enderecos`. Tudo amarrado por chaves estrangeiras, com integridade garantida pelo banco.

### 2. NoSQL

**O que é:** uma família de bancos que **abre mão da tabela rígida** para ganhar **flexibilidade e escala**. "NoSQL" significa "**Not Only SQL**" (não só SQL), não "sem SQL". Nasceram com as gigantes da web (Google, Amazon, Facebook), que precisavam escalar para bilhões de usuários e lidar com dados sem formato fixo.

**Analogia:** se o relacional é uma **planilha disciplinada**, o NoSQL é uma **caixa de documentos soltos**. Cada documento pode ter campos diferentes. Mais liberdade, menos amarras.

**Características:**
- **Esquema flexível** (schema-on-read): cada registro pode ter uma estrutura diferente.
- **Escala horizontal** fácil: cresce adicionando mais máquinas baratas (veremos no CAP por quê).
- Costuma trocar **consistência imediata** por **disponibilidade e velocidade** (também no CAP).
- Geralmente **sem JOINs** tradicionais: os dados relacionados ficam juntos, no mesmo documento.

**Quando usar:** dados **sem formato fixo** ou que **mudam de estrutura**, **volume gigante**, necessidade de **escala extrema**, ou quando velocidade importa mais que consistência perfeita.

**Ferramentas:** MongoDB, Redis, Cassandra, DynamoDB, Neo4j (cada um de um subtipo, veja abaixo).

**Exemplo real:** o carrinho de compras de um e-commerce guardado no **Redis** (rapidíssimo), ou o catálogo de produtos com atributos variados (um tênis tem "numeração", um livro tem "autor") no **MongoDB**.

### 3. NewSQL (o híbrido)

**O que é:** a geração mais nova, que tenta juntar **o melhor dos dois mundos**: a **consistência ACID e o SQL** do relacional, com a **escala horizontal** do NoSQL. Surgiu para resolver o dilema "ou tenho ACID, ou tenho escala".

**Analogia:** a **planilha disciplinada do relacional, mas que se divide magicamente entre vários prédios** sem perder a organização nem o controle.

**Características:**
- Fala **SQL** e mantém **ACID**.
- Escala horizontalmente como os NoSQL (distribuído por muitas máquinas).
- Mais novo e mais complexo de operar; usado quando se precisa das duas coisas ao mesmo tempo.

**Quando usar:** sistemas que precisam de **transações fortes** (como um banco financeiro) **e** de **escala global** (muitas regiões, muitos usuários).

**Ferramentas:** Google Spanner, CockroachDB, YugabyteDB, TiDB.

**Exemplo real:** uma fintech global que precisa de transações ACID (é dinheiro) mas opera em vários países com baixa latência em cada um usa algo como o **CockroachDB** ou o **Spanner**.

---

## 🔍 Mergulho no NoSQL: os quatro tipos

"NoSQL" é um guarda-chuva. Por baixo dele há **quatro modelos** bem diferentes. Saber distinguir é o que cai em prova e em entrevista.

### a) Documento (Document)

Guarda dados como **documentos JSON/BSON**, cada um autocontido. É o mais parecido com objetos do seu código.

- **Analogia:** uma **pasta onde cada ficha tem os campos que precisar**.
- **Quando:** catálogos, perfis de usuário, conteúdo com estrutura variável.
- **Ferramentas:** **MongoDB**, CouchDB.
- **Exemplo:** um produto com todos os seus atributos e variações num único documento, sem precisar de 5 tabelas e JOINs.

```json
{ "_id": 1, "nome": "Tênis", "tamanhos": [38,39,40], "cor": "preto" }
```

### b) Chave-valor (Key-Value)

O mais simples: uma **chave** aponta para um **valor**. Como um dicionário/`Map` gigante. Extremamente rápido.

- **Analogia:** o **guarda-volumes**: ficha → item, nada mais.
- **Quando:** cache, sessões, carrinho de compras, rankings em tempo real.
- **Ferramentas:** **Redis**, DynamoDB, Memcached.
- **Exemplo:** guardar a sessão do usuário: `sessao:abc123 → { userId: 5 }`, com expiração automática.

### c) Coluna (Column-Family / Wide-Column)

Organiza por **colunas** em vez de linhas, feito para **escrever e ler volumes massivos** distribuídos por muitas máquinas.

- **Analogia:** um **depósito gigante** otimizado para engolir toneladas de dados por segundo.
- **Quando:** séries temporais, logs em escala, IoT, dados de telemetria.
- **Ferramentas:** **Cassandra**, HBase, ScyllaDB.
- **Exemplo:** a Netflix registrando eventos de "quem assistiu o quê e quando" em escala planetária.

### d) Grafo (Graph)

Guarda **nós** e as **relações** entre eles como cidadãos de primeira classe. Brilha quando a **relação** é o que importa.

- **Analogia:** um **mapa de uma rede social**: pessoas (nós) e amizades (arestas).
- **Quando:** redes sociais, motores de recomendação, detecção de fraude, grafos de conhecimento.
- **Ferramentas:** **Neo4j**, Amazon Neptune.
- **Exemplo:** "amigos de amigos que curtem a mesma banda", uma consulta horrível em SQL e natural num grafo.

---

## ⚖️ SQL x NoSQL lado a lado

| Característica | Relacional (SQL) | NoSQL |
|---|---|---|
| **Estrutura** | Tabelas rígidas | Documentos, pares, colunas, grafos |
| **Esquema** | Definido antes (schema-on-write) | Flexível (schema-on-read) |
| **Linguagem** | SQL padronizado | Varia por banco |
| **Relações** | JOINs entre tabelas | Dados aninhados, sem JOIN clássico |
| **Consistência** | ACID forte | Geralmente eventual (BASE) |
| **Escala** | Vertical (máquina maior) | Horizontal (mais máquinas) |
| **Melhor para** | Dados estruturados e relações | Volume, flexibilidade, escala |
| **Exemplos** | PostgreSQL, MySQL, Oracle | MongoDB, Redis, Cassandra, Neo4j |

> **Mito a derrubar:** "NoSQL é melhor/mais moderno que SQL". Falso. São ferramentas para problemas diferentes. O PostgreSQL inclusive guarda JSON nativamente (tipo `JSONB`), cobrindo muitos casos de NoSQL sem abrir mão do relacional.

---

## 🧮 O teorema CAP (por que não dá para ter tudo)

Em sistemas **distribuídos** (espalhados por várias máquinas), existe um limite famoso. O teorema CAP diz que, entre três propriedades, você só pode garantir **duas** ao mesmo tempo:

| Letra | Nome | Significa |
|---|---|---|
| **C** | Consistência | Todos os nós veem o mesmo dado no mesmo instante |
| **A** | Disponibilidade | O sistema sempre responde, mesmo sob falha |
| **P** | Tolerância a partição | Funciona mesmo se a rede entre os nós se partir |

**Analogia:** duas bibliotecas em cidades diferentes, que deveriam ter o mesmo acervo. Se a estrada entre elas cai (**partição**), você escolhe: ou **recusa empréstimos** até sincronizar (prioriza consistência), ou **empresta mesmo assim** e arrisca que as duas fiquem diferentes por um tempo (prioriza disponibilidade).

- Como a **partição** (P) é inevitável na prática (redes falham), a escolha real é entre **C** e **A**.
- **Bancos SQL tradicionais** tendem a priorizar **consistência** (CP).
- **Muitos NoSQL** priorizam **disponibilidade** (AP), com "consistência eventual": o dado se alinha depois de um tempinho.

Por isso se fala que o NoSQL costuma seguir **BASE** (Basically Available, Soft state, Eventual consistency), o oposto do **ACID**.

---

## 🎯 Como escolher: um guia prático

```
Os dados têm estrutura clara e relações, e consistência é crítica?
   → SIM  →  Relacional (PostgreSQL)   ← comece sempre por aqui

Precisa de cache ultrarrápido ou sessão?
   → Chave-valor (Redis)

Dados sem formato fixo, muito variáveis?
   → Documento (MongoDB)

Volume massivo de escrita, logs, séries temporais?
   → Coluna (Cassandra)

O mais importante são as relações (rede social, recomendação)?
   → Grafo (Neo4j)

Precisa de ACID forte E escala global ao mesmo tempo?
   → NewSQL (CockroachDB, Spanner)
```

> **Conselho de arquiteto:** comece pelo **relacional**. Ele resolve 90% dos casos e o PostgreSQL é poderosíssimo. Só vá para NoSQL quando tiver um **problema concreto** que o relacional não resolve bem (escala extrema, dados realmente sem esquema). Escolher NoSQL "porque é moderno" é uma armadilha clássica.

---

## 💻 No seu dia a dia (Node, NestJS, PostgreSQL)

| Conceito | Como aparece para você |
|---|---|
| **Relacional** | Seu PostgreSQL com TypeORM/Prisma. A base de tudo |
| **NoSQL documento** | MongoDB com o Mongoose, se precisar de flexibilidade |
| **Chave-valor** | Redis para cache de respostas, sessões, filas (BullMQ) |
| **JSONB** | O Postgres guarda JSON nativo: você tem flexibilidade NoSQL **dentro** do relacional |
| **ACID vs BASE** | No Postgres, `BEGIN...COMMIT` te dá ACID; num cache Redis, você aceita que o dado é "best effort" |
| **Escala** | Subir a máquina do Postgres (vertical) x distribuir (horizontal, mais complexo) |

**Um padrão comum na sua stack:** PostgreSQL como fonte da verdade (ACID) **+** Redis como cache na frente (velocidade). O melhor dos dois: consistência onde importa, velocidade onde dá.

---

## 📚 Leituras no Silberschatz

| Capítulo | Tema |
|---|---|
| **1** | Introdução e modelos de dados |
| **2–6** | Modelo relacional e SQL |
| **7** | Modelagem e normalização |
| **17–19** | Transações, concorrência, recuperação (ACID) |
| **10** | Bancos NoSQL e Big Data |
| **20–21** | Bancos distribuídos e paralelos (base do CAP e do NewSQL) |

---

## 🧠 Perguntas para testar o entendimento

1. "SQL x NoSQL" e "OLTP x OLAP" são o mesmo eixo de classificação? Explique.
2. Dê um exemplo de banco que é **transacional e NoSQL** ao mesmo tempo.
3. Para guardar a **sessão** de um usuário logado, qual tipo de NoSQL faz mais sentido, e por quê?
4. Pelo teorema CAP, por que um banco distribuído precisa escolher entre consistência e disponibilidade quando a rede falha?
5. Seu colega quer trocar o PostgreSQL por MongoDB "porque é mais moderno". Que pergunta você faz antes de concordar?
