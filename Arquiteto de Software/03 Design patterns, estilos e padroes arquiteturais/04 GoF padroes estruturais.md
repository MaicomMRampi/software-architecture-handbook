# 🧱 GoF — Padrões Estruturais

> **Módulo 03 · Design Patterns** — Como organizar a relação entre partes do sistema: Adapter, Facade, Decorator, Composite, Flyweight, Proxy e Bridge.

---

Enquanto os padrões de criação tratam de **como criar objetos**, os estruturais respondem perguntas como:

- Como faço duas partes diferentes do sistema trabalharem juntas?
- Como simplifico uma parte muito complexa?
- Como adiciono funcionalidade sem alterar o código existente?
- Como evito duplicar as mesmas informações em milhares de objetos?
- Como trabalho com estruturas de vários níveis (árvores)?

| Padrão | Ideia principal |
|---|---|
| **Adapter** | Fazer coisas diferentes trabalharem juntas |
| **Facade** | Esconder uma complexidade atrás de uma interface simples |
| **Decorator** | Adicionar funcionalidades sem alterar o original |
| **Composite** | Tratar elementos individuais e grupos da mesma forma |
| **Flyweight** | Compartilhar informações repetidas |
| **Proxy** | Controlar o acesso a um objeto |
| **Bridge** | Separar abstração de implementação |

---

## 1. Adapter

Seu sistema espera receber um pagamento assim:

```js
payment.pay(100)
```

Porém, a API externa faz a mesma coisa com uma interface diferente:

```js
externalPayment.makePayment(100)
```

O **Adapter** cria uma *ponte*, adaptando uma interface à outra:

```js
const externalPayment = {
  makePayment: (amount) => console.log(`Pagamento realizado: R$ ${amount}`),
};

const paymentAdapter = {
  pay: (amount) => externalPayment.makePayment(amount),
};

paymentAdapter.pay(100); // o resto do sistema continua usando pay()
```

**Quando usar:** integrar bibliotecas/APIs de terceiros ou sistemas legados sem espalhar a interface deles pelo código. É exatamente o "adaptador" da **Arquitetura Hexagonal**.

**Analogia:** adaptador de tomada — a tomada tem um formato e o aparelho outro; o adaptador fica entre os dois.

---

## 2. Facade

Fornece uma **interface simples** para um subsistema complexo.

```js
// Subsistemas complexos
const estoque = { reservar: (itens) => console.log('Reservado', itens) };
const pagamento = { cobrar: (valor) => console.log('Cobrado', valor) };
const envio = { agendar: (end) => console.log('Envio para', end) };
const email = { enviar: (msg) => console.log('Email:', msg) };

// Facade
const checkoutFacade = {
  finalizarCompra({ itens, valor, endereco }) {
    estoque.reservar(itens);
    pagamento.cobrar(valor);
    envio.agendar(endereco);
    email.enviar('Pedido confirmado!');
  },
};

checkoutFacade.finalizarCompra({ itens: ['livro'], valor: 50, endereco: 'Rua A' });
```

**Quando usar:** esconder a orquestração de vários serviços; criar um ponto de entrada para um módulo (a "API pública" de um módulo em um monólito modular). Em microsserviços, o **API Gateway / BFF** é uma fachada.

**Cuidado:** a fachada não deve virar uma "classe Deus" com toda a lógica do sistema.

**Analogia:** a recepção de um hotel — você pede "um táxi para as 8h" e não precisa saber com quem a recepcionista fala.

---

## 3. Decorator

Adiciona comportamento a um objeto **dinamicamente**, "embrulhando-o" em outro objeto com a mesma interface — sem alterar o original e sem herança.

```js
class Notificador {
  enviar(msg) { console.log('E-mail:', msg); }
}

class ComSMS {
  constructor(notificador) { this.n = notificador; }
  enviar(msg) { this.n.enviar(msg); console.log('SMS:', msg); }
}

class ComLog {
  constructor(notificador) { this.n = notificador; }
  enviar(msg) { console.log('[log] enviando...'); this.n.enviar(msg); }
}

const n = new ComLog(new ComSMS(new Notificador()));
n.enviar('Seu pedido saiu para entrega');
```

Em JavaScript também é comum decorar **funções**:

```js
const comCache = (fn) => {
  const cache = new Map();
  return (arg) => cache.has(arg) ? cache.get(arg) : (cache.set(arg, fn(arg)), cache.get(arg));
};
const buscarProduto = comCache((id) => db.find(id));
```

**Quando usar:** logging, cache, retry, métricas, autorização em volta de algo já existente. Cumpre o **OCP**.

**Analogia:** um café — você adiciona leite, depois chantilly, depois canela; cada adição "embrulha" a anterior, e continua sendo um café.

---

## 4. Composite

Compõe objetos em **estruturas de árvore** e permite tratar **itens individuais e grupos da mesma forma**.

```js
class Produto {
  constructor(nome, preco) { this.nome = nome; this.preco = preco; }
  getPreco() { return this.preco; }
}

class Caixa {
  constructor() { this.itens = []; }
  adicionar(item) { this.itens.push(item); return this; }
  getPreco() { return this.itens.reduce((t, i) => t + i.getPreco(), 0); }
}

const kit = new Caixa()
  .adicionar(new Produto('Mouse', 50))
  .adicionar(new Caixa().adicionar(new Produto('Cabo', 10)).adicionar(new Produto('Adaptador', 15)));

kit.getPreco(); // 75 — o cliente não precisa saber se é produto ou caixa
```

**Exemplos reais:** árvore do DOM, sistema de arquivos (pastas e arquivos), menus e submenus, organogramas, componentes React.

