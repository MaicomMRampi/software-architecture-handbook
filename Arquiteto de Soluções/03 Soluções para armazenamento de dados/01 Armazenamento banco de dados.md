# 💾 Armazenamento e Bancos de Dados

> Onde os dados moram, como são guardados e por que existem bancos tão diferentes para problemas tão diferentes.

**Trilha 3: Bancos de Dados e Armazenamento** · Referência: *Database System Concepts* (Silberschatz, Korth & Sudarshan)

---

## 📌 Sumário

- [Visão geral](#-visão-geral-o-mapa)
- [Parte 1: tipos de armazenamento](#-parte-1-os-três-tipos-de-armazenamento)
  - [Block storage](#1-block-storage-armazenamento-de-bloco)
  - [File storage](#2-file-storage-armazenamento-de-arquivo)
  - [Object storage](#3-object-storage-armazenamento-de-objeto)
  - [Comparação](#comparação-dos-três)
- [Parte 2: o que é um SGBD](#-parte-2-o-que-é-um-sgbd)
- [Parte 3: OLTP, o banco do dia a dia](#-parte-3-oltp-o-banco-do-dia-a-dia)
  - [ACID a fundo](#acid-a-fundo)
- [Parte 4: OLAP, o banco da análise](#-parte-4-olap-o-banco-da-análise)
- [OLTP x OLAP lado a lado](#-oltp-x-olap-lado-a-lado)
- [Como tudo se conecta](#-como-tudo-se-conecta-numa-empresa-real)
- [No seu dia a dia](#-no-seu-dia-a-dia-node-nestjs-postgresql)
- [Leituras no Silberschatz](#-leituras-no-silberschatz)

---

## 🗺️ Visão geral: o mapa

Antes de mergulhar, entenda que "guardar dados" se divide em duas grandes perguntas:

1. **Como o disco guarda os bytes?** → tipos de armazenamento (bloco, arquivo, objeto)
2. **Como eu organizo e consulto esses bytes com segurança?** → bancos de dados (OLTP, OLAP)

```
                        GUARDAR DADOS
                             │
          ┌──────────────────┴──────────────────┐
          │                                      │
   ARMAZENAMENTO (os bytes)            BANCO DE DADOS (a organização)
          │                                      │
   ┌──────┼──────┐                     ┌─────────┴─────────┐
 bloco  arquivo  objeto              OLTP               OLAP
  (SSD)  (NFS)    (S3)          (dia a dia)         (análise)
```

Um banco de dados **roda em cima** de um tipo de armazenamento. O seu PostgreSQL, por exemplo, geralmente grava num **block storage**.

---

## 📦 Parte 1: os três tipos de armazenamento

**Analogia geral: guardar suas coisas.** Você pode guardar objetos de três jeitos: numa **gaveta vazia** que você organiza sozinho (bloco), num **arquivo de pastas etiquetadas** (arquivo), ou num **guarda-volumes** onde você entrega o item, recebe uma ficha com um código e pega de volta mostrando a ficha (objeto).

### 1. Block storage (armazenamento de bloco)

**O que é:** o disco é dividido em pedaços de tamanho fixo chamados **blocos**, numerados. Quem decide o que vai em cada bloco é o **sistema operacional ou o banco de dados**, não o armazenamento. O armazenamento só diz "me dê o bloco 4812" e devolve aqueles bytes.

**Analogia:** uma **gaveta de cofres numerados**, todos do mesmo tamanho. O armazenamento entrega e guarda cofres por número; **a organização é problema seu**.

**Características:**
- **Mais rápido e menor latência** dos três.
- Permite **leitura e escrita de pedacinhos** (atualizar um registro sem reescrever o arquivo inteiro).
- É um disco "cru": precisa de um sistema de arquivos ou um banco por cima para fazer sentido.

**Onde usar:** discos de máquinas virtuais, e **o disco onde um banco de dados grava**. É o padrão para OLTP.

**Ferramentas:** Amazon EBS, Azure Managed Disks, Google Persistent Disk. No seu PC, o próprio SSD.

**Exemplo real:** o volume onde roda o PostgreSQL de produção da sua empresa. Quando uma transação atualiza uma linha, o banco escreve só os blocos afetados, em milissegundos.

### 2. File storage (armazenamento de arquivo)

**O que é:** os dados são organizados em **arquivos e pastas hierárquicas**, exatamente como o explorador de arquivos do seu computador. Vários computadores podem acessar a **mesma** pasta pela rede.

**Analogia:** um **arquivo de escritório com pastas etiquetadas**, compartilhado por toda a equipe. Todo mundo abre a mesma gaveta e enxerga a mesma estrutura de pastas.

**Características:**
- Organização familiar: caminhos como `/relatorios/2026/vendas.pdf`.
- Acessado por protocolos de rede: **NFS** (mundo Linux/Unix) e **SMB/CIFS** (mundo Windows).
- Latência **maior** que o bloco, porque passa pela rede e pela camada de pastas.

**Onde usar:** quando **várias máquinas precisam compartilhar os mesmos arquivos** com estrutura de diretórios: uma pasta de rede da empresa, arquivos compartilhados entre servidores de aplicação.

**Ferramentas:** Amazon EFS, Azure Files, Google Filestore. Na empresa, um servidor NAS.

**Exemplo real:** três servidores da sua aplicação que precisam ler os mesmos arquivos de template ou uploads de uma pasta comum, montada via NFS.

### 3. Object storage (armazenamento de objeto)

**O que é:** cada dado é um **objeto** independente, guardado num repositório chamado **bucket**. O objeto carrega os dados **mais os metadados** (tipo, data, dono...) e recebe uma **chave única** (um identificador). Você não navega por pastas: você pede o objeto **pela chave**, via API HTTP.

**Analogia:** um **guarda-volumes**. Você entrega a mala, recebe uma **ficha com um código**, e vai embora. Para pegar de volta, apresenta o código. Você não sabe (nem precisa saber) em qual prateleira ela está; o guarda-volumes resolve isso, e pode ter galpões no mundo todo.

**Características:**
- **Escala praticamente infinita** e **custo baixo** (paga pelo que usa).
- **Altíssima durabilidade** (o S3 anuncia 99,999999999%, os "onze noves"), porque cada objeto é copiado várias vezes automaticamente.
- Acesso via **API HTTP** (GET, PUT), o que combina perfeitamente com aplicações web.
- **Não é feito para edição constante**: você substitui o objeto inteiro, não um pedacinho. E a **latência é maior** que a do bloco.

**Onde usar:** dados grandes, que **crescem sempre** e **mudam pouco**: vídeos, imagens, áudios, backups, logs, arquivos de usuários.

**Ferramentas:** Amazon S3, Azure Blob Storage, Google Cloud Storage.

**Exemplo real:** a Netflix guardando os milhões de arquivos de vídeo no **Amazon S3**; o seu sistema guardando os **PDFs de nota fiscal** ou as **fotos de perfil** dos usuários num bucket, em vez de no banco.

### Comparação dos três

| | Block | File | Object |
|---|---|---|---|
| **Unidade** | Bloco numerado | Arquivo em pasta | Objeto + metadados |
| **Como acessa** | Endereço do bloco | Caminho `/pasta/arquivo` | Chave, via API HTTP |
| **Latência** | Menor (mais rápido) | Média | Maior |
| **Edição parcial** | Sim | Sim | Não (troca o objeto inteiro) |
| **Escala** | Limitada | Média | Praticamente infinita |
| **Custo** | Maior | Médio | Menor |
| **Caso típico** | Disco de banco/VM | Pasta compartilhada | Mídia, backup, logs |
| **Exemplos** | EBS, SSD | EFS, NFS, Azure Files | S3, Blob, GCS |

> **Regra de bolso:** banco de dados → **bloco**. Compartilhar pastas entre máquinas → **arquivo**. Guardar mídia e arquivos de usuário → **objeto**.

---

## 🗄️ Parte 2: o que é um SGBD

**SGBD = Sistema Gerenciador de Banco de Dados** (em inglês, DBMS). É o **software que fica entre a sua aplicação e os dados no disco**, e cuida de criar, estruturar, consultar, atualizar e proteger esses dados.

**Analogia:** o SGBD é o **gerente de uma biblioteca gigante**. Você não entra no acervo para procurar e mexer nos livros. Você fala com o gerente ("quero os livros de 2025 do autor X"), e ele garante a organização, o controle de quem pega o quê, e que dois leitores não rasguem a mesma página ao mesmo tempo.

Sem um SGBD, você teria que ler e escrever arquivos no disco na mão, controlar acesso simultâneo, garantir que nada corrompa no meio de uma falha de energia... O SGBD resolve tudo isso.

**O que ele entrega:**
- **Linguagem de consulta** (SQL, no mundo relacional).
- **Integridade:** regras que impedem dados inválidos (uma venda sem cliente, por exemplo).
- **Concorrência:** milhares de usuários ao mesmo tempo sem pisar no dado um do outro.
- **Segurança:** quem pode ver e alterar o quê.
- **Recuperação:** se faltar energia no meio de uma operação, o banco volta a um estado íntegro.

O seu **PostgreSQL** é um SGBD. O **MySQL**, o **SQL Server**, o **Oracle** também. Eles se dividem em duas grandes famílias pelo propósito: **OLTP** e **OLAP**.

---

## ⚡ Parte 3: OLTP, o banco do dia a dia

**OLTP = Online Transaction Processing** (processamento de transações em tempo real).

**O que é:** o banco otimizado para as **operações do dia a dia** da aplicação: muitas operações pequenas de **CRUD** (criar, ler, atualizar, apagar), acontecendo **ao mesmo tempo**, com **velocidade e exatidão**.

**Analogia:** o **caixa de um supermercado**. Milhares de operações pequenas e rápidas por minuto: passa produto, dá baixa no estoque, registra o pagamento. Cada operação é simples, mas precisa ser **imediata e correta**.

**Características:**
- Muitas transações **curtas e simultâneas**.
- Mistura de escrita e leitura, sempre em **poucos registros por vez**.
- Dados **atuais e detalhados**.
- Segue **ACID** à risca.

**Ferramentas:** PostgreSQL, MySQL, SQL Server, Oracle.

**Exemplo real:** quando você faz um **Pix** ou finaliza uma compra no Mercado Livre. O banco OLTP garante que o dinheiro saia de uma conta, entre na outra e dê baixa no estoque, **tudo ou nada**.

### ACID a fundo

ACID são as quatro garantias que tornam uma transação confiável. **Uma transação é um conjunto de operações que deve ser tratado como uma só.**

**Analogia central (a transferência bancária):** você transfere R$ 100 do João para a Maria. São dois passos: **tirar 100 do João** e **colocar 100 na Maria**. Se o sistema cair entre os dois, o dinheiro não pode sumir nem ser duplicado.

| Letra | Nome | O que garante | No exemplo |
|---|---|---|---|
| **A** | **Atomicidade** | Ou **tudo** acontece, ou **nada** acontece. Não existe meio-caminho | Se cair depois de tirar do João, a operação é **desfeita** (rollback). O João não perde 100 à toa |
| **C** | **Consistência** | O banco sai de um estado válido para outro válido; as regras nunca são quebradas | O total de dinheiro no sistema continua o mesmo. Nenhuma regra (saldo negativo, chave estrangeira) é violada |
| **I** | **Isolamento** | Transações simultâneas não se atrapalham; cada uma enxerga um estado coerente | Se o João faz duas transferências ao mesmo tempo, uma não lê o saldo "no meio" da outra |
| **D** | **Durabilidade** | Depois de confirmada (commit), a transação **sobrevive** a quedas de energia | Confirmou a transferência? Mesmo que o servidor desligue no segundo seguinte, ela está gravada |

**No seu PostgreSQL**, isso é literalmente:

```sql
BEGIN;                                             -- início da transação
  UPDATE contas SET saldo = saldo - 100 WHERE id = 1;  -- João
  UPDATE contas SET saldo = saldo + 100 WHERE id = 2;  -- Maria
COMMIT;                                            -- confirma tudo de uma vez
-- se algo der errado antes do COMMIT: ROLLBACK desfaz os dois UPDATEs
```

Se o banco cair entre os dois `UPDATE`, a **atomicidade** garante que nenhum dos dois valha. É por isso que operações financeiras **sempre** rodam dentro de uma transação, nunca como comandos soltos.

---

## 📊 Parte 4: OLAP, o banco da análise

**OLAP = Online Analytical Processing** (processamento analítico).

**O que é:** o banco projetado para **leitura pesada** sobre **grandes volumes de dados históricos**: cruzar métricas, gerar relatórios, alimentar BI e Machine Learning. Não é feito para alterar registros a todo segundo, mas para **analisar milhões deles de uma vez**.

**Analogia:** o **departamento de inteligência** da rede de supermercados. Não fica no caixa. Pega o histórico de **todos** os caixas, de **todas** as lojas, dos **últimos 5 anos**, e responde perguntas como "quais produtos vendem mais em dias de chuva no Sul?".

**Características:**
- Consultas **complexas e pesadas**, lendo milhões de linhas.
- **Pouca escrita**: os dados entram em **cargas periódicas** (uma vez por noite, por exemplo), não a cada transação.
- Dados **históricos, consolidados e agregados**.
- Organização em **cubos**: tabelas **fato** (as métricas, ex.: vendas) cruzadas com tabelas **dimensão** (os recortes, ex.: tempo, região, produto).

**Conceitos ligados:**
- **Data Warehouse:** o grande armazém que consolida os dados de várias fontes para análise.
- **Business Intelligence (BI):** ferramentas que leem o Data Warehouse e geram painéis (Power BI, Looker, Metabase).
- **ETL / ELT:** o processo que **Extrai** dos sistemas OLTP, **Transforma** e **Carrega** no OLAP.

**Ferramentas:** Amazon Redshift, Google BigQuery, Snowflake.

**Exemplo real:** a diretoria do iFood usando o **BigQuery** ligado ao **Power BI** para analisar 5 anos de pedidos, descobrir padrões e planejar campanhas.

---

## ⚖️ OLTP x OLAP lado a lado

| Característica | OLTP (transacional) | OLAP (analítico) |
|---|---|---|
| **Objetivo** | Operações do dia a dia em tempo real | Analisar histórico e gerar insights |
| **Operação típica** | CRUD rápido, poucos registros | Leitura pesada, milhões de registros |
| **Escrita** | Intensa e constante | Rara (cargas periódicas) |
| **Tipo de dado** | Atual e detalhado | Histórico, consolidado, agregado |
| **Usuário** | A aplicação, o cliente final | Analistas, diretoria, cientistas de dados |
| **Tamanho da consulta** | "Qual o saldo da conta 123?" | "Qual a média de vendas por região nos últimos 5 anos?" |
| **Modelagem** | Normalizada (evita repetição) | Dimensional (cubos, fato e dimensão) |
| **Exemplos** | PostgreSQL, MySQL, SQL Server, Oracle | BigQuery, Redshift, Snowflake |

> **A frase para guardar:** OLTP **registra** o que acontece agora; OLAP **entende** o que já aconteceu. Um alimenta o outro.

---

## 🔗 Como tudo se conecta numa empresa real

Os conceitos não vivem isolados. Veja o fluxo típico de um e-commerce:

```
Cliente faz um pedido no app
        │
        ▼
┌─────────────────────┐
│   OLTP (PostgreSQL) │  grava o pedido na hora, com ACID (block storage)
└─────────┬───────────┘
          │  toda noite, um processo ETL copia os dados
          ▼
┌─────────────────────┐
│  OLAP (BigQuery)    │  acumula o histórico para análise
└─────────┬───────────┘
          │
          ▼
    Power BI / dashboards  →  a diretoria decide

   Em paralelo:
   - fotos dos produtos e notas fiscais → Object Storage (S3)
   - pasta de arquivos entre servidores → File Storage (NFS)
   - disco onde o PostgreSQL grava       → Block Storage (EBS)
```

Repare: **uma única aplicação usa os três armazenamentos e os dois tipos de banco**, cada um no seu papel. Saber escolher é o trabalho do arquiteto de soluções.

---

## 💻 No seu dia a dia (Node, NestJS, PostgreSQL)

| Conceito | Como aparece para você |
|---|---|
| **OLTP** | O seu PostgreSQL com o TypeORM/Prisma. Todo CRUD da sua API |
| **Transação ACID** | `queryRunner.startTransaction()` no TypeORM, ou `prisma.$transaction([...])` |
| **Block storage** | O disco (EBS, Persistent Disk) onde o banco roda em produção |
| **Object storage** | Em vez de salvar o `BYTEA` de uma imagem no Postgres, você sobe para o **S3** e guarda **só a URL** no banco |
| **File storage** | Uma pasta NFS montada para uploads compartilhados entre instâncias |
| **OLAP** | Quando os relatórios da diretoria começam a travar o banco de produção, é sinal de que a análise deveria sair para um OLAP separado |

**Um erro clássico que isso te ajuda a evitar:** guardar arquivos grandes (PDFs, imagens, vídeos) **dentro** do PostgreSQL. O banco incha, os backups ficam lentos e caros. O certo é mandar o arquivo para o **object storage** e guardar no banco apenas a **chave/URL** do objeto. É exatamente a separação "banco para dados estruturados, object storage para blobs".

**Outro:** rodar relatório analítico pesado direto no banco de produção OLTP. Uma query que varre 5 anos de pedidos pode **travar** as transações dos clientes. Por isso se separa OLTP de OLAP.

---

## 📚 Leituras no Silberschatz (*Database System Concepts*)

| Capítulo | Tema |
|---|---|
| **1** | Introdução: o que é e por que existe um SGBD |
| **4** | SQL intermediário (transações, junções) |
| **17** | Transações e as propriedades **ACID** |
| **18** | Controle de concorrência (o "I" do isolamento) |
| **19** | Recuperação após falhas (o "D" da durabilidade) |
| **11** | Armazenamento físico (como o banco usa o disco em blocos) |

**Complementos do roteiro:** [Block, File e Object Storage (AWS)](https://aws.amazon.com/pt/compare/the-difference-between-block-file-object-storage) · [What Are ACID Transactions? (Databricks)](https://www.databricks.com/blog/what-are-acid-transactions)

---

## 🧠 Perguntas para testar o entendimento

1. Você precisa guardar as fotos de perfil dos usuários do seu sistema. **Block, file ou object storage?** Por quê?
2. Explique, com a transferência bancária, o que cada letra do **ACID** garante.
3. Por que é má ideia rodar o relatório anual da diretoria direto no banco **OLTP** de produção?
4. No seu PostgreSQL, por que uma operação financeira deve ficar dentro de `BEGIN ... COMMIT` em vez de dois comandos soltos?
