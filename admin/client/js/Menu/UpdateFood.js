document.addEventListener("DOMContentLoaded", function () {
    const foodID = new URLSearchParams(window.location.search).get('foodID');
    console.log('foodID:', foodID);

    if (!foodID) {
        console.error("Không tìm thấy foodID trong URL!");
        alert("Không tìm thấy foodID trong URL!");
        return;
    }

    fetch(`http://127.0.0.1:8081/restaurant/menu/id/${foodID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không tìm thấy món ăn!');
            }
            return response.json();
        })
        .then(food => {
            console.log('Thông tin món ăn:', food);
            document.getElementById('foodName').value = food.name;
            document.getElementById('foodPrice').value = food.price;
            document.getElementById('foodDescription').value = food.description;
            document.getElementById('categoryName').value = food.category.name;
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin món ăn:', error);
            alert('Lỗi khi tải thông tin món ăn.');
        });

    const updateFoodForm = document.getElementById('updateFoodForm');
    updateFoodForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('foodName').value;
        const price = document.getElementById('foodPrice').value;
        const description = document.getElementById('foodDescription').value;
        const categoryName = document.getElementById('categoryName').value;

        if (!name || !price || !description || !categoryName) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        // Gửi yêu cầu cập nhật món ăn
        fetch(`http://127.0.0.1:8081/restaurant/menu/${foodID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nameCategory: categoryName,
                name: name,
                price: parseFloat(price),
                description: description,

            })
        })
            .then(response => {
                if (response.ok) {
                    alert('Cập nhật món ăn thành công!');
                    window.location.href = "/admin/pages/tables.html";
                } else {
                    console.log('Lỗi cập nhật response:', response);
                    alert("Cập nhật món ăn thất bại.");
                }
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật món ăn:', error);
                alert('Lỗi khi cập nhật món ăn.');
            });
    });
});