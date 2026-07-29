const firebaseConfig = {
    apiKey: "AIzaSyAtQ2VcIdWzTklDI0tlQbbesnKkwsN6LoI",
    authDomain: "noir-coffee-d0e66.firebaseapp.com",
    projectId: "noir-coffee-d0e66",
    storageBucket: "noir-coffee-d0e66.firebasestorage.app",
    messagingSenderId: "1032402894592",
    appId: "1:1032402894592:web:011a2bd5f0059ccf323de5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// استخدام المفتاح الأصلي الصحيح الخاص بمشروعك
let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const tableInput = document.getElementById('table-number');

function loadCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart" style="color: #aaa; text-align: center;">السلة فارغة حالياً.</p>';
        totalPriceEl.textContent = '$0.00';
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let itemDiv = document.createElement('div');
        itemDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);";
        itemDiv.innerHTML = `
            <div>
                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 0.95rem;">${item.name}</h4>
                <p style="color: #aaa; margin: 0; font-size: 0.85rem;">السعر: $${item.price.toFixed(2)} | الكمية: ${item.quantity}</p>
            </div>
            <div style="display: flex; gap: 5px; align-items: center;">
                <button onclick="updateQty(${index}, 1)" style="background: rgba(255,255,255,0.1); color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">+</button>
                <button onclick="updateQty(${index}, -1)" style="background: rgba(255,255,255,0.1); color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">-</button>
                <button onclick="removeItem(${index})" style="background: rgba(255,77,77,0.2); color: #ff8080; border: 1px solid rgba(255,77,77,0.4); padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">حذف</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

window.updateQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    loadCart();
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    loadCart();
}

loadCart();

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('السلة فارغة، أضف منتجات قبل تأكيد الطلب.');
        return;
    }

    let tableNum = tableInput.value.trim();
    if (!tableNum) {
        alert('يرجى كتابة رقم الطاولة أو المكان!');
        tableInput.focus();
        return;
    }

    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'جاري إرسال الطلب...';

    db.collection("orders").add({
        items: cart,
        total: total,
        table: tableNum,
        status: "pending",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('تم إرسال الطلب بنجاح إلى الكاشير!');
        localStorage.removeItem('coffeeCart');
        cart = [];
        loadCart();
        tableInput.value = '';
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'تأكيد الطلب';
    })
    .catch((error) => {
        console.error("خطأ في إرسال الطلب:", error);
        alert('حدث خطأ أثناء إرسال الطلب، تأكد من الاتصال بالإنترنت.');
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'تأكيد الطلب';
    });
});
