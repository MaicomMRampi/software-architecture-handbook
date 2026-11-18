# 📘 Manual: Laboratório "EC2 Local" com Hyper-V + Ubuntu + SSH

> Manual de instrução com todos os comandos usados no laboratório, explicados um por um.
> Objetivo: simular um servidor na nuvem (como uma EC2 da AWS) dentro do próprio PC e acessá-lo **pela rede**, com **chave SSH**, como um profissional.

---

## 📑 Índice

1. [Visão geral: o que estamos montando](#1-visão-geral-o-que-estamos-montando)
2. [Antes de começar: como não se perder](#2-antes-de-começar-como-não-se-perder)
3. [Hyper-V: o menu da VM](#3-hyper-v-o-menu-da-vm)
4. [Recuperar o acesso (esqueci usuário e senha)](#4-recuperar-o-acesso-esqueci-usuário-e-senha)
5. [Entrar na VM pelo console](#5-entrar-na-vm-pelo-console)
6. [Preparar o servidor](#6-preparar-o-servidor)
7. [Acessar a VM "de longe" pelo Windows](#7-acessar-a-vm-de-longe-pelo-windows)
8. [Par de chaves (key pair): o que é e como funciona](#8-par-de-chaves-key-pair-o-que-é-e-como-funciona)
9. [Gerar o par de chaves](#9-gerar-o-par-de-chaves)
10. [Instalar o cadeado na VM](#10-instalar-o-cadeado-na-vm)
11. [Criar uma chave de backup](#11-criar-uma-chave-de-backup)
12. [Atalho: o arquivo `config`](#12-atalho-o-arquivo-config)
13. [Desligar o login por senha](#13-desligar-o-login-por-senha)
14. [Backup, passphrase e restauração da chave](#14-backup-passphrase-e-restauração-da-chave)
15. [Diagnóstico: o que cada erro significa](#15-diagnóstico-o-que-cada-erro-significa)
16. [Dicas para não precisar decorar](#16-dicas-para-não-precisar-decorar)
17. [Folha de consulta rápida](#17-folha-de-consulta-rápida)

---

## 1. Visão geral: o que estamos montando

| Na AWS (mundo real) | No laboratório |
|---|---|
| Datacenter da Amazon | Hyper-V no seu PC |
| EC2 (servidor) | VM `ec2_local` (Ubuntu Server) |
| Internet entre você e a AWS | **Default Switch** do Hyper-V (rede virtual) |
| Console da AWS | Janela do Hyper-V ("sala de máquinas") |
| Arquivo `.pem` | Chave privada `id_ed25519` |
| `ssh -i chave.pem ubuntu@IP` | `ssh maicom@172.25.173.84` |

```
┌──────────────── SEU PC FÍSICO ───────────────────────────────────┐
│                                                                   │
│  WINDOWS (cliente)             Default Switch                     │
│  172.25.160.1                 (rede privada 172.25.160.0/20)      │
│  ├─ PowerShell                      │                             │
│  ├─ .ssh\id_ed25519     🔑          │                             │
│  └─ .ssh\known_hosts    📇 ── TCP:22 ──▶ VM ec2_local             │
│                                     │   172.25.173.84             │
│                                     │   ├─ sshd escutando na :22  │
│                                     │   └─ ~/.ssh/authorized_keys 🔒
└───────────────────────────────────────────────────────────────────┘
```

**Analogia geral:** criar a VM é como **alugar um apartamento vazio**.
- O **IP** é o endereço.
- A **porta 22** é a sala onde fica o porteiro (o SSH).
- A **chave SSH** é a sua forma de provar quem você é para o porteiro.
- A **janela do Hyper-V** é a sala de máquinas do prédio: quem está lá dentro pode tudo.

---

## 2. Antes de começar: como não se perder

### Olhe sempre o prompt antes de digitar

| Prompt | Onde você está | Quem é |
|---|---|---|
| `PS C:\Users\PC>` | No **Windows** (PowerShell) | O **cliente** |
| `maicom@maicomec2:~$` | Na **VM** (Linux), usuário comum | O **servidor** |
| `root@maicomec2:~#` | Na **VM**, como administrador (root) | O **servidor** com poder total |

> 💡 `$` no final = usuário comum. `#` no final = root (administrador). Cuidado redobrado com o `#`.

Confundir os dois lados é o erro mais comum. Exemplo real do laboratório: a chave foi gerada **dentro da VM** por engano, quando deveria ser gerada no **Windows**.

---

## 3. Hyper-V: o menu da VM

Clique com o botão direito na VM, no Gerenciador do Hyper-V:

| Opção | O que faz | Analogia |
|---|---|---|
| **Conectar...** | Abre a janela com a tela da VM (o console) | Ligar o monitor |
| **Desligar...** | Pede ao sistema para encerrar corretamente | Iniciar → Desligar |
| **Desativar...** | Corta a energia na hora | Puxar o cabo da tomada |
| **Redefinir** | Reinicia na hora (não tem a ver com senha!) | Botão de reset do gabinete |
| **Salvar** | Congela a VM do jeito que está | Hibernar |
| **Pausar** | Pausa a execução | Pause num vídeo |
| **Ponto de Verificação** | Tira uma "foto" da VM para voltar depois | Ponto de restauração |
| **Reverter...** | Volta para o último ponto de verificação | Restaurar o sistema |

> 💡 **Antes de mexer em algo arriscado**, crie um **Ponto de Verificação**. Se der errado, use **Reverter**. Na nuvem, isso se chama **snapshot**.

---

## 4. Recuperar o acesso (esqueci usuário e senha)

> **Importante:** você não "recupera" a senha antiga, você **redefine** uma nova.
> O Linux não guarda a senha, só um **hash** dela (no arquivo `/etc/shadow`). Hash é como uma impressão digital: serve para conferir, mas não dá para reconstruir a senha a partir dele. É a mesma ideia do `bcrypt` no NestJS.

**Analogia:** o chaveiro não "descobre" a chave antiga. Ele **troca o miolo da fechadura** e te entrega uma chave nova.

### 4.1 Abrir o menu do GRUB

1. No Hyper-V: **Conectar...** (abre a janela da VM).
2. Clique **dentro** da janela (para o teclado ir para a VM).
3. Na barra da janela: **Ação → Redefinir** (reinicia a VM).
4. Assim que a tela ficar preta, aperte **`Esc` uma ou duas vezes**.

O **GRUB** é o programa que roda **antes** do Linux, é ele que escolhe como o sistema vai iniciar.

**Se aparecer `grub>`** (você apertou `Esc` demais):

```
normal
```

| | |
|---|---|
| **O que faz** | Sai do prompt de comandos do GRUB e carrega o menu normal |
| **Depois** | Aperte `Esc` **uma vez só** para o menu aparecer |

> **Analogia:** o `Esc` é como o botão do elevador. Apertar uma vez chama o elevador (o menu). Apertar várias vezes fez ele passar do andar e ir para o subsolo (o `grub>`).

### 4.2 Entrar no modo de recuperação

1. No menu, escolha **Advanced options for Ubuntu**.
2. Escolha a linha que termina com **(recovery mode)**.
3. No **Recovery Menu** (fundo azul/cinza), escolha **`root` – Drop to root shell prompt**.
4. Se pedir "Press Enter for maintenance", aperte **Enter**.
5. Aparece um prompt terminado em **`#`**: você está dentro como administrador.

> Repare que o menu mostra **"filesystem state: read-only"**: o disco está só para leitura. Por isso o próximo comando é necessário.

### 4.3 Liberar a escrita no disco

```bash
mount -o remount,rw /
```

| Parte | Significado |
|---|---|
| `mount` | Comando que "monta" discos (conecta um disco a uma pasta) |
| `-o remount,rw` | Opções: **remontar** o disco em modo **rw** (*read-write*, leitura e escrita) |
| `/` | A pasta raiz, ou seja, o disco principal do sistema |

**O que faz:** o modo de recuperação abre o disco **só para leitura**, por segurança. Sem esse comando, o `passwd` falha com o erro `Authentication token manipulation error`.

**Saída esperada:** nenhuma. Silêncio = sucesso.

### 4.4 Descobrir o nome do usuário

```bash
ls /home
```

| Parte | Significado |
|---|---|
| `ls` | *list*: lista o conteúdo de uma pasta |
| `/home` | Pasta onde fica uma subpasta para cada usuário |

**O que faz:** mostra as pastas de usuários. **O nome da pasta é o seu login.**

**Saída esperada:**
```
maicom
```

### 4.5 Redefinir a senha

```bash
passwd maicom
```

| Parte | Significado |
|---|---|
| `passwd` | *password*: troca a senha de um usuário |
| `maicom` | O usuário que terá a senha trocada (use o nome que apareceu no `ls /home`) |

**O que faz:** substitui o hash da senha antiga pelo hash da senha nova.

**Como usar:**
- Digite a nova senha. **Nada aparece na tela** enquanto você digita (nem asteriscos). É proposital.
- Digite de novo para confirmar.

**Saída esperada:**
```
passwd: password updated successfully
```

> ⚠️ **Se esquecer o nome** e digitar só `passwd`, você troca a senha do **root**, não a do seu usuário.
>
> ⚠️ **Teclado:** no recovery, o teclado pode estar no padrão americano (US). Símbolos e acentos mudam de lugar. Use uma senha **só com letras minúsculas e números** e troque por uma forte depois.

### 4.6 Reiniciar

```bash
reboot
```

**O que faz:** reinicia a máquina. Depois disso, entre com o usuário e a senha nova.

### 4.7 Plano B: se o recovery pedir a senha do root

1. No menu do GRUB, com a linha **Ubuntu** selecionada, aperte **`e`** (editar).
2. Desça até a linha que começa com **`linux`**.
3. Vá até o **final** dessa linha e acrescente: ` init=/bin/bash` (com um espaço antes).
4. Aperte **`Ctrl+X`** para iniciar.
5. Rode os comandos `mount`, `ls /home` e `passwd` (seções 4.3 a 4.5).
6. No lugar do `reboot`, use:

```bash
exec /sbin/init
```

| | |
|---|---|
| **`init=/bin/bash`** | Diz ao Linux: "em vez de iniciar o sistema normal, abra direto um terminal de administrador" |
| **`exec /sbin/init`** | Continua a inicialização normal do sistema a partir desse terminal |

### 🔒 Lição de segurança

Tudo isso só funciona porque você tem **acesso ao console** (a janela do Hyper-V). Quem só sabe o seu **IP** não consegue fazer isso: o GRUB roda **antes** da rede existir.

| Ambiente | Quem tem o "console" | O que proteger |
|---|---|---|
| VM no Hyper-V | Quem usa o seu Windows | Senha do Windows |
| Servidor físico | Quem entra na sala | A porta do datacenter |
| EC2 na AWS | Quem entra na sua conta AWS | Senha forte + **MFA** |

E é por isso que existe **criptografia de disco** (BitLocker, LUKS): sem ela, quem tem acesso físico tem acesso a tudo.

---

## 5. Entrar na VM pelo console

Ao ligar, o Ubuntu Server (modo texto) mostra:

```
maicomec2 login: _
```

| Prompt | O que digitar |
|---|---|
| `login:` | O **nome do usuário** (ex: `maicom`), **não** a senha |
| `Password:` | A senha. **Nada aparece** enquanto digita. Aperte Enter no final |

**Deu certo se** o prompt virar `maicom@maicomec2:~$`.
**Deu errado se** aparecer `Login incorrect` → confira o usuário e a senha.

> **Analogia:** como no caixa eletrônico. Primeiro o cartão (usuário), depois a senha (que não aparece na tela).

---

## 6. Preparar o servidor

> Todos estes comandos rodam **na VM** (prompt `maicom@maicomec2:~$`).

### 6.1 Descobrir o IP da VM

```bash
ip a
```

| Parte | Significado |
|---|---|
| `ip` | Ferramenta para ver e configurar a rede |
| `a` | Abreviação de `address`: mostra os endereços de todas as interfaces de rede |

**O que procurar:** a interface **`eth0`** e a linha que começa com **`inet`**:

```
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> ...
    inet 172.25.173.84/20 ... scope global dynamic eth0
```

| Pedaço | Significado |
|---|---|
| `172.25.173.84` | **O IP da VM** (anote este) |
| `/20` | O tamanho da rede (CIDR): os primeiros 20 bits são da rede |
| `dynamic` | O IP foi dado automaticamente (DHCP) e **pode mudar** |

> ⚠️ **Pegadinha do Default Switch:** o IP da VM pode **mudar** quando o Windows reinicia. Se o `ssh` parar de funcionar, rode `ip a` de novo. Na AWS, o problema é resolvido com **Elastic IP** (IP fixo).
>
> 💡 `172.25.x.x` é um **IP privado**: só existe dentro da rede virtual do Hyper-V. Nem o seu celular consegue alcançar.

### 6.2 O `sudo`: o crachá de administrador

```bash
sudo <comando>
```

**O que faz:** executa o comando **como administrador (root)**. Pede a **sua** senha na primeira vez (fica lembrado por alguns minutos).

**Analogia:** você é um funcionário comum (`maicom`). Para abrir o almoxarifado (instalar programas, mexer em configurações do sistema), precisa mostrar o **crachá de gerente**. É o "Executar como administrador" do Windows.

**Erro típico sem `sudo`:**
```
Error: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)
Error: Unable to acquire the dpkg frontend lock (...), are you root?
```
`are you root?` = "você é administrador?"

**Atalho:** esqueceu o `sudo`? Digite:
```bash
sudo !!
```
O `!!` repete o último comando, agora com `sudo`.

### 6.3 Atualizar a lista de programas

```bash
sudo apt update
```

| Parte | Significado |
|---|---|
| `apt` | O gerenciador de pacotes do Ubuntu (como o `npm`, só que para o sistema operacional) |
| `update` | Baixa a lista **atualizada** de programas disponíveis. **Não instala nada** |

**Analogia:** é como baixar o **catálogo novo** da loja antes de fazer o pedido.

> `apt update` = atualiza o catálogo. `apt upgrade` = de fato atualiza os programas instalados.

### 6.4 Instalar o servidor SSH

```bash
sudo apt install -y openssh-server
```

| Parte | Significado |
|---|---|
| `apt install` | Instala um programa (como o `npm install`) |
| `-y` | Responde "sim" automaticamente para a pergunta "deseja continuar?" |
| `openssh-server` | O **servidor SSH**: o programa que fica escutando na porta 22 |

**O que faz:** instala o "porteiro" da porta 22. Sem ele, ninguém consegue conectar por SSH.

**Saída possível:**
```
openssh-server is already the newest version
```
= já estava instalado (provavelmente marcado durante a instalação do Ubuntu).

### 6.5 Ligar o SSH e mantê-lo ligado

```bash
sudo systemctl enable --now ssh
```

| Parte | Significado |
|---|---|
| `systemctl` | Ferramenta que controla os **serviços** (programas que rodam em segundo plano) |
| `enable` | Faz o serviço **iniciar sozinho** quando a VM ligar |
| `--now` | E também **liga agora** |
| `ssh` | O nome do serviço |

**Analogia:** `enable` é contratar o porteiro com carteira assinada (vem todo dia). `--now` é pedir para ele começar hoje mesmo.

### 6.6 Ver se o SSH está rodando

```bash
sudo systemctl status ssh
```

**O que procurar:**
```
Active: active (running)
```
Em verde = rodando. Aperte **`q`** para sair da tela.

| Outros comandos do `systemctl` | O que fazem |
|---|---|
| `sudo systemctl start ssh` | Liga |
| `sudo systemctl stop ssh` | Desliga |
| `sudo systemctl restart ssh` | Reinicia (necessário depois de mudar a configuração) |

### 6.7 Ver quem está escutando em cada porta

```bash
sudo ss -tlnp | grep :22
```

| Parte | Significado |
|---|---|
| `ss` | *socket statistics*: mostra as conexões e portas |
| `-t` | Só TCP |
| `-l` | Só as portas em **LISTEN** (esperando conexões) |
| `-n` | Mostra números (22) em vez de nomes (ssh) |
| `-p` | Mostra qual **programa** está usando a porta |
| `\| grep :22` | Filtra só as linhas que contêm `:22` |

**Saída esperada:**
```
LISTEN 0  4096  0.0.0.0:22  0.0.0.0:*  users:(("sshd",pid=...))
```

| Pedaço | Significado |
|---|---|
| `0.0.0.0:22` | Escutando na porta 22 em **todas** as interfaces de rede (acessível de fora) |
| `127.0.0.1:22` | Se aparecesse isso, só a própria VM conseguiria acessar |

### 6.8 Ver o log do SSH (quem tentou entrar)

```bash
sudo journalctl -u ssh -n 15
```

| Parte | Significado |
|---|---|
| `journalctl` | Mostra os **logs** do sistema |
| `-u ssh` | Só do serviço (*unit*) `ssh` |
| `-n 15` | Só as últimas 15 linhas |

**Exemplos do que aparece:**
```
Failed password for maicom from 172.25.160.1 port 51234 ssh2     ← senha errada
Accepted password for maicom from 172.25.160.1 port 51240 ssh2   ← entrou com senha
Accepted publickey for maicom from 172.25.160.1 port 51300 ssh2  ← entrou com chave
Invalid user admin from 45.x.x.x port 40022                      ← usuário que não existe
```

| Pedaço | Significado |
|---|---|
| `from 172.25.160.1` | O **IP de origem** (quem está tentando entrar). É este IP que um firewall enxerga |
| `port 51234` | A **porta efêmera** (aleatória) que o cliente usou |

> Em um servidor real na internet, este log fica cheio de tentativas de robôs. Por isso se usa login por chave e se desliga o login por senha.

---

## 7. Acessar a VM "de longe" pelo Windows

> Daqui pra frente, os comandos rodam no **PowerShell do Windows** (prompt `PS C:\Users\PC>`), a não ser que esteja indicado o contrário.
> **Minimize a janela do Hyper-V e finja que ela não existe.** 🙈

### 7.1 Testar se a VM responde na rede

```powershell
ping 172.25.173.84
```

**O que faz:** manda pequenos pacotes (ICMP) e espera resposta. Mostra se a máquina está **alcançável** pela rede.

> Se não responder, não significa necessariamente que está fora do ar: alguns firewalls bloqueiam `ping`.

### 7.2 Testar se a porta 22 está aberta

```powershell
Test-NetConnection 172.25.173.84 -Port 22
```

**O que faz:** tenta abrir uma conexão **TCP** na porta 22 (faz o 3-way handshake: SYN → SYN-ACK → ACK).

**Saída do laboratório:**
```
ComputerName     : 172.25.173.84
RemoteAddress    : 172.25.173.84
RemotePort       : 22
InterfaceAlias   : vEthernet (Default Switch)
SourceAddress    : 172.25.160.1
TcpTestSucceeded : True
```

| Campo | Significado |
|---|---|
| `RemoteAddress` / `RemotePort` | Destino: o IP e a porta da VM |
| `InterfaceAlias` | Por qual "placa de rede" do Windows saiu: a placa virtual do Default Switch |
| `SourceAddress` | **IP de origem**: o seu Windows nessa rede. É o IP que você liberaria num firewall com `/32` |
| `TcpTestSucceeded : True` | ✅ A porta está aberta e tem alguém escutando |

> É o equivalente do Windows ao `nc -zv IP 22` do Linux. Use sempre que precisar descobrir se o problema é de **rede/firewall** ou de **aplicação**.

### 7.3 Conectar por SSH

```powershell
ssh maicom@172.25.173.84
```

| Parte | Significado |
|---|---|
| `ssh` | O cliente SSH (já vem no Windows 10/11) |
| `maicom` | O **usuário** na VM |
| `@` | Separa usuário e endereço (como num e-mail) |
| `172.25.173.84` | O **IP** da VM |

**Na primeira vez, aparece:**
```
The authenticity of host '172.25.173.84 (172.25.173.84)' can't be established.
ED25519 key fingerprint is SHA256:1S9GvfO1jEqMvqoQaS+SHtfx00lyU3nMqdm6jH4gU/E.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Digite **`yes`**.

**O que está acontecendo:** a VM mostra a **impressão digital** (fingerprint) dela, que é como o **RG do servidor**. Ao responder `yes`, o Windows grava essa identidade no arquivo `known_hosts`. Se um dia outra máquina tentar se passar por esse IP, o SSH avisa:

```
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
```

> É o mesmo papel do **certificado TLS** no HTTPS: garantir que você está falando com o servidor certo.

**Curiosidade do laboratório:** apareceu também:
```
This host key is known by the following other names/addresses:
    C:\Users\PC/.ssh/known_hosts:1: 172.22.52.124
```
Ou seja, **a mesma VM** já tinha sido acessada antes por **outro IP**. É a prova de que o IP do Default Switch **mudou** depois de reiniciar.

Depois do `yes`, digite a senha. Deu certo se o prompt virar `maicom@maicomec2:~$` **dentro do PowerShell**.

### 7.4 Sair da VM

```bash
exit
```

**O que faz:** encerra a sessão SSH e volta para o PowerShell. Aparece:
```
logout
Connection to 172.25.173.84 closed.
PS C:\Users\PC>
```

### 7.5 Ver o "raio-X" da conexão

```powershell
ssh -v maicom@172.25.173.84
```

| Parte | Significado |
|---|---|
| `-v` | *verbose*: mostra cada etapa da conexão (use `-vvv` para ainda mais detalhe) |

**Use quando** algo não funcionar. É o equivalente ao `curl -v` para HTTPS. Linhas importantes:

```
debug1: Connecting to 172.25.173.84 port 22.                        ← TCP
debug1: Server host key: ssh-ed25519 SHA256:1S9G...                 ← identidade do servidor
debug1: Offering public key: C:\Users\PC/.ssh/id_ed25519 ...        ← "tenho esta chave"
debug1: Server accepts key: ...                                     ← "ela está cadastrada"
Authenticated to 172.25.173.84 ([172.25.173.84]:22) using "publickey".  ← entrou com CHAVE
```

---

## 8. Par de chaves (key pair): o que é e como funciona

### 8.1 O que é

Um par de chaves são **dois números enormes ligados matematicamente**:

| Arquivo | O que é | Analogia | Compartilhar? |
|---|---|---|---|
| `id_ed25519` | **Chave privada** | A **chave** / o seu **carimbo exclusivo** | ❌ **Nunca** |
| `id_ed25519.pub` | **Chave pública** | O **cadeado** / a **foto do carimbo** | ✅ À vontade |

**A propriedade que faz tudo funcionar:**

> Da chave **privada** se calcula a **pública** em milissegundos.
> Da **pública** é **impossível** voltar para a **privada**.

É uma **função de mão única**.

**Analogia da tinta:** misturar azul com amarelo e obter verde é fácil. Receber um balde de verde e separar o azul e o amarelo exatos é impossível. A privada é a receita secreta, e a pública é o verde que todo mundo pode ver.

### 8.2 De onde vem o nome `id_ed25519`

```
id  _  ed  25519
│      │    │
│      │    └─ 25519 → vem de 2²⁵⁵ − 19, o número primo usado nas contas
│      └─ ed → "Edwards", o tipo de curva matemática (curva de Edwards)
└─ id → "identity", a sua identidade
```

- O algoritmo se chama **EdDSA** (*Edwards-curve Digital Signature Algorithm*) e usa a **Curve25519**.
- É uma **curva elíptica**: "andar para frente" nela é fácil, mas descobrir quantos passos foram dados é praticamente impossível.
- **Analogia do relógio:** se eu digo "ande 5 bilhões de vezes de 7 em 7 horas", você calcula onde o ponteiro para. Mas, olhando só o ponteiro, não dá para descobrir quantas voltas foram dadas. O **número de passos** é a chave privada, e o **ponto final** é a chave pública.
- A chave privada tem **256 bits**: um número da ordem de 10⁷⁷. Estima-se que existam cerca de 10⁸⁰ átomos no universo observável. Adivinhar a sua chave seria como acertar um átomo específico do universo.

| | **ed25519** | **RSA** |
|---|---|---|
| Base matemática | Curvas elípticas | Fatorar números primos |
| Tamanho | 256 bits | 3072 a 4096 bits |
| Velocidade | Muito rápida | Mais lenta |
| Arquivo padrão | `id_ed25519` | `id_rsa` |
| Recomendado hoje | ✅ | Só por compatibilidade |

> O nome do arquivo é só um **nome padrão**: é o que o SSH procura automaticamente. Dá para salvar com qualquer nome (ex: `backup_key`).

### 8.3 Os dois usos de um par de chaves

| Uso | Quem faz o quê | Onde aparece |
|---|---|---|
| **Assinatura** (provar identidade) | **Privada assina**, **pública confere** | Login SSH, JWT RS256, commits assinados |
| **Criptografia** (esconder dados) | **Pública tranca**, **privada destranca** | TLS/HTTPS (troca inicial), e-mail criptografado |

O login SSH usa **assinatura**.

### 8.4 Como o login por chave funciona

```
1. Windows: "Quero entrar como maicom. Tenho esta chave: ssh-ed25519 AAAA...Kp3x"
2. VM:      procura em /home/maicom/.ssh/authorized_keys → "conheço esse cadeado"
3. VM:      "Então prove. Assine estes dados aleatórios: 7f3a91c4..."
4. Windows: assina com a CHAVE PRIVADA → envia só a ASSINATURA
5. VM:      confere a assinatura com o CADEADO (chave pública) → ✅ bateu
6. VM:      "Pode entrar, maicom."
```

**Pontos-chave:**
- A chave privada **nunca sai do seu computador**. Só trafega a **prova** de que você a tem.
- Os dados a assinar **mudam a cada conexão**. Uma assinatura gravada não serve para a próxima vez.
- O usuário importa: o cadeado está na pasta do `maicom`. Tentar `ssh root@...` com essa chave falha, porque o cadeado não está na lista do root.

**Analogia da academia:**
1. **No primeiro dia**, você mostra o documento (a **senha**) e **cadastra a digital** (o cadeado no `authorized_keys`).
2. **Do segundo dia em diante**, só encosta o dedo na catraca (a **chave**). Ninguém pede documento.

### 8.5 Senha e chave são coisas separadas

A chave **não é a sua senha criptografada**. São **duas portas** para o mesmo usuário:

```
                    ┌─ Porta 1: SENHA  (continua existindo!)
Usuário maicom  ────┤
                    └─ Porta 2: CHAVE  (id_ed25519)
```

O SSH tenta a chave **primeiro**. Se ela não funcionar, cai para a senha. Para fechar a porta 1, veja a [seção 13](#13-desligar-o-login-por-senha).

A senha continua servindo para coisas **dentro** da VM: o `sudo` e o login pela janela do Hyper-V.

| | Senha | Chave |
|---|---|---|
| O que você prova | Que **sabe** algo | Que **tem** algo |
| O que trafega | A senha (dentro do túnel criptografado) | Só uma assinatura descartável |
| Robô tentando adivinhar | Possível | Impossível na prática |
| Vários servidores | Uma senha por servidor | O mesmo cadeado em todos |

### 8.6 Os dois pares de chaves do SSH (autenticação mútua)

| Par de chaves | Quem prova | Conferido onde | Protege contra |
|---|---|---|---|
| **Do servidor** (host key) | "Este servidor é quem diz ser" | `known_hosts`, no **Windows** | Servidor falso |
| **Seu** (`id_ed25519`) | "Este usuário é quem diz ser" | `authorized_keys`, na **VM** | Usuário falso |

### 8.7 No mundo real

- **AWS:** ao criar uma EC2 e baixar o `.pem`, a AWS gera o par, coloca o cadeado no `authorized_keys` da EC2 e te entrega a chave privada. É exatamente o que você fez na mão.
- **GitHub:** cadastrar uma "SSH key" no GitHub é entregar o seu **cadeado** para ele. O `git push` usa o mesmo fluxo.
- **JWT RS256 no NestJS:** o servidor de autenticação assina o token com a chave **privada**, e as outras APIs conferem com a **pública**.

---

## 9. Gerar o par de chaves

> ⚠️ Rode **no Windows** (prompt `PS C:\Users\PC>`), **nunca na VM**.
> A chave privada tem que ficar com **quem acessa** (o cliente). Gerar na VM é como deixar a chave pendurada do lado de dentro da porta.

```powershell
ssh-keygen -t ed25519
```

| Parte | Significado |
|---|---|
| `ssh-keygen` | *SSH key generator*: gerador de chaves SSH |
| `-t ed25519` | *type*: o tipo (algoritmo) da chave. Aqui, o moderno **ed25519** |

**O que ele faz (passo a passo):**
1. **Sorteia** um número aleatório gigante → a **chave privada**.
2. **Calcula** a chave pública a partir dela.
3. **Salva** as duas em arquivos.

> Ele **não** usa a sua senha da VM e **não** criptografa nada (a não ser que você defina uma passphrase). É **geração**, não criptografia.

**As perguntas que ele faz:**

```
Enter file in which to save the key (C:\Users\PC/.ssh/id_ed25519):
```
Onde salvar. Aperte **Enter** para aceitar o padrão.

```
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```
A **passphrase** é uma senha que **tranca o arquivo da chave privada** (uma chave dentro de um cofre).
- **Vazia** (Enter, Enter) → a chave fica sem cofre. Ok para laboratório.
- **Preenchida** → se alguém roubar o arquivo, não consegue usar sem a passphrase. Recomendado para servidores reais.

**Saída esperada:**
```
Your identification has been saved in C:\Users\PC/.ssh/id_ed25519
Your public key has been saved in C:\Users\PC/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:aze1vNRtoaZLA91jUSKyz7z3t9UI6HyVTuaDzdFE2Hk pc@Maicom
The key's randomart image is:
+--[ED25519 256]--+
|        . . . oo|
|         o . o .oE|
|        ...       |
+----[SHA256]-----+
```

| Pedaço | Significado |
|---|---|
| `identification ... id_ed25519` | A **chave privada** 🔑 |
| `public key ... id_ed25519.pub` | A **chave pública** 🔒 |
| `fingerprint SHA256:...` | Um "resumo" curto da chave, para identificá-la |
| `pc@Maicom` | Comentário: usuário@computador (só para identificar) |
| `randomart` | Um desenho que representa a chave. Serve para humanos compararem chaves "de olho" |

### 9.1 Ver o conteúdo das chaves

```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

**Saída (uma linha só):**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...Kp3x pc@Maicom
│            │                              │
│            │                              └─ comentário
│            └─ a chave pública (o número, em Base64)
└─ o algoritmo
```

A privada (`id_ed25519`, sem `.pub`) tem este formato:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
-----END OPENSSH PRIVATE KEY-----
```

> ⚠️ Esse texto **é a sua identidade**. Quem copiar ele **vira você** em todo servidor que tenha o seu cadeado. Nunca cole em chat, e-mail ou repositório.

### 9.2 O `$env:USERPROFILE`

```powershell
$env:USERPROFILE
```
Saída: `C:\Users\PC`

É uma **variável de ambiente**, a mesma ideia do `process.env` no Node. Guarda a pasta do seu usuário, para que o comando funcione em qualquer PC.

| Terminal | Pasta do usuário | Exemplo |
|---|---|---|
| PowerShell | `$env:USERPROFILE` | `C:\Users\PC` |
| CMD | `%USERPROFILE%` | `C:\Users\PC` |
| Linux | `$HOME` ou `~` | `/home/maicom` |
| Node.js | `os.homedir()` | `C:\Users\PC` |

**Comandos úteis:**
```powershell
ls $env:USERPROFILE\.ssh          # listar a pasta .ssh
explorer $env:USERPROFILE\.ssh    # abrir a pasta no Explorador de Arquivos
Get-ChildItem env:                # ver todas as variáveis de ambiente
```

---

## 10. Instalar o cadeado na VM

> Roda **no Windows**. Vai pedir a senha da VM **uma última vez**.

```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh maicom@172.25.173.84 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Por partes

```
type ...id_ed25519.pub  |  ssh maicom@172.25.173.84  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
└──── 1. lê o arquivo ┘ └2┘ └──────── 3. conecta ──┘ └─────────────── 4. roda NA VM ───────────────┘
     (no WINDOWS)      cano
```

**1. `type $env:USERPROFILE\.ssh\id_ed25519.pub`**, no Windows
- `type` → **lê** um arquivo e joga o conteúdo na saída (no Linux, o equivalente é `cat`).
- Resultado: o texto do cadeado `ssh-ed25519 AAAA... pc@Maicom`.

**2. `|`: o pipe ("cano")**
- Pega a **saída** do comando da esquerda e entrega como **entrada** para o da direita.
- **Analogia:** uma **esteira de fábrica** que leva a peça da máquina 1 direto para a máquina 2.
- Em JS, seria como `salvarNaVM(lerArquivo('id_ed25519.pub'))`, ou `stream.pipe(...)` no Node.

**3. `ssh maicom@172.25.173.84 "..."`**
- Conecta na VM e **roda só o comando entre aspas** lá. Não abre um terminal interativo: entra, executa e sai.
- **Analogia:** pedir ao porteiro "entrega isto no apartamento e volta".

**4. `"mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"`**, na VM

| Parte | Significado |
|---|---|
| `mkdir -p ~/.ssh` | Cria a pasta `.ssh` dentro de `/home/maicom`. O `-p` faz não dar erro se ela já existir |
| `&&` | "E então": só roda o próximo comando se o anterior deu certo |
| `cat` | Aqui, lê o que chegou **pela esteira** (o cadeado vindo do Windows) |
| `>>` | **Acrescenta** no final do arquivo |
| `~/.ssh/authorized_keys` | A **lista de cadeados aceitos** do usuário `maicom` |

### ⚠️ `>>` vs `>`: um caractere que pode te trancar para fora

| Símbolo | O que faz | Resultado |
|---|---|---|
| `>>` | **Acrescenta** no final | Mantém os cadeados que já existiam ✅ |
| `>` | **Substitui** o arquivo inteiro | Apaga todos os outros cadeados ❌ |

**Analogia:** `>>` é **adicionar um nome** no fim da lista da portaria. `>` é **rasgar a lista** e escrever uma nova.

### O fluxo completo

```
WINDOWS                                          VM (172.25.173.84)
id_ed25519.pub
   │ type (lê)
   ▼
"ssh-ed25519 AAAA... pc@Maicom"
   │ | (esteira)
   ▼
ssh ═══════════ túnel criptografado :22 ═══════▶ cat (recebe o texto)
                                                   │ >> (acrescenta)
                                                   ▼
                                        ~/.ssh/authorized_keys
                                        └─ ssh-ed25519 AAAA...Kp3x pc@Maicom
```

> Esse comando **não criptografa** o cadeado. Ele só **copia o texto**. A única criptografia é a do **túnel SSH**, que protege o transporte (como um carro-forte levando a carga).

### Testar

```powershell
ssh maicom@172.25.173.84
```

Deve entrar **sem pedir senha**. ✅

### Conferir na VM

```bash
cat ~/.ssh/authorized_keys
```

**O que faz:** mostra a lista de cadeados aceitos. Cada linha é um cadeado.

---

## 11. Criar uma chave de backup

Uma segunda chave, **totalmente independente** da primeira, para não ficar trancado para fora se perder a principal.

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\backup_key -C "chave-backup"
```

| Parte | Significado |
|---|---|
| `-t ed25519` | Tipo da chave |
| `-f ...\backup_key` | *file*: nome e local do arquivo (em vez do padrão `id_ed25519`) |
| `-C "chave-backup"` | *comment*: o comentário no final da chave, para identificar qual é qual |

**O que faz:** sorteia **outro** número aleatório e calcula **outro** cadeado. **Não** é uma cópia da primeira chave, nem a primeira "criptografada de novo".

**Analogia:** você voltou ao chaveiro e pediu **outro par de chave e cadeado**. Não tem nenhuma ligação com o primeiro.

**Instalar o cadeado de backup:**
```powershell
type $env:USERPROFILE\.ssh\backup_key.pub | ssh maicom@172.25.173.84 "cat >> ~/.ssh/authorized_keys"
```

**Resultado na VM:**
```
WINDOWS                          VM: ~/.ssh/authorized_keys
🔑 id_ed25519  ──── abre ────▶  🔒 ssh-ed25519 AAAA...Kp3x pc@Maicom
🔑 backup_key  ──── abre ────▶  🔒 ssh-ed25519 AAAA...9fQz chave-backup
```

**Entrar com uma chave específica:**
```powershell
ssh -i $env:USERPROFILE\.ssh\backup_key maicom@172.25.173.84
```

| Parte | Significado |
|---|---|
| `-i` | *identity*: qual chave privada usar (é o mesmo `-i chave.pem` da AWS) |

**Revogar uma chave** (ex: notebook roubado): na VM, edite a lista e apague a linha daquele dispositivo:
```bash
nano ~/.ssh/authorized_keys
```
No `nano`: apague a linha, salve com **`Ctrl+O`** e Enter, saia com **`Ctrl+X`**.

> **Boa prática:** uma chave **por dispositivo** (PC de casa, notebook, PC do trabalho). Se um for perdido ou roubado, você remove só o cadeado dele, e os outros continuam funcionando.

---

## 12. Atalho: o arquivo `config`

Para não digitar `ssh maicom@172.25.173.84` toda vez.

**Abrir/criar o arquivo** (no Windows):
```powershell
notepad $env:USERPROFILE\.ssh\config
```
> ⚠️ Se o Bloco de Notas perguntar se quer criar o arquivo, confirme. O arquivo se chama `config`, **sem** extensão. Se ele virar `config.txt`, não funciona: ao salvar, escolha "Todos os arquivos" no tipo.

**Conteúdo:**
```
Host ec2local
    HostName 172.25.173.84
    User maicom
    IdentityFile ~/.ssh/id_ed25519
```

| Linha | Significado |
|---|---|
| `Host ec2local` | O **apelido** que você vai digitar |
| `HostName` | O IP (ou domínio) real |
| `User` | O usuário na VM |
| `IdentityFile` | Qual chave privada usar |

**Agora basta:**
```powershell
ssh ec2local
```

> **Analogia:** é como um **alias de import** no projeto (`@/components`) ou uma variável de ambiente: um nome amigável para algo comprido. Se o IP mudar, você só edita este arquivo.
>
> ⚠️ Se você **não** criou este arquivo, o apelido `ec2local` não existe. Use a forma completa `maicom@172.25.173.84`.

---

## 13. Desligar o login por senha

Fecha a "porta 1" (senha), deixando só a "porta 2" (chave). Os robôs que tentam adivinhar senhas ficam sem ter o que tentar.

> ⚠️ **Regra de ouro:** **não feche** a sessão SSH atual até testar, em **outro** PowerShell, que o login por chave continua funcionando. Se algo der errado, você ainda tem uma sessão aberta para consertar.

**1. Na VM, abra a configuração do servidor SSH:**
```bash
sudo nano /etc/ssh/sshd_config
```

| Parte | Significado |
|---|---|
| `nano` | Editor de texto simples do terminal |
| `/etc/ssh/sshd_config` | Configuração do **servidor** SSH (o `d` de `sshd` = *daemon*, programa que roda em segundo plano) |

**2. Ache a linha:**
```
#PasswordAuthentication yes
```
**Troque por** (sem o `#`):
```
PasswordAuthentication no
```
> O `#` no começo transforma a linha em **comentário** (é ignorada). Tirar o `#` ativa a linha.

Salve: **`Ctrl+O`**, Enter. Saia: **`Ctrl+X`**.

**3. Confira se algum outro arquivo está ligando a senha de volta:**
```bash
sudo grep -r PasswordAuthentication /etc/ssh/
```
| Parte | Significado |
|---|---|
| `grep` | Procura um texto dentro de arquivos |
| `-r` | *recursive*: procura em todos os arquivos da pasta e subpastas |

> No Ubuntu, arquivos em `/etc/ssh/sshd_config.d/` (como `50-cloud-init.conf`) podem ter `PasswordAuthentication yes` e **sobrescrever** a sua configuração. Se aparecer algum, troque para `no` nele também.

**4. Valide a configuração antes de aplicar:**
```bash
sudo sshd -t
```
**O que faz:** testa se o arquivo de configuração tem erro. **Silêncio = ok.** Se mostrar erro, corrija antes de reiniciar.

**5. Aplique:**
```bash
sudo systemctl restart ssh
```

**6. Teste em OUTRO PowerShell:**
```powershell
ssh maicom@172.25.173.84
```
Deve entrar com a chave. ✅

**7. Confirme que a senha foi desligada:**
```powershell
ssh -o PubkeyAuthentication=no maicom@172.25.173.84
```
| Parte | Significado |
|---|---|
| `-o PubkeyAuthentication=no` | Força o cliente a **não** usar a chave, como se você não tivesse ela |

**Resultado esperado:**
```
maicom@172.25.173.84: Permission denied (publickey).
```
Repare: agora só aparece `publickey`. Antes aparecia `(publickey,password)`. A porta da senha está fechada. ✅

---

## 14. Backup, passphrase e restauração da chave

### 14.1 Se formatar o PC

Formatar **apaga** `C:\Users\PC\.ssh\` e, com ela, a chave privada. Ela **não existe** em nenhum outro lugar: não tem "esqueci minha chave".

**Resultado:** o cadeado continua na VM, mas a chave que abre sumiu. 🔒❌🔑

**Como voltar a entrar** (se não tiver backup):
1. No Windows formatado, gere um par novo: `ssh-keygen -t ed25519`.
2. Entre na VM pelo **console do Hyper-V**.
3. Cole o conteúdo do novo `.pub` no final de `~/.ssh/authorized_keys`.
   - Na janela do Hyper-V: **Área de Transferência → Digitar texto da área de transferência**.
4. Apague a linha do cadeado antigo.

**Na AWS:** se perder o `.pem`, a AWS **não tem cópia**. Os caminhos são o **EC2 Instance Connect**, o **Session Manager (SSM)**, ou desanexar o disco, montar em outra EC2 e editar o `authorized_keys`. Trabalhoso, por isso o certo é prevenir.

### 14.2 Adicionar uma passphrase a uma chave existente

```powershell
ssh-keygen -p -f $env:USERPROFILE\.ssh\id_ed25519
```

| Parte | Significado |
|---|---|
| `-p` | *passphrase*: alterar a passphrase de uma chave existente |
| `-f` | Qual arquivo de chave |

- `Enter old passphrase`: Enter (se hoje está vazia).
- `Enter new passphrase`: a frase nova.

**O que faz:** criptografa o arquivo da chave privada. A chave em si **não muda** (o cadeado na VM continua valendo). Muda só o "cofre" em volta dela.

> A passphrase é **local**: destrava a chave no seu PC e nunca viaja pela rede.

### 14.3 Onde guardar o backup

| Local | Seguro? | Por quê |
|---|---|---|
| Gerenciador de senhas (Bitwarden, 1Password, KeePass) | ✅ Melhor | Criptografado e protegido pela senha mestra |
| Pen drive criptografado (BitLocker To Go) | ✅ Bom | Precisa de senha para abrir |
| Google Drive / OneDrive sem proteção | ⚠️ Arriscado | Se a conta for invadida, a chave vai junto |
| E-mail, WhatsApp, GitHub | ❌ Nunca | Fica espalhada em servidores de terceiros |

**O que precisa de backup:**

| Arquivo | Backup? |
|---|---|
| `id_ed25519` (privada) | ✅ **Sim**, é o essencial |
| `id_ed25519.pub` (pública) | Opcional, dá para recriar (veja abaixo) |
| `config` | Opcional, é prático |
| `known_hosts` | Não precisa, se recria sozinho |

**Recriar a pública a partir da privada:**
```powershell
ssh-keygen -y -f $env:USERPROFILE\.ssh\id_ed25519
```
| Parte | Significado |
|---|---|
| `-y` | Lê a chave privada e **imprime a pública** correspondente |

> Isso funciona porque a pública é **calculada** a partir da privada. O contrário é impossível.

### 14.4 Restaurar depois de formatar

1. Crie a pasta `C:\Users\PC\.ssh\` e cole o arquivo `id_ed25519` dentro.
2. Corrija as permissões:

```powershell
icacls $env:USERPROFILE\.ssh\id_ed25519 /inheritance:r /grant:r "$($env:USERNAME):F"
```

| Parte | Significado |
|---|---|
| `icacls` | Ferramenta do Windows para mudar permissões de arquivos |
| `/inheritance:r` | Remove as permissões "herdadas" da pasta (que deixam outros usuários lerem) |
| `/grant:r "USUARIO:F"` | Dá **controle total (F)** só para o seu usuário |

**Por quê:** o SSH **se recusa** a usar uma chave que outros usuários consigam ler, e mostra:
```
WARNING: UNPROTECTED PRIVATE KEY FILE!
```
> No Linux, o equivalente é `chmod 600 ~/.ssh/id_ed25519` (só o dono lê e escreve).

3. Teste: `ssh maicom@172.25.173.84`.

### 14.5 Estratégia completa

- **Backup da chave** → protege contra **perda** (formatação, HD queimado).
- **Uma chave por dispositivo** → protege contra **roubo** (remove só o cadeado do aparelho roubado).
- **Passphrase** → protege a cópia, se alguém pegar o arquivo.
- **Plano B de acesso** → console da nuvem ou do Hyper-V, uma segunda chave.

---

## 15. Diagnóstico: o que cada erro significa

| Erro / sintoma | Camada | Significado | Onde olhar |
|---|---|---|---|
| Fica carregando até dar **timeout** | 3/4 | Um **firewall** descartou a conexão, ou o IP está errado | IP certo? Firewall da nuvem / `ufw`? |
| **Connection refused** | 4 | A máquina respondeu, mas **ninguém está escutando** na porta | `systemctl status ssh`, `ss -tlnp` |
| `TcpTestSucceeded : False` | 4 | Porta fechada ou bloqueada | Idem acima |
| **Permission denied** | 7 | A rede está ok, a **autenticação** falhou | Usuário/senha/chave? `journalctl -u ssh` |
| `Login incorrect` (console) | 7 | Usuário ou senha errados | Teclado (US vs ABNT2)? |
| `are you root?` | — | Faltou o `sudo` | `sudo !!` |
| `Authentication token manipulation error` | — | O `passwd` não conseguiu gravar (disco só leitura) | `mount -o remount,rw /` |
| `REMOTE HOST IDENTIFICATION HAS CHANGED` | 7 | O servidor tem outra identidade (reinstalação ou ataque) | Se você reinstalou: `ssh-keygen -R IP` |
| `UNPROTECTED PRIVATE KEY FILE` | — | Permissões da chave abertas demais | `icacls` (seção 14.4) |

**`ssh-keygen -R IP`**: remove o servidor antigo do `known_hosts`. Use **só** quando você sabe que a identidade mudou por um motivo legítimo (ex: recriou a VM).

**A regra de ouro do diagnóstico:**
> **Timeout** = problema no caminho (rede, firewall).
> **Refused** = cheguei, mas não tem ninguém atendendo (serviço).
> **Permission denied** = cheguei, tem gente atendendo, mas me barraram (autenticação).

---

## 16. Dicas para não precisar decorar

Você não precisa decorar comandos, assim como não decora todos os métodos de Array no JS. Guarde o **conceito** ("preciso ver o IP") e consulte o **como**.

| Ferramenta | Como usar | O que faz |
|---|---|---|
| **`Ctrl+R`** | Aperte e digite um pedaço (ex: `ssh`) | Busca no histórico de comandos. Enter executa, `Ctrl+R` de novo mostra o anterior |
| **`history`** | `history \| grep ssh` | Lista tudo que você já digitou (filtrando por `ssh`) |
| **`tldr`** | `sudo apt install -y tldr`, depois `tldr ssh` | Mostra os usos mais comuns de um comando, com exemplos |
| **`--help`** | `ssh-keygen --help` | Ajuda rápida do comando |
| **`man`** | `man ssh` (sai com `q`) | O manual completo |
| **Seta ↑** | No terminal | Repete os últimos comandos |
| **`Tab`** | Comece a digitar e aperte Tab | Completa nomes de comandos e arquivos |
| **`sudo !!`** | Depois de esquecer o `sudo` | Repete o último comando com `sudo` |

**Plano de treino:**
1. **Semana 1:** refaça o laboratório do zero, consultando este manual.
2. **Semana 2:** refaça **sem consultar**, olhando só a folha de consulta abaixo.
3. **Depois:** suba um Node e um Nginx na VM, usando os mesmos comandos em outro contexto.

---

## 17. Folha de consulta rápida

### Na VM (Linux)

| Eu preciso... | Comando |
|---|---|
| ver o IP da máquina | `ip a` |
| executar como administrador | `sudo <comando>` |
| atualizar a lista de programas | `sudo apt update` |
| instalar um programa | `sudo apt install -y <programa>` |
| ligar um serviço e deixar automático | `sudo systemctl enable --now <serviço>` |
| ver se um serviço está rodando | `sudo systemctl status <serviço>` |
| reiniciar um serviço | `sudo systemctl restart <serviço>` |
| ver quem escuta em cada porta | `sudo ss -tlnp` |
| ver o log de um serviço | `sudo journalctl -u <serviço> -n 20` |
| listar arquivos | `ls` / `ls -la` (inclui ocultos) |
| ver o conteúdo de um arquivo | `cat <arquivo>` |
| editar um arquivo | `nano <arquivo>` (salvar `Ctrl+O`, sair `Ctrl+X`) |
| procurar texto em arquivos | `grep -r "<texto>" <pasta>` |
| trocar a senha de um usuário | `sudo passwd <usuário>` |
| ver a lista de chaves autorizadas | `cat ~/.ssh/authorized_keys` |
| validar a configuração do SSH | `sudo sshd -t` |
| reiniciar a máquina | `sudo reboot` |
| sair da sessão SSH | `exit` |

### No Windows (PowerShell)

| Eu preciso... | Comando |
|---|---|
| testar se a porta está aberta | `Test-NetConnection <IP> -Port 22` |
| conectar na VM | `ssh <usuário>@<IP>` |
| conectar com o apelido | `ssh ec2local` |
| conectar com uma chave específica | `ssh -i <caminho-da-chave> <usuário>@<IP>` |
| ver o passo a passo da conexão | `ssh -v <usuário>@<IP>` |
| gerar um par de chaves | `ssh-keygen -t ed25519` |
| gerar chave com nome e comentário | `ssh-keygen -t ed25519 -f <caminho> -C "<comentário>"` |
| colocar/trocar passphrase | `ssh-keygen -p -f <chave>` |
| recriar a chave pública | `ssh-keygen -y -f <chave-privada>` |
| esquecer um servidor do `known_hosts` | `ssh-keygen -R <IP>` |
| instalar o cadeado na VM | `type <chave>.pub \| ssh <usuário>@<IP> "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"` |
| ver a pasta do usuário | `$env:USERPROFILE` |
| abrir a pasta `.ssh` | `explorer $env:USERPROFILE\.ssh` |
| proteger a chave (permissões) | `icacls <chave> /inheritance:r /grant:r "$($env:USERNAME):F"` |

### Recuperação de acesso (console do Hyper-V)

| Passo | Ação |
|---|---|
| 1 | Conectar → Ação → Redefinir → `Esc` (1 ou 2 vezes) |
| 2 | Se aparecer `grub>`: digitar `normal`, depois `Esc` uma vez |
| 3 | Advanced options → (recovery mode) → root |
| 4 | `mount -o remount,rw /` |
| 5 | `ls /home` |
| 6 | `passwd <usuário>` |
| 7 | `reboot` |

### Arquivos importantes

| Arquivo | Onde | O que é |
|---|---|---|
| `id_ed25519` | Windows `C:\Users\PC\.ssh\` | Sua chave **privada** 🔑 (nunca compartilhe) |
| `id_ed25519.pub` | Windows `C:\Users\PC\.ssh\` | Sua chave **pública** 🔒 (o cadeado) |
| `known_hosts` | Windows `C:\Users\PC\.ssh\` | Identidades dos servidores que você já conheceu 📇 |
| `config` | Windows `C:\Users\PC\.ssh\` | Apelidos de conexão |
| `authorized_keys` | VM `/home/maicom/.ssh/` | Cadeados aceitos para o usuário `maicom` |
| `sshd_config` | VM `/etc/ssh/` | Configuração do servidor SSH |
| `/etc/shadow` | VM | Hashes das senhas dos usuários |

---

> 📌 **Próximos passos do laboratório:**
> 1. Desligar o login por senha ([seção 13](#13-desligar-o-login-por-senha))
> 2. Subir uma aplicação Node.js na VM e acessar pelo navegador do Windows
> 3. Colocar o Nginx na frente do Node (porta 80 → 3000)
