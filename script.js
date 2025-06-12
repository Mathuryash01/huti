// Initialize or load cart
let cart = JSON.parse(localStorage.getItem("cartData")) || {};
let modalProductName = '';
let modalProductPrice = 0;
let modalProductImg = '';

// Play sound if exists
const sound = document.getElementById("addSound");

// Add to cart function
function addToCart(name, price, imgSrc) {
  if (cart[name]) {
    if (cart[name].qty < 10) {
      cart[name].qty++;
    } else {
      alert("Maximum 10 items allowed per product.");
      return;
    }
  } else {
    cart[name] = { price, qty: 1, img: imgSrc };
  }

  localStorage.setItem("cartData", JSON.stringify(cart));
  updateCart();
  showNotification("Product has been added to cart");

  // ✅ Vibration on mobile
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

  // ✅ Play sound
  if (sound) sound.play();
}

// Update cart count on top
function updateCart() {
  let totalQty = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = totalQty;

  // ✅ If cart items are being shown in modal/cart UI — update them here if needed
}

// Show animated notification
function showNotification(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.style.display = "block";
    notification.style.opacity = 1;

    // ✅ Center align notification
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";

    setTimeout(() => {
      notification.style.opacity = 0;
      setTimeout(() => {
        notification.style.display = "none";
      }, 300);
    }, 2000);
  }
}

// Open modal
function openModal(name, price, imgSrc) {
  modalProductName = name;
  modalProductPrice = price;
  modalProductImg = imgSrc;

  document.getElementById("modalImage").src = imgSrc;
  document.getElementById("modalProductName").innerText = name;
  document.getElementById("modalProductPrice").innerText = price;
  document.getElementById("modalQuantity").innerText = cart[name]?.qty || 0;
  document.getElementById("imageModal").style.display = "block";
}

// Close modal
function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

// Add product from modal
function addModalToCart() {
  addToCart(modalProductName, modalProductPrice, modalProductImg);
  document.getElementById("modalQuantity").innerText = cart[modalProductName]?.qty || 0;
}

// Add click event listeners on image and button
document.querySelectorAll(".product-card img").forEach((img) => {
  img.addEventListener("click", function () {
    const card = this.closest(".product-card");
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const src = this.src;
    openModal(name, price, src);
  });
});

document.querySelectorAll(".product-card button").forEach((btn) => {
  btn.addEventListener("click", function () {
    const card = this.closest(".product-card");
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const imgSrc = card.querySelector("img").src;
    addToCart(name, price, imgSrc);
  });
});

// Modal button listeners
document.querySelector(".close").addEventListener("click", closeModal);
document.getElementById("modal-add-cart").addEventListener("click", addModalToCart);

// Checkout button (optional if present)
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      alert("Proceeding to checkout...");
    } else {
      window.location.href = "login.html";
    }
  });
}

// ✅ Clear Cart button
const clearCartBtn = document.getElementById("clear-cart-btn");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to clear the cart?")) {
      cart = {};
      localStorage.removeItem("cartData");
      updateCart();
      showNotification("Cart cleared");
    }
  });
}

// ✅ Load cart count on page load
updateCart();
