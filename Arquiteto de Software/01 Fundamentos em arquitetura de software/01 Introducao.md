# 📖 Introdução à Arquitetura de Software

> **Módulo 01 · Fundamentos** — O que é arquitetura, por que ela importa, o papel do arquiteto e o conceito de modularidade.

---

## 1. O que é Arquitetura de Software?

A **Arquitetura de Software** é o conjunto de decisões estruturais e estratégicas de alto nível que definem:

- **como o sistema é organizado** (componentes, módulos, serviços);
- **como esses componentes interagem** (chamadas síncronas, eventos, filas);
- **como os atributos de qualidade são garantidos** (escalabilidade, segurança, resiliência, desempenho, manutenibilidade).

> *"Arquitetura é sobre as coisas difíceis de mudar depois."* — Ralph Johnson

A arquitetura estabelece as regras e os limites da solução antes de o código ser escrito em massa, permitindo que o sistema cresça junto com o negócio sem gerar dívida técnica incontrolável.

### As quatro dimensões da arquitetura

Segundo Mark Richards e Neal Ford (*Fundamentals of Software Architecture*), a arquitetura de um sistema é descrita por:

| Dimensão | O que é | Exemplo |
|---|---|---|
| **Estrutura** | O estilo arquitetural adotado | Monolito em camadas, microsserviços, event-driven |
| **Características arquiteturais** | Os "-ilities" que o sistema deve atender | Disponibilidade, escalabilidade, segurança |
| **Decisões arquiteturais** | Regras que restringem como o sistema é construído | "A camada de apresentação não acessa o banco diretamente" |
| **Princípios de design** | Diretrizes (não regras rígidas) | "Prefira comunicação assíncrona entre serviços" |

### Arquitetura × Design

| Arquitetura | Design |
|---|---|
| Visão macro, estrutural | Visão micro, detalhe de implementação |
| Difícil e caro de mudar | Relativamente fácil de mudar |
| Ex.: monolito ou microsserviços? SQL ou NoSQL? | Ex.: nome das classes, qual padrão GoF usar num trecho |

Na prática, a fronteira é um **espectro**, não uma linha: quanto mais cara e arriscada for a mudança, mais "arquitetural" é a decisão.

## 2. Exemplo prático

Decisões tipicamente arquiteturais:

- Definir se a aplicação será um **monolito** ou um conjunto de **microsserviços**;
- Escolher entre banco relacional (**PostgreSQL**) ou NoSQL (**MongoDB**);
- Adotar comunicação assíncrona via **RabbitMQ/Kafka** em vez de chamadas HTTP diretas;
- Definir a estratégia de autenticação (sessão, JWT, OAuth2/OIDC).

Alterar essas decisões com o sistema em produção exige reescritas caras e arriscadas — por isso elas precisam ser tomadas com análise de **trade-offs** (ver [03 Trade-Offs Arquiteturais](03%20Trade-Offs%20Arquiteturais.md)).

## 3. Analogia — Construção civil

- **Decisão arquitetural:** a fundação, as colunas de sustentação e as prumadas hidráulicas/elétricas. Mover uma coluna mestra depois da obra pronta pode derrubar o prédio.
- **Detalhe de implementação (design):** a cor da parede, o modelo da torneira, o tipo de piso. Podem ser trocados a qualquer momento sem afetar a estrutura.

## 4. O papel do Arquiteto de Software

As principais expectativas sobre um arquiteto:

1. **Tomar decisões arquiteturais** e documentá-las (ex.: ADRs — *Architecture Decision Records*);
2. **Analisar continuamente a arquitetura**, identificando degradação e dívida técnica;
3. **Acompanhar tendências** tecnológicas, sem cair no *hype*;
4. **Garantir conformidade** do código com as decisões tomadas (revisões, *fitness functions*);
5. **Ter experiência diversificada** — conhecer amplitude de tecnologias, não só profundidade em uma;
6. **Conhecer o domínio do negócio**;
7. **Ter habilidades interpessoais** — liderança, negociação e comunicação;
8. **Entender e navegar a política** da organização.

