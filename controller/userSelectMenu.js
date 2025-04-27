document.addEventListener("DOMContentLoaded", function () {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    let menuList = document.getElementById('menu-list');
    let categoryFilter = document.getElementById('category-filter');
    let searchInput2 = document.getElementById('search-input-2');
    let menuData = [];


    fetch('http://localhost:8081/restaurant/menu')
        .then(response => response.json())
        .then(data => {
            menuData = data;
            displayMenu(data);


            const categories = [...new Set(data.map(food => food.category.name))];
            categories.forEach(categoryName => {
                let option = document.createElement('option');
                option.value = categoryName;
                option.textContent = categoryName;
                categoryFilter.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching menu data:', error));


    const displayMenu = (filteredData) => {
        menuList.innerHTML = '';
        filteredData.forEach(food => {
            let foodItem = `
                <div class="food-item">
                    <img src="${food.description}" alt="${food.name}">
                    <h3>${food.name}</h3>
                    <p>Loại: ${food.category.name}</p>
                    <p>Giá: ${food.price} VNĐ</p>
                    <button class="order-button" data-food-id="${food.id}" data-food-name="${food.name}" data-food-price="${food.price}" data-food-image="${food.description}">Thêm vào giỏ hàng</button>
                </div>
            `;
            menuList.innerHTML += foodItem;
        });


        document.querySelectorAll('.order-button').forEach(button => {
            button.addEventListener('click', function () {
                let foodId = this.getAttribute('data-food-id');
                let foodName = this.getAttribute('data-food-name');
                let foodPrice = this.getAttribute('data-food-price');
                let foodImage = this.getAttribute('data-food-image');

                alert(`Bạn đã thêm vào giỏ hàng món ${foodName} thành công!`);

                cartItems.push({ id: foodId, name: foodName, price: foodPrice, image: foodImage });
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            });
        });
    };


    categoryFilter.addEventListener('change', function () {
        const selectedCategory = this.value;
        const filteredData = selectedCategory ? menuData.filter(food => food.category.name === selectedCategory) : menuData;
        displayMenu(filteredData);
    });


    const searchMenu = (query) => {
        const filteredData = menuData.filter(food => food.name.toLowerCase().includes(query.toLowerCase()));
        displayMenu(filteredData);
    };


    searchInput2.addEventListener('input', function () {
        searchMenu(this.value);
    });
});
