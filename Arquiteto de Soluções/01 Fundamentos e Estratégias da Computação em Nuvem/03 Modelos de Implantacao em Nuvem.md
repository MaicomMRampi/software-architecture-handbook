# 🏗️ Modelos de Implantação em Nuvem

> **Módulo 01 · Computação em Nuvem** — Pública, privada, híbrida e comunitária: características, vantagens, desvantagens e quando usar cada uma.

---

O **modelo de implantação** define **onde a infraestrutura está, quem a possui e quem pode usá-la**. O NIST define quatro modelos.

## 1. Nuvem pública (*Public Cloud*)

Infraestrutura de um provedor, compartilhada entre muitos clientes e acessada pela internet.

> **Exemplos:** AWS, Microsoft Azure, Google Cloud, Oracle Cloud (OCI).

| Vantagens | Desvantagens |
|---|---|
| Sem investimento inicial (pay-as-you-go) | Menor controle sobre a infraestrutura |
| Escalabilidade praticamente ilimitada | Risco de lock-in |
| Manutenção física e de hardware pelo provedor | Custos podem crescer sem governança |
| Alcance global, serviços prontos (IA, analytics) | Requisitos regulatórios podem limitar o uso |

- **Multi-tenant:** hardware compartilhado com **isolamento lógico** entre clientes.
- **Ideal para:** startups, aplicações web, cargas variáveis, ambientes de teste.

---

## 2. Nuvem privada (*Private Cloud*)

Infraestrutura **dedicada a uma única organização**, no data center próprio ou hospedada por terceiro, com características de nuvem (autoatendimento, virtualização, automação).

> **Exemplos:** data center de um banco com **OpenStack** ou **VMware vSphere/VCF**; *hosted private cloud* em provedores locais; AWS Outposts e Azure Stack (hardware do provedor no data center do cliente).

| Vantagens | Desvantagens |
|---|---|
| Controle total de segurança, rede e dados | Investimento alto (CAPEX) em hardware e licenças |
| Personalização para requisitos específicos | Escalabilidade limitada à capacidade comprada |
| Desempenho previsível (recursos dedicados) | Exige equipe especializada para operar |
| Facilita conformidade rígida | Ociosidade fora dos picos |

> ⚠️ Um data center virtualizado **não é**, por si só, uma nuvem privada: precisa ter **autoatendimento, elasticidade e medição** de uso.

- **Ideal para:** setores altamente regulados (financeiro, governo, defesa), cargas estáveis e previsíveis, sistemas legados críticos.

---

## 3. Nuvem híbrida (*Hybrid Cloud*)

Combina nuvem privada/on-premises **e** pública, **integradas**, permitindo que dados e aplicações transitem entre elas.

> **Exemplo:** um hospital guarda prontuários na **nuvem privada** (sigilo e regulação) e usa a **nuvem pública** para o app de agendamento e análises estatísticas com dados anonimizados.

| Vantagens | Desvantagens |
|---|---|
| Flexibilidade para posicionar cada carga no melhor ambiente | Gestão complexa de ambientes diferentes |
| Dados sensíveis ficam no ambiente privado | Integração de rede e identidade desafiadora |
| **Cloud bursting:** pública absorve picos da privada | Latência e custo de tráfego entre ambientes |
| Facilita migração gradual e DR | Exige ferramentas de gestão unificada (CMP) |

### Conectividade

- **VPN site-to-site** (pela internet, criptografada, mais barata);
- **Link dedicado:** AWS Direct Connect, Azure ExpressRoute, Google Cloud Interconnect (baixa latência, banda garantida).

### Ferramentas típicas

Azure Arc, AWS Outposts, Google Anthos/GKE Enterprise, Red Hat OpenShift, VMware Cloud Foundation, Kubernetes como camada comum.

---

## 4. Nuvem comunitária (*Community Cloud*)

Infraestrutura compartilhada por **um grupo de organizações com interesses comuns** (missão, segurança, conformidade), gerenciada por elas ou por terceiro.

> **Exemplos:** AWS GovCloud e Azure Government (órgãos governamentais dos EUA); nuvens compartilhadas entre universidades ou entre hospitais de uma rede.

- **Vantagem:** custos divididos e conformidade específica do setor;
- **Desvantagem:** menos flexível, capacidade e governança compartilhadas.

---

## 5. Comparativo

| Critério | Pública | Privada | Híbrida | Comunitária |
|---|---|---|---|---|
| **Custo inicial** | Baixo | Alto | Médio | Dividido |
| **Controle** | Baixo | Total | Alto (na parte privada) | Compartilhado |
| **Escalabilidade** | Muito alta | Limitada | Alta (bursting) | Média |
| **Complexidade** | Baixa | Alta | Muito alta | Média |
| **Conformidade rígida** | Possível, com cuidado | Mais fácil | Dados sensíveis na privada | Feita para o setor |

> **Multicloud** (vários provedores públicos) é diferente de híbrida — ver [05 Arquitetura multicloud](05%20Arquitetura%20multi%20cloud.md).

## 6. Analogia — Moradia

- **Pública:** hotel — paga a diária, tudo pronto, divide o prédio com outros hóspedes.
- **Privada:** casa própria — controle total, mas você paga e mantém tudo.
- **Híbrida:** casa própria + hotel quando chegam visitas demais (*bursting*).
- **Comunitária:** condomínio — moradores com interesses comuns dividem a estrutura e as regras.

---

## ✅ Pontos-chave

- 4 modelos (NIST): **pública, privada, híbrida e comunitária**.
- Pública = escala e baixo custo inicial; privada = controle e conformidade.
- Híbrida integra as duas (cloud bursting, dados sensíveis no privado).
- Híbrida ≠ multicloud.

## ❓ Perguntas de revisão

<details><summary>1. O que é cloud bursting?</summary>
Usar a nuvem pública para absorver picos de demanda que excedem a capacidade da nuvem privada/on-premises.
</details>

<details><summary>2. Por que um banco escolheria nuvem privada ou híbrida?</summary>
Por exigências regulatórias, controle total sobre dados sensíveis e sistemas legados críticos; a híbrida permite ainda usar a pública para cargas menos sensíveis.
</details>

<details><summary>3. O que diferencia nuvem privada de um data center comum virtualizado?</summary>
A nuvem privada oferece características de nuvem: autoatendimento sob demanda, elasticidade, pool de recursos e serviço medido.
</details>

<details><summary>4. Dê um exemplo de nuvem comunitária.</summary>
AWS GovCloud ou Azure Government, usadas por órgãos governamentais com requisitos de conformidade comuns.
</details>

## 🔗 Relacionadas

- [04 Modelos de serviço](04%20Modelos%20de%20Servi%C3%A7o%20em%20Nuvem.md)
- [05 Arquitetura multicloud](05%20Arquitetura%20multi%20cloud.md)

## 📚 Referências

- NIST SP 800-145 — *The NIST Definition of Cloud Computing*.
