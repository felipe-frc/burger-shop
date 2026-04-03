# 🍔 The Burger House

Aplicação web de cardápio digital para hamburgueria, com carrinho interativo, validação de pedido, integração com WhatsApp e foco em experiência do usuário.

---

## 📌 Objetivo do Projeto

Este projeto foi desenvolvido com o objetivo de praticar e demonstrar:

* construção de interfaces modernas e responsivas;
* manipulação do DOM com JavaScript puro;
* gerenciamento de estado do carrinho;
* persistência de dados com localStorage;
* integração com APIs externas (ViaCEP);
* foco em UX/UI para aplicações reais de delivery.

---

## 🚀 Funcionalidades

* 📋 Exibição de cardápio por categorias (Hambúrgueres, Acompanhamentos e Bebidas)
* 🛒 Adição e remoção de produtos no carrinho
* ➕ Controle de quantidade de itens
* 💾 Persistência do carrinho com localStorage
* 🚫 Validação de carrinho vazio antes de prosseguir
* 📍 Etapa de preenchimento de endereço
* 🔎 Busca automática de endereço via CEP (ViaCEP)
* 📦 Revisão final do pedido
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
├── script.js           # Lógica do sistema (carrinho, validações, fluxo do pedido)
├── styles/
│   └── style.css       # Estilos customizados
├── assets/             # Imagens e recursos visuais
└── package.json        # Configuração do projeto
```

---

## ⚙️ Organização da Aplicação

A aplicação foi estruturada separando responsabilidades em:

* **Interface (HTML):** estrutura visual do sistema
* **Estilização (CSS/Tailwind):** layout e design
* **Lógica (JavaScript):** controle do carrinho, validações e fluxo do pedido
* **Recursos:** imagens e assets

---

## ⭐ Diferenciais Técnicos

* Persistência do carrinho utilizando localStorage
* Fluxo completo de pedido até integração com WhatsApp
* Integração com API externa para preenchimento automático de endereço
* Feedback visual com animações e notificações
* Interface responsiva para diferentes dispositivos
* Aplicação orientada à experiência do usuário

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
git clone https://github.com/seu-usuario/burger-shop.git
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

* O funcionamento do envio de pedidos depende do WhatsApp Web
* A busca de endereço depende da API ViaCEP
* É necessário acesso à internet para carregamento de recursos externos

---

## 📈 Melhorias Futuras

* Integração com backend para gerenciamento de pedidos
* Sistema de autenticação de usuários
* Painel administrativo
* Integração com banco de dados
* Deploy em ambiente de produção

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

Felipe França
