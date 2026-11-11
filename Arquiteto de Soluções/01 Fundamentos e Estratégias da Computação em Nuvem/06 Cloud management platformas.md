# 🎛️ Cloud Management Platforms (CMP)

> **Módulo 01 · Computação em Nuvem** — Plataformas que centralizam custos, governança, provisionamento e monitoramento de ambientes multicloud e híbridos.

---

## 1. O que é uma CMP?

Uma **Cloud Management Platform (CMP)** é um conjunto integrado de ferramentas que permite gerenciar ambientes **multicloud** e **híbridos** a partir de um painel único (*single pane of glass*).

Quando a TI se divide entre AWS, Azure, GCP e data centers locais, cada um com console, APIs, IAM e faturamento próprios, a CMP **abstrai essas diferenças** e padroniza governança, custos e operação.

```text
                ┌──────────── CMP (painel único) ────────────┐
                │ Custos · Políticas · Catálogo · Inventário │
                └──────┬──────────┬──────────┬──────────┬────┘
                       ↓          ↓          ↓          ↓
                     AWS        Azure       GCP     On-premises (VMware)
```

---

## 2. Os 4 pilares de uma CMP

### 2.1 Gestão financeira (FinOps)

- **Faturamento unificado** dos vários provedores em um dashboard;
- **Showback/chargeback:** atribuir custos a times, projetos e centros de custo (via **tags**);
- **Detecção de desperdício:** discos não anexados, IPs ociosos, instâncias superdimensionadas (*rightsizing*), ambientes de teste ligados à noite;
- **Previsão e alertas** de orçamento;
- **Recomendações** de instâncias reservadas, Savings Plans e Spot.

### 2.2 Governança, segurança e compliance

- **Políticas centralizadas** (ex.: "nenhum bucket S3 ou Blob pode ser público", "só regiões no Brasil");
- **RBAC unificado:** permissões por papel, independentemente da nuvem;
- **Auditoria:** quem criou, alterou ou destruiu cada recurso;
- **Postura de segurança (CSPM):** detectar configurações inseguras e desvios de benchmarks (CIS).

### 2.3 Provisionamento e automação self-service

- **Catálogo de serviços:** o desenvolvedor pede "ambiente de dev padrão" e recebe já com rede, segurança e tags corretas;
- **Orquestração:** backups, desligamento fora do horário comercial, autoscaling;
- Integração com **IaC** (Terraform) e pipelines CI/CD.

### 2.4 Inventário e monitoramento

- **Inventário em tempo real** de VMs, containers, redes e bancos em todos os ambientes;
- Métricas de desempenho e disponibilidade consolidadas;
- Detecção de **shadow IT** (recursos criados fora do processo).

---

## 3. Ferramentas do mercado

| Categoria | Exemplos |
|---|---|
| **CMPs / gestão híbrida** | VMware Aria (antigo vRealize), Morpheus, Scalr, Flexera One, ServiceNow ITOM |
| **Nativas com alcance multicloud** | Azure Arc, Google Anthos / GKE Enterprise, AWS Systems Manager |
| **FinOps** | CloudHealth, Apptio Cloudability, Vantage, Kubecost (Kubernetes) |
| **Governança e segurança (CSPM)** | Prisma Cloud, Wiz, Microsoft Defender for Cloud |
| **Provisionamento / IaC** | Terraform Cloud / HCP, Pulumi, Crossplane, Backstage (portal do desenvolvedor) |

> Nem sempre uma CMP "tudo em um" é necessária: muitas empresas combinam **Terraform + ferramenta de FinOps + CSPM + observabilidade** (Datadog, Grafana).

---

## 4. Benefícios e desafios

| Benefícios | Desafios |
|---|---|
| Visão consolidada de custos e recursos | Licenciamento caro |
| Governança e segurança consistentes | Pode ficar atrás das novidades dos provedores |
| Autoatendimento com guarda-corpos (*guardrails*) | Abstração esconde recursos específicos de cada nuvem |
| Menos trabalho manual e erros | Mais uma plataforma para operar (e possível lock-in na CMP) |

---

## 5. CMP e Platform Engineering

A tendência atual é a **engenharia de plataforma**: um time interno constrói uma **plataforma interna de desenvolvimento (IDP)** — portal self-service (ex.: Backstage), templates de serviço, pipelines e políticas — oferecendo aos desenvolvedores *golden paths* (caminhos padronizados) sobre uma ou mais nuvens. Na prática, cumpre o papel de CMP voltado ao desenvolvedor.

---

## 6. Analogia — Administradora de condomínios

Uma administradora cuida de vários prédios (provedores de nuvem) diferentes: consolida as contas, aplica as mesmas regras de segurança, mantém o cadastro de tudo e oferece aos moradores um canal único para pedir serviços — sem que cada morador precise falar com cada fornecedor.

---

## ✅ Pontos-chave

- CMP = **painel único** para gerenciar multicloud e nuvem híbrida.
- Pilares: **FinOps, governança/segurança, provisionamento self-service, inventário/monitoramento**.
- Tags e políticas são a base de custos e governança.
- Engenharia de plataforma (IDP) é a evolução voltada ao desenvolvedor.

## ❓ Perguntas de revisão

<details><summary>1. Qual problema uma CMP resolve?</summary>
A fragmentação de gestão em ambientes multicloud/híbridos: cada provedor tem console, IAM, faturamento e APIs próprios. A CMP unifica custos, governança, provisionamento e inventário.
</details>

<details><summary>2. O que é showback e chargeback?</summary>
Showback mostra a cada time quanto ele consome; chargeback efetivamente cobra (rateia) esse custo para o centro de custo do time.
</details>

<details><summary>3. Cite dois exemplos de desperdício que uma CMP detecta.</summary>
Discos não anexados a nenhuma instância e instâncias superdimensionadas ou ligadas fora do horário de uso.
</details>

<details><summary>4. Qual a relação entre CMP e engenharia de plataforma?</summary>
Ambas oferecem gestão centralizada e autoatendimento com guardrails; a engenharia de plataforma foca na experiência do desenvolvedor por meio de uma plataforma interna (IDP) com golden paths.
</details>

## 🔗 Relacionadas

- [05 Arquitetura multicloud](05%20Arquitetura%20multi%20cloud.md)
- [02 Princípios (pay-as-you-go e FinOps)](02%20Principios%20da%20Computa%C3%A7%C3%A3o%20em%20Nuvem.md)

## 📚 Referências

- Gartner — *Cloud Management Platforms* (definição de mercado).
- FinOps Foundation — https://www.finops.org
- Backstage — https://backstage.io
