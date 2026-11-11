# ☁️ Introdução à Computação em Nuvem

> **Módulo 01 · Computação em Nuvem** — O que é nuvem, as 5 características essenciais do NIST, vantagens, riscos e como mitigá-los.

---

## 1. Conceito

**Computação em nuvem** é a entrega de recursos de computação (servidores, armazenamento, bancos de dados, redes, software, IA) **pela internet, sob demanda**, com pagamento pelo uso. Em vez de comprar e manter data centers próprios, a organização aluga a capacidade de um provedor.

### Definição do NIST (SP 800-145)

> Modelo que permite acesso **ubíquo, conveniente e sob demanda**, via rede, a um conjunto compartilhado de recursos configuráveis, que podem ser **rapidamente provisionados e liberados** com mínimo esforço de gestão ou interação com o provedor.

O NIST organiza a nuvem em **5 características, 3 modelos de serviço e 4 modelos de implantação**:

```text
5 características essenciais
├── Autoatendimento sob demanda
├── Amplo acesso à rede
├── Pool de recursos (multi-tenant)
├── Elasticidade rápida
└── Serviço medido (pay-as-you-go)

3 modelos de serviço:     IaaS · PaaS · SaaS                     → nota 04
4 modelos de implantação: Pública · Privada · Híbrida · Comunitária → nota 03
```

| Característica | O que significa | Exemplo |
|---|---|---|
| **Autoatendimento sob demanda** | Provisionar sem falar com ninguém do provedor | Criar uma VM pelo console em 1 minuto |
| **Amplo acesso à rede** | Acessível por rede padrão, de vários dispositivos | Console web, CLI, SDK, app mobile |
| **Pool de recursos** | Hardware compartilhado entre clientes, alocado dinamicamente | Várias empresas no mesmo servidor, isoladas logicamente |
| **Elasticidade rápida** | Aumentar/reduzir rapidamente, até automaticamente | Auto Scaling na Black Friday |
| **Serviço medido** | Uso monitorado e cobrado | Cobrança por segundo de VM, por GB armazenado |

---

## 2. Principais vantagens

- **Escalabilidade:** ampliar ou reduzir a infraestrutura conforme a demanda, sem comprar equipamento;
- **Elasticidade:** ajuste automático dos recursos às variações de uso;
- **Custo:** troca **CAPEX por OPEX** — paga-se pelo uso, sem investimento inicial em hardware;
- **Agilidade:** ambientes em minutos, não em semanas de compra e instalação;
- **Alcance global:** regiões em vários continentes, menor latência para usuários distantes;
- **Serviços gerenciados:** banco, filas, IA e segurança prontos, reduzindo trabalho operacional;
- **Resiliência:** várias zonas de disponibilidade e regiões para alta disponibilidade e recuperação de desastres.

### Infraestrutura global (exemplo AWS)

| Conceito | Definição |
|---|---|
| **Região** | Área geográfica com vários data centers (ex.: `sa-east-1`, São Paulo) |
| **Zona de Disponibilidade (AZ)** | Um ou mais data centers isolados dentro da região, com energia e rede próprias |
| **Edge location / PoP** | Ponto de presença para CDN e DNS, perto dos usuários |

> Para alta disponibilidade, distribua a aplicação em **pelo menos duas AZs**.

---

## 3. Riscos e desafios

| Risco | Descrição |
|---|---|
| **Dependência de conectividade** | Sem internet estável, não há acesso aos serviços |
| **Segurança e privacidade** | Vazamentos e acessos indevidos — geralmente por **má configuração do cliente** |
| **Vendor lock-in** | Dependência de serviços proprietários de um provedor |
| **Custos descontrolados** | Recursos esquecidos ligados, falta de governança ("bill shock") |
| **Conformidade e soberania** | Onde os dados ficam armazenados (LGPD, regulações setoriais) |
| **Falta de habilidades** | Times sem experiência em arquitetura e operação em nuvem |

---

## 4. Estratégias de mitigação

