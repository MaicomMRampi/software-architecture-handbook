# 🚀 Arquiteturas Modernas e Abordagens de Design

> **Módulo 01 · Fundamentos** — Da arquitetura "desenhada toda no início" à arquitetura evolutiva, e as soft skills que o arquiteto precisa.

---

## 1. Arquiteturas modernas

Abordagem voltada a sistemas **distribuídos, escaláveis e flexíveis** (cloud-native, microsserviços, serverless, event-driven). A prioridade não é a perpetuidade do código, mas a **capacidade de adaptação contínua** às mudanças do negócio.

Características comuns:

- **Cloud-native:** feitas para rodar em nuvem (containers, orquestração, elasticidade);
- **Desacopladas:** serviços independentes, comunicação via APIs e eventos;
- **Automatizadas:** CI/CD, infraestrutura como código, observabilidade;
- **Resilientes:** projetadas para falhar parcialmente sem cair por completo.

> Referência: os **12 fatores** (*The Twelve-Factor App*) — configuração via ambiente, processos stateless, logs como fluxo de eventos, paridade entre ambientes, etc.

---

## 2. Abordagens de planejamento arquitetural

```text
 BDUF  ←───────────── Arquitetura Evolutiva ─────────────→  Puramente Emergente
(tudo antes)    (intencional + emergente, guiada)        (nada antes, surge no dia a dia)
```

### 2.1 BDUF (Big Design Up Front)

- **Definição:** toda a arquitetura e detalhes são desenhados rigidamente antes da implementação (típico do modelo cascata).
- **Problema:** alto risco de retrabalho — as premissas iniciais raramente sobrevivem às mudanças do mercado.
- **Quando ainda faz sentido:** sistemas com requisitos muito estáveis e regulados (aviação, dispositivos médicos).

### 2.2 Arquitetura Intencional

- **Definição:** decisões estratégicas de alto nível tomadas antes ou nas fases iniciais.
- **Foco:** visão geral, diretrizes de segurança, integrações principais e restrições tecnológicas — sem a rigidez do BDUF.
- No **SAFe**, é complementada pela *Architectural Runway* (base técnica suficiente para as próximas features).

### 2.3 Arquitetura Emergente

- **Definição:** estrutura que surge organicamente das decisões diárias do time em ciclos ágeis (refatoração contínua, TDD).
- **Risco:** sem direcionamento intencional, leva à degradação e ao caos estrutural (*big ball of mud*).

### 2.4 Arquitetura Evolutiva

- **Definição:** equilíbrio entre intencional e emergente — o sistema é projetado para suportar **mudanças incrementais e guiadas** em múltiplas dimensões (segurança, desempenho, funcionalidade).
- **Mecanismo:** **Fitness Functions** — verificações automatizadas que validam continuamente se os atributos de qualidade estão sendo mantidos.

#### Exemplos de Fitness Functions

| Atributo | Fitness function |
|---|---|
| Desempenho | Teste de carga no pipeline: p95 < 300 ms |
| Arquitetura em camadas | Teste (ArchUnit / dependency-cruiser) que falha se `controller` acessar `repository` diretamente |
| Segurança | Scanner de dependências vulneráveis (Snyk, `npm audit`) quebrando o build |
| Acoplamento | Falha se houver dependência cíclica entre módulos |

```js
// Exemplo com dependency-cruiser (.dependency-cruiser.js)
module.exports = {
  forbidden: [{
    name: 'controller-nao-acessa-model',
    from: { path: '^src/controllers' },
    to:   { path: '^src/models' }
  }]
};
```

---

## 3. Soft skills para arquitetos

O sucesso de uma arquitetura depende da capacidade do arquiteto de **engajar pessoas e alinhar expectativas**.

- **Comunicação multinível:** traduzir termos técnicos em valor de negócio para executivos, e diretrizes de negócio em requisitos técnicos para desenvolvedores.
- **Negociação e gestão de conflitos:** defender refatoração e pagamento de dívida técnica frente a prazos apertados.
- **Liderança servidora e mentoria:** guiar o time na adoção de padrões sem impor decisões de forma ditatorial.
- **Empatia técnica:** entender as dores do time para desenhar arquiteturas que facilitem o dia a dia.
- **Pensamento sistêmico:** enxergar efeitos de segunda ordem de uma decisão (custo, operação, pessoas).

### Antipadrões de arquiteto

| Antipadrão | Descrição |
|---|---|
| **Arquiteto de torre de marfim** | Decide sem conhecer o código nem o time |
| **Arquiteto controlador** | Toma decisões de nível de design que caberiam ao time |
| **Arquiteto ausente** | Não acompanha a implementação e a arquitetura se degrada |

> 💡 Dica de Richards & Ford: o arquiteto deve continuar **codificando** (provas de conceito, correção de bugs, ferramentas internas), mas evitar ficar no caminho crítico das entregas.

---

## ✅ Pontos-chave

- Arquiteturas modernas priorizam **adaptabilidade** sobre perfeição inicial.
- BDUF é rígido; emergência pura gera caos; **evolutiva** equilibra os dois.
- **Fitness functions** transformam requisitos de arquitetura em testes automatizados.
- Soft skills são tão críticas quanto conhecimento técnico.

## ❓ Perguntas de revisão

<details><summary>1. Qual o principal risco da arquitetura puramente emergente?</summary>
Degradação estrutural (big ball of mud), por falta de uma direção intencional comum.
</details>

<details><summary>2. O que é uma fitness function? Dê um exemplo.</summary>
Uma verificação automatizada de um atributo arquitetural. Ex.: teste no CI que falha se houver dependência cíclica entre módulos ou se o p95 de latência passar de 300 ms.
</details>

<details><summary>3. Por que BDUF é arriscado em produtos digitais?</summary>
Porque fixa decisões cedo, com pouca informação; quando o mercado ou os requisitos mudam, o retrabalho é alto.
</details>

## 🔗 Relacionadas

- [03 Trade-Offs Arquiteturais](03%20Trade-Offs%20Arquiteturais.md)
- [10 DevOps](10%20Devops.md)
- [Arquiteturas cloud e serverless](../04%20Arquiteturas%20da%20atualidade/05%20Arquiteturas%20cloud%20e%20serverless.md)

## 📚 Referências

- FORD, N.; PARSONS, R.; KUA, P. *Building Evolutionary Architectures*. 2ª ed. O'Reilly, 2022.
- WIGGINS, A. *The Twelve-Factor App*. https://12factor.net
