# 🏛️ Princípios da Computação em Nuvem

> **Módulo 01 · Computação em Nuvem** — Os pilares que sustentam arquiteturas em nuvem: escalabilidade/elasticidade, confiabilidade/disponibilidade, segurança/conformidade e pagamento sob demanda.

---

## 1. Escalabilidade e elasticidade

| | Escalabilidade | Elasticidade |
|---|---|---|
| **Definição** | **Capacidade** de crescer (ou reduzir) para suportar mais carga | Ajuste **automático e dinâmico** dos recursos em tempo real |
| **Horizonte** | Planejamento de médio/longo prazo | Reação a picos de curto prazo |
| **Exemplo** | A arquitetura suporta ir de 1 mil para 1 milhão de usuários | Sobe de 2 para 20 instâncias às 20h e volta para 2 às 23h |

> Todo sistema elástico é escalável, mas nem todo sistema escalável é elástico (pode escalar manualmente).

### Vertical × horizontal

| | Vertical (*scale up*) | Horizontal (*scale out*) |
|---|---|---|
| **Como** | Máquina maior (mais CPU/RAM) | Mais máquinas iguais em paralelo |
| **Limite** | Teto do maior servidor disponível | Praticamente ilimitado |
| **Downtime** | Geralmente exige reinício | Sem downtime |
| **Requisito** | Nenhum | Aplicação **stateless** + balanceador de carga |
| **Exemplo** | Trocar `t3.medium` por `m5.4xlarge` | Auto Scaling Group atrás de um Load Balancer |

```text
                    ┌─ Instância 1 ─┐
Usuários → [Load Balancer] ─ Instância 2 ─→ Banco gerenciado / cache
                    └─ Instância N ─┘   (estado fora das instâncias)
            ↑ Auto Scaling: CPU > 70% adiciona; < 30% remove
```

---

## 2. Confiabilidade e disponibilidade

- **Confiabilidade:** o sistema funciona **corretamente e de forma consistente** ao longo do tempo (executa a função esperada, recupera-se de falhas).
- **Disponibilidade:** o sistema está **acessível** quando o usuário precisa. Medida em percentual (SLA).

| Disponibilidade | Downtime por ano |
|---|---|
| 99% | 3,65 dias |
| 99,9% | 8,76 horas |
| 99,99% | 52,6 minutos |
| 99,999% | 5,26 minutos |

### Como a nuvem ajuda

- **Redundância** em várias zonas de disponibilidade (Multi-AZ) e regiões;
- **Health checks** e substituição automática de instâncias com falha (*self-healing*);
- **Balanceamento de carga** e failover automático de banco;
- **Backups e snapshots** gerenciados.

### Métricas de recuperação

- **RTO (Recovery Time Objective):** quanto tempo o sistema pode ficar fora do ar;
- **RPO (Recovery Point Objective):** quanto de dados (em tempo) é aceitável perder;
- **MTBF / MTTR:** tempo médio entre falhas / tempo médio para reparar.

> Disponibilidade composta: serviços em série **multiplicam** disponibilidades. Dois componentes de 99,9% em sequência → 99,9% × 99,9% ≈ **99,8%**. Redundância em paralelo aumenta: `1 − (1 − 0,999)²` ≈ **99,9999%**.

---

## 3. Segurança e conformidade

- **Segurança:** proteção de dados, aplicações e infraestrutura contra acessos não autorizados e ameaças — identidade (IAM, MFA), criptografia em trânsito e em repouso, segmentação de rede, monitoramento.
- **Conformidade:** atender a leis e normas — **LGPD/GDPR**, PCI-DSS (cartões), HIPAA (saúde), ISO 27001, SOC 2.
- Na nuvem vale o **modelo de responsabilidade compartilhada**: o provedor cuida da segurança **da** nuvem; o cliente, da segurança **na** nuvem (ver [08 Responsabilidade na cloud](08%20Responsabilidade%20na%20Cloud.md)).

---

## 4. Pagamento sob demanda (pay-as-you-go)

Cobra-se apenas pelos recursos efetivamente usados (por segundo, por requisição, por GB), eliminando custos fixos com infraestrutura física.

### Modelos de compra (exemplo AWS EC2)

| Modelo | Desconto aproximado | Ideal para |
|---|---|---|
| **On-demand** | — | Cargas imprevisíveis, testes |
| **Reservadas / Savings Plans** (1 ou 3 anos) | até ~70% | Carga base estável |
| **Spot** | até ~90% | Cargas tolerantes a interrupção (batch, CI, ML) |

> ⚠️ Pay-as-you-go é vantagem **e** risco: sem governança (tags, orçamentos, alertas), a conta cresce sem controle. Prática de **FinOps**: visibilidade → otimização → operação contínua.

---

## 5. Outros princípios de arquitetura em nuvem

- **Projete para falhas** (*design for failure*): assuma que tudo pode falhar;
- **Automatize tudo**: infraestrutura como código, CI/CD;
- **Desacople componentes**: filas e eventos entre serviços;
- **Prefira serviços gerenciados** para reduzir trabalho operacional;
- **Trate servidores como gado, não como pets**: instâncias descartáveis e substituíveis.

---

## ✅ Pontos-chave

- **Escalabilidade** = capacidade de crescer; **elasticidade** = ajuste automático.
- Escala horizontal exige aplicação **stateless**.
- **Confiabilidade** = funcionar corretamente; **disponibilidade** = estar acessível (SLA em "noves").
- **RTO** = tempo para voltar; **RPO** = quanto dado pode ser perdido.
- Pay-as-you-go precisa de **FinOps**.

## ❓ Perguntas de revisão

<details><summary>1. Qual a diferença entre escalabilidade e elasticidade?</summary>
Escalabilidade é a capacidade do sistema de crescer para suportar mais carga; elasticidade é o ajuste automático e em tempo real dos recursos conforme a demanda.
</details>

<details><summary>2. Por que a escala horizontal exige aplicações stateless?</summary>
Porque qualquer instância pode receber qualquer requisição; se o estado (sessão, arquivos) ficar em uma instância, ele se perde ou fica inconsistente quando instâncias são adicionadas ou removidas.
</details>

<details><summary>3. Qual a diferença entre RTO e RPO?</summary>
RTO é o tempo máximo aceitável para restaurar o serviço; RPO é a quantidade máxima aceitável de dados perdidos, medida em tempo desde o último backup/replicação.
</details>

<details><summary>4. Quando usar instâncias Spot?</summary>
Em cargas tolerantes a interrupção, como processamento batch, pipelines de CI e treinamento de ML com checkpoints.
</details>

## 🔗 Relacionadas

- [01 Introdução à computação em nuvem](01%20Introducao%20a%20computacao%20em%20nuvem.md)
- [06 Cloud management platforms (FinOps)](06%20Cloud%20management%20platformas.md)

## 📚 Referências

- AWS Well-Architected — pilares de Confiabilidade e Otimização de Custos.
- FinOps Foundation — https://www.finops.org
