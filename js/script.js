document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-to-cart');

    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('$', ''));

            // جلب السلة المخزنة مسبقاً أو إنشاء مصفوفة فارغة
            let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

            // فحص هل المنتج موجود مسبقاً بالسلة
            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            // حفظ التحديثات في الذاكرة المحلية
            localStorage.setItem('coffeeCart', JSON.stringify(cart));
            alert(`تمت إضافة ${name} إلى السلة`);
        });
    });
});
