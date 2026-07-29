// ===============================
// Noir Coffee - Cart System
// ===============================

// قراءة السلة إذا موجودة
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// حفظ السلة
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// إضافة منتج
function addToCart(id, name, price) {

    // هل المنتج موجود؟
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();

    alert(name + " added to cart");
}

// عرض محتوى السلة (للتجربة)
function showCart() {
    console.log(cart);
}
