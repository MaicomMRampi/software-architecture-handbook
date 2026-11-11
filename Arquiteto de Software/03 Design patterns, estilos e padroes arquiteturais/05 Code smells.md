# 👃 Code Smells

> **Módulo 03 · Design Patterns** — Sinais de problemas de design: as 5 categorias (Bloaters, OO Abusers, Change Preventers, Dispensables, Couplers) e as refatorações que os resolvem.

**Code Smells**, ou **"cheiros de código"**, são características presentes no código-fonte que indicam a possibilidade de existir um problema de design ou estrutura.

Um *code smell* **não significa necessariamente que existe um bug**. O código pode funcionar corretamente e atender aos requisitos, mas sua estrutura pode dificultar a manutenção, aumentar o acoplamento e tornar futuras alterações mais complexas.

Os code smells são, portanto, **sinais de possíveis problemas que podem contribuir para o aumento do débito técnico ao longo do tempo**.

> Code smell não é necessariamente um erro. É um sinal de que o código merece ser analisado.

---

# Code Smells — Couplers

Os **Couplers** são code smells relacionados ao **acoplamento excessivo entre módulos, funções ou componentes**.

Quando uma parte do sistema depende excessivamente de outras partes, uma alteração em um componente pode exigir mudanças em vários outros pontos.

Isso pode dificultar:

* Manutenção;
* Testes;
* Reutilização;
* Evolução do sistema;
* Alteração de regras de negócio.

### Exemplo

Imagine uma função responsável por processar um pedido:

```javascript
const processOrder = (order) => {
    const database = createDatabase()
    const emailService = createEmailService()
    const logger = createLogger()

    database.save(order)

    emailService.send(order.customerEmail)

    logger.info(`Pedido ${order.id} processado`)
}
```

Nesse exemplo, `processOrder` conhece diretamente diferentes implementações e também é responsável por criá-las.

```text
processOrder
    ├── Database
    ├── EmailService
    └── Logger
```

Isso aumenta o acoplamento.

Uma abordagem mais desacoplada é receber as dependências externamente:

```javascript
const processOrder = (
    { database, emailService, logger },
    order
) => {
    database.save(order)

    emailService.send(order.customerEmail)

    logger.info(`Pedido ${order.id} processado`)
}
```

Agora a função não precisa saber **como** cada dependência é criada.

```text
              processOrder
             /      |      \
            ↓       ↓       ↓
       database   email   logger
```

Essa abordagem também facilita os testes, pois podemos fornecer implementações diferentes:

```javascript
processOrder(
    {
        database: fakeDatabase,
        emailService: fakeEmailService,
        logger: fakeLogger
    },
    order
)
```

> O objetivo não é eliminar dependências, mas **controlar o acoplamento e tornar as dependências explícitas**.

---

## Principais Couplers

| Code Smell                 | Descrição                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------- |
| **Feature Envy**           | Uma função utiliza excessivamente dados ou comportamentos pertencentes a outro módulo. |
| **Inappropriate Intimacy** | Dois componentes conhecem detalhes internos demais um do outro.                        |
| **Message Chains**         | Uma sequência extensa de chamadas entre objetos ou funções.                            |
| **Middle Man**             | Um componente apenas repassa chamadas sem adicionar comportamento relevante.           |
| **Hidden Dependencies**    | Dependências existentes, mas que não são claramente declaradas.                        |

---

# Feature Envy

**Feature Envy** ocorre quando uma função ou módulo demonstra interesse excessivo pelos dados de outro componente.

Exemplo:

```javascript
const calculateDiscount = (order, customer) => {
    if (
        customer.type === "premium" &&
        customer.registrationTime > 2
    ) {
        return 0.20
    }

    return 0
}
```

A função `calculateDiscount` conhece detalhes específicos de `customer`.

Uma alternativa seria concentrar essa regra em uma função relacionada ao cliente:

```javascript
const customerHasDiscount = (customer) => {
    return (
        customer.type === "premium" &&
        customer.registrationTime > 2
    )
}

const calculateDiscount = (order, customer) => {
    if (customerHasDiscount(customer)) {
        return 0.20
    }

    return 0
}
```

A ideia é **manter cada comportamento próximo do contexto ao qual ele pertence**.

---

# Inappropriate Intimacy

**Inappropriate Intimacy** ocorre quando dois componentes conhecem detalhes internos demais um do outro.

Exemplo:

```text
Módulo A
   ↕
conhecimento excessivo
   ↕
Módulo B
```

