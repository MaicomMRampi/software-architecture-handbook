# 🛠️ Modelos de Serviço em Nuvem

> **Módulo 01 · Computação em Nuvem** — On-premises, IaaS, PaaS, SaaS e além (CaaS, FaaS): quem gerencia o quê em cada modelo.

---

O modelo de serviço define **até onde vai a responsabilidade do provedor** e onde começa a do cliente. Quanto mais "acima" na pilha, menos controle e menos trabalho operacional.

## 1. Quem gerencia o quê

| Camada | On-premises | IaaS | PaaS | SaaS |
|---|:---:|:---:|:---:|:---:|
| Aplicação | 🟦 | 🟦 | 🟦 | 🟧 |
| Dados | 🟦 | 🟦 | 🟦 | 🟦* |
| Runtime / middleware | 🟦 | 🟦 | 🟧 | 🟧 |
| Sistema operacional | 🟦 | 🟦 | 🟧 | 🟧 |
| Virtualização | 🟦 | 🟧 | 🟧 | 🟧 |
| Servidores, storage, rede | 🟦 | 🟧 | 🟧 | 🟧 |
| Data center físico | 🟦 | 🟧 | 🟧 | 🟧 |

🟦 cliente · 🟧 provedor · \* no SaaS o cliente continua responsável pelos **seus dados, usuários e permissões**.

---

## 2. On-premises (local)

Toda a infraestrutura física e lógica é da organização: hardware, rede, refrigeração, energia, SO, dados e aplicações.

> **Exemplo:** a empresa compra servidores, instala numa sala na sede e mantém equipe própria para cabos, refrigeração e manutenção.

**Quando faz sentido:** requisitos de latência local extrema, regulação muito restritiva, cargas estáveis e grandes já amortizadas.

---

## 3. IaaS — Infraestrutura como Serviço

O provedor entrega **recursos básicos**: VMs, armazenamento e rede. O cliente gerencia SO, patches, runtime, banco e aplicação.

> **Exemplos:** AWS EC2, Azure Virtual Machines, Google Compute Engine; armazenamento S3/EBS; VPC.

| Vantagens | Desvantagens |
|---|---|
| Máximo controle e flexibilidade | Mais trabalho operacional (patches, segurança do SO) |
| Bom para migrar aplicações legadas (*lift and shift*) | Exige conhecimento de infraestrutura |

---

## 4. PaaS — Plataforma como Serviço

O provedor gerencia infraestrutura, SO, atualizações e **ambiente de execução**. O cliente cuida do **código e dos dados**.

> **Exemplos:** AWS Elastic Beanstalk, Azure App Service, Google App Engine, Heroku, Render; bancos gerenciados (Amazon RDS, Azure SQL, Cloud SQL).

| Vantagens | Desvantagens |
|---|---|
| Foco no código, deploy simples | Menos controle sobre o ambiente |
| Escala, patches e alta disponibilidade gerenciados | Limitações de runtime e configuração |
| Maior produtividade do time | Maior risco de lock-in |

---

## 5. SaaS — Software como Serviço

Software **pronto para uso** pela internet. O provedor gerencia tudo; o cliente apenas usa e configura.

> **Exemplos:** Google Workspace, Microsoft 365, Salesforce, Slack, Trello, Zoom.

| Vantagens | Desvantagens |
|---|---|
| Zero instalação e manutenção | Pouca personalização |
| Atualizações automáticas, assinatura previsível | Dados sob guarda do fornecedor; integração limitada às APIs |

---

## 6. Modelos intermediários e modernos

| Modelo | O que é | Exemplos |
|---|---|---|
| **CaaS** (*Containers as a Service*) | Orquestração de containers gerenciada | Amazon EKS/ECS, AKS, GKE, Cloud Run |
| **FaaS** (*Functions as a Service* / serverless) | Executa funções sob eventos; paga por execução; escala a zero | AWS Lambda, Azure Functions, Cloud Functions |
| **DBaaS** | Banco de dados gerenciado | RDS, DynamoDB, MongoDB Atlas |
| **BaaS** (*Backend as a Service*) | Autenticação, banco e storage prontos para apps | Firebase, Supabase |
| **AIaaS** | Modelos e serviços de IA via API | Amazon Bedrock, Azure OpenAI, Vertex AI |

```text
Mais controle                                              Menos gestão
On-prem → IaaS → CaaS → PaaS → FaaS/Serverless → SaaS
```

---

## 7. Analogia — Pizza as a Service

| Modelo | Analogia |
|---|---|
| **On-premises** | Faz a pizza em casa: compra ingredientes, forno, gás, mesa |
| **IaaS** | Aluga a cozinha equipada; você traz ingredientes e faz a pizza |
| **PaaS** | Compra a pizza para assar em casa (*take and bake*); você só assa e serve |
| **SaaS** | Vai à pizzaria: só come |

---

## 8. Como escolher

| Se você precisa… | Prefira |
|---|---|
| Controle total do SO ou migrar legado rápido | IaaS |
| Focar no código de uma aplicação web/API | PaaS ou CaaS |
| Processamento orientado a eventos, carga intermitente | FaaS |
| Função de negócio comum (e-mail, CRM, ERP) | SaaS |

> Regra prática: **suba na pilha o máximo possível** — use o serviço mais gerenciado que atende aos requisitos, e desça só quando houver motivo (controle, custo em escala, restrição técnica).

---

## ✅ Pontos-chave

- IaaS = infraestrutura; PaaS = plataforma para o código; SaaS = software pronto.
- Quanto mais gerenciado, menos controle e menos trabalho operacional.
- CaaS e FaaS (serverless) são modelos intermediários modernos.
- Mesmo no SaaS, **dados e acessos** são responsabilidade do cliente.

## ❓ Perguntas de revisão

<details><summary>1. Em IaaS, quem aplica patches no sistema operacional?</summary>
O cliente.
</details>

<details><summary>2. Classifique: EC2, Heroku, Gmail e Lambda.</summary>
EC2 = IaaS; Heroku = PaaS; Gmail = SaaS; Lambda = FaaS (serverless).
</details>

<details><summary>3. Qual o principal trade-off ao subir de IaaS para PaaS?</summary>
Ganha-se produtividade e menos operação; perde-se controle sobre o ambiente e aumenta o risco de lock-in.
</details>

<details><summary>4. Em SaaS, o cliente não tem nenhuma responsabilidade de segurança?</summary>
Tem: continua responsável pelos seus dados, contas de usuários, permissões e configurações de acesso.
</details>

## 🔗 Relacionadas

- [03 Modelos de implantação](03%20Modelos%20de%20Implantacao%20em%20Nuvem.md)
- [08 Responsabilidade na cloud](08%20Responsabilidade%20na%20Cloud.md)
- [Arquiteturas cloud e serverless](../../Arquiteto%20de%20Software/04%20Arquiteturas%20da%20atualidade/05%20Arquiteturas%20cloud%20e%20serverless.md)

## 📚 Referências

- NIST SP 800-145.
- KERRISON, A. *Pizza as a Service*, 2014.
