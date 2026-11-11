# 🧱 Princípios SOLID

> **Módulo 01 · Fundamentos** — Cinco princípios de design orientado a objetos para código manutenível, testável e flexível.

---

## 1. Conceito

**SOLID** é um acrônimo para cinco princípios popularizados por Robert C. Martin (*Uncle Bob*). Eles orientam como estruturar classes e componentes para evitar o "código espaguete" — código fortemente acoplado, frágil e difícil de testar.

| Letra | Princípio | Ideia central |
|---|---|---|
| **S** | Single Responsibility | Uma classe deve ter **um único motivo para mudar** |
| **O** | Open/Closed | Aberto para **extensão**, fechado para **modificação** |
| **L** | Liskov Substitution | Subtipos devem poder **substituir** o tipo base sem quebrar nada |
| **I** | Interface Segregation | Várias interfaces **específicas** > uma interface genérica |
| **D** | Dependency Inversion | Dependa de **abstrações**, não de implementações concretas |

Os exemplos abaixo usam TypeScript.

---

## 2. S — Single Responsibility Principle (SRP)

> "Um módulo deve ser responsável por um, e apenas um, ator." — Robert C. Martin

**❌ Violação:** a classe calcula, persiste e envia e-mail — três motivos para mudar.

```ts
class Pedido {
  calcularTotal() { /* regra de negócio */ }
  salvarNoBanco() { /* SQL */ }
  enviarEmailConfirmacao() { /* SMTP */ }
}
```

**✅ Correto:** cada responsabilidade em sua classe.

```ts
class Pedido { calcularTotal() { /* ... */ } }
class PedidoRepository { salvar(p: Pedido) { /* ... */ } }
class NotificadorPedido { enviarConfirmacao(p: Pedido) { /* ... */ } }
```

**Sinal de violação:** classes com nomes genéricos (`Manager`, `Helper`, `Utils`) ou que mudam por pedidos de áreas diferentes (financeiro, marketing, TI).

---

## 3. O — Open/Closed Principle (OCP)

**❌ Violação:** cada novo tipo de desconto exige editar a classe.

```ts
function calcularDesconto(tipo: string, valor: number) {
  if (tipo === 'natal') return valor * 0.1;
  if (tipo === 'blackfriday') return valor * 0.3;
  // novo desconto = mexer aqui de novo
}
```

**✅ Correto:** novos comportamentos entram por **extensão** (polimorfismo / Strategy).

```ts
interface Desconto { aplicar(valor: number): number; }
class DescontoNatal implements Desconto { aplicar(v: number) { return v * 0.1; } }
class DescontoBlackFriday implements Desconto { aplicar(v: number) { return v * 0.3; } }

function calcularDesconto(d: Desconto, valor: number) { return d.aplicar(valor); }
```

---

## 4. L — Liskov Substitution Principle (LSP)

Se `S` é subtipo de `T`, objetos de `T` podem ser substituídos por objetos de `S` **sem alterar o comportamento correto** do programa.

**❌ Exemplo clássico — Quadrado × Retângulo:**

```ts
class Retangulo {
  constructor(public largura = 0, public altura = 0) {}
  setLargura(l: number) { this.largura = l; }
  setAltura(a: number) { this.altura = a; }
  area() { return this.largura * this.altura; }
}

class Quadrado extends Retangulo {
  setLargura(l: number) { this.largura = l; this.altura = l; }
  setAltura(a: number) { this.largura = a; this.altura = a; }
}

const r: Retangulo = new Quadrado();
r.setLargura(5); r.setAltura(4);
r.area(); // esperado 20, retorna 16 → viola LSP
```

**Sinais de violação:** subclasse que lança `NotImplementedException`, sobrescreve método para "não fazer nada" ou exige `if (obj instanceof X)` no código cliente.

---

## 5. I — Interface Segregation Principle (ISP)

Clientes não devem ser forçados a depender de métodos que não usam.

**❌ Violação:**

```ts
interface Trabalhador { trabalhar(): void; comer(): void; }
class Robo implements Trabalhador {
  trabalhar() { /* ok */ }
  comer() { throw new Error('Robô não come'); } // forçado
}
```

