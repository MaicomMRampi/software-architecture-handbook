# Software Architecture Handbook

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
