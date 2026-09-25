# Arquiteturas Cloud Native e Serverless

## 📌 Visão Geral
À medida que a computação em nuvem evoluiu, a forma como projetamos softwares mudou. O foco deixou de ser o gerenciamento de máquinas físicas ou virtuais e passou a ser o desenvolvimento focado em **escalabilidade**, **resiliência** e **agilidade de entrega**.

* **Cloud Native:** Um conjunto de práticas e padrões para criar aplicações nativamente otimizadas para ambientes de nuvem dinâmica.
* **Serverless:** Um modelo de execução em nuvem onde o provedor gerencia dinamicamente a alocação e o provisionamento de servidores.

---

## 🏠 Analogia da Vida Real: Da Casa Própria ao Quarto de Hotel

Para entender a evolução da infraestrutura:

1. **On-Premises / VM Tradicional (Casa Própria):** Você compra a casa, cuida da pintura, encanamento e segurança. Se for viajar por 1 mês, continua pagando IPTU, conta de luz fixa e manutenção, mesmo com a casa vazia.
2. **Cloud Native (Condomínio de Apartamentos Modulares):** Você aluga apartamentos prontos e padronizados em um condomínio moderno (**Contêineres**). A estrutura do prédio (elevadores, portaria) é gerenciada, mas você organiza seus móveis e programa o condomínio para liberar um quarto extra (**Autoscaling**) quando receber visitas.
3. **Serverless (Quarto de Hotel sob Demanda ou Uber):** Você não aluga o apartamento inteiro. Você paga apenas pelos **minutos exatos** em que usou o quarto ou a corrida. Não há custo quando você não está usando, e a manutenção, limpeza e infraestrutura são 100% invisíveis para você.

---

## 📊 Tabela Comparativa

| Critério | Tradicional (IaaS / VM) | Cloud Native (Containers / K8s) | Serverless (FaaS) |
| :--- | :--- | :--- | :--- |
| **Gerenciamento de Servidor** | Total (SO, patches, rede) | Parcial (Gerencia os nós ou clusters) | Zero (Invisível ao dev) |
| **Escalabilidade** | Lenta (minutos a horas) | Rápida (segundos/minutos) | Instantânea (milissegundos) |
| **Modelo de Cobrança** | Fixo por hora/mês ligado | Fixo por recurso alocado no cluster | Pagamento estrito por execução/tempo |
| **Ciclo de Vida do Processo** | Longa duração (*Long-running*) | Longa duração (*Long-running*) | Curta duração (*Efémero/Stateless*) |
| **Gargalo Principal** | Custo fixo alto e ociosidade | Complexidade de orquestração | *Cold Starts* e limite de execução |

---

## 🏗️ Os 4 Pilares do Cloud Native

A *Cloud Native Computing Foundation* (CNCF) define a arquitetura nativa com base em 4 pilares:

```text
                       CLOUD NATIVE        

              └───────────┬────────────┘
     ┌────────────────────┼────────────────────┐
     │                    │                    │
┌────────┴─────────┐ ┌────────┴─────────┐ ┌────────┴─────────┐ ┌────────┴─────────┐
│  Microsserviços  │ │   Contêineres    │ │ DevOps & CI/CD  │ │ Orquestração    │
│  (Desacoplados)  │ │   (Docker)       │ │  (Automação)    │ │  (Kubernetes)   │
└──────────────────┘ └──────────────────┘ └─────────────────┘ └─────────────────┘
```

1. **Microsserviços:** Aplicação dividida em serviços menores, independentes e focados em um único domínio de negócio.
2. **Empacotamento via Contêineres:** Garantia de que a aplicação rode da mesma forma em qualquer ambiente (desenvolvimento, teste, produção).
3. **DevOps e CI/CD:** Integração e implantação contínuas para entregar código em produção de forma rápida e automatizada.
4. **Orquestração Dinâmica:** Ferramentas que gerenciam a saúde, escala e rede dos contêineres automaticamente.

---

## ⚡ Características Fundamentais do Serverless

O modelo Serverless combina duas abordagens principais:

* **FaaS (Function as a Service):** O desenvolvedor escreve pequenas funções ativadas por **eventos** (ex: um upload de imagem no storage dispara uma função que redimensiona a foto).
* **BaaS (Backend as a Service):** Uso de serviços terceirizados totalmente gerenciados para banco de dados, autenticação ou filas (ex: DynamoDB, Firebase, AWS SQS).

### Principais Conceitos Serverless:
* **Execução orientada a eventos:** A função só executa em resposta a um gatilho (HTTP, fila, banco de dados).
* **Stateless (Sem Estado):** Cada invocação da função é isolada. Nenhum dado local é mantido entre as execuções.
* **Cold Start (Início Frio):** O pequeno atraso (latência) que ocorre quando a nuvem precisa subir um novo ambiente do zero para responder a uma primeira requisição após um período de inatividade.

---

## 🎯 Quando usar cada arquitetura?

### Use Cloud Native (Contêineres / Kubernetes) se:
* A aplicação exige processos contínuos de longa duração (ex: conexões WebSocket persistentes, *daemons*).
* Você precisa de controle sobre o ambiente de execução ou bibliotecas do sistema operacional.
* Deseja evitar o *Vendor Lock-in* (dependência de um único provedor de nuvem), pois contêineres rodam em qualquer lugar.

### Use Serverless se:
* O tráfego da aplicação é altamente imprevisível ou possui picos esporádicos.
* Você quer reduzir ao máximo os custos operacionais e de manutenção de infraestrutura.
* Está construindo microsserviços orientados a eventos, APIs REST ou processamento de tarefas em segundo plano.

---

## 🛠️ Tecnologias Populares

### Cloud Native Ecosystem
* **Contêineres e Orquestração:** Docker, Kubernetes (K8s), OpenShift.
* **Service Mesh & Observabilidade:** Istio, Linkerd, Prometheus, Grafana, Jaeger.
* **CI/CD:** GitHub Actions, GitLab CI, ArgoCD.

### Serverless Ecosystem
* **FaaS (Compute):** AWS Lambda, Google Cloud Functions, Azure Functions.
* **BaaS & Databases:** AWS DynamoDB, Firebase, Supabase, Amazon S3.
* **Frameworks de Implantação:** Serverless Framework, AWS SAM, SST.