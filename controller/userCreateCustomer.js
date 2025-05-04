document.addEventListener("DOMContentLoaded", function () {
    const paymentButton = document.getElementById('payment-button');
    const customerModal = document.getElementById('customer-modal');
    const closeCustomerModalButton = document.getElementById('close-customer-modal');
    const invoiceModal = document.getElementById('invoiceModal');
    const closeInvoiceModalButton = document.getElementById('close-invoice-modal');
    const confirmCheckoutButton = document.getElementById('confirm-checkout');
    let cartItems = [];


    const userID = localStorage.getItem('userID');
    if (!userID) {
        alert("Không tìm thấy userID. Vui lòng đăng nhập.");
        return;
    }


    if (paymentButton) {
        paymentButton.onclick = () => {
            customerModal.style.display = 'block';
        };
    }

    if (closeCustomerModalButton) {
        closeCustomerModalButton.onclick = () => {
            customerModal.style.display = 'none';
        };
    }

    window.onclick = function (event) {
        if (event.target === customerModal) {
            customerModal.style.display = 'none';
        }
        if (event.target === invoiceModal) {
            invoiceModal.style.display = 'none';
        }
    };

    // Xử lý form khách hàng
    const form = document.getElementById('customerForm');
    if (form) {
        form.onsubmit = async (event) => {
            event.preventDefault();

            const customerData = {
                name: document.getElementById('customerName').value,
                phoneNumber: document.getElementById('customerPhone').value
            };

            try {
                const response = await fetch('http://localhost:8081/restaurant/customer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customerData)
                });

                if (response.ok) {

                    Object.keys(customerData).forEach(key => {
                        localStorage.setItem(key, customerData[key]);
                    });


                    customerModal.style.display = 'none';


                    displayInvoiceModal();
                } else {
                    const errorData = await response.json();
                    console.error('Error Response:', errorData);
                    alert(`Có lỗi xảy ra: ${errorData.message || 'Vui lòng thử lại.'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi gửi thông tin khách hàng.');
            }
        };
    }


    async function displayInvoiceModal() {
        if (!invoiceModal) {
            console.error('Modal hóa đơn không tồn tại!');
            return;
        }

        invoiceModal.style.display = 'block';


        const Name = localStorage.getItem('name') || 'Chưa có thông tin';
        const tableID = localStorage.getItem('tableID') || 'Chưa có bàn';
        document.getElementById('server-name').textContent = Name;
        document.getElementById('table-number').textContent = tableID;


        const tableId = localStorage.getItem('tableID');
        if (!tableId) {
            alert('Không có thông tin bàn');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8081/restaurant/order/table/${tableId}`);
            if (response.ok) {
                const order = await response.json();
                cartItems = order.foods.map((food, index) => ({
                    name: food.name,
                    price: food.price,
                    quantity: order.quantity[index],
                    image: food.description
                }));

                // Cập nhật thông tin món ăn vào modal
                updateInvoiceItems();
            } else {
                console.error('Error fetching order:', response.statusText);
                alert('Không thể tải thông tin đơn hàng.');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            alert('Có lỗi xảy ra khi tải thông tin đơn hàng.');
        }
    }

    // Cập nhật danh sách món ăn trong hóa đơn
    function updateInvoiceItems() {
        const invoiceItemsTable = document.getElementById('invoice-items').getElementsByTagName('tbody')[0];
        invoiceItemsTable.innerHTML = ''; // Xóa các dòng cũ

        let totalPrice = 0;
        if (cartItems.length === 0) {
            invoiceItemsTable.innerHTML = '<tr><td colspan="5">Không có món ăn trong hóa đơn.</td></tr>';
        } else {
            cartItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price} VNĐ</td>
                        <td>${item.quantity * item.price} VNĐ</td>
                    `;
                invoiceItemsTable.appendChild(row);
                totalPrice += item.quantity * item.price;
            });
        }

        document.getElementById('total-price-modal').textContent = `${totalPrice} VNĐ`;
    }



    if (confirmCheckoutButton) {
        confirmCheckoutButton.onclick = async () => {
            const tableID = localStorage.getItem('tableID');
            const userID = localStorage.getItem('userID');
            const phoneNumber = localStorage.getItem('phoneNumber');
            const rating = document.getElementById('customerRating').value;
            const comment = document.getElementById('customerComment').value;

            if (!rating || !comment) {
                alert("Vui lòng nhập đánh giá và nhận xét.");
                return;
            }

            const requestBody = { userID, phoneNumber, rating: parseInt(rating), comment };

            try {
                console.log("🔄 Gửi yêu cầu thanh toán...");
                const paymentResponse = await fetch(
                    `http://localhost:8081/restaurant/checkout/${tableID}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(requestBody),
                    }
                );

                if (!paymentResponse.ok) {
                    const errText = await paymentResponse.text();
                    console.error("❌ Thanh toán thất bại:", errText);
                    alert("Thanh toán thất bại. Vui lòng thử lại.");
                    return;
                }
                fetch(`http://localhost:8081/restaurant/tables/unavailable/${tableID}`, {
                    method: 'POST',
                })
                    .then(response => {
                        if (response.ok) {
                            console.log(`Bàn ${tableID} đã được đặt trạng thái UNAVAILABLE.`);
                        } else {
                            return response.text().then(text => {
                                console.error('Lỗi khi đặt trạng thái bàn:', text);
                            });
                        }
                    })
                    .catch(err => console.error('Lỗi khi gọi API:', err));

                const invoiceData = await paymentResponse.json();
                console.log("✅ Thanh toán thành công:", invoiceData);

                // Gọi API để set bàn AVAILABLE
                console.log("🔄 Gửi yêu cầu set bàn AVAILABLE...");
                releaseTable(tableID);

                console.log("🧹 Xóa cartItems và reload...");
                localStorage.removeItem("cartItems");
                window.location.reload();
            } catch (err) {
                console.error("❌ Lỗi toàn cục:", err);
                alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
        };
    }
    if (closeInvoiceModalButton) {
        closeInvoiceModalButton.onclick = () => {
            invoiceModal.style.display = 'none';
        };
    }
});
