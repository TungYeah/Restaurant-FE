document.addEventListener("DOMContentLoaded", async function () {
    const tableId = localStorage.getItem('tableID');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsList = document.getElementById('cart-items');
    let totalPrice = 0;

    function addItemToCart(item) {
        const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cartItems.push(item);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();
    }

    function updateCartDisplay() {
        cartItemsList.innerHTML = '';
        totalPrice = 0;

        cartItems.forEach(item => {
            let listItem = document.createElement('li');
            listItem.classList.add('cart-item');

            let foodImage = document.createElement('img');
            foodImage.src = item.image;
            foodImage.alt = item.name;
            foodImage.onerror = function () {
                foodImage.src = 'path/to/default/image.png';
                foodImage.alt = 'Ảnh không có';
            };
            listItem.appendChild(foodImage);

            let nameSpan = document.createElement('span');
            nameSpan.classList.add('item-name');
            nameSpan.textContent = item.name;
            listItem.appendChild(nameSpan);

            let priceSpan = document.createElement('span');
            priceSpan.classList.add('item-price');
            priceSpan.textContent = `${item.price} VNĐ`;
            listItem.appendChild(priceSpan);

            let quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity || 0;
            quantityInput.min = 1;
            quantityInput.classList.add('item-quantity');

            quantityInput.addEventListener('input', function () {
                item.quantity = parseInt(quantityInput.value);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateTotalPrice();
                itemTotalPriceSpan.textContent = `${item.price * item.quantity} VNĐ`;
            });

            listItem.appendChild(quantityInput);

            let itemTotalPriceSpan = document.createElement('span');
            itemTotalPriceSpan.classList.add('item-total-price');
            itemTotalPriceSpan.textContent = `${item.price * item.quantity} VNĐ`;
            listItem.appendChild(itemTotalPriceSpan);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Xóa';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function () {
                cartItems = cartItems.filter(cartItem => cartItem.name !== item.name);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartDisplay();
                updateTotalPrice();
            });

            listItem.appendChild(deleteButton);
            cartItemsList.appendChild(listItem);

            totalPrice += item.price * item.quantity;
        });
        document.getElementById('total-price').textContent = totalPrice + ' VNĐ';
    }

    async function loadOrder() {
        try {
            const response = await fetch(`http://127.0.0.1:8081/restaurant/order/table/${tableId}`);
            if (response.ok) {
                const order = await response.json();

                if (order.foods && Array.isArray(order.foods)) {
                    order.foods.forEach((food, index) => {
                        const item = {
                            name: food.name,
                            price: food.price,
                            quantity: order.quantity[index],
                            image: food.description
                        };
                        addItemToCart(item);
                    });
                }

                updateCartDisplay();
            } else {
                console.error('Error fetching order:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    }

    loadOrder();

    document.getElementById('checkout-button').addEventListener('click', async function () {
        const serverName = localStorage.getItem('name');
        const userID = localStorage.getItem('userID');
        const customerID = localStorage.getItem('customerID');

        if (!cartItems.length) {
            alert('Giỏ hàng trống! Không thể thanh toán.');
            return;
        }

        const requestBody = {
            userID: userID,
            customerID: customerID,
            tableID: parseInt(tableId),
            foodNames: cartItems.map(item => item.name),
            quantities: cartItems.map(item => item.quantity)
        };

        try {
            const orderResponse = await fetch(`http://127.0.0.1:8081/restaurant/order/table/${tableId}/add_items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (orderResponse.ok) {
                const data = await orderResponse.json();
                const orderID = data.orderID; // Lưu orderID

                // Không thực hiện thanh toán ngay lập tức


                localStorage.removeItem('cartItems');

            } else {
                alert('Tạo đơn hàng thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error during order creation:', error);
            alert('Có lỗi xảy ra trong quá trình tạo đơn hàng. Vui lòng thử lại.');
        }
    });

    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('modal').style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        const invoiceModal = document.getElementById('modal');
        if (event.target === invoiceModal) {
            invoiceModal.style.display = 'none';
        }
    });

    function updateTotalPrice() {
        totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('total-price').textContent = totalPrice + ' VNĐ';
    }

    updateCartDisplay();

    window.addEventListener('beforeunload', function () {
        localStorage.removeItem('cartItems');
    });
});
