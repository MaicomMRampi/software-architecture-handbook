# 📖 DevOps: Cultura, Práticas e Arquitetura de Software

## 11.1. Princípios DevOps

### 1. O Problema Histórico (Antes do DevOps)
Antes do DevOps, existia o **"muro de confusão"** separando dois silos isolados:
* **Dev (Desenvolvimento):** Focado em velocidade e em lançar novas funcionalidades constantemente.
* **Ops (Operações/Infraestrutura):** Focado na estabilidade e em evitar quedas do sistema em produção.
* **O Conflito:** Dev tentava subir mudanças diárias, enquanto Ops tentava congelar o ambiente. Isso resultava em deploys manuais, demorados e com alta taxa de erros.

### 2. O Conceito de DevOps
DevOps não é um cargo ou ferramenta, mas uma **cultura/filosofia** que unifica responsabilidades (*"You build it, you run it"*).
* **Objetivo:** Entregar software de alta qualidade de forma rápida, frequente, contínua e segura.

### 3. Os Pilares Iniciais
* **Cultura de Colaboração:** Trabalho conjunto do levantamento de requisitos ao monitoramento em produção.
* **Automação (Cultura CI/CD):** Integração e implantação automatizadas para reduzir o fator de erro humano.
* **Feedback Frequente e Monitoramento:** Visibilidade contínua em tempo real para detectar problemas antes dos usuários.

---

## 11.2. Pilares DevOps

Os 5 pilares fundamentais para sustentação da cultura DevOps são:

1. **Automação:** Substituição de tarefas repetitivas por scripts e pipelines.
2. **Integração Contínua (CI):** Validação e testes frequentes do código principal.
3. **Entrega Contínua (CD):** Garantia de software sempre pronto para produção.
4. **Monitoramento e Feedback:** Acompanhamento de métricas e comportamento em tempo real.
5. **Segurança (DevSecOps):** Segurança inserida desde o início do ciclo de desenvolvimento (*Shift-Left Security*).

---

## 11.3. Ferramentas e Práticas Comuns em DevOps

### 🤖 Automação
Elimina a intervenção manual em compilações, testes e provisionamentos.
* **Builds:** Compilação automática do código.
* **Testes:** Execução de testes de unidade (ex: **JUnit**) e testes de interface/E2E (ex: **Selenium**).
* **Deploys e Configuração:** Gerenciamento de fluxos (**GitLab CI/CD**) e automação de infraestrutura (**Ansible**).

---

### 🔄 CI (Integração Contínua)
Prática de integrar o código de todos os desenvolvedores no repositório principal várias vezes ao dia.
* **Objetivo:** Descobrir falhas rapidamente (*Fail Fast*).
* **Fluxo do CI:**
  1. `Commit / Push` → Envio das alterações para o repositório Git.
  2. `Build Automático` → O servidor compila a nova versão.
  3. `Testes Automáticos` → Execução das suítes de testes.
* **Regra de Ouro:** Se o build ou os testes falharem, a alteração é rejeitada até que o erro seja corrigido.
* **Ferramentas:** Jenkins, GitLab CI/CD, GitHub Actions, CircleCI.

---

### 🚀 CD (Continuous Delivery vs. Continuous Deployment)
Garante que o código aprovado no CI possa ser enviado para produção de maneira ágil e segura.

| Característica | Continuous Delivery (Entrega Contínua) | Continuous Deployment (Implantação Contínua) |
| :--- | :--- | :--- |
| **Gatilho de Produção** | Exige **aprovação manual** (um clique). | **100% Automatizado** (passou nos testes, vai direto ao ar). |
| **Nível de Automação** | Automação até o ambiente de Staging. | Automação total até o ambiente de Produção. |

* **Benefícios:** Eliminação de deploys complexos, menor impacto em atualizações e rollback facilitado.
* **Ferramentas:** ArgoCD, GitLab CD, Jenkins, Octopus Deploy, Flux.

---

### 📊 Monitoramento Contínuo e Observabilidade
Acompanhamento da saúde, disponibilidade e performance da aplicação em produção.

#### Os 3 Pilares da Observabilidade:
1. **Métricas (O que está acontecendo?):** Dados numéricos agregados (ex: uso de CPU, memória, requisições/seg). Ferramenta: **Prometheus**.
2. **Logs (O que deu errado exatamente?):** Histórico detalhado de eventos em texto. Ferramenta: **ELK Stack (Elasticsearch, Logstash, Kibana)**.
3. **Traces (Onde está o gargalo?):** Rastreamento do caminho percorrido por uma requisição entre microsserviços.

* **Visualização:** **Grafana** (Dashboards gráficos consolidados).

---

### 🏗️ Arquitetura Evolutiva

Projeta o software para suportar mudanças contínuas de forma incremental.

Conexão com DevOps: Mudanças estruturais no sistema só são seguras quando amparadas por automação de testes e pipelines de CI/CD eficientes.

Princípios da Arquitetura Evolutiva:
Desacoplamento: Componentes independentes (estilo "blocos de Lego"). Alterar um módulo não impacta os demais.

Feedback Contínuo: Validação imediata das mudanças arquiteturais via testes automatizados e monitoramento.

Governança Mínima: Autonomia para os times tomarem decisões técnicas sem burocracias centralizadas excessivas.

### 🎨 Design para DevOps
Imutabilidade da Infraestrutura: Servidores em produção nunca são alterados diretamente. Caso precise de atualização, o servidor antigo é destruído e um novo é criado do zero via IaC (Terraform).

Descentralização das Decisões Arquiteturais: As equipes (squads) têm autonomia para escolher as melhores ferramentas/tecnologias para seus problemas específicos.

Resiliência: O sistema é projetado aceitando que falhas ocorrem, implementando mecanismos automáticos de recuperação sem interferência humana.

📐 Princípios Arquiteturais Aplicados a DevOps
Escalabilidade Horizontal: Aumentar a capacidade adicionando mais instâncias/servidores em paralelo (ao invés de aumentar a memória de uma única máquina).

Resiliência e Tolerância a Falhas: Uso de réplicas e backups para manter a disponibilidade caso nós da rede falhem.

Suportar Desempenho Variável (Auto Scaling): Aumento ou redução automática da quantidade de servidores conforme os picos de tráfego.

### 🚀 Práticas de Arquitetura para Deploy
🔵🟢 1. Blue-Green Deployment
Mecanismo: Mantém dois ambientes idênticos em produção (Blue e Green).

Como funciona: O tráfego dos usuários fica direcionado ao Blue (versão atual). A nova versão é instalada e testada no Green (ocioso). Ao finalizar os testes, o roteamento é chaveado para o Green.

Vantagem: Zero downtime e rollback instantâneo (reverter a chave para o Blue em caso de falha).

### 🐤 2. Canary Releases (Lançamento Canário)
Mecanismo: Liberação gradual da nova versão para um pequeno percentual de usuários.

Como funciona: A nova versão é disponibilizada para, por exemplo, 5% dos usuários. Os logs e métricas são avaliados. Se estável, a porcentagem sobe gradativamente (20% → 50% → 100%).

Vantagem: Minimiza o raio de impacto (blast radius) de eventuais bugs críticos.