> 💡 **Amplitude × Profundidade:** o desenvolvedor tende a buscar profundidade técnica; o arquiteto precisa de **amplitude** — saber que várias soluções existem e quais seus trade-offs, mesmo sem dominar todas a fundo.

---

## 5. Modularidade

**Modularidade** é a prática de dividir um sistema em partes menores, autônomas e bem delimitadas — os **módulos**. Uma boa modularidade busca:

- **Alta coesão:** cada módulo resolve uma única responsabilidade de negócio; os elementos dentro dele "pertencem juntos".
- **Baixo acoplamento:** os módulos dependem o mínimo possível uns dos outros e se comunicam apenas por **contratos claros** (APIs/interfaces).

### Tipos de coesão (da pior para a melhor)

| Tipo | Descrição |
|---|---|
| Coincidental | Elementos agrupados sem relação (ex.: `Utils`) — **evitar** |
| Lógica | Agrupados por categoria parecida, mas fazem coisas diferentes |
| Temporal | Executados no mesmo momento (ex.: inicialização) |
| Procedural | Executados em sequência obrigatória |
| Comunicacional | Operam sobre os mesmos dados |
| Sequencial | A saída de um é a entrada do outro |
| **Funcional** | Todos contribuem para uma única tarefa bem definida — **ideal** |

### Tipos de acoplamento

- **Aferente (Ca):** quantos módulos dependem *deste* módulo (entrada).
- **Eferente (Ce):** de quantos módulos *este* depende (saída).
- **Instabilidade** `I = Ce / (Ca + Ce)` — próximo de 1 = instável (muda fácil, depende de muitos); próximo de 0 = estável (muitos dependem dele, mudar é arriscado).

### Exemplo

Em um e-commerce, o módulo de **Pagamentos** fica separado do módulo de **Notificações**. Pagamentos publica o evento `PagamentoConcluido`; Notificações escuta e envia o e-mail. Se o provedor de e-mail mudar (SendGrid → AWS SES), o código de pagamento não é tocado.

```text
[Pagamentos] --(evento: PagamentoConcluido)--> [Notificações] --> SendGrid / SES
```

### Analogia — Computador desktop

Se a placa de vídeo queima, você não joga o computador fora: troca a peça no slot PCI-Express (interface padrão). Processador, memória e fonte continuam funcionando.

---

## ✅ Pontos-chave

- Arquitetura = decisões **estruturais e difíceis de mudar**.
- Toda decisão arquitetural envolve **trade-offs**; não existe bala de prata.
- O arquiteto precisa de **amplitude técnica**, conhecimento de negócio e soft skills.
- Boa modularidade = **alta coesão + baixo acoplamento**.

## ❓ Perguntas de revisão

<details><summary>1. Qual a diferença entre arquitetura e design?</summary>
Arquitetura trata de decisões estruturais, de alto nível e caras de mudar (estilo arquitetural, banco, comunicação). Design trata de detalhes de implementação mais fáceis de alterar (classes, nomes, padrões locais).
</details>

<details><summary>2. Quais são as quatro dimensões que descrevem uma arquitetura?</summary>
Estrutura, características arquiteturais, decisões arquiteturais e princípios de design.
</details>

<details><summary>3. Por que "alta coesão e baixo acoplamento" facilitam a manutenção?</summary>
Porque uma mudança fica contida dentro de um único módulo (coesão) e não se propaga para os demais (acoplamento baixo), reduzindo risco e custo de alteração.
</details>

<details><summary>4. O que indica um módulo com instabilidade próxima de 0?</summary>
Que muitos módulos dependem dele e ele depende de poucos — é estável, e por isso alterá-lo é arriscado. Deve ser abstrato e bem definido.
</details>

## 🔗 Relacionadas

- [02 Princípios SOLID](02%20Principios%20Solid.md)
- [03 Trade-Offs Arquiteturais](03%20Trade-Offs%20Arquiteturais.md)
- [04 Arquiteturas modernas](04%20Arquiteturas%20modernas.md)

## 📚 Referências

- RICHARDS, M.; FORD, N. *Fundamentals of Software Architecture*. O'Reilly, 2020.
- BASS, L.; CLEMENTS, P.; KAZMAN, R. *Software Architecture in Practice*. 4ª ed. Addison-Wesley, 2021.
