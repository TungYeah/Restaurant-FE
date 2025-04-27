document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById('categorySelect');
    const createFoodForm = document.getElementById('createFoodForm');
    const foodName = document.getElementById('foodName');
    const foodPrice = document.getElementById('foodPrice');
    const foodDescription = document.getElementById('foodDescription');


    then(response => response.json())
        .then(data => {
            console.log('Dữ liệu trả về từ API:', data);


            const categories = [...new Set(data.map(food => food.category.name))];
            console.log('Danh sách các danh mục:', categories); // Log danh mục


            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "Chọn danh mục";
            categorySelect.appendChild(defaultOption);


            categories.forEach(categoryName => {
                let option = document.createElement('option');
                option.value = categoryName;
                option.textContent = categoryName;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));


    createFoodForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedCategory = categorySelect.value;
        const name = foodName.value;
        const price = parseFloat(foodPrice.value);
        const description = foodDescription.value;

        if (!selectedCategory || !name || !price || !description) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }


        const newFood = {
            nameCategory: selectedCategory,
            name: name,
            price: price,
            description: description
        };


        fetch('http://localhost:8081/restaurant/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFood)
        })
            .then(response => response.json())
            .then(data => {
                alert('Món ăn đã được tạo thành công!');

                createFoodForm.reset();
            })
            .catch(error => {
                console.error('Error creating food:', error);
                alert('Đã có lỗi xảy ra, vui lòng thử lại!');
            });
    });
});
