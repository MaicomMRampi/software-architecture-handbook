# Code Smells

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
