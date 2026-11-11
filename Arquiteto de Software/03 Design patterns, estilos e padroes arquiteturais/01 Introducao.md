# 🧭 Introdução: Arquitetura, Design e Qualidade de Software

> **Módulo 03 · Design Patterns** — Arquitetura × design, atributos de qualidade (ISO 25010), papel do arquiteto e as práticas de código que sustentam uma boa arquitetura.

---

## Arquitetura e Design de Software

A **arquitetura de software** define a estrutura fundamental de um sistema, seus principais componentes, responsabilidades, relacionamentos e as formas como esses componentes se comunicam.

Em conjunto com o **design de software**, a arquitetura estabelece princípios e decisões que contribuem para que o sistema seja **manutenível, seguro, escalável e capaz de evoluir ao longo do seu ciclo de vida**.

Uma arquitetura bem definida não busca apenas atender aos requisitos atuais, mas também preparar o software para **mudanças futuras**, reduzindo o impacto e o custo das alterações.

### Qualidade de Software

Entre os principais atributos relacionados à qualidade de software estão:

* **Confiabilidade:** capacidade do sistema de executar suas funções de maneira consistente e confiável.
* **Desempenho:** capacidade do sistema de atender aos requisitos de tempo de resposta, processamento e utilização de recursos.
* **Usabilidade:** facilidade com que os usuários conseguem compreender e utilizar o sistema.
* **Segurança:** capacidade de proteger dados, recursos e funcionalidades contra acessos ou ações não autorizadas.
* **Compatibilidade:** capacidade do software de funcionar adequadamente em diferentes ambientes e sistemas.
* **Portabilidade:** capacidade de executar ou ser adaptado para diferentes ambientes com baixo esforço.
* **Manutenibilidade:** facilidade de compreender, corrigir, modificar e evoluir o software.

---

## Arquitetura e Evolução do Software

Um dos principais objetivos da arquitetura de software é permitir que o sistema **evolua de forma controlada**.

Mudanças são inevitáveis durante o ciclo de vida de um software. Novos requisitos, regras de negócio, integrações, tecnologias e necessidades de escala podem exigir alterações na estrutura existente.

Uma arquitetura bem projetada busca **reduzir o acoplamento e controlar o impacto das mudanças**, tornando o sistema mais preparado para evoluir sem comprometer sua estabilidade.

> Uma boa arquitetura não elimina a complexidade. Ela organiza a complexidade para que o sistema possa evoluir de maneira sustentável.

---

## Qual é o papel do arquiteto de software?

O arquiteto de software atua principalmente na definição e evolução das decisões estruturais do sistema, considerando aspectos técnicos e de negócio.

Entre suas responsabilidades estão:

* Definir e orientar decisões arquiteturais.
* Identificar e avaliar trade-offs técnicos.
* Apoiar a equipe na aplicação de boas práticas de desenvolvimento.
* Estabelecer padrões e princípios técnicos.
* Promover qualidade, manutenibilidade e evolução do código.
* Avaliar impactos técnicos de novas funcionalidades e mudanças.
* Contribuir para decisões relacionadas a escalabilidade, segurança e desempenho.
* Documentar decisões arquiteturais relevantes.
* Orientar a equipe na adoção de padrões e estilos arquiteturais.
* Garantir que as decisões técnicas estejam alinhadas aos requisitos do sistema.

O papel do arquiteto não deve ser visto apenas como a definição da estrutura inicial do sistema, mas como uma atuação contínua sobre sua **evolução técnica e arquitetural**.

---

## Conceitos Importantes

Durante os estudos, alguns conceitos são fundamentais para compreender a construção e evolução de sistemas de software:

### Clean Code

Princípios e práticas voltados à escrita de código **legível, simples, coeso e de fácil manutenção**.

### Design Patterns

Soluções reutilizáveis para problemas recorrentes de design de software. Alguns exemplos incluem:

* Factory
* Builder
* Strategy
* Observer
* Adapter
* Decorator
* Singleton

### Object Calisthenics

Conjunto de práticas e restrições utilizadas para exercitar princípios de orientação a objetos, buscando melhorar aspectos como **coesão, encapsulamento e legibilidade**.

### Code Smells

Indicadores de possíveis problemas no design ou na implementação do código. Não representam necessariamente erros, mas podem indicar pontos que merecem análise e refatoração.

### TDD — Test Driven Development

Abordagem de desenvolvimento baseada no ciclo:

**Red → Green → Refactor**

O objetivo é utilizar testes como parte do processo de desenvolvimento, contribuindo para maior confiabilidade e segurança durante a evolução do código.

### Análise Estática de Código