- **Gestão financeira (FinOps):** orçamentos, alertas, tags de custo, desligar recursos ociosos, instâncias reservadas/spot;
- **Política de segurança:** criptografia, MFA, menor privilégio, monitoramento (ver [08 Responsabilidade na cloud](08%20Responsabilidade%20na%20Cloud.md));
- **Continuidade do negócio:** redundância multi-AZ, backups, plano de DR testado;
- **Escolha criteriosa do provedor:** confiabilidade, certificações (ISO 27001, SOC 2), região no Brasil, suporte a **IaC**;
- **Reduzir lock-in quando fizer sentido:** containers, Terraform, padrões abertos (ver [05 Multicloud](05%20Arquitetura%20multi%20cloud.md)).

### Estratégias de migração — os 7 Rs

| Estratégia | O que é |
|---|---|
| **Retire** | Desligar o que não é mais usado |
| **Retain** | Manter on-premises (por enquanto) |
| **Rehost** (*lift and shift*) | Mover como está para VMs na nuvem |
| **Relocate** | Mover a plataforma de virtualização inteira (ex.: VMware Cloud on AWS) |
| **Replatform** (*lift, tinker and shift*) | Pequenas otimizações (ex.: banco para RDS gerenciado) |
| **Repurchase** | Trocar por SaaS (ex.: CRM próprio → Salesforce) |
| **Refactor / Re-architect** | Reescrever para cloud-native (microsserviços, serverless) |

### Frameworks de boas práticas

**Well-Architected Framework** (AWS; Azure e Google têm equivalentes) — 6 pilares: **excelência operacional, segurança, confiabilidade, eficiência de desempenho, otimização de custos e sustentabilidade**.

---

## 5. Analogia — Energia elétrica

Antigamente, fábricas tinham seus próprios geradores (data center próprio). Hoje, ligam-se à rede elétrica e pagam pelo kWh consumido (nuvem). Ganha-se escala e conveniência, mas depende-se da distribuidora e é preciso controlar o consumo para a conta não explodir.

---

## ✅ Pontos-chave

- Nuvem = recursos sob demanda, pela rede, pagos pelo uso.
- NIST: **5 características**, **3 modelos de serviço**, **4 modelos de implantação**.
- Vantagens: escala, elasticidade, OPEX, agilidade, alcance global.
- Riscos: segurança (má configuração), lock-in, custos, conectividade, conformidade.
- Migração: **7 Rs**; boas práticas: **Well-Architected**.

## ❓ Perguntas de revisão

<details><summary>1. Quais são as 5 características essenciais da nuvem segundo o NIST?</summary>
Autoatendimento sob demanda, amplo acesso à rede, pool de recursos, elasticidade rápida e serviço medido.
</details>

<details><summary>2. Qual a diferença entre região e zona de disponibilidade?</summary>
Região é uma área geográfica; zonas de disponibilidade são data centers isolados dentro de uma região. Distribuir em várias AZs dá alta disponibilidade.
</details>

<details><summary>3. O que é "lift and shift" e qual sua limitação?</summary>
Rehost: mover a aplicação como está para VMs na nuvem. É rápido, mas não aproveita elasticidade nem serviços gerenciados, e pode até custar mais.
</details>

<details><summary>4. Quais são os 6 pilares do Well-Architected Framework?</summary>
Excelência operacional, segurança, confiabilidade, eficiência de desempenho, otimização de custos e sustentabilidade.
</details>

## 🔗 Relacionadas

- [02 Princípios da computação em nuvem](02%20Principios%20da%20Computa%C3%A7%C3%A3o%20em%20Nuvem.md)
- [03 Modelos de implantação](03%20Modelos%20de%20Implantacao%20em%20Nuvem.md)
- [04 Modelos de serviço](04%20Modelos%20de%20Servi%C3%A7o%20em%20Nuvem.md)

## 📚 Referências

- NIST SP 800-145 — *The NIST Definition of Cloud Computing*, 2011.
- AWS Well-Architected Framework — https://aws.amazon.com/architecture/well-architected
