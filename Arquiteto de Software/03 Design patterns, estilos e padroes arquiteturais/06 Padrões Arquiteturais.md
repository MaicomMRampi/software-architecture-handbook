# Padrões Arquiteturais

Os padrões arquiteturais são formas de organizar a estrutura de uma aplicação.

A ideia principal é definir **como as diferentes partes do sistema serão separadas e como elas irão se comunicar**.

Por exemplo, em uma aplicação podemos ter:

* uma parte responsável pela interface;
* uma parte responsável por receber requisições;
* uma parte responsável pelas regras de negócio;
* uma parte responsável pelos dados.

Sem uma organização, todas essas responsabilidades podem acabar misturadas, tornando o sistema mais difícil de entender e manter.

Neste conteúdo serão apresentados três padrões bastante conhecidos:

| Padrão   | Significado             | Ideia principal                                    |
| -------- | ----------------------- | -------------------------------------------------- |
| **MVC**  | Model, View, Controller | Separar dados, interface e controle                |
| **MVP**  | Model, View, Presenter  | Colocar a lógica de apresentação no Presenter      |
| **MVVM** | Model, View, ViewModel  | Criar uma camada que conecta a interface aos dados |

---

## MVC — Model, View, Controller

MVC significa:

```text
Model
View
Controller
```

A ideia é dividir a aplicação em três responsabilidades principais.

### Model

O **Model** representa os dados e as regras relacionadas ao domínio da aplicação.

Por exemplo, em um sistema de pedidos:

```js
const order = {
    id: 10,
    customer: "Maicom",
    total: 250
}
```

O Model pode ser responsável pelas operações e regras relacionadas a esses dados.

### View

A **View** é aquilo que o usuário visualiza e utiliza.

Por exemplo:

```text
Pedido #10

Cliente: Maicom
Total: R$ 250,00

[ Finalizar pedido ]
```

Em uma aplicação web, normalmente está relacionada aos componentes da interface.

### Controller

O **Controller** recebe uma ação ou requisição e coordena o que precisa acontecer.

Em uma API Node.js, por exemplo:

```js
const getOrder = async (req, res) => {
    const order = await orderService.findById(req.params.id)

    return res.json(order)
}
```

O Controller recebe a requisição, chama o serviço necessário e devolve uma resposta.

### Fluxo

```text
Usuário
   ↓
View
   ↓
Controller
   ↓
Model
   ↓
Controller
   ↓
View
   ↓
Usuário
```

### Entendendo de forma simples

Podemos pensar:

> **View:** mostra as informações.

> **Controller:** recebe a ação e coordena o processo.

> **Model:** representa os dados e as regras da aplicação.

### Analogia

Imagine um restaurante:

```text
Cliente
   ↓
Garçom
   ↓
Cozinha
   ↓
Prato
   ↓
Garçom
   ↓
Cliente
```

O cliente faz o pedido.

O garçom recebe e encaminha.

A cozinha prepara.

O garçom entrega o resultado.

Cada parte possui uma responsabilidade diferente.

---

# MVP — Model, View, Presenter

MVP significa:

```text
Model
View
Presenter
```

Ele possui uma ideia parecida com o MVC, mas existe uma diferença importante:

**No MVP, o Presenter assume uma responsabilidade maior pela lógica da apresentação.**

### Model

Continua representando os dados e regras da aplicação.

```js
const user = {
    name: "Maicom",
    active: true
}
```

### View

É responsável por mostrar as informações para o usuário.

```text
Usuário: Maicom
Status: Ativo
```

### Presenter

O Presenter funciona como uma ponte entre a View e o restante da aplicação.

Ele pode buscar os dados, processá-los e preparar aquilo que a View precisa apresentar.

```js
const createUserPresenter = ({ userService }) => {
    const loadUser = async (id) => {
        const user = await userService.findById(id)

        return {
            name: user.name,
            status: user.active
                ? "Ativo"
                : "Inativo"
        }
    }

    return {
        loadUser
    }
}
```

A View pode utilizar o Presenter:

```js
const userData = await presenter.loadUser(10)

view.showUser(userData)
```

### Fluxo

```text
Usuário
   ↓
View
   ↓
Presenter
   ↓
Model / Serviços
   ↓
Presenter
   ↓
View
   ↓
Usuário
```

### Entendendo de forma simples

No MVP, tentamos deixar a View mais simples.

O Presenter fica responsável por decidir:

* quais dados buscar;
* como preparar esses dados;
* quais informações a View deve apresentar.