Processo de análise do código-fonte sem a necessidade de executá-lo, permitindo identificar problemas relacionados a qualidade, complexidade, padrões, possíveis bugs e violações de regras.

### SOLID

Conjunto de cinco princípios de design orientado a objetos que auxiliam na construção de sistemas mais **flexíveis, extensíveis e fáceis de manter**:

* **S — Single Responsibility Principle**
* **O — Open/Closed Principle**
* **L — Liskov Substitution Principle**
* **I — Interface Segregation Principle**
* **D — Dependency Inversion Principle**

---

## Complementos

### ISO/IEC 25010 — modelo de qualidade de produto

Os atributos listados acima vêm do modelo **ISO/IEC 25010**, que organiza a qualidade em características: adequação funcional, eficiência de desempenho, compatibilidade, usabilidade, confiabilidade, segurança, manutenibilidade e portabilidade. A manutenibilidade, por exemplo, se divide em **modularidade, reusabilidade, analisabilidade, modificabilidade e testabilidade**.

### Object Calisthenics — as 9 regras (Jeff Bay)

1. Apenas um nível de indentação por método;
2. Não use `else`;
3. Encapsule tipos primitivos e strings (ex.: `Cpf`, `Email` em vez de `string`);
4. Coleções de primeira classe (uma classe que só encapsula a coleção);
5. Um ponto por linha (Lei de Demeter: `a.b().c().d()` é um alerta);
6. Não abrevie nomes;
7. Mantenha entidades pequenas (classes ~50 linhas, pacotes ~10 arquivos);
8. No máximo duas variáveis de instância por classe;
9. Sem getters/setters/propriedades públicas — "diga, não pergunte" (*Tell, Don't Ask*).

São exercícios, não leis: o objetivo é treinar coesão e encapsulamento.

### TDD na prática

```text
🔴 Red      → escreva um teste que falha para o próximo comportamento
🟢 Green    → escreva o mínimo de código para o teste passar
🔵 Refactor → melhore o design mantendo os testes verdes
```

```js
// 1. Red
test('aplica 10% de desconto acima de R$ 100', () => {
  expect(calcularTotal(200)).toBe(180);
});
// 2. Green
const calcularTotal = (v) => (v > 100 ? v * 0.9 : v);
// 3. Refactor: extrair constantes, nomear regras...
```

**Pirâmide de testes:** muitos testes unitários (rápidos), menos de integração e poucos end-to-end (lentos e frágeis).

### Análise estática

Ferramentas: **ESLint** (JS/TS), **SonarQube/SonarCloud** (bugs, vulnerabilidades, code smells, duplicação, cobertura), **Checkstyle/PMD** (Java). Métricas comuns: complexidade ciclomática, complexidade cognitiva, duplicação, dívida técnica estimada. Integradas ao CI, funcionam como **quality gates**.

---

## ✅ Pontos-chave

- Arquitetura organiza a complexidade para permitir **evolução controlada**.
- Qualidade de software é descrita por atributos (ISO 25010): confiabilidade, desempenho, segurança, manutenibilidade…
- Clean Code, SOLID, padrões, TDD, Object Calisthenics e análise estática sustentam a arquitetura no nível do código.

## ❓ Perguntas de revisão

<details><summary>1. Quais são as três etapas do ciclo do TDD?</summary>
Red (teste falhando), Green (código mínimo para passar) e Refactor (melhorar o design com os testes verdes).
</details>

<details><summary>2. Qual a diferença entre code smell e bug?</summary>
Bug é um comportamento incorreto; code smell é um indício de problema de design que dificulta manutenção, mesmo com o código funcionando.
</details>

<details><summary>3. Cite três regras do Object Calisthenics.</summary>
Um nível de indentação por método; não usar else; encapsular primitivos (também: um ponto por linha, não abreviar, entidades pequenas…).
</details>

<details><summary>4. O que a análise estática consegue detectar sem executar o código?</summary>
Violações de padrão, possíveis bugs, vulnerabilidades, duplicação, complexidade excessiva e code smells.
</details>

## 🔗 Relacionadas

- [02 GoF — catálogo de padrões](02%20GoF%20catalogo%20de%20padroes.md)
- [05 Code smells](05%20Code%20smells.md)
- [Princípios SOLID](../01%20Fundamentos%20em%20arquitetura%20de%20software/02%20Principios%20Solid.md)

## 📚 Referências

- MARTIN, R. C. *Código Limpo*. Alta Books, 2009.
- BECK, K. *TDD — Desenvolvimento Guiado por Testes*. Bookman, 2010.
- ISO/IEC 25010:2023 — *Product quality model*.
