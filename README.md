# 🍔 The Burger House

Aplicação web de cardápio digital para hamburgueria, com carrinho interativo, validação de pedidos, integração com WhatsApp e foco em experiência do usuário.

---

## 🌐 Acesse o Projeto

👉 https://burger-shop-aiib.vercel.app/

---

## 📌 Objetivo do Projeto

Este projeto foi desenvolvido com o objetivo de praticar e demonstrar habilidades em desenvolvimento front-end, incluindo:

* construção de interfaces modernas e responsivas;
* manipulação do DOM com JavaScript puro;
* gerenciamento de estado do carrinho;
* persistência de dados com localStorage;
* integração com APIs externas (ViaCEP);
* foco em UX/UI aplicado a sistemas reais de delivery.

---

## 🚀 Funcionalidades

* 📋 Exibição de cardápio por categorias (Hambúrgueres, Acompanhamentos e Bebidas)
* 🛒 Adição e remoção de produtos no carrinho
* ➕ Controle de quantidade de itens
* 💾 Persistência do carrinho com localStorage
* 🚫 Validação de carrinho vazio antes de prosseguir
* 📍 Etapa de preenchimento de endereço
* 🔎 Busca automática de endereço via CEP (ViaCEP)
* 📦 Revisão completa do pedido
* 📲 Envio do pedido diretamente para o WhatsApp
* ⏰ Status dinâmico da loja (Aberto / Fechado)
* 🎨 Feedback visual com animações e notificações (Toast)

---

## 🛠️ Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Tailwind CSS
* Toastify
* Font Awesome
* API ViaCEP
* localStorage

---

## 🏗️ Estrutura do Projeto

```
burger-shop/
│
├── index.html          # Estrutura principal da aplicação
├── script.js           # Lógica do sistema (carrinho, validações e fluxo do pedido)
├── styles/
│   └── style.css       # Estilos customizados
├── assets/             # Imagens e recursos visuais
└── package.json        # Configuração do projeto
```

---

## ⚙️ Organização da Aplicação

A aplicação foi estruturada com separação de responsabilidades:

* **Interface (HTML):** estrutura visual da aplicação
* **Estilização (CSS/Tailwind):** layout e identidade visual
* **Lógica (JavaScript):** gerenciamento do carrinho, validações e fluxo do pedido
* **Recursos:** imagens e assets

---

## ⭐ Diferenciais Técnicos

* Persistência do carrinho utilizando localStorage
* Fluxo completo de pedido com integração ao WhatsApp
* Integração com API externa para preenchimento automático de endereço
* Feedback visual com animações e notificações
* Interface responsiva para diferentes dispositivos
* Foco em experiência do usuário (UX)

---

## 📸 Interface do Sistema

### 🏠 Página Inicial

<p align="center">
  <img src="docs/images/home.png" width="800">
</p>

### 🍔 Cardápio

<p align="center">
  <img src="docs/images/menu.png" width="800">
</p>

### 🛒 Carrinho

<p align="center">
  <img src="docs/images/cart.png" width="800">
</p>

### 📍 Endereço

<p align="center">
  <img src="docs/images/address.png" width="800">
</p>

### 📦 Revisão do Pedido

<p align="center">
  <img src="docs/images/review.png" width="800">
</p>

---

## ▶️ Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/felipe-frc/burger-shop.git
```

### 2. Acessar a pasta do projeto

```bash
cd burger-shop
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Executar o projeto

```bash
npm run dev
```

---

## ⚠️ Observações

* O envio de pedidos depende do WhatsApp Web
* A busca de endereço depende da API ViaCEP
* É necessário acesso à internet para carregamento de recursos externos

---

## 📈 Melhorias Futuras

* Integração com backend para gerenciamento de pedidos
* Sistema de autenticação de usuários
* Painel administrativo
* Integração com banco de dados

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

**Felipe França** 
