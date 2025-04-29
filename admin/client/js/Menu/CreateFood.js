document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử từ form
    const createFoodForm = document.getElementById('createFoodForm');
    const categoryName = document.getElementById('categoryName');
    const foodName = document.getElementById('foodName');
    const foodPrice = document.getElementById('foodPrice');
    const foodDescription = document.getElementById('foodDescription');


    createFoodForm.addEventListener('submit', function (event) {
        event.preventDefault();


        const category = categoryName.value.trim();
        const name = foodName.value.trim();
        const price = parseFloat(foodPrice.value);
        const description = foodDescription.value.trim();


        if (!category || !name || isNaN(price) || price <= 0 || !description) {
            alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
            return;
        }


        const newFood = {
            nameCategory: category,
            name: name,
            price: price,
            description: description
        };

        fetch('http://127.0.0.1:8081/restaurant/menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFood)
        })
            .then(response => {

                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Không thể tạo món ăn');
                    });
                }
                return response.json();
            })
            .then(data => {

                alert('Tạo món ăn thành công!');
                createFoodForm.reset();


                window.location.href = "/admin/pages/tables.html";
            })
            .catch(error => {

                console.error('Lỗi khi tạo món ăn:', error.message || error);
                alert('Đã xảy ra lỗi, vui lòng thử lại!');
            });
    });
});