**✅ Correto:**

```ts
interface Trabalhavel { trabalhar(): void; }
interface Alimentavel { comer(): void; }
class Humano implements Trabalhavel, Alimentavel { trabalhar() {} comer() {} }
class Robo implements Trabalhavel { trabalhar() {} }
```

---

## 6. D — Dependency Inversion Principle (DIP)

1. Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de **abstrações**.
2. Abstrações não devem depender de detalhes; detalhes dependem de abstrações.

**❌ Violação:**

```ts
class GerenciadorDePedidos {
  private gateway = new GatewayStripe(); // acoplado ao Stripe
}
```

**✅ Correto (com injeção de dependência):**

```ts
interface IGatewayPagamento { cobrar(valor: number): Promise<void>; }

class GatewayStripe implements IGatewayPagamento { async cobrar(v: number) { /* ... */ } }
class GatewayMercadoPago implements IGatewayPagamento { async cobrar(v: number) { /* ... */ } }

class GerenciadorDePedidos {
  constructor(private gateway: IGatewayPagamento) {}
  finalizar(valor: number) { return this.gateway.cobrar(valor); }
}

new GerenciadorDePedidos(new GatewayMercadoPago());
```

Trocar Stripe por Mercado Pago passa a exigir só uma nova implementação do contrato. Nos testes, basta injetar um **mock** de `IGatewayPagamento`.

> ⚠️ **DIP ≠ Injeção de Dependência.** DIP é o *princípio* (depender de abstrações); DI é a *técnica* de entregar a dependência de fora (construtor, container IoC).

### Analogia — Tomada elétrica

A tomada expõe um contrato (padrão elétrico). Geladeira, TV ou carregador se conectam sem que a tomada conheça o aparelho, e o aparelho não sabe se a energia veio de usina solar, hídrica ou eólica.

---

## 7. SOLID e Arquitetura

Os mesmos princípios escalam para o nível arquitetural:

- **SRP** → microsserviços com responsabilidade de negócio bem definida (*bounded contexts*);
- **OCP** → arquiteturas de plugins e microkernel;
- **DIP** → base da Arquitetura Hexagonal, Onion e Clean Architecture (o domínio define as portas; a infraestrutura implementa os adaptadores).

---

## ✅ Pontos-chave

- SOLID reduz acoplamento e aumenta coesão no nível de classes.
- **SRP**: um motivo para mudar. **OCP**: estenda sem editar. **LSP**: subtipos substituíveis. **ISP**: interfaces pequenas. **DIP**: dependa de abstrações.
- Não aplicar dogmaticamente: abstrações demais também geram complexidade (*over-engineering*).

## ❓ Perguntas de revisão

<details><summary>1. Como identificar uma violação do SRP?</summary>
A classe muda por motivos de áreas/atores diferentes, tem muitos métodos sem relação entre si ou nome genérico como Manager/Utils.
</details>

<details><summary>2. Qual padrão GoF é frequentemente usado para cumprir o OCP?</summary>
Strategy (também Decorator e Template Method).
</details>

<details><summary>3. Por que o Quadrado herdando de Retângulo viola o LSP?</summary>
Porque o Quadrado altera o comportamento esperado de setLargura/setAltura; código que funciona com Retângulo passa a produzir resultados errados com Quadrado.
</details>

<details><summary>4. Qual a diferença entre DIP e Injeção de Dependência?</summary>
DIP é o princípio de depender de abstrações; DI é uma técnica para fornecer as implementações concretas de fora da classe.
</details>

## 🔗 Relacionadas

- [01 Introdução](01%20Introducao.md)
- [Code smells](../03%20Design%20patterns,%20estilos%20e%20padroes%20arquiteturais/05%20Code%20smells.md)
- [Arquiteturas em camadas (Hexagonal, Clean)](../03%20Design%20patterns,%20estilos%20e%20padroes%20arquiteturais/07%20Arquiteturas%20em%20camadas.md)

## 📚 Referências

- MARTIN, R. C. *Arquitetura Limpa*. Alta Books, 2019.
- MARTIN, R. C. *Agile Software Development: Principles, Patterns, and Practices*. Prentice Hall, 2002.
