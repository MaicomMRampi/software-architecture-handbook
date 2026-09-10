## 🎯 Conceito Detalhado
O **SOLID** é um acrônimo para cinco princípios de design de código orientado a objetos, popularizados por Robert C. Martin (*Uncle Bob*). Eles servem como diretrizes para estruturar classes e componentes de forma que o software seja manutenível, testável, flexível e imune ao "código espaguete" (códigos fortemente acoplados e confusos).

## 🛡️ O Acrônimo SOLID
* **S (Single Responsibility Principle):** Princípio da Responsabilidade Única. Uma classe deve ter apenas um motivo para mudar.
* **O (Open/Closed Principle):** Princípio Aberto/Fechado. Entidades devem estar abertas para extensão, mas fechadas para modificação.
* **L (Liskov Substitution Principle):** Princípio da Substituição de Liskov. Subclasses devem ser substituíveis por suas classes base sem quebrar a aplicação.
* **I (Interface Segregation Principle):** Princípio da Segregação de Interface. Múltiplas interfaces específicas são melhores que uma única interface genérica.
* **D (Dependency Inversion Principle):** Princípio da Inversão de Dependência. Dependa de abstrações (interfaces), não de implementações concretas.

## 💻 Exemplo Prático (Inversão de Dependência - DIP)
Em vez de uma classe `GerenciadorDePedidos` instanciar diretamente o gateway de pagamento (`new GatewayStripe()`), ela passa a depender de um contrato `IGatewayPagamento`.

Com essa abstração, alternar entre Stripe, PayPal ou Mercado Pago exige apenas injetar a nova implementação do contrato, sem modificar a regra de negócio central do pedido. Essa abordagem também simplifica a criação de *mocks* em testes automatizados.

## 🔌 Analogia
**Tomada Elétrica Padrão:**
A tomada na parede expõe um contrato (a interface elétrica). É possível conectar uma geladeira, uma televisão ou um carregador de celular. A tomada não precisa conhecer o funcionamento interno do aparelho para fornecer energia, assim como o aparelho não precisa saber se a eletricidade veio de uma usina solar, hídrica ou eólica.