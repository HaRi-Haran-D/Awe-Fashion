// Sample products (add realistic images in 'assets' folder)
const products = [
  { id: 1, name: "Blue Checked Shirt", price: 799, desc: "Cotton, Slim-fit", img: "assets/img/blue_shirt.webp", cat: "Shirts" },
  { id: 2, name: "Casual White Tee", price: 499, desc: "Pure cotton. Bestseller", img: "assets/img/shirt2.webp", cat: "T-Shirts" },
  { id: 3, name: "Classic Jeans", price: 1199, desc: "Blue, stretch", img: "assets/img/jeans.webp", cat: "Jeans" },
  { id: 4, name: "Brown Leather Belt", price: 599, desc: "Genuine leather", img: "assets/img/belts.webp", cat: "Accessories" },
  { id: 5, name: "Grey Formal Pants", price: 999, desc: "Poly-viscose blend", img: "assets/img/pant1.webp", cat: "Pants" },
  { id: 6, name: "Black Polo T-shirt", price: 699, desc: "Regular fit, comfy", img: "assets/img/t_shirt.webp", cat: "T-Shirts" },
  { id: 7, name: "Formal Blue Shirt", price: 899, desc: "Office favorite", img: "assets/img/shirt3.webp", cat: "Shirts" },
  { id: 8, name: "Kaezri Wallet", price: 349, desc: "Royal Wallet", img: "assets/img/wallet.png", cat: "Accessories" }
];

// Cart state using localStorage for persistence
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM Elements
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems"); 
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

// Utilities
function renderProducts(items) {
  productGrid.innerHTML = "";
  if (items.length === 0) {
    productGrid.innerHTML = `<div class='text-center py-5 text-muted'>No products found.</div>`;
    return;
  }
  items.forEach(prod => {
    productGrid.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${prod.img}" class="card-img-top" alt="${prod.name}" height=300>
          <div class="card-body d-flex flex-column">
            <h6 class="card-title fw-bold">${prod.name}</h6>
            <small class="text-muted mb-1">${prod.desc}</small>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="fw-bold">₹${prod.price}</span>
              <button class="btn btn-sm btn-primary add-to-cart" data-id="${prod.id}"><i class="bi bi-cart-plus"></i></button>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// Cart Functions
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = "<div class='text-muted text-center'>Cart is empty</div>";
    cartTotal.innerText = "0";
    cartCount.innerText = "0";
    return;
  }
  let total = 0;
  cartItems.innerHTML = cart.map(item => {
    const prod = products.find(p => p.id === item.id);
    total += prod.price * item.q;
    return `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <span>
          ${prod.name} <small class="text-secondary">x${item.q}</small>
        </span>
        <div>
          ₹${prod.price * item.q}
          <button class="btn btn-sm btn-link text-danger remove-from-cart" data-id="${item.id}"><i class="bi bi-trash"></i></button>
        </div>
      </div>`;
  }).join("");
  cartTotal.innerText = total;
  cartCount.innerText = cart.reduce((sum, i) => sum + i.q, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}
// Add item to cart
function addToCart(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) cart[index].q += 1;
  else cart.push({ id, q: 1 });
  renderCart();
}
// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}
// Filtering
function filterProducts() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const cat = document.getElementById("categorySelect").value;
  let filtered = products.filter(p =>
    (search === "" || p.name.toLowerCase().includes(search)) &&
    (cat === "" || p.cat === cat)
  );
  renderProducts(filtered);
}
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  renderCart();
  // Add to cart
  productGrid.addEventListener("click", e => {
    if (e.target.closest(".add-to-cart")) {
      const id = +e.target.closest(".add-to-cart").dataset.id;
      addToCart(id);
    }
  });
  // Remove from cart
  cartItems.addEventListener("click", e => {
    if (e.target.closest(".remove-from-cart")) {
      const id = +e.target.closest(".remove-from-cart").dataset.id;
      removeFromCart(id);
    }
  });
  // Search and filter events
  document.getElementById("searchInput").addEventListener("input", filterProducts);
  document.getElementById("categorySelect").addEventListener("change", filterProducts);
});
