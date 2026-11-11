# 📡 Edge Computing

> **Módulo 01 · Computação em Nuvem** — Levar processamento para perto de onde os dados são gerados, reduzindo latência e tráfego até a nuvem central.

---

## 1. Conceito

**Edge Computing** (computação de borda) é um modelo distribuído em que o processamento e o armazenamento acontecem **próximos à fonte dos dados** (dispositivos, sensores, usuários), em vez de tudo ser enviado a um data center ou região de nuvem centralizada.

```text
 Dispositivos / Sensores  →  Borda (gateway, micro-DC, PoP de CDN)  →  Nuvem central
   (gera dados)               (processa em ms, filtra, decide)          (armazena, treina IA, analytics)
```

A nuvem não desaparece: a borda **complementa** a nuvem — decisões rápidas na borda, processamento pesado e histórico na nuvem.

## 2. Por que usar?

| Motivação | Explicação |
|---|---|
| **Baixa latência** | Decisões em milissegundos (carro autônomo, robô industrial, jogos) |
| **Economia de banda** | Filtrar/agregar dados antes de enviar (câmeras geram TB/dia) |
| **Operação offline / resiliência** | A loja ou fábrica continua funcionando sem internet |
| **Privacidade e soberania** | Dados sensíveis processados localmente (LGPD) |
| **Escala de IoT** | Bilhões de dispositivos não conseguem falar todos com a nuvem central |

## 3. Camadas: Cloud, Fog e Edge

| Camada | Onde fica | Exemplo |
|---|---|---|
| **Device edge** | No próprio dispositivo | Câmera com IA embarcada, celular |
| **Edge / Near edge** | Gateway local, micro data center | Servidor na fábrica, na loja, na torre 5G (MEC) |
| **Fog** | Camada intermediária entre borda e nuvem | Nós regionais que agregam várias bordas |
| **Cloud** | Região do provedor | AWS/Azure/GCP |

## 4. Casos de uso

- **Indústria 4.0:** manutenção preditiva analisando vibração das máquinas em tempo real;
- **Veículos autônomos e conectados:** decisão de frenagem não pode esperar a nuvem;
- **Varejo:** checkout sem caixa, análise de vídeo na loja;
- **Saúde:** monitoramento de pacientes com wearables;
- **CDN e serverless de borda:** executar código em PoPs perto do usuário (Cloudflare Workers, Lambda@Edge, Vercel Edge Functions) para personalização, A/B test, autenticação;
- **5G + MEC (Multi-access Edge Computing):** aplicações de baixa latência na rede da operadora.

## 5. Ofertas dos provedores

| Provedor | Serviços |
|---|---|
| **AWS** | Outposts, Local Zones, Wavelength (5G), IoT Greengrass, Lambda@Edge, CloudFront Functions |
| **Azure** | Azure Stack Edge, Azure IoT Edge, Azure Arc |
| **Google** | Google Distributed Cloud (Edge), Anthos |
| **Outros** | Cloudflare Workers, Fastly Compute, Akamai EdgeWorkers; K3s / KubeEdge para Kubernetes leve |

## 6. Desafios

- **Gestão de frota:** atualizar e monitorar milhares de nós remotos (deploy via GitOps, OTA);
- **Segurança física e lógica:** equipamentos fora do data center são mais expostos;
- **Recursos limitados:** CPU, memória e energia restritos;
- **Consistência de dados:** sincronização borda ↔ nuvem, conflitos ao operar offline;
- **Observabilidade distribuída.**

## 7. Exemplo de arquitetura

```text
[Sensores de temperatura] --MQTT--> [Gateway de borda]
                                      ├─ regra local: temp > 80°C → desliga máquina (≈5 ms)
                                      └─ agrega médias por minuto
                                              │
                                              ↓ (só resumos, a cada 1 min)
                                       [Nuvem: IoT Core → data lake → dashboard / ML]
                                              │
                                              └─ novo modelo de ML treinado → enviado de volta à borda
```

## 8. Analogia

O **pronto-socorro do bairro** (borda) resolve rápido as emergências; casos complexos e exames detalhados vão para o **hospital central** (nuvem). Mandar todo paciente para o hospital central seria lento e lotaria o sistema.

---

## ✅ Pontos-chave

- Edge = processar **perto da origem dos dados**.
- Benefícios: latência, banda, operação offline, privacidade.
- Edge **complementa** a nuvem, não a substitui.
- Desafios: gestão de muitos nós remotos, segurança e sincronização de dados.

## ❓ Perguntas de revisão

<details><summary>1. Cite duas vantagens do edge computing em relação a processar tudo na nuvem.</summary>
Menor latência nas decisões e menor consumo de banda (só dados filtrados/agregados vão para a nuvem). Também permite operar offline.
</details>

<details><summary>2. Qual a diferença entre edge e fog computing?</summary>
Edge é o processamento no dispositivo ou junto a ele; fog é uma camada intermediária que agrega e processa dados de várias bordas antes da nuvem.
</details>

<details><summary>3. Dê um exemplo de edge computing para aplicações web.</summary>
Funções serverless em CDN (Cloudflare Workers, Lambda@Edge) executando autenticação, redirecionamentos ou personalização no PoP mais próximo do usuário.
</details>

## 🔗 Relacionadas

- [01 Introdução à computação em nuvem](01%20Introducao%20a%20computacao%20em%20nuvem.md)
- [05 Arquitetura multicloud](05%20Arquitetura%20multi%20cloud.md)
- [Arquiteturas cloud e serverless](../../Arquiteto%20de%20Software/04%20Arquiteturas%20da%20atualidade/05%20Arquiteturas%20cloud%20e%20serverless.md)

## 📚 Referências

- ETSI — *Multi-access Edge Computing (MEC)*.
- SATYANARAYANAN, M. *The Emergence of Edge Computing*. IEEE Computer, 2017.
