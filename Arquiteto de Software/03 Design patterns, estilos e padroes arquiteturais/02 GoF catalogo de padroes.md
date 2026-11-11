# 📚 GoF — Catálogo de Padrões de Projeto

> **Módulo 03 · Design Patterns** — Visão geral dos 23 padrões do *Gang of Four*, organizados em criação, estruturais e comportamentais.

---

## 1. O que são padrões de projeto?

**Padrões de projeto (design patterns)** são **soluções reutilizáveis e comprovadas para problemas recorrentes** de design de software orientado a objetos. Não são código pronto, e sim um **modelo de solução** que você adapta ao seu contexto.

O catálogo clássico vem do livro *Design Patterns: Elements of Reusable Object-Oriented Software* (1994), de Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides — a **Gang of Four (GoF)**.

### Elementos de um padrão

| Elemento | Descrição |
|---|---|
| **Nome** | Vocabulário comum para o time ("usa um Strategy aqui") |
| **Problema** | Quando aplicar; o contexto |
| **Solução** | Elementos, relacionamentos e responsabilidades |
| **Consequências** | Trade-offs: benefícios e custos |

### Princípios por trás dos padrões

- **Programe para uma interface, não para uma implementação;**
- **Prefira composição a herança;**
- **Encapsule o que varia.**

---

## 2. Os 23 padrões GoF

### 🏭 Criação (5) — *como os objetos são criados*

| Padrão | Intenção |
|---|---|
| **Singleton** | Garantir uma única instância com acesso global |
| **Builder** | Construir objetos complexos passo a passo |
| **Factory Method** | Deixar subclasses decidirem qual classe instanciar |
| **Abstract Factory** | Criar famílias de objetos relacionados |
| **Prototype** | Criar objetos clonando um protótipo |

➡️ Detalhes em [03 Padrões de criação](03%20GoF%20padroes%20de%20criacao.md).

### 🧱 Estruturais (7) — *como classes e objetos se compõem*

| Padrão | Intenção |
|---|---|
| **Adapter** | Converter a interface de uma classe em outra esperada pelo cliente |
| **Bridge** | Separar abstração de implementação para variarem independentemente |
| **Composite** | Tratar objetos individuais e composições (árvores) de forma uniforme |
| **Decorator** | Adicionar responsabilidades dinamicamente, sem herança |
| **Facade** | Interface simples para um subsistema complexo |
| **Flyweight** | Compartilhar estado para suportar muitos objetos pequenos com eficiência |
| **Proxy** | Substituto que controla o acesso a outro objeto (cache, lazy load, segurança) |

➡️ Detalhes em [04 Padrões estruturais](04%20GoF%20padroes%20estruturais.md).

### 🔁 Comportamentais (11) — *como objetos interagem e dividem responsabilidades*

| Padrão | Intenção | Exemplo do dia a dia |
|---|---|---|
| **Strategy** | Família de algoritmos intercambiáveis | Cálculo de frete por transportadora |
| **Observer** | Notificar dependentes quando um objeto muda | `addEventListener`, EventEmitter, RxJS |
| **Command** | Encapsular uma requisição como objeto | Desfazer/refazer, filas de tarefas |
| **Chain of Responsibility** | Passar a requisição por uma cadeia de handlers | Middlewares do Express |
| **Template Method** | Esqueleto do algoritmo com passos sobrescritos pelas subclasses | Hooks de ciclo de vida de frameworks |
| **State** | Comportamento muda conforme o estado interno | Pedido: criado → pago → enviado |
| **Iterator** | Percorrer coleção sem expor sua estrutura | `for...of`, generators |
| **Mediator** | Centralizar a comunicação entre objetos | Torre de controle, chat room |
| **Memento** | Capturar e restaurar estado sem violar encapsulamento | Undo em editores |
| **Visitor** | Adicionar operações a uma estrutura sem alterar suas classes | Percorrer AST em compiladores/linters |
| **Interpreter** | Representar e interpretar uma gramática | Expressões regulares, DSLs |

### Exemplos rápidos dos comportamentais mais usados

**Strategy**

```js
const fretes = {
  correios: (peso) => peso * 1.5,
  transportadora: (peso) => 20 + peso * 0.8,
};
function calcularFrete(tipo, peso) { return fretes[tipo](peso); }
```

**Observer**

```js
const { EventEmitter } = require('events');
const pedidos = new EventEmitter();
pedidos.on('criado', (p) => console.log('Enviar e-mail para', p.cliente));
pedidos.on('criado', (p) => console.log('Baixar estoque de', p.itens));
pedidos.emit('criado', { cliente: 'Ana', itens: ['livro'] });
```

**Chain of Responsibility** (middlewares)

```js
app.use(autenticar);   // se falhar, interrompe a cadeia
app.use(autorizar);
app.use(validarBody);
app.post('/pedidos', criarPedido);
```

**State**

```js
const transicoes = { criado: ['pago', 'cancelado'], pago: ['enviado'], enviado: ['entregue'] };
function mudarStatus(pedido, novo) {
  if (!transicoes[pedido.status]?.includes(novo)) throw new Error('Transição inválida');
  pedido.status = novo;
}
```

---

## 3. Como escolher um padrão

| Se o problema é… | Considere |
|---|---|
| Muitos `if/else` ou `switch` escolhendo comportamento | **Strategy**, **State** |
| Criação de objeto complexa ou variável | **Builder**, **Factory** |
| Integrar com API/biblioteca de interface diferente | **Adapter** |
| Simplificar uso de vários serviços | **Facade** |
| Adicionar comportamento sem mexer na classe | **Decorator**, **Proxy** |
| Reagir a eventos em vários lugares | **Observer** |
| Pipeline de validações/etapas | **Chain of Responsibility** |

> ⚠️ **Não force padrões.** Aplicar padrão sem o problema correspondente gera complexidade desnecessária (*patternite*). Use quando o problema aparecer — muitas vezes durante a **refatoração** de um *code smell*.

---

## ✅ Pontos-chave

- 23 padrões GoF: **5 de criação, 7 estruturais, 11 comportamentais**.
- Padrões criam **vocabulário comum** e registram soluções com seus trade-offs.
- Fundamentos: programar para interfaces, composição sobre herança, encapsular o que varia.
- Mais usados no dia a dia: Strategy, Observer, Factory, Adapter, Facade, Decorator, Chain of Responsibility.

## ❓ Perguntas de revisão

<details><summary>1. Quais são as três categorias GoF e quantos padrões cada uma tem?</summary>
Criação (5), estruturais (7) e comportamentais (11).
</details>

<details><summary>2. Qual padrão representa os middlewares do Express?</summary>
Chain of Responsibility.
</details>

<details><summary>3. Qual padrão substitui um switch que escolhe algoritmos diferentes?</summary>
Strategy (ou State, se a escolha depende do estado interno do objeto).
</details>

<details><summary>4. O que significa "prefira composição a herança"?</summary>
Montar comportamento combinando objetos (delegação) em vez de criar hierarquias de subclasses, o que reduz acoplamento e permite trocar comportamento em tempo de execução.
</details>

## 🔗 Relacionadas

- [01 Introdução](01%20Introducao.md)
- [05 Code smells](05%20Code%20smells.md)

## 📚 Referências

- GAMMA, E. et al. *Padrões de Projeto*. Bookman, 2000.
- FREEMAN, E.; ROBSON, E. *Use a Cabeça! Padrões de Projetos*. 2ª ed. Alta Books.
- Refactoring.Guru — https://refactoring.guru/pt-br/design-patterns
