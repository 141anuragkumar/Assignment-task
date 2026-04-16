const API = "https://fakestoreapi.com/products";

let allProducts = [];
let cartItems = [];

// INIT
window.onload = loadData;

// FETCH DATA
async function loadData() {
  toggleLoader(true);

  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error();

    const data = await res.json();

    allProducts = data;

    renderProducts(data);
    loadCategories(data);

  } catch {
    document.getElementById("products").innerHTML =
      `<h5 class="text-danger text-center">Failed to load products</h5>`;
  }

  toggleLoader(false);
}

// LOADER
function toggleLoader(show) {
  document.getElementById("loader").style.display =
    show ? "block" : "none";
}

// CUSTOM NAME (Wearable)
function customName(category) {
  const map = {
    "electronics": "Wireless Earbuds Pro",
    "jewelery": "Smart Ring X",
    "men's clothing": "Smart Watch Ultra",
    "women's clothing": "Bluetooth Speaker Mini"
  };
  return map[category] || "Wearable Gadget";
}

// CATEGORY LABEL
function customCategory(cat) {
  return customName(cat);
}

// RENDER PRODUCTS
function renderProducts(data) {
  const container = document.getElementById("products");

  if (data.length === 0) {
    container.innerHTML = `<h5 class="text-center">No Products Found</h5>`;
    return;
  }

  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card h-100">

          <img src="${p.image}">

          <div class="card-body d-flex flex-column">
            <h6>${customName(p.category)}</h6>

            <p class="text-info fw-bold">₹${p.price}</p>

            <span class="badge bg-info">${customCategory(p.category)}</span>

            <div class="mt-auto">

              <button class="btn btn-success w-100 mt-2"
                onclick='addToCart(${JSON.stringify(p)})'>
                Add to Cart
              </button>

              <button class="btn btn-warning w-100 mt-2"
                onclick='buyNow(${JSON.stringify(p)})'>
                Buy Now
              </button>

              <button class="btn btn-outline-light w-100 mt-2"
                onclick='showDetails(${JSON.stringify(p)})'>
                View
              </button>

            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// LOAD CATEGORY FILTER
function loadCategories(data) {
  const cats = [...new Set(data.map(p => p.category))];
  const select = document.getElementById("category");

  cats.forEach(c => {
    select.innerHTML += `<option value="${c}">${customCategory(c)}</option>`;
  });
}

// MAIN LOGIC (FILTER + SEARCH + SORT)
function updateUI() {
  let temp = [...allProducts];

  const category = document.getElementById("category").value;
  const search = document.getElementById("search").value.toLowerCase();
  const sort = document.getElementById("sort").value;

  if (category !== "all") {
    temp = temp.filter(p => p.category === category);
  }

  temp = temp.filter(p =>
    customName(p.category).toLowerCase().includes(search)
  );

  if (sort === "low") temp.sort((a, b) => a.price - b.price);
  if (sort === "high") temp.sort((a, b) => b.price - a.price);

  renderProducts(temp);
}

// EVENTS
document.getElementById("category").addEventListener("change", updateUI);
document.getElementById("search").addEventListener("input", updateUI);
document.getElementById("sort").addEventListener("change", updateUI);

// CART (Simple)
function addToCart(product) {
  cartItems.push(product);
  document.getElementById("cartCount").innerText = cartItems.length;
  alert("Added to cart");
}

// BUY NOW
function buyNow(product) {
  alert("You bought: " + customName(product.category));
}

// PRODUCT DETAILS
function showDetails(p) {
  document.getElementById("modalContent").innerHTML = `
    <h5>${customName(p.category)}</h5>
    <img src="${p.image}" height="150">

    <p>${p.description}</p>

    <p><b>Price:</b> $${p.price}</p>
    <p><b>Rating:</b> ${p.rating.rate}</p>
  `;

  new bootstrap.Modal(document.getElementById("productModal")).show();
}