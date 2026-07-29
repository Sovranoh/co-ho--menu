const firebaseConfig = {
    apiKey: "AIzaSyAtQ2VcIdWzTklDI0tlQbbesnKkwsN6LoI",
    authDomain: "noir-coffee-d0e66.firebaseapp.com",
    projectId: "noir-coffee-d0e66",
    storageBucket: "noir-coffee-d0e66.firebasestorage.app",
    messagingSenderId: "1032402894592",
    appId: "1:1032402894592:web:011a2bd5f0059ccf323de5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

    document.getElementById('checkout-btn').addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        let tableNumber = document.getElementById('table-number').value.trim();

        if (cart.length === 0) {
            alert('السلة فارغة!');
            return;
        }

        if (!tableNumber) {
            alert('يرجى إدخال رقم الطاولة أو المكان!');
            return;
        }

        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        db.collection("orders").add({
            table: tableNumber,
            items: cart,
            total: total,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert('تم إرسال طلبك بنجاح إلى الكاشير!');
            localStorage.removeItem('coffeeCart');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("خطأ في إرسال الطلب: ", error);
            alert('حدث خطأ، يرجى المحاولة مرة أخرى.');
        });
    });
});
