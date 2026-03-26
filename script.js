// --- CÓDIGO JAVASCRIPT FINAL E APRIMORADO - THE BURGER HOUSE ---

const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const spanItem = document.getElementById("date-span");
const personalizeBtns = document.querySelectorAll(".personalize-btn");
const customizationModal = document.getElementById("customization-modal");
const customItemName = document.getElementById("custom-item-name");
const addCustomizedBtn = document.getElementById("add-customized-item");
const cancelCustomization = document.getElementById("cancel-customization");
const customObservations = document.getElementById("custom-observations");
const removeSection = document.getElementById("remove-section");

let currentCustomName = "";
let currentCustomPrice = 0;
let currentBaseIngredients = [];

personalizeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentCustomName = btn.dataset.name;
    currentCustomPrice = parseFloat(btn.dataset.price);
    currentBaseIngredients = JSON.parse(btn.dataset.ingredients);

    // Atualiza o nome
    customItemName.textContent = currentCustomName;

    // Cria os checkboxes para remover ingredientes
    removeSection.innerHTML = `<p class="font-medium text-zinc-700 mb-1">Remover Ingredientes:</p>`;
    currentBaseIngredients.forEach(ing => {
      const checkbox = document.createElement("div");
      checkbox.innerHTML = `<label><input type="checkbox" class="remove" value="${ing}"> Sem ${ing}</label>`;
      removeSection.appendChild(checkbox);
    });

    customizationModal.classList.remove("hidden");
  });
});


let cart = JSON.parse(localStorage.getItem("cart")) || [];

function openModal() {
  updateCartModal();
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
}

function closeModal() {
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
}

cartBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) closeModal();
});

menu.addEventListener("click", function (event) {
  const parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  Toastify({
    text: `"${name}" adicionado ao carrinho!`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: { background: "#22c55e" },
  }).showToast();

  updateCartModal();
}

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index]; // Você já tem o item aqui
    if (item.quantity > 1) {
      item.quantity -= 1; // Usando a variável 'item'
    } else {
      cart.splice(index, 1);
    }
    updateCartModal();
  }
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4");
    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between w-full"> 
        <div> 
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn bg-red-500 text-white px-3 py-1 rounded text-sm" data-name="${item.name}">
          Remover
        </button>
      </div>`;
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCounter.textContent = totalItems;
  checkoutBtn.disabled = cart.length === 0;
  checkoutBtn.classList.toggle("opacity-50", cart.length === 0);

  localStorage.setItem("cart", JSON.stringify(cart));
}

addressInput.addEventListener("input", function () {
  if (addressInput.value !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "DESCULPE, O RESTAURANTE ESTÁ FECHADO!",
      duration: 3000,
      style: { background: "#ef4444" },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => `*${item.name}* - Quantidade: (${item.quantity}) - Preço: R$${item.price.toFixed(2)}\n`)
    .join("");

  const total = cartTotal.textContent;
  const messageText = `Olá, gostaria de fazer um pedido!\n\n*Meu Pedido:*\n\n${cartItems}\n*Total: ${total}*\n\n*Endereço de Entrega:*\n${addressInput.value}`;
  const message = encodeURIComponent(messageText);
  const phone = "64999244855";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  addressInput.value = "";
  closeModal();
  updateCartModal();
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 23;
}

function updateRestaurantStatus() {
  const isOpen = checkRestaurantOpen();
  if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    spanItem.textContent = "Aberto agora - Seg à Dom das 18:00 às 23:00";
  } else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
    spanItem.textContent = "Fechado no momento - Horário: 18:00 às 23:00";
  }
}

window.addEventListener("DOMContentLoaded", function() {
  // Este código só vai rodar depois que todo o seu HTML for carregado.
  
  // Roda as funções que precisam ser iniciadas com a página:
  updateCartModal();
  updateRestaurantStatus();
  setInterval(updateRestaurantStatus, 60000);
});