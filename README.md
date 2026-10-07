# Au Ajuda - Conectando sem Barreiras

O **Au Ajuda** é uma aplicação web interativa de navegação interna e acessibilidade, desenvolvida especificamente para orientar visitantes, alunos e funcionários pelas dependências do **Senac Londrina Centro**. O projeto atua como um mapa virtual inteligente e inclusivo, facilitando a localização de salas, laboratórios, auditórios e andares de forma autónoma.

---

## 📋 Índice
1. [Sobre o Projeto](#sobre-o-projeto)
2. [Arquitetura e Fluxo de Utilização](#arquitetura-e-fluxo-de-utilização)
3. [Funcionalidades Principais](#funcionalidades-principais)
4. [Stack Tecnológica (Destaque Docker & Render)](#stack-tecnológica-destaque-docker--render)
5. [Estrutura de Ficheiros](#estrutura-de-ficheiros)
6. [Como Executar Localmente](#como-executar-localmente)
7. [Deploy e Hospedagem na Nuvem](#deploy-e-hospedagem-na-nuvem)

---

## 🎯 1. Sobre o Projeto
O ecossistema educacional moderno exige soluções que promovam a inclusão digital e física. O **Au Ajuda** nasceu para colmatar a dificuldade de orientação em edifícios amplos, oferecendo um guia passo-a-passo multimodal. Através de uma interface limpa, o utilizador consegue visualizar o caminho estruturado por andares (Térreo, 1º, 2º e 3º andares) amparado por suporte visual avançado e conteúdos multimédia.

---

## 🔄 2. Arquitetura e Fluxo de Utilização
A aplicação foi construída sob o conceito de **SPA (Single Page Application) leve**, garantindo transições instantâneas sem recarregamentos de página:
* **Seleção de Andar:** O utilizador escolhe o destino pretendido no menu lateral ou através do mapa geral da unidade.
* **Injeção Dinâmica de Conteúdo:** O motor em JavaScript (`script.js`) atualiza em tempo real o banco de dados local (`locationDB`), injetando os textos explicativos, as imagens ilustrativas do percurso e os vídeos em alta definição correspondentes à rota escolhida.
* **Modais de Visualização (Lightbox):** Permite ampliar as imagens dos locais em ecrã inteiro para análise detalhada de pontos de referência.

---

## ✨ 3. Funcionalidades Principais
* **Navegação Multimodal por Andares:** Mapeamento completo do Térreo, 1º, 2º e 3º andares com instruções visuais detalhadas.
* **Suporte a Vídeos Exclusivos (MP4):** Cada andar dispõe de botões dedicados ao carregamento de tutoriais em vídeo que demonstram o trajeto completo.
* **Acessibilidade Integrada (WAI-ARIA):** 
  * Atalhos de controlo dinâmico de tamanho de fonte (`A+` / `A-`).
  * Preparação estrutural para integração de assistente de Libras.
  * Compatibilidade com leitores de ecrã e feedback em áudio.
* **Design Responsivo (Mobile-First):** Layout adaptado fluidamente para computadores, tablets e smartphones.

---

##  4. Stack Tecnológica (Foco em Docker e Render)

Esta secção detalha a infraestrutura de engenharia e as ferramentas utilizadas para entregar alta performance, segurança e automação no ciclo de vida do software.

###  Frontend Core (Zero-Framework)
* **HTML5 Semântico:** Estruturação limpa baseada em componentes de acessibilidade.
* **CSS3 Customizado:** Estilização moderna com variáveis globais (`:root`), Flexbox/Grid e transições fluidas.
* **JavaScript (ES6+):** Lógica orientada a eventos, manipulação de DOM em tempo real e gestão de estado em memória.

### 🐳 O Papel do Docker na Aplicação
Para garantir que a aplicação corre de forma idêntica em qualquer ambiente (eliminando o clássico problema do *"na minha máquina funciona"*), utilizámos a conteinerização através do **Docker**.
* **Imagem Base (`nginx:alpine-slim`):** Escolhemos uma distribuição Alpine Linux combinada com o servidor web Nginx por ser extremamente leve (pesando poucos megabytes), o que acelera o tempo de arranque (*startup time*).
* **Segurança Reforçada (Hardening):** 
  * O container está configurado para **não utilizar privilégios de root**, executando sob o utilizador restrito `nginx`.
  * Os diretórios de cache e processos do Nginx foram mapeados com permissões rigorosas de escrita para o utilizador comum.
* **Portabilidade Total:** O `Dockerfile` empacota a aplicação estática de forma isolada, gerindo de forma autónoma o redirecionamento de portas e a entrega de assets estáticos (imagens e vídeos).

### ☁️ O Papel do Render e do `Dockerfile` no Deploy
A escolha do **Render** como plataforma de nuvem (*Cloud Web Service*) deve-se à sua integração nativa com arquiteturas baseadas em contentores Docker:
* **Leitura Direta do Dockerfile:** Ao detetar o repositório no GitHub, o Render lê o `Dockerfile` presente na raiz do projeto e executa o processo de *build* de forma automatizada (Pipeline CI/CD).
* **Adaptação de Portas Dinâmicas:** Através de comandos internos no `Dockerfile` (`sed`), o Nginx foi configurado para escutar na porta estipulada pelo ambiente do Render (`10000`), permitindo a comunicação correta com o balanceador de carga externo.
* **HTTPS Automático e Escalabilidade:** O Render fornece certificados SSL gratuitos por predefinição e gere a infraestrutura efémera do container, garantindo alta disponibilidade com mínimo esforço operacional.

---

## 📁 5. Estrutura de Ficheiros
```text
/
├── Dockerfile        # Configuração do container Docker baseada em Nginx
├── index.html        # Estrutura principal da interface e modais
├── style.css         # Folha de estilos global, temas e responsividade
├── script.js         # Lógica da aplicação, rotas e base de dados em memória
├── images/           # Diretório de imagens e capturas de ecrã dos locais
└── README.md         # Documentação oficial do projeto