**Analogia:** um exército — um general dá a ordem a divisões, que repassam a brigadas, até chegar aos soldados; a ordem é a mesma em qualquer nível.

---

## 5. Flyweight

Economiza memória **compartilhando o estado comum** (intrínseco) entre muitos objetos, mantendo separado o estado que varia (extrínseco).

```js
// Estado intrínseco compartilhado
const tiposArvore = new Map();
function getTipo(nome, cor, textura) {
  const chave = `${nome}-${cor}-${textura}`;
  if (!tiposArvore.has(chave)) tiposArvore.set(chave, { nome, cor, textura });
  return tiposArvore.get(chave);
}

// Estado extrínseco: posição de cada árvore
const floresta = [];
for (let i = 0; i < 1_000_000; i++) {
  floresta.push({ x: Math.random() * 1000, y: Math.random() * 1000, tipo: getTipo('Pinheiro', 'verde', 'pinheiro.png') });
}
// 1 milhão de árvores, mas só 1 objeto com a textura
```

**Quando usar:** quantidade enorme de objetos parecidos (jogos, editores de texto com caracteres, mapas). Exemplos: *string interning*, pools de objetos.

**Analogia:** uma biblioteca — em vez de cada aluno comprar o mesmo livro, todos compartilham o exemplar; só a anotação de "quem pegou e quando" é individual.

---

## 6. Proxy

Um objeto **substituto** que controla o acesso a outro, com a mesma interface.

| Tipo | Uso |
|---|---|
| **Virtual** | Carregamento preguiçoso (*lazy load*) de algo caro |
| **De proteção** | Verifica permissão antes de delegar |
| **Remoto** | Representa um objeto em outro processo/servidor (stubs gRPC) |
| **De cache** | Guarda respostas para evitar chamadas repetidas |

```js
const api = { buscarUsuario: (id) => ({ id, nome: 'Ana' }) };

const apiComCache = new Proxy(api, {
  cache: new Map(),
  get(alvo, prop) {
    if (prop !== 'buscarUsuario') return alvo[prop];
    return (id) => {
      if (!this.cache.has(id)) this.cache.set(id, alvo.buscarUsuario(id));
      return this.cache.get(id);
    };
  },
});
```

> Decorator × Proxy: estruturas parecidas. **Decorator adiciona** comportamento (normalmente montado pelo cliente); **Proxy controla o acesso** (normalmente gerencia o ciclo de vida do objeto real).

**Analogia:** o cartão de crédito é um proxy do dinheiro na sua conta.

---

## 7. Bridge

Separa uma **abstração** da sua **implementação**, para que as duas variem de forma independente — evitando explosão de subclasses.

```js
// Implementações
const email = { enviar: (msg) => console.log('Email:', msg) };
const sms = { enviar: (msg) => console.log('SMS:', msg) };

// Abstrações
class Alerta {
  constructor(canal) { this.canal = canal; }
  disparar(msg) { this.canal.enviar(msg); }
}
class AlertaUrgente extends Alerta {
  disparar(msg) { this.canal.enviar(`🚨 URGENTE: ${msg}`); }
}

new AlertaUrgente(sms).disparar('Servidor fora do ar');
// Sem Bridge: AlertaEmail, AlertaSms, AlertaUrgenteEmail, AlertaUrgenteSms...
```

**Analogia:** controle remoto (abstração) × aparelho (implementação) — qualquer controle funciona com qualquer TV.

---

## ✅ Pontos-chave

- **Adapter:** compatibiliza interfaces. **Facade:** simplifica um subsistema.
- **Decorator:** adiciona comportamento embrulhando. **Proxy:** controla acesso.
- **Composite:** árvore tratada uniformemente. **Flyweight:** compartilha estado repetido.
- **Bridge:** abstração e implementação variam independentes.
- Quase todos se apoiam em **composição** e **interfaces comuns**.

## ❓ Perguntas de revisão

<details><summary>1. Qual a diferença entre Adapter e Facade?</summary>
Adapter converte uma interface existente na interface que o cliente espera (compatibilidade). Facade cria uma interface nova e simplificada para um conjunto de subsistemas (simplicidade).
</details>

<details><summary>2. Por que o Decorator respeita o princípio Aberto/Fechado?</summary>
Porque adiciona comportamento envolvendo o objeto, sem modificar a classe original.
</details>

<details><summary>3. Dê dois exemplos reais de Composite.</summary>
Árvore do DOM e sistema de arquivos (pastas contendo arquivos e outras pastas).
</details>

<details><summary>4. O que é estado intrínseco e extrínseco no Flyweight?</summary>
Intrínseco é o estado comum e imutável, compartilhado entre objetos; extrínseco é o que varia por objeto e é mantido/fornecido de fora.
</details>

<details><summary>5. Diferença entre Decorator e Proxy?</summary>
Decorator adiciona responsabilidades; Proxy controla o acesso ao objeto real (lazy load, cache, permissão, acesso remoto).
</details>

## 🔗 Relacionadas

- [02 GoF — catálogo](02%20GoF%20catalogo%20de%20padroes.md)
- [03 GoF — padrões de criação](03%20GoF%20padroes%20de%20criacao.md)
- [07 Arquiteturas em camadas (Hexagonal: portas e adaptadores)](07%20Arquiteturas%20em%20camadas.md)

## 📚 Referências

- GAMMA, E. et al. *Padrões de Projeto*. Bookman, 2000.
- Refactoring.Guru — https://refactoring.guru/pt-br/design-patterns/structural-patterns
