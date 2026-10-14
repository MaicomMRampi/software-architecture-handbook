# ☁️ Modelos de Implantação de Nuvem

Este módulo é dedicado à introdução dos modelos de implantação utilizados na arquitetura em nuvem, destacando suas características, vantagens e casos de uso.

---

## 🏗️ Tipos de Modelos de Implantação

### 1. Nuvem Pública (*Public Cloud*)
> **Exemplo Prático:** Serviços fornecidos por provedores globais como **Amazon Web Services (AWS)**, **Microsoft Azure** e **Google Cloud Platform (GCP)**.

* **👥 Acesso compartilhado (*Multi-tenant*):** A infraestrutura física é compartilhada entre múltiplos clientes, mantendo o isolamento lógico e a segurança dos dados.
* **💡 Custo inicial reduzido:** Modelo de pagamento por uso (*Pay-as-You-Go*), dispensando investimentos em servidores próprios.
* **📈 Alta escalabilidade:** Recursos computacionais dinâmicos que se adaptam rapidamente a variações na demanda.
* **🛠️ Manutenção gerenciada:** O provedor cuida da atualização de hardware, segurança física e manutenção da infraestrutura.
* **🌍 Conectividade global:** Acesso fácil aos serviços de qualquer local com conexão à internet.
* **📦 Recursos padronizados:** Oferta de serviços e ferramentas pré-configuradas para rápido provisionamento.

---

### 2. Nuvem Privada (*Private Cloud*)
> **Exemplo Prático:** O data center interno de um banco ou grande corporação, gerenciado exclusivamente para a empresa usando plataformas como **OpenStack** ou **VMware**.

* **🔒 Uso exclusivo:** Infraestrutura dedicada inteiramente a uma única organização, oferecendo controle absoluto.
* **⚙️ Personalização:** Flexibilidade total para adaptar a arquitetura às necessidades operacionais e de conformidade.
* **💼 Custos elevados:** Exige investimento inicial significativo em hardware, licenças e equipe de manutenção especializada.
* **🎛️ Controle total:** Gerenciamento direto sobre regras de acesso, políticas de segurança e governança de dados.
* **📉 Escalabilidade limitada:** A expansão depende de aquisição e instalação física de novos equipamentos.
* **⚡ Desempenho previsível:** Recursos dedicados garantem alta estabilidade sem interferência de terceiros.

---

### 3. Nuvem Híbrida (*Hybrid Cloud*)
> **Exemplo Prático:** Um hospital que armazena prontuários e dados sensíveis de pacientes na sua **nuvem privada** (por exigências legais e de sigilo), mas utiliza a **nuvem pública** para rodar seu aplicativo mobile de agendamentos e fazer análises estatísticas.

A **nuvem híbrida** conecta ambientes públicos e privados, permitindo que dados e aplicações sejam compartilhados entre eles para aproveitar o melhor de ambos os mundos.

* **🔀 Flexibilidade operacional:** Permite mover cargas de trabalho entre a nuvem privada e a pública conforme a necessidade do negócio.
* **⚖️ Custo balanceado:** Usa a nuvem pública para absorver picos de acesso e mantém custos fixos controlados na nuvem privada.
* **🔐 Segurança aprimorada:** Dados sensíveis permanecem protegidos no ambiente privado, enquanto aplicações não críticas rodam no público.
* **🧩 Complexidade de gestão:** Exige ferramentas e estratégias robustas para gerenciar e orquestrar múltiplos ambientes em conjunto.
* **📊 Alta escalabilidade (*Cloud Bursting*):** Recorre à nuvem pública instantaneamente em momentos de sobrecarga no servidor privado.
* **🔗 Integração desafiadora:** Requer conexões de rede seguras (como VPNs ou links dedicados) para garantir comunicação eficiente.
* **🔄 Continuidade do negócio:** Melhora a resiliência operacional e facilita planos de recuperação de desastres (*Disaster Recovery*).
