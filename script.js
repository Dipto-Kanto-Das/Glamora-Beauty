const container = document.getElementById("product-list"); // only one container
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");

let products = [];

async function loadProducts() {
  try {
    const res = await fetch('products.json');
    products = await res.json();
    renderProducts(); // initial render
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

function renderProducts(searchText = "", category = "all") {
  if(!container) return;
  container.innerHTML = "";

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (category === "all" || p.category === category)
  );

  if(filtered.length === 0){
    container.innerHTML = "<p class='text-center text-muted'>No products found.</p>";
    return;
  }

  filtered.forEach(p => {
    container.innerHTML += `
      <div class="col-md-3 col-sm-6">
        <div class="card h-100 shadow-sm">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">৳${p.price}</p>
            <button class="btn btn-pink btn-sm rounded-pill">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
}

// Event listeners
document.getElementById('search-btn')?.addEventListener('click', () => {
  renderProducts(searchInput.value, categoryFilter.value);
});

categoryFilter?.addEventListener('change', () => {
  renderProducts(searchInput.value, categoryFilter.value);
});

// Load products on page load
loadProducts();
