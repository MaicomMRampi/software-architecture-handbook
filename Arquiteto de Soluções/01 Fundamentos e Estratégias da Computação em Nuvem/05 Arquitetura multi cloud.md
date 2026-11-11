# ☁️☁️ Arquitetura Multicloud

> **Módulo 01 · Computação em Nuvem** — Usar serviços de mais de um provedor de nuvem pública: motivações, padrões, desafios e trade-offs.

---

## 1. Conceito

**Multicloud** é a estratégia de utilizar serviços de **dois ou mais provedores de nuvem pública** (ex.: AWS, Azure, Google Cloud, OCI) em uma mesma organização ou solução.

| Termo | Definição |
|---|---|
| **Multicloud** | Vários provedores de nuvem **pública** |
| **Nuvem híbrida** | Combinação de nuvem **privada/on-premises** com nuvem **pública**, integradas |
| **Híbrida + multicloud** | On-premises + mais de um provedor público |

> Multicloud pode ser **intencional** (estratégia) ou **acidental** (cada time/aquisição escolheu um provedor diferente).

## 2. Por que adotar multicloud?

- **Evitar lock-in** com um único fornecedor e ganhar poder de negociação;
- **Melhor serviço para cada caso** (*best of breed*): ex. BigQuery/Vertex AI no GCP, Microsoft 365/Entra ID na Azure, maior catálogo na AWS;
- **Resiliência:** reduzir impacto de falhas regionais ou globais de um provedor;
- **Requisitos regulatórios e de soberania de dados:** regiões ou certificações disponíveis só em determinado provedor;
- **Fusões e aquisições:** empresas que já trazem outra nuvem;
- **Latência/presença geográfica.**

## 3. Desafios

| Desafio | Descrição |
|---|---|
| **Complexidade operacional** | Várias consoles, APIs, modelos de IAM e de rede |
| **Habilidades** | Time precisa dominar mais de uma plataforma |
| **Segurança e identidade** | Políticas consistentes entre provedores; superfície de ataque maior |
| **Rede e egress** | Tráfego entre nuvens é cobrado (*egress fees*) e adiciona latência |
| **Governança e custos (FinOps)** | Visão consolidada de gastos é difícil |
| **Consistência de dados** | Replicar dados entre nuvens é caro e complexo |
| **Mínimo denominador comum** | Para ser portável, abre-se mão de serviços gerenciados avançados |

## 4. Padrões arquiteturais multicloud

1. **Particionamento por carga de trabalho:** cada sistema roda inteiro em um provedor (ex.: ERP na Azure, analytics no GCP). Mais simples e o mais comum.
2. **Ativo-passivo (DR):** produção em um provedor, recuperação de desastre em outro.
3. **Ativo-ativo:** a mesma aplicação roda simultaneamente em mais de um provedor, com balanceamento global (DNS/GSLB). Máxima resiliência, máxima complexidade.
4. **Burst/arbitragem:** carga extra ou mais barata direcionada a outro provedor.
5. **Front-end/edge agnóstico:** CDN e WAF de terceiros (Cloudflare, Akamai) na frente de backends em nuvens diferentes.

```text
                   ┌──────────── DNS global / CDN ────────────┐
                   ↓                                          ↓
           ┌──────────────┐                           ┌──────────────┐
           │     AWS      │   ←─ replicação dados ─→  │    Azure     │
           │ K8s (EKS)    │                           │ K8s (AKS)    │
           └──────────────┘                           └──────────────┘
                   ↑______ Terraform / GitOps / Observabilidade única ______↑
```

## 5. Tecnologias habilitadoras

- **Containers e Kubernetes:** camada de abstração comum (EKS, AKS, GKE) — base da portabilidade;
- **Infraestrutura como código agnóstica:** Terraform/OpenTofu, Pulumi, Crossplane;
- **Service mesh:** Istio, Linkerd, Consul (conectividade e mTLS entre clusters);
- **Identidade federada:** SSO via OIDC/SAML (Okta, Entra ID);
- **Observabilidade unificada:** OpenTelemetry, Grafana, Datadog;
- **Cloud Management Platforms (CMP):** gestão centralizada de custos, governança e provisionamento (ver [06 Cloud management platforms](06%20Cloud%20management%20platformas.md)).

## 6. Trade-off central

> **Portabilidade × uso de serviços gerenciados.** Quanto mais você usa serviços nativos (DynamoDB, Lambda, BigQuery), mais produtivo e menos portável fica. Quanto mais abstrai (só Kubernetes + Postgres), mais portável e mais trabalho operacional assume.

Recomendação comum: adotar multicloud **por motivo de negócio claro**, preferindo particionar por carga de trabalho, e não "rodar tudo em todas as nuvens" por padrão.

## 7. Analogia

Ter contas em mais de um banco: você diversifica riscos e usa o melhor produto de cada um, mas precisa controlar vários aplicativos, senhas, tarifas e transferências entre eles (que custam).

---

## ✅ Pontos-chave

- Multicloud = mais de um provedor **público**; híbrida = privada + pública.
- Motivações: evitar lock-in, best of breed, resiliência, regulação.
- Custos ocultos: complexidade, egress, skills, governança.
- Kubernetes, Terraform e OpenTelemetry são os principais habilitadores.

## ❓ Perguntas de revisão

<details><summary>1. Qual a diferença entre multicloud e nuvem híbrida?</summary>
Multicloud usa mais de um provedor de nuvem pública; nuvem híbrida integra infraestrutura privada/on-premises com nuvem pública.
</details>

<details><summary>2. Cite três desafios do multicloud.</summary>
Complexidade operacional, custos de tráfego entre nuvens (egress) e governança/segurança consistente entre provedores.
</details>

<details><summary>3. Qual o padrão multicloud mais simples e mais comum?</summary>
Particionamento por carga de trabalho: cada sistema roda inteiramente em um provedor escolhido pelo melhor encaixe.
</details>

## 🔗 Relacionadas

- [03 Modelos de implantação em nuvem](03%20Modelos%20de%20Implantacao%20em%20Nuvem.md)
- [06 Cloud management platforms](06%20Cloud%20management%20platformas.md)
- [08 Responsabilidade na cloud](08%20Responsabilidade%20na%20Cloud.md)

## 📚 Referências

- NIST SP 500-292 — *Cloud Computing Reference Architecture*.
- Google Cloud — *Hybrid and multicloud patterns*. https://cloud.google.com/architecture/hybrid-multicloud-patterns
