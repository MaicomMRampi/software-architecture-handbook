# Abordagens de Desenvolvimento Móvel: Nativo, Cross-platform e Híbrido

## 📌 Visão Geral
A criação de aplicações móveis exige definir como o código será executado no dispositivo. Existem três abordagens principais: **Nativo**, **Cross-platform** e **Híbrido**. A escolha correta depende de fatores como orçamento, prazo de entrega, necessidade de performance e acesso a recursos de hardware (câmera, GPS, sensores, Bluetooth).

---

## 🚗 Analogia da Vida Real: O Meio de Transporte

Imagine que você precisa viajar por terra e por água:

1. **Nativo (Carro de Corrida + Jet Ski):** Você compra um carro de alta performance ajustado para a estrada e um jet ski feito especificamente para a água. Cada um entrega o **desempenho máximo** em seu terreno, mas você precisa comprar, manter e pilotar dois veículos completamente diferentes.
2. **Cross-platform (Veículo Anfíbio de Alta Performance):** Um veículo construído do zero com engenharia avançada para andar rápido no asfalto e navegar muito bem na água usando os mesmos comandos. Você mantém **apenas um veículo**, com performance quase idêntica aos dedicados.
3. **Híbrido (Carro comum adaptado com flutuadores):** Um carro tradicional onde você instala bóias para conseguir flutuar na água. Ele cumpre o objetivo de atravessar o lago, mas navega devagar e não foi projetado originalmente para aquilo.

---

## 📊 Tabela Comparativa

| Critério | Nativo | Cross-platform | Híbrido |
| :--- | :--- | :--- | :--- |
| **Base de Código** | Separada (1 para iOS, 1 para Android) | Única (Reaproveitamento de ~80-90%) | Única (Reaproveitamento de ~90-100%) |
| **Performance** | Máxima | Quase Nativa (Excelente) | Média / Baixa |
| **Acesso ao Hardware** | Acesso total e imediato às APIs do SO | Alto (via plugins/bridges) | Limitado (depende de wrappers) |
| **Look & Feel (UI/UX)** | 100% fiel às diretrizes de cada SO | Altamente customizável / Componentes nativos | Semelhante a uma página Web |
| **Custo / Tempo** | Maior custo e maior tempo de desenvolvimento | Menor custo e rápida entrega | Menor custo e desenvolvimento muito ágil |

---

## 🔍 Detalhamento das Abordagens

### 1. Desenvolvimento Nativo
Desenvolvido usando as linguagens, SDKs e ferramentas oficiais fornecidas pela Google (Android) ou Apple (iOS).

* **Como funciona:** O código é compilado diretamente para a linguagem de máquina/bytecode aceita pelo sistema operacional.
* **Vantagens:** Performance impecável, acesso no "dia zero" às novas funcionalidades do SO, suporte total da comunidade oficial.
* **Desvantagens:** Alto custo (necessidade de manter duas equipes especialistas: Swift/iOS e Kotlin/Android).

### 2. Desenvolvimento Cross-platform (Multiplataforma)
Desenvolvido usando um único framework que renderiza componentes nativos ou desenha a interface diretamente em uma tela (*canvas*).

* **Como funciona:** O código único é compilado para código nativo (como no Flutter) ou utiliza pontes de comunicação direta com as APIs nativas (como no React Native).
* **Vantagens:** Manutenção centralizada, ciclo de desenvolvimento acelerado, excelente custo-benefício e performance muito próxima do nativo.
* **Desvantagens:** Dependência de bibliotecas da comunidade para suporte a APIs nativas recém-lançadas.

### 3. Desenvolvimento Híbrido
Desenvolvido com tecnologias web tradicionais empacotadas dentro de um contêiner nativo.

* **Como funciona:** O aplicativo executa uma **WebView** (um navegador sem barra de endereços). A comunicação com o hardware é feita através de plugins intermediários (ex: Capacitor/Cordova).
* **Vantagens:** Reutilização total de conhecimentos de desenvolvimento Web (HTML/CSS/JS) e reaproveitamento de código de sistemas Web já existentes.
* **Desvantagens:** Desempenho inferior em animações complexas, maior consumo de memória e experiência visual que pode parecer "estranha" para o usuário acostumado com apps nativos.

---

## 🎯 Matriz de Decisão: Qual escolher?

* **Escolha Nativo se:** Você está criando jogos pesados (3D), apps de realidade aumentada, edição de vídeo em tempo real ou se o projeto possui orçamento amplo e exige o máximo desempenho possível.
* **Escolha Cross-platform se:** Você precisa lançar para iOS e Android rapidamente, busca excelente performance visual, deseja reduzir custos operacionais e criar apps corporativos, e-commerces ou redes sociais.
* **Escolha Híbrido se:** Sua equipe é estritamente composta por desenvolvedores Web, o app é simples (focado em exibição de formulários e dados) e o prazo/orçamento é extremamente reduzido.

---

## 🛠️ Tecnologias Populares

* **Nativo:** Kotlin, Java (Android Studio) \| Swift, Objective-C (Xcode).
* **Cross-platform:** Flutter (Dart), React Native (JavaScript/TypeScript), .NET MAUI (C#).
* **Híbrido:** Ionic Framework, Apache Cordova, Capacitor.