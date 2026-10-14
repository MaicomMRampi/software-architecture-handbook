# GoF — Padrões Estruturais

Os padrões estruturais ajudam a organizar a forma como diferentes partes do sistema se relacionam.

Enquanto os padrões de criação se preocupam principalmente com **como criar objetos**, os padrões estruturais ajudam a responder perguntas como:

- Como faço duas partes diferentes do sistema trabalharem juntas?
- Como simplifico uma parte muito complexa?
- Como adiciono uma nova funcionalidade sem alterar o código existente?
- Como evito ficar criando várias cópias das mesmas informações?
- Como trabalho com estruturas que possuem vários níveis?

Neste grupo, vamos estudar:

| Padrão | Ideia principal |
|---|---|
| **Adapter** | Fazer coisas diferentes trabalharem juntas |
| **Facade** | Esconder uma complexidade atrás de uma interface simples |
| **Flyweight** | Evitar duplicação de informações |
| **Composite** | Trabalhar com elementos individuais e grupos da mesma forma |
| **Decorator** | Adicionar funcionalidades sem alterar o original |

---

## Adapter

Imagine que seu sistema espera receber um pagamento desta forma:

```js
payment.pay(100)
```
Pórem há uma api que faz exatamente a mesma coisa porém com interfaces diferentes 

```js
externalPayment.makePayment(100)
```

O Adapter vai criar uma espécie de _ponte_, ou seja ela vai adaptar o código anterior ao novo exemplo:

```js
const externalPayment = {
    makePayment: (amount) => {
        console.log(`Pagamento realizado: R$ ${amount}`)
    }
}

const paymentAdapter = {
    pay: (amount) => {
        externalPayment.makePayment(amount)
    }
}
```
Agora o restante do código poderá utilizar da seguinte forma.

```js
paymentAdapter.pay(100)
```

## Analogia

É como um adaptador de tomada.

A tomada possui um formato e o aparelho possui outro. O adaptador fica entre os dois para permitir que funcionem juntos.