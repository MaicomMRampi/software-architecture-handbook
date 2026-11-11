# Responsabilidade na Cloud

Guia de estudo sobre as responsabilidades de quem opera ambientes em nuvem, com foco em AWS: modelo de responsabilidade compartilhada, gestão de identidades e acessos, Zero Trust, backups e boas práticas de segurança operacional.

---

## Sumário

1. [Modelo de Responsabilidade Compartilhada](#1-modelo-de-responsabilidade-compartilhada)
2. [Gestão de Identidade e Acesso (IAM)](#2-gestão-de-identidade-e-acesso-iam)
3. [Menor Privilégio e Zero Trust](#3-menor-privilégio-e-zero-trust)
4. [Backups e Recuperação de Desastres](#4-backups-e-recuperação-de-desastres)
5. [Criptografia](#5-criptografia)
6. [Monitoramento e Auditoria](#6-monitoramento-e-auditoria)
7. [Segurança de Rede](#7-segurança-de-rede)
8. [Custos como Responsabilidade](#8-custos-como-responsabilidade)
9. [Checklist](#9-checklist)
10. [Referências](#10-referências)

---

## 1. Modelo de Responsabilidade Compartilhada

Na nuvem, a segurança é dividida entre o provedor e o cliente. A AWS resume assim:

- **AWS: segurança DA nuvem**: data centers, hardware, rede física, virtualização (hypervisor) e a infraestrutura dos serviços gerenciados.
- **Cliente: segurança NA nuvem**: dados, identidades e acessos, configuração dos serviços, sistema operacional das instâncias, aplicações, regras de rede e criptografia.

A divisão muda conforme o tipo de serviço:

| Camada                         | IaaS (EC2) | PaaS (RDS, Elastic Beanstalk) | SaaS / Serverless (S3, Lambda) |
|--------------------------------|:----------:|:-----------------------------:|:------------------------------:|
| Dados e classificação          | Cliente    | Cliente                       | Cliente                        |
| Identidades e acessos (IAM)    | Cliente    | Cliente                       | Cliente                        |
| Código da aplicação            | Cliente    | Cliente                       | Cliente                        |
| Sistema operacional e patches  | Cliente    | AWS                           | AWS                            |
| Configuração de rede/firewall  | Cliente    | Compartilhado                 | Compartilhado                  |
| Infraestrutura física          | AWS        | AWS                           | AWS                            |

> **Regra prática:** quanto mais gerenciado o serviço, menos você administra, mas **dados, acessos e configuração são sempre seus**. A maioria dos incidentes em nuvem vem de configuração errada do lado do cliente (bucket público, chave vazada, permissão excessiva), não de falha do provedor.

---

## 2. Gestão de Identidade e Acesso (IAM)

### 2.1 Usuário root

O usuário root é o e-mail usado para criar a conta e tem **acesso irrestrito** a tudo, inclusive faturamento e encerramento da conta. Ele não pode ser limitado por políticas IAM.

**O que fazer:**

- Ativar **MFA** no root imediatamente (de preferência chave física ou app autenticador).
- **Não criar access keys** para o root. Se existirem, apagar.
- Usar o root apenas para tarefas que exigem ele, por exemplo:
  - alterar dados da conta e plano de suporte;
  - fechar a conta;
  - restaurar permissões de um administrador que se trancou para fora;
  - algumas configurações de faturamento.
- Guardar a senha em um cofre de senhas, com um e-mail corporativo (de grupo) como dono da conta, não um e-mail pessoal.

### 2.2 Identidades do dia a dia

| Recurso                  | Para que serve                                                                 |
|--------------------------|--------------------------------------------------------------------------------|
| **IAM Identity Center**  | Forma recomendada de dar acesso a pessoas: login único (SSO) e credenciais temporárias. |
| **IAM User**             | Identidade com credenciais de longo prazo. Usar só quando não houver alternativa. |
| **IAM Group**            | Agrupa usuários para aplicar as mesmas permissões (ex.: `devs`, `financeiro`). |
| **IAM Role**             | Identidade assumida temporariamente por serviços, aplicações ou pessoas.       |
| **IAM Policy**           | Documento JSON que define o que é permitido ou negado.                         |

**Boas práticas:**

- Pessoas acessam via **Identity Center** ou usuários com MFA obrigatório.
- Aplicações rodando na AWS (EC2, ECS, Lambda) usam **roles**, nunca access keys fixas no código ou no `.env`.
- Pipelines de CI/CD (GitHub Actions, por exemplo) usam **OIDC** para assumir uma role, sem guardar chaves como secret.
- Permissões são dadas a **grupos/roles**, não diretamente a usuários.
- Access keys que ainda existirem devem ser **rotacionadas** e removidas quando não usadas.
- Usar o **IAM Access Analyzer** para encontrar permissões e acessos externos não utilizados.

### 2.3 Exemplo de política com menor privilégio

Uma aplicação NestJS que só precisa ler e gravar arquivos em uma pasta de um bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "UploadsDaAplicacao",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::meu-bucket-app/uploads/*"
    }
  ]
}
```

Compare com o anti-padrão, que dá controle total de **todos** os buckets da conta:

```json
{
  "Effect": "Allow",
  "Action": "s3:*",
  "Resource": "*"
}
```

---

## 3. Menor Privilégio e Zero Trust

São dois conceitos relacionados, mas diferentes:

### 3.1 Princípio do Menor Privilégio (Least Privilege)

Cada identidade recebe **somente as permissões necessárias** para sua função, pelo **menor tempo** possível. É o que se aplica ao criar usuários e roles com permissões específicas em vez de usar o root ou políticas `*`.

Como aplicar:

1. Comece com zero permissões e adicione conforme a necessidade.
2. Restrinja ações (`Action`) e recursos (`Resource`) específicos.
3. Use condições (`Condition`) quando fizer sentido: região, IP, MFA, tags.
4. Revise periodicamente e remova o que não é usado.
5. Prefira credenciais temporárias (roles) a credenciais permanentes.

### 3.2 Zero Trust ("confiança zero")

Modelo de segurança em que **nada é confiável por padrão**, nem mesmo o que está dentro da rede interna. Toda requisição precisa ser autenticada, autorizada e verificada.

Pilares:

- **Nunca confie, sempre verifique**: cada acesso é validado, independentemente de onde vem.
- **Menor privilégio**: acesso mínimo necessário (o item anterior faz parte do Zero Trust).
- **Assuma que houve violação**: projete o sistema para limitar o estrago caso uma credencial vaze (segmentação, logs, alertas).
- **Verificação contínua**: identidade, dispositivo e contexto são reavaliados, não só no login.

Na prática, na AWS: MFA em todo lugar, credenciais temporárias, segmentação de rede (VPC, subnets privadas, security groups restritos), comunicação entre serviços autenticada e auditoria constante.

---

## 4. Backups e Recuperação de Desastres

O provedor garante a durabilidade da infraestrutura, mas **não protege seus dados contra exclusão acidental, bug na aplicação, ransomware ou credencial comprometida**. Backup é responsabilidade do cliente.

### 4.1 Conceitos

| Termo   | Significado                                                                   |
|---------|-------------------------------------------------------------------------------|
| **RPO** (Recovery Point Objective) | Quanto de dado posso perder? Define a frequência do backup. |
| **RTO** (Recovery Time Objective)  | Quanto tempo posso ficar fora do ar? Define a estratégia de recuperação. |
| **Regra 3-2-1** | 3 cópias dos dados, em 2 tipos de mídia/serviço, 1 fora do local principal (outra região ou conta). |

### 4.2 Recursos na AWS

- **AWS Backup**: centraliza políticas de backup (planos, retenção, cópias entre regiões e contas) para EC2, EBS, RDS, DynamoDB, EFS, S3 e outros.
- **Snapshots de EBS e RDS**: cópias pontuais de discos e bancos.
- **RDS automated backups + Point-in-Time Recovery**: restaura o banco para qualquer momento dentro do período de retenção.
- **S3 Versioning**: mantém versões anteriores de objetos sobrescritos ou apagados.
- **S3 Cross-Region Replication**: replica objetos para outra região.
- **S3 Object Lock / AWS Backup Vault Lock**: backups imutáveis (modelo WORM), que nem um administrador consegue apagar antes do prazo. Proteção importante contra ransomware.

### 4.3 Boas práticas

- Definir RPO e RTO por sistema, de acordo com o impacto no negócio.
- Automatizar: backup manual é backup esquecido.
- Guardar cópias em **outra região** e, idealmente, em **outra conta AWS** com acesso restrito.
- Criptografar os backups.
- **Testar a restauração regularmente.** Backup que nunca foi restaurado não é garantia.
- Documentar o procedimento de recuperação (runbook).
- Definir política de retenção (ex.: diários por 30 dias, mensais por 1 ano), também considerando LGPD e requisitos legais.

### 4.4 Estratégias de Disaster Recovery

Da mais barata e lenta para a mais cara e rápida:

1. **Backup & Restore**: recria o ambiente a partir dos backups. RTO de horas.
2. **Pilot Light**: núcleo mínimo (ex.: banco replicado) sempre ligado em outra região.
3. **Warm Standby**: cópia reduzida do ambiente rodando, pronta para escalar.
4. **Multi-site Active/Active**: duas regiões atendendo ao mesmo tempo. RTO quase zero.

---

## 5. Criptografia

- **Em repouso**: ativar criptografia em S3, EBS, RDS, DynamoDB e backups, usando **AWS KMS**.
- **Em trânsito**: TLS em todas as comunicações (certificados via **AWS Certificate Manager**).
- **Segredos**: senhas de banco, tokens e chaves de API ficam no **Secrets Manager** ou **SSM Parameter Store**, nunca no código ou no repositório.
- Controlar quem pode usar cada chave KMS pela key policy.

---

## 6. Monitoramento e Auditoria

| Serviço           | Função                                                                 |
|-------------------|------------------------------------------------------------------------|
| **CloudTrail**    | Registra todas as chamadas de API: quem fez o quê, quando e de onde.   |
| **CloudWatch**    | Métricas, logs e alarmes.                                              |
| **AWS Config**    | Histórico de configuração e regras de conformidade (ex.: "nenhum bucket público"). |
| **GuardDuty**     | Detecção de ameaças (acessos suspeitos, credenciais comprometidas).    |
| **Security Hub**  | Painel consolidado de achados de segurança e boas práticas.            |

Recomendações:

- CloudTrail ativo em **todas as regiões**, com logs em bucket protegido.
- Alarme para **qualquer login do usuário root**.
- Alarmes para mudanças em IAM, security groups e desativação de logs.

---

## 7. Segurança de Rede

- Bancos e serviços internos em **subnets privadas**, sem IP público.
- **Security Groups** liberando só as portas e origens necessárias. Nunca `0.0.0.0/0` em SSH (22) ou banco de dados.
- Preferir **SSM Session Manager** a SSH aberto para acessar instâncias.
- **S3 Block Public Access** ativado na conta.
- **AWS WAF** e **Shield** para aplicações expostas na internet.
- **VPC Endpoints** para acessar serviços AWS sem passar pela internet.

---

## 8. Custos como Responsabilidade

Uma credencial vazada pode virar uma fatura enorme (mineração de criptomoedas é o caso clássico). Controle de custos também é segurança:

- Criar **AWS Budgets** com alertas por e-mail.
- Ativar **Cost Anomaly Detection**.
- Usar **tags** para identificar dono e projeto de cada recurso.
- Desligar ou remover recursos sem uso.

---

## 9. Checklist

**Conta e root**
- [ ] MFA ativado no root
- [ ] Nenhuma access key no root
- [ ] E-mail da conta é corporativo/de grupo
- [ ] Alarme para uso do root

**Identidades**
- [ ] Acesso de pessoas via Identity Center ou usuários com MFA
- [ ] Aplicações usando roles, sem chaves fixas
- [ ] CI/CD usando OIDC
- [ ] Políticas sem `"Action": "*"` e `"Resource": "*"` desnecessários
- [ ] Revisão periódica de permissões (Access Analyzer)

**Backups**
- [ ] RPO e RTO definidos
- [ ] AWS Backup ou backups automáticos configurados
- [ ] Cópia em outra região/conta
- [ ] Backups imutáveis para dados críticos
- [ ] Teste de restauração realizado e documentado

**Dados e rede**
- [ ] Criptografia em repouso e em trânsito
- [ ] Segredos no Secrets Manager/Parameter Store
- [ ] S3 Block Public Access ativo
- [ ] Security groups revisados

**Monitoramento e custos**
- [ ] CloudTrail em todas as regiões
- [ ] GuardDuty ativo
- [ ] Budgets e alertas de custo configurados

---

## 10. Referências

- [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Tasks that require root user credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html)
- [AWS Well-Architected Framework: Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)
- [AWS Well-Architected Framework: Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [AWS Backup](https://docs.aws.amazon.com/aws-backup/)
- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/publications/detail/sp/800-207/final)
