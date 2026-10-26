# 3.2. Cloud Management Platforms (CMP)

## 📌 1. O que é uma Cloud Management Platform (CMP)?

Uma **Cloud Management Platform (CMP)** é uma solução de software composta por um conjunto de ferramentas integradas que permite às organizações gerenciar ambientes **Multicloud** e **Nuvem Híbrida** a partir de um painel de controle unificado (*single pane of glass*).

Conforme o ambiente de TI cresce e se divide entre AWS, Azure, GCP e datacenters locais, a CMP abstrai as complexidades específicas de cada provedor, padronizando a governança, os custos e a operação.

---

## 🏗️ 2. Os 4 Pilares Fundamental de uma CMP

### 1. Gestão Financeira (FinOps e Otimização de Custos)
* **Visão Unificada de Faturamento:** Consolidação das contas de diferentes provedores em um único dashboard.
* **Detecção de Desperdícios:** Identificação de discos não anexados, IP's estáticos não utilizados ou instâncias sobredimensionadas (*over-provisioned*).
* **Previsão e Alertas:** Projeção de gastos futuros e alertas automáticos ao ultrapassar orçamentos estipulados.

### 2. Governança, Segurança e Compliance
* **Políticas Centralizadas:** Definição de regras globais (ex.: "Nenhum bucket S3 na AWS ou Blob na Azure pode ser público").
* **Controle de Acesso (RBAC):** Mapeamento único de permissões para usuários e equipes, independentemente da nuvem destino.
* **Auditoria:** Rastreamento unificado de quem criou, alterou ou destruiu qualquer recurso na infraestrutura.

### 3. Provisionamento e Automação Self-Service
* **Catálogo de Serviços:** Permitir que desenvolvedores solicitem um ambiente de desenvolvimento pré-configurado com aprovação automática ou simplificada.
* **Orquestração:** Execução de rotinas automatizadas de backup, desligamento de máquinas fora do horário comercial e *autoscaling*.

### 4. Inventário e Monitoramento Integrado
* Mapeamento em tempo real de todas as VMs, containers, redes e bancos de dados implantados no ecossistema global da empresa.

---

