document.addEventListener('DOMContentLoaded', () => {
    const shoppingIcon = document.getElementById('user-cart');
    if (!shoppingIcon) {
        console.error('Phần tử không tồn tại!');
    } else {
        shoppingIcon.addEventListener('click', function() {
            console.log('Giỏ hàng đã được nhấp vào'); 
            window.location.href = '../view/shopCart.html';
        });
    }
});

const userIcon = document.getElementById('user-house');

userIcon.addEventListener('click', function() {
    window.location.href = '../view/page.html';
});

