# ⚖️ Trade-Offs Arquiteturais

> **Módulo 01 · Fundamentos** — Toda decisão arquitetural é uma troca: ganhar em um atributo de qualidade significa abrir mão de outro.

---

## 1. Conceito

Na arquitetura de software não existem soluções perfeitas nem "balas de prata". Toda decisão estrutural envolve um **trade-off** (troca compensatória): para priorizar um atributo de qualidade (desempenho, disponibilidade, segurança), abre-se mão de outro (simplicidade, custo, velocidade de desenvolvimento).

> *"Tudo em arquitetura de software é um trade-off."* — Primeira Lei da Arquitetura de Software (Richards & Ford)
>
> *"O porquê é mais importante que o como."* — Segunda Lei

O papel do arquiteto não é escolher a tecnologia mais moderna, e sim **analisar o contexto do negócio**, mapear vantagens e desvantagens de cada opção e escolher aquela cujos **efeitos colaterais são aceitáveis**.

## 2. Atributos de qualidade (características arquiteturais)

Os principais "-ilities" que entram em conflito:

| Categoria | Exemplos |
|---|---|
| **Operacionais** | Disponibilidade, desempenho, escalabilidade, elasticidade, recuperabilidade, confiabilidade |
| **Estruturais** | Manutenibilidade, extensibilidade, testabilidade, portabilidade, configurabilidade |
| **Transversais** | Segurança, usabilidade, acessibilidade, privacidade, conformidade legal (LGPD) |

> 💡 Escolha **poucas** características prioritárias (3 a 7). Tentar maximizar todas gera arquiteturas caras e complexas — o objetivo é a arquitetura **menos pior**, não a perfeita.

## 3. Trade-offs clássicos

| Decisão | Ganha | Perde |
|---|---|---|
| **Cache (Redis)** | Latência baixa, menos carga no banco | Custo, complexidade, risco de dado desatualizado |
| **Microsserviços** | Escalabilidade e deploy independentes | Complexidade operacional, latência de rede, consistência eventual |
| **Monolito** | Simplicidade, transações locais, deploy único | Escalabilidade granular, autonomia de times |
| **Comunicação assíncrona (filas)** | Desacoplamento, resiliência a picos | Rastreabilidade, ordem de mensagens, consistência eventual |
| **Normalização do banco** | Integridade, sem redundância | Consultas com muitos JOINs, desempenho de leitura |
| **Criptografia ponta a ponta** | Segurança | Desempenho, complexidade de gestão de chaves |
| **Replicação de dados** | Disponibilidade, leitura rápida | Consistência, custo de armazenamento |

### Teorema CAP

Em um sistema distribuído, na ocorrência de uma **partição de rede (P)**, é preciso escolher entre:

- **Consistência (C):** todos os nós veem o mesmo dado ao mesmo tempo;
- **Disponibilidade (A):** todo pedido recebe resposta, mesmo que com dado possivelmente desatualizado.

| Tipo | Prioriza | Exemplos |
|---|---|---|
| **CP** | Consistência | MongoDB (config. padrão), HBase, etcd |
| **AP** | Disponibilidade | Cassandra, DynamoDB, CouchDB |

O **PACELC** complementa: *se há Partição, escolha A ou C; Else (sem partição), escolha entre Latência ou Consistência.*

## 4. Exemplo prático detalhado — Cache com Redis

```text
Cliente → API → [Redis] --hit--> resposta rápida
                   │
                  miss
                   ↓
               PostgreSQL → grava no Redis (TTL 5 min) → resposta
```

- **Ganhos:** respostas em milissegundos; menos carga no banco relacional.
- **Custos:** nova infraestrutura para operar; estratégia de invalidação (TTL, *write-through*, *cache-aside*); usuário pode ver preço desatualizado por até 5 min.
- **Pergunta-chave para o negócio:** *"É aceitável o cliente ver um preço com até 5 minutos de atraso?"* → para catálogo, sim; para saldo bancário, não.

## 5. Como analisar um trade-off

1. Identifique as **características arquiteturais** prioritárias para o negócio;
2. Liste as **opções** viáveis;
3. Avalie cada opção contra as características (matriz de decisão);
4. Torne explícitos os **custos aceitos**;
5. Registre a decisão em um **ADR** (ver [07 Conduzindo um processo decisório](07%20Conduzindo%20um%20processo%20decis%C3%B3rio.md)).

Métodos formais: **ATAM** (*Architecture Tradeoff Analysis Method*, SEI), com cenários de qualidade e identificação de pontos de sensibilidade e de trade-off.

## 6. Analogia — Escolha de um veículo

- **Carro esportivo:** velocidade e desempenho, mas sacrifica economia, espaço interno e custo de manutenção.
- **Minivan:** espaço e capacidade de carga, mas sacrifica velocidade e manobrabilidade.

Nenhum é "melhor": depende de para que você vai usar.

> **Regra do arquiteto:** não pergunte *"Essa tecnologia é boa?"*; pergunte *"Quais são os trade-offs dessa tecnologia no nosso contexto?"*

---

## ✅ Pontos-chave

- Todo ganho arquitetural tem um custo correspondente.
- Priorize poucas características de qualidade, alinhadas ao negócio.
- CAP: em partição de rede, escolha entre consistência e disponibilidade.
- Registre o **porquê** das decisões (ADRs).

## ❓ Perguntas de revisão

<details><summary>1. Cite dois trade-offs de adotar microsserviços.</summary>
Ganha-se escalabilidade e deploy independentes; perde-se simplicidade operacional, há latência de rede e consistência eventual entre serviços.
</details>

<details><summary>2. Um sistema de saldo bancário deve ser CP ou AP? Por quê?</summary>
Em geral CP: exibir ou aceitar operações sobre saldo inconsistente é inaceitável, então é melhor rejeitar temporariamente do que responder com dado errado.
</details>

<details><summary>3. Por que não se deve tentar maximizar todas as características arquiteturais?</summary>
Porque elas conflitam entre si; cada uma adicionada aumenta custo e complexidade. Busca-se a arquitetura "menos pior" para o contexto.
</details>

## 🔗 Relacionadas

- [05 Estilo arquitetural monolítico](05%20Estilo%20arquitetural%20monolitico.md)
- [06 Estilos arquiteturais distribuídos](06%20Estilos%20arquiteturais%20distribuidos.md)
- [07 Conduzindo um processo decisório](07%20Conduzindo%20um%20processo%20decis%C3%B3rio.md)

## 📚 Referências

- RICHARDS, M.; FORD, N. *Fundamentals of Software Architecture*. O'Reilly, 2020.
- FORD, N. et al. *Software Architecture: The Hard Parts*. O'Reilly, 2021.
