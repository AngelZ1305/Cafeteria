const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');

const cart = JSON.parse(localStorage.getItem('cart')) || [];

const products = [
    { id: "1", name: "Kong Plushie", price: 330.00, img: "/../imagesShop/plushie.jpg" },
    { id: "2", name: "Kong Bone", price: 380.00, img: "/../imagesShop/bone.jpg" },
    { id: "3", name: "Kyjen porcupine", price: 240.00, img: "/../imagesShop/porcupine.jpg" },
];

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productElement = button.closest('.product-card');
        const productName = productElement.querySelector('.product-name').textContent.replace('Name: ', '');
        const product = products.find(p => p.name === productName);
    
        if (product) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${product.name} has been added to your cart.`);
        } else {
            alert('Product not found!');
        }});
    });

    function displayCartItems() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('total-price').textContent = 'Total: $0.00';
            return;
        }

        cart.forEach((item, index) => {
            totalPrice += item.price;
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-image">
                <h3>${item.name}</h3>
                <h3>$${item.price.toFixed(2)}</h3>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        totalPriceElement = document.getElementById('total-price');
        totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
    displayCartItems();

const checkoutBtn = document.getElementById('checkout-btn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty");
        } else {
            localStorage.removeItem('cart');
            alert("Checkout successful!");
            displayCartItems();
            location.reload();
        }
    });
}