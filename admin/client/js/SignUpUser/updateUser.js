document.addEventListener("DOMContentLoaded", function () {
    // Lấy foodID từ URL
    const foodID = new URLSearchParams(window.location.search).get('foodID');
    console.log('foodID:', foodID);

    // Kiểm tra xem foodID có tồn tại không trong URL
    if (!foodID) {
        console.error("Không tìm thấy foodID trong URL!");
        return;
    }

    // Fetch thông tin món ăn từ server
    fetch(`http://127.0.0.1:8081/restaurant/menu/id/${foodID}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error("Chi tiết lỗi từ server:", text); // Log chi tiết lỗi từ server
                    throw new Error(`Lỗi từ server: ${text}`);
                });
            }
            return response.json();
        })
        .then(food => {
            console.log("Thông tin món ăn:", food);
            if (!food.name || !food.price || !food.description || !food.category) {
                throw new Error("Dữ liệu món ăn không đầy đủ!");
            }

            // Điền thông tin món ăn vào form
            document.getElementById('foodName').value = food.name;
            document.getElementById('foodPrice').value = food.price;
            document.getElementById('foodDescription').value = food.description;
            document.getElementById('categoryName').value = food.category.name;
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin món ăn:', error);
            alert('Lỗi khi tải thông tin món ăn. Vui lòng kiểm tra lại!');
        });

    // Xử lý sự kiện submit form để cập nhật món ăn
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

        // Gửi yêu cầu PUT để cập nhật món ăn
        fetch(`http://127.0.0.1:8081/restaurant/menu/${foodID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                price: parseFloat(price),
                description: description,
                category: { name: categoryName }
            })
        })
            .then(response => {
                if (response.ok) {
                    alert('Cập nhật món ăn thành công!');
                    window.location.href = "/admin/pages/menu.html";
                } else {
                    alert("Cập nhật món ăn thất bại.");
                }
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật món ăn:', error);
                alert('Lỗi khi cập nhật món ăn. Vui lòng thử lại!');
            });
    });
});
