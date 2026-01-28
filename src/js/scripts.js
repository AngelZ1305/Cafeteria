const loadCoffee = document.getElementById('load-coffee-btn');
let coffeeContainer = true;
let favoriteContainer = false;
const productsContainer = document.getElementById('products-container');
const loadFavorites = document.getElementById('load-favorites-btn');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const type = params.get('type');
const confirmBtn = document.getElementById('confirm-adoption-btn');


let product = null;
if (type === 'coffee') {
    product = coffees.find(coffee => coffee.id === id);
} else if (type === 'favorite') {
    product = favorites.find(favorite => favorite.id === id);
}

if (loadCoffee && loadFavorites && productsContainer) {
    fetch("../partials/coffees.html")
        .then(r => r.text())
        .then(async html => {
            productsContainer.innerHTML = html;
            productsContainer.style.display = "block";

            const coffees = await loadCoffees();
            renderCoffees(coffees);
            renderFavoriteCoffees(coffees);
        })
        .catch(console.error);

    loadCoffee.addEventListener("click", async () => {
        if (!coffeeContainer) {
            try {
                const html = await fetch("../partials/coffees.html").then(r => r.text());
                productsContainer.innerHTML = html;
                productsContainer.style.display = "block";

                coffeeContainer = true;
                favoriteContainer = false;

                const coffees = await loadCoffees();
                renderCoffees(coffees);
                renderFavoriteCoffees(coffees);
            } catch (e) {
                console.error(e);
            }
        } else {
            productsContainer.innerHTML = "";
            productsContainer.style.display = "none";
            coffeeContainer = false;
        }
    });



    loadFavorites.addEventListener("click", async () => {
  if (!favoriteContainer) {
    try {
      const html = await fetch("../partials/favorites.html").then(r => r.text());
      productsContainer.innerHTML = html;
      productsContainer.style.display = "block";

      favoriteContainer = true;
      coffeeContainer = false;

      const coffees = await loadCoffees();
      renderFavoriteCoffees(coffees);
    } catch (e) {
      console.error(e);
    }
  } else {
    productsContainer.innerHTML = "";
    productsContainer.style.display = "none";
    favoriteContainer = false;
  }
});

}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".favorite-btn");
  if (!btn) return;

  const userKey = getCurrentUserKey();
  if (!userKey) {
    alert("Debes iniciar sesión para guardar favoritos.");
    return;
  }

  const type = btn.dataset.type || "coffee";
  const id = btn.dataset.id;

  const newValue = toggleFavorite(userKey, type, id);

  const icon = btn.querySelector(".heart-icon");
  if (icon) icon.classList.toggle("active", newValue === true);

  const coffees = await loadCoffees();
  renderFavoriteCoffees(coffees);
});
document.getElementById("logout-btn")?.addEventListener("click", logout);
const userKey = getCurrentUserKey();
if (!userKey) {
  window.location.href = "login.html";
}



if (product) {
    document.getElementById('product-name').textContent = "Product Name: " + product.name;
    document.getElementById('product-price').textContent = "Price: " + product.price;
    document.getElementById('product-image').src = product.img;
}


const containerCoffees = document.getElementById("container-coffees");

async function loadCoffees() {
    let coffees = JSON.parse(localStorage.getItem("coffees"));

    if (!coffees || coffees.length === 0) {
        const res = await fetch("../../coffee.json");
        if (!res.ok) throw new Error("No se pudo cargar coffee.json");

        coffees = await res.json();
        localStorage.setItem("coffees", JSON.stringify(coffees));
    }

    return coffees;
}

function getCurrentUserKey() {
  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;

  try {
    const obj = JSON.parse(raw);
    return obj.id ?? obj.email ?? obj.username ?? obj.user ?? null;
  } catch {
    return raw;
  }
}

function readFavoritesByUser() {
  return JSON.parse(localStorage.getItem("favoritesByUser")) || {};
}

function writeFavoritesByUser(data) {
  localStorage.setItem("favoritesByUser", JSON.stringify(data));
}

function isFavorite(userKey, type, productId) {
  if (!userKey) return false;
  const favs = readFavoritesByUser();
  return favs?.[userKey]?.[type]?.[String(productId)] === true;
}

function toggleFavorite(userKey, type, productId) {
  if (!userKey) return null;

  const favs = readFavoritesByUser();
  favs[userKey] ??= {};
  favs[userKey][type] ??= {};

  const idStr = String(productId);
  const newValue = !(favs[userKey][type][idStr] === true);

  favs[userKey][type][idStr] = newValue;

  if (!newValue) delete favs[userKey][type][idStr];

  writeFavoritesByUser(favs);
  return newValue;
}

function renderCoffees(coffees) {
  const containerCoffees = document.getElementById("container-coffees");
  
  if (!containerCoffees) {
    console.error('No existe container-coffees en el HTML (id).');
    return;
  }

  const userKey = getCurrentUserKey();

  if (!coffees || coffees.length === 0) {
    containerCoffees.innerHTML = "<p>No hay cafés disponibles.</p>";
    return;
  }

  containerCoffees.innerHTML = coffees.map(coffee => {
    const fav = isFavorite(userKey, "coffee", coffee.id);

    return `
      <article class="coffee-card" data-type="coffee" data-id="${coffee.id}">
        <h3>${coffee.nombre}</h3>
        <img src="${coffee.imagen}" alt="${coffee.nombre}" class="products-img">
        <p>Price: $${coffee.precio}</p>

        <button class="favorite-btn" data-type="coffee" data-id="${coffee.id}" aria-label="Favorite">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               class="heart-icon ${fav ? "active" : ""}" aria-hidden="true">
            <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
              2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3
              19.58 3 22 5.42 22 8.5 22 12.28 18.6 15.36 13.45 20.04 L12 21.35z"/>
          </svg>
        </button>
      </article>
    `;
  }).join("");
}
function renderFavoriteCoffees(coffees) {
  const containerFavorites = document.getElementById("container-favorites");
  if (!containerFavorites) return;

  const userKey = getCurrentUserKey();
  if (!userKey) {
    containerFavorites.innerHTML = "<p>Inicia sesión para ver favoritos.</p>";
    return;
  }

  const favoritesByUser = readFavoritesByUser();
  const favIds = Object.keys(favoritesByUser?.[userKey]?.coffee || {});

  const favoriteCoffees = coffees.filter(c => favIds.includes(String(c.id)));

  if (favoriteCoffees.length === 0) {
    containerFavorites.innerHTML = "<p>No tienes cafés favoritos.</p>";
    return;
  }

  containerFavorites.innerHTML = favoriteCoffees.map(coffee => `
    <article class="coffee-card" data-type="coffee" data-id="${coffee.id}">
      <h3>${coffee.nombre}</h3>
      <img src="${coffee.imagen}" alt="${coffee.nombre}" class="products-img">
      <p>Price: $${coffee.precio}</p>
      <button class="favorite-btn" data-type="coffee" data-id="${coffee.id}">
        <svg viewBox="0 0 24 24" class="heart-icon active" aria-hidden="true">
          <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
          2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3
          19.58 3 22 5.42 22 8.5 22 12.28 18.6 15.36 13.45 20.04 L12 21.35z"/>
        </svg>
      </button>
    </article>
  `).join("");
}
function logout() {
  localStorage.removeItem("currentUser");

  alert("Sesión cerrada");

  window.location.href = "login.html";
}

loadCoffees().catch(console.error);