Isso cria forte dependência entre os componentes.

Uma alteração na estrutura interna de um módulo pode exigir alterações no outro.

O ideal é que os componentes se comuniquem por meio de **interfaces ou contratos bem definidos**, sem depender de detalhes internos.

---

# Message Chains

**Message Chains** ocorre quando existe uma sequência extensa de chamadas para acessar uma informação.

Exemplo:

```javascript
const stateName = order
    .customer
    .address
    .city
    .state
    .name
```

Esse tipo de acesso pode indicar que um componente está atravessando várias estruturas internas para obter uma informação.

Uma alternativa é criar uma função que encapsule esse acesso:

```javascript
const getCustomerStateName = (order) => {
    return order.customer.address.city.state.name
}

const stateName = getCustomerStateName(order)
```

Isso não elimina necessariamente o problema estrutural, mas **centraliza o conhecimento sobre essa estrutura**.

---

# Middle Man

O **Middle Man** ocorre quando um componente simplesmente repassa chamadas para outro sem adicionar comportamento relevante.

Exemplo:

```javascript
const findOrder = (orderRepository, id) => {
    return orderRepository.findById(id)
}
```

Se essa função não adiciona nenhuma regra, transformação ou validação, ela pode estar apenas aumentando a quantidade de abstrações.

A solução pode ser remover o intermediário quando ele não possui uma responsabilidade real.

> Nem todo intermediário é ruim. Ele se torna um problema quando existe apenas para repassar chamadas.

---

# Hidden Dependencies

**Hidden Dependencies** são dependências que existem, mas não ficam claras para quem utiliza a função.

Exemplo:

```javascript
const processOrder = (order) => {
    global.database.save(order)
}
```

A função depende de `global.database`, mas essa dependência não aparece em sua assinatura.

Uma alternativa mais explícita:

```javascript
const processOrder = (database, order) => {
    database.save(order)
}
```

Agora fica evidente que a função depende de um `database`.

Também fica mais fácil testar:

```javascript
processOrder(fakeDatabase, order)
```

---

# Como identificar Couplers?

Alguns sinais podem indicar acoplamento excessivo:

```text
Componente conhece muitos outros componentes
                ↓
       Dependências excessivas
                ↓
      Chamadas muito encadeadas
                ↓
       Detalhes internos expostos
                ↓
      Alteração gera muitos impactos
                ↓
        Testes ficam difíceis
                ↓
          Alto acoplamento
```

O objetivo **não é eliminar todas as dependências**.

Todo sistema possui dependências.

O objetivo é manter o acoplamento **controlado, explícito e coerente com as responsabilidades de cada componente**.

---

## Resumo

> **Couplers são code smells relacionados ao acoplamento entre componentes.**

A principal pergunta ao identificar esse tipo de problema é:

**"Este componente realmente deveria conhecer e depender de tudo isso?"**

Se a resposta for não, existe uma possível oportunidade de **refatoração e redução de acoplamento**.

---

# As outras categorias de code smells

O catálogo clássico (Martin Fowler, *Refactoring*; organizado por Mäntylä) divide os smells em **cinco categorias**. Acima vimos os **Couplers**; abaixo, as outras quatro.

| Categoria | Problema central |
|---|---|
| **Bloaters** (inchados) | Código que cresceu demais |
| **Object-Orientation Abusers** | Uso incorreto de orientação a objetos |
| **Change Preventers** | Uma mudança exige alterar muitos lugares |
| **Dispensables** | Código desnecessário |
| **Couplers** | Acoplamento excessivo (visto acima) |

## 1. Bloaters

| Smell | Sinal | Refatoração |
|---|---|---|
| **Long Method** | Função com dezenas de linhas, comentários separando "blocos" | *Extract Method* |
| **Large Class / God Class** | Classe que faz de tudo | *Extract Class*, aplicar SRP |
| **Long Parameter List** | Mais de 3–4 parâmetros | *Introduce Parameter Object*, Builder |
| **Primitive Obsession** | `string` para CPF, e-mail, dinheiro | *Replace Primitive with Object* (Value Objects) |
| **Data Clumps** | Mesmo grupo de dados sempre junto (`rua, numero, cidade, cep`) | Criar classe `Endereco` |

```js
// ❌ Long Parameter List + Primitive Obsession
criarUsuario('Ana', 'ana@x.com', '123.456.789-00', 'Rua A', 10, 'Porto Alegre', '90000-000');

// ✅
criarUsuario({ nome: 'Ana', email: new Email('ana@x.com'), cpf: new Cpf('123.456.789-00'), endereco });
```

