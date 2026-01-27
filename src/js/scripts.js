const loadCoffee = document.getElementById('load-coffee-btn');
let coffeeContainer = false;
let dessertContainer = false;
const productsContainer = document.getElementById('products-container');
const loadDesserts = document.getElementById('load-desserts-btn');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const type = params.get('type');
const confirmBtn = document.getElementById('confirm-adoption-btn');


let product = null;
if (type === 'coffee') {
    product = coffees.find(coffee => coffee.id === id);
} else if (type === 'dessert') {
    product = desserts.find(dessert => dessert.id === id);
}

if (loadCoffee && loadDesserts && productsContainer) {
    loadCoffee.addEventListener('click', () => {
        if (!coffeeContainer) {
            fetch('../partials/coffees.html')
                .then(response => response.text())
                .then(html => {
                    productsContainer.innerHTML = html;
                    productsContainer.style.display = 'block';
                    coffeeContainer = true;
                    dessertContainer = false;

                })
                .catch(error => console.error('Error fetching the coffees.html file:', error));

        } else {

            productsContainer.innerHTML = '';
            productsContainer.style.display = 'none';
            coffeeContainer = false;
        }
    });


    loadDesserts.addEventListener('click', () => {
        if (!dessertContainer) {
            fetch('/views/partials/desserts.html')
                .then(response => response.text())
                .then(html => {
                    productsContainer.innerHTML = html;
                    productsContainer.style.display = 'block';
                    dessertContainer = true;
                    coffeeContainer = false;
                })
                .catch(error => console.error('Error fetching the desserts.html file:', error));

        } else {

            productsContainer.innerHTML = '';
            productsContainer.style.display = 'none';
            dessertContainer = false;

        }
    });
}

document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('adoption-btn')) {
        const article = event.target.closest('article');
        const id = article.getAttribute('data-id');
        const type = article.getAttribute('data-type');
        window.location.href = `adoption.html?type=${type}&id=${id}`;
    }
});

if (product) {
    document.getElementById('product-name').textContent = "Product Name: " + product.name;
    document.getElementById('product-price').textContent = "Price: " + product.price;
    document.getElementById('product-image').src = product.img;
}



