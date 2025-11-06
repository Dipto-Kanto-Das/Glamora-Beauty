// unified script.js for Glamora-Beauty
// Features: load products.json (with fallback), search, filter, wishlist (localStorage), wishlist count, add-to-cart demo

const container = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const searchBtn = document.getElementById("search-btn");
const wishlistCountEl = document.getElementById("wishlist-count");

// wishlist from localStorage
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// products array (will be loaded from products.json)
let products = [];

// load products from JSON
async function loadProducts() {
  try {
    const res = await fetch('products.json');
    if (!res.ok) throw new Error('products.json not found');
    products = await res.json();
  } catch (err) {
    console.warn('products.json not loaded, using fallback demo data.', err);
    // fallback demo data
    products = [
      { id: 1, name: "Premium Hijab", category: "hijab", price: 450, image: "./assets/GS/21.jpg" },
      { id: 2, name: "Arabian Attar", category: "attar", price: 350, image: "./assets/GS/22.jpg" },
      { id: 3, name: "Gift Tasbeeh Set", category: "gift", price: 500, image: "./assets/GS/23.jpg" },
      { id: 4, name: "Men's Islamic Wear", category: "islamicwear", price: 1200, image: "./assets/GS/24.jpg" },
      { id: 5, name: "Ladies Abaya", category: "islamicwear", price: 1600, image: "./assets/GS/25.jpg" },
      { id: 6, name: "Crystal Tasbeeh", category: "gift", price: 250, image: "./assets/GS/26.jpg" },
    ];
  }
  updateWishlistCount();
  displayProducts(products);
}

// helper: render products
function displayProducts(list) {
  if (!container) return;
  container.innerHTML = "";
  if (!list || list.length === 0) {
    container.innerHTML = "<p class='text-center text-muted'>No products found.</p>";
    return;
  }

  list.forEach(p => {
    const isWishlisted = wishlist.includes(p.id);
    container.innerHTML += `
      <div class="col-md-4 col-lg-3 col-sm-6">
        <div class="card product-card shadow-sm h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${p.name}</h5>
            <p class="text-muted mb-2 text-capitalize">${p.category}</p>
            <p class="fw-bold text-pink">৳${p.price}</p>
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-outline-dark btn-sm" onclick="addToCart(${p.id})">
                <i class="fa-solid fa-cart-shopping"></i>
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="toggleWishlist(event, ${p.id})">
                <i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// toggle wishlist (stop event propagation to prevent other click handlers)
function toggleWishlist(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (wishlist.includes(id)) wishlist = wishlist.filter(w => w !== id);
  else wishlist.push(id);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
  displayProducts(filteredProducts());
}

function updateWishlistCount() {
  if (!wishlistCountEl) return;
  wishlistCountEl.textContent = wishlist.length;
}

// add to cart demo
function addToCart(id) {
  const p = products.find(x => x.id === id);
  alert(`${p ? p.name : 'Product'} added to cart! (demo)`);
}

// compute filtered products
function filteredProducts() {
  const searchText = (searchInput?.value || "").toLowerCase();
  const category = (categoryFilter?.value || "all");
  return products.filter(p =>
    p.name.toLowerCase().includes(searchText) &&
    (category === "all" || p.category === category)
  );
}

// events
searchBtn?.addEventListener('click', () => {
  displayProducts(filteredProducts());
});

categoryFilter?.addEventListener('change', () => {
  displayProducts(filteredProducts());
});

// initial load
loadProducts();

// expose some for debug (optional)
window.toggleWishlist = toggleWishlist;
window.addToCart = addToCart;
window.displayProducts = displayProducts;
