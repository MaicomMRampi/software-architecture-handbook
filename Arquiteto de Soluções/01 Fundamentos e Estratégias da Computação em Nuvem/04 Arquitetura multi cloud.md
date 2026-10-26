# 🛠️ Modelos de Serviço em Nuvem (*Service Models*)

Compreender a divisão de responsabilidades entre o cliente e o provedor de nuvem é fundamental para planejar a infraestrutura e garantir alta disponibilidade, escalabilidade e elasticidade.

---

## 🏗️ Comparativo de Modelos de Serviço

### 1. On-Premises (Implantação Local)
Toda a infraestrutura física e lógica fica sob responsabilidade exclusiva da organização contratante (hardware, redes, virtualização, sistema operacional, dados e aplicações).

> **💡 Exemplo Prático:** Uma empresa que compra seus próprios servidores físicos, instala em uma sala de data center local dentro da sua sede e mantém uma equipe própria para cuidar dos cabos, refrigeração e manutenção do hardware.

---

### 2. IaaS (*Infrastructure as a Service* / Infraestrutura como Serviço)
O provedor fornece os recursos básicos de computação (servidores virtuais, armazenamento e rede). O cliente é responsável por instalar e gerenciar o sistema operacional, bancos de dados e aplicações.

> **💡 Exemplo Prático:** Criar uma máquina virtual no **AWS EC2** ou **Azure Virtual Machines**. O provedor cuida do servidor físico, mas você decide se vai instalar Linux ou Windows e como vai configurar o ambiente.

---

### 3. PaaS (*Platform as a Service* / Plataforma como Serviço)
O provedor gerencia a infraestrutura física, o sistema operacional, atualizações e o ambiente de execução (*runtime*). O cliente fica responsável apenas por desenvolver, implantar o código da aplicação e gerenciar seus dados.

> **💡 Exemplo Prático:** Publicar um sistema web na **AWS Elastic Beanstalk**, **Heroku** ou **Google App Engine**. Você apenas envia o seu código (em Python, Node.js, Java, etc.) e a plataforma cuida automaticamente do servidor, do servidor web e da escala.

---

### 4. SaaS (*Software as a Service* / Software como Serviço)
O software é entregue pronto para uso final pela internet. O provedor gerencia absolutamente tudo — desde a infraestrutura subjacente até a interface do usuário e atualizações de segurança.

> **💡 Exemplo Prático:** Ferramentas corporativas como **Google Workspace (Gmail, Drive)**, **Microsoft 365**, **Salesforce** ou **Trello**. Você não precisa instalar nem configurar nada; basta fazer login pelo navegador e utilizar o sistema.