## 2. Object-Orientation Abusers

| Smell | Sinal | Refatoração |
|---|---|---|
| **Switch Statements** | `switch`/`if` por tipo repetido em vários lugares | Polimorfismo, **Strategy**, **State** |
| **Refused Bequest** | Subclasse herda e ignora/sobrescreve métodos do pai | Trocar herança por composição (viola LSP) |
| **Temporary Field** | Atributo só preenchido em certas situações | *Extract Class* |
| **Alternative Classes with Different Interfaces** | Duas classes fazem o mesmo com nomes diferentes | Unificar interface, Adapter |

```js
// ❌ switch por tipo
function calcularFrete(tipo, peso) {
  switch (tipo) { case 'sedex': return peso * 3; case 'pac': return peso * 1.5; }
}
// ✅ Strategy
const fretes = { sedex: (p) => p * 3, pac: (p) => p * 1.5 };
```

## 3. Change Preventers

| Smell | Sinal | Refatoração |
|---|---|---|
| **Divergent Change** | **Uma classe** muda por **vários motivos** diferentes | *Extract Class* (SRP) |
| **Shotgun Surgery** | **Uma mudança** exige editar **muitas classes** | *Move Method/Field*, concentrar a responsabilidade |
| **Parallel Inheritance Hierarchies** | Criar subclasse em uma hierarquia obriga a criar em outra | Unir hierarquias, Bridge |

> Dica para memorizar: *Divergent Change* = 1 classe, N motivos. *Shotgun Surgery* = 1 motivo, N classes.

## 4. Dispensables

| Smell | Sinal | Refatoração |
|---|---|---|
| **Duplicate Code** | Lógica copiada e colada | *Extract Method*, DRY |
| **Dead Code** | Código nunca executado | Remover (o Git guarda o histórico) |
| **Comments** em excesso | Comentário explicando código confuso | Renomear, extrair método com nome claro |
| **Lazy Class** | Classe que quase não faz nada | *Inline Class* |
| **Speculative Generality** | Abstrações "para o futuro" nunca usadas | Remover (YAGNI) |
| **Data Class** | Só getters/setters, sem comportamento | Mover comportamento para a classe |

## Como lidar com code smells

1. **Detecte:** revisão de código, ESLint, SonarQube (aponta smells e dívida técnica);
2. **Garanta testes** antes de refatorar;
3. **Refatore em pequenos passos** (catálogo de refatorações de Fowler);
4. **Regra do escoteiro:** deixe o código um pouco melhor do que encontrou.

---

## ✅ Pontos-chave

- Code smell é **indício**, não bug.
- 5 categorias: **Bloaters, OO Abusers, Change Preventers, Dispensables, Couplers**.
- Muitos smells são resolvidos com SOLID e padrões GoF (Strategy, Facade, Adapter).
- Refatore com testes e em pequenos passos.

## ❓ Perguntas de revisão

<details><summary>1. Qual a diferença entre Divergent Change e Shotgun Surgery?</summary>
Divergent Change: uma classe muda por vários motivos diferentes. Shotgun Surgery: uma única mudança exige alterar várias classes.
</details>

<details><summary>2. O que é Feature Envy?</summary>
Um método que usa mais os dados de outra classe do que da sua própria — indica que ele provavelmente deveria estar na outra classe.
</details>

<details><summary>3. Como resolver Primitive Obsession?</summary>
Substituindo primitivos por objetos de valor (Value Objects) como Cpf, Email, Dinheiro, que encapsulam validação e comportamento.
</details>

<details><summary>4. Qual smell um switch por tipo repetido em vários lugares representa e como resolver?</summary>
Switch Statements (OO Abuser); resolve-se com polimorfismo, Strategy ou State.
</details>

<details><summary>5. O que é Message Chain e qual lei ele viola?</summary>
Uma cadeia de chamadas como a.getB().getC().getD(); viola a Lei de Demeter ("fale só com seus vizinhos imediatos").
</details>

## 🔗 Relacionadas

- [Princípios SOLID](../01%20Fundamentos%20em%20arquitetura%20de%20software/02%20Principios%20Solid.md)
- [02 GoF — catálogo de padrões](02%20GoF%20catalogo%20de%20padroes.md)

## 📚 Referências

- FOWLER, M. *Refatoração*. 2ª ed. Novatec, 2020.
- Refactoring.Guru — https://refactoring.guru/pt-br/refactoring/smells
