document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    function loadCart() {
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">السلة فارغة حالياً.</p>';
            totalPriceElement.innerText = '$0.00';
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            let itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">السعر: $${item.price.toFixed(2)}</p>
                    <p class="item-qty">الكمية: ${item.quantity}</p>
                </div>
                <div class="item-controls">
                    <button onclick="updateQty(${index}, 1)">+</button>
                    <button onclick="updateQty(${index}, -1)">-</button>
                    <button class="delete-btn" onclick="removeItem(${index})">حذف</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        totalPriceElement.innerText = `$${total.toFixed(2)}`;
    }

    window.updateQty = function(index, change) {
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem('coffeeCart', JSON.stringify(cart));
        loadCart();
    }

    window.removeItem = function(index) {
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
        loadCart();
    }

    loadCart();
});