> **MVP = colocar a lógica de apresentação no Presenter.**

### Analogia

Imagine um restaurante.

O cliente faz um pedido, mas existe alguém responsável por organizar esse pedido antes de encaminhá-lo para a cozinha.

Essa pessoa pode verificar as informações, organizar o pedido e depois entregar o resultado ao cliente.

O Presenter possui uma função parecida: ele faz a ligação entre a interface e o restante da aplicação.

---

# MVVM — Model, View, ViewModel

MVVM significa:

```text
Model
View
ViewModel
```

A ideia é parecida com os padrões anteriores, mas aqui temos o **ViewModel** como intermediário entre a interface e os dados.

### Model

Representa os dados e regras da aplicação.

```js
const user = {
    name: "Maicom",
    active: true
}
```

### View

É a interface que o usuário utiliza.

```text
Nome: Maicom
Status: Ativo

[ Desativar usuário ]
```

### ViewModel

O ViewModel prepara os dados e comportamentos que a View precisa.

```js
const createUserViewModel = ({ userService }) => {
    let user = null

    const load = async (id) => {
        user = await userService.findById(id)
    }

    const getData = () => ({
        name: user?.name,
        status: user?.active
            ? "Ativo"
            : "Inativo"
    })

    const disable = async () => {
        await userService.disable(user.id)

        user.active = false
    }

    return {
        load,
        getData,
        disable
    }
}
```

A View trabalha com o ViewModel:

```js
await viewModel.load(10)

const data = viewModel.getData()

view.show(data)
```

### Fluxo

```text
Usuário
   ↓
View
   ↕
ViewModel
   ↓
Model / Serviços
```

Uma característica muito comum do MVVM é a comunicação entre a View e o ViewModel.

Quando os dados do ViewModel mudam, a interface pode ser atualizada automaticamente, dependendo da tecnologia utilizada.

Esse conceito é bastante comum em aplicações que trabalham com **estado e reatividade**.

### Entendendo de forma simples

Podemos pensar no ViewModel como uma camada que prepara tudo que a interface precisa.

A View não precisa conhecer todos os detalhes de como os dados são obtidos ou processados.

> **MVVM = utilizar o ViewModel para conectar a interface aos dados e comportamentos da aplicação.**

---

# MVC x MVP x MVVM

Os três padrões possuem uma ideia em comum:

> **Separar responsabilidades.**

A principal diferença está em quem fica responsável pela lógica relacionada à apresentação.

| Padrão   | Principal responsável |
| -------- | --------------------- |
| **MVC**  | Controller            |
| **MVP**  | Presenter             |
| **MVVM** | ViewModel             |

Podemos visualizar assim:

### MVC

```text
View
 ↓
Controller
 ↓
Model
```

### MVP

```text
View
 ↓
Presenter
 ↓
Model
```

### MVVM

```text
View
 ↕
ViewModel
 ↓
Model
```

---

# Quando cada um pode fazer sentido?

Não existe um padrão que seja automaticamente melhor que os outros.

A escolha depende da tecnologia utilizada, da complexidade da aplicação e de como queremos organizar as responsabilidades.

### MVC

Pode ser interessante para aplicações onde queremos uma separação simples e conhecida.

É muito comum em aplicações web.

```text
Requisição
    ↓
Controller
    ↓
Service / Model
    ↓
Database
```

### MVP

Pode ser interessante quando queremos deixar a View mais simples e concentrar a lógica de apresentação no Presenter.

```text
View
 ↓
Presenter
 ↓
Services
```

### MVVM

Pode ser interessante para interfaces mais interativas, principalmente quando existe bastante alteração de estado.

```text
View
 ↕
ViewModel
 ↓
Services / Model
```

---

# Como lembrar?

### MVC

> **Controller controla o fluxo.**

### MVP

> **Presenter prepara a apresentação.**

### MVVM

> **ViewModel representa os dados e comportamentos que a View precisa.**

---

# Comparação final

```text
                 PADRÕES ARQUITETURAIS
                         │
        ┌────────────────┼────────────────┐
        │                │                │
       MVC              MVP             MVVM
        │                │                │
   Controller         Presenter       ViewModel
        │                │                │
     Controla         Controla        Conecta
      fluxo        apresentação      View e dados
```

A ideia mais importante não é decorar as siglas.

Os três padrões tentam resolver um problema parecido:

> **Como separar a interface, os dados e a lógica da aplicação para que cada parte tenha uma responsabilidade mais clara?**

A diferença está principalmente em **como essa comunicação e essa responsabilidade são organizadas**.

---
