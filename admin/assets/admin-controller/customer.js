document.addEventListener("DOMContentLoaded", function () {
    let customerList = document.getElementById('customer-list');

    // Hàm lấy danh sách khách hàng từ server
    function getCustomer() {
        fetch('http://localhost:8081/restaurant/customer')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi mạng hoặc server');
                }
                return response.json();
            })
            .then(customers => {
                displayCustomerInfo(customers);
            })
            .catch(error => {
                console.error('Không thể lấy thông tin khách hàng:', error);
                customerList.innerHTML = '<p>Không thể lấy thông tin khách hàng.</p>';
            });
    }


    function displayCustomerInfo(customers) {
        customerList.innerHTML = '';
        customers.forEach(customer => {
            let customerItem = `
                <li class="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
                    <div class="d-flex flex-column">
                        <h6 class="mb-3 text-sm">${customer.name || 'Chưa có tên'}</h6>
                        <span class="mb-2 text-xs">Số điện thoại: <span class="text-dark font-weight-bold ms-sm-2">${customer.phoneNumber || 'Không có'}</span></span>
                        <span class="mb-2 text-xs">Tổng chi tiêu: <span class="text-dark ms-sm-2 font-weight-bold">${customer.totalSpent || '0.00'}</span></span>
                    </div>
                    <div class="ms-auto text-end">
                        <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;" onclick="deleteCustomer('${customer.phoneNumber}')">
                            <i class="material-symbols-rounded text-sm me-2" style="color: #97a2c1;">delete</i>Xoá
                        </a>
                        <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;" onclick="editCustomer('${customer.phoneNumber}')">
                            <i class="material-symbols-rounded text-sm me-2">edit</i>Sửa
                        </a>
                    </div>
                </li>
            `;
            customerList.innerHTML += customerItem;
        });
    }

    getCustomer();
});

function deleteCustomer(phoneNumber) {
    fetch(`http://localhost:8081/restaurant/customer/${phoneNumber}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            return response.text();
        })
        .then(message => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}