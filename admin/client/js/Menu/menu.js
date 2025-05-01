const fetchMenuItems = async () => {
  try {
    const response = await fetch('http://localhost:8081/restaurant/menu');
    const data = await response.json();

    const tableBody = document.getElementById('menuItemsTable');
    tableBody.innerHTML = '';

    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>
            <div class="d-flex px-2 py-1">
              <div>
                <img src="${item.description}" class="avatar avatar-sm me-3 border-radius-lg" alt="${item.name}">
              </div>
              <div class="d-flex flex-column justify-content-center">
                <h6 class="mb-0 text-sm">${item.name}</h6>
                <p class="text-xs text-secondary mb-0">${item.category.name}</p>
              </div>
            </div>
          </td>
          <td>
            <p class="text-xs font-weight-bold mb-0">${item.category.name}</p>
          </td>
          <td class="align-middle text-center text-sm">
            <span class="badge badge-sm" style="background-color: #6b7ddc; color: white;">${item.price} VND</span>
          </td>
          <td class="align-middle text-center">
            <div class="ms-auto text-end">
                <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;" onclick="deleteMenuItem('${item.foodID}')">
                    <i class="material-symbols-rounded text-sm me-2">delete</i>Delete
                </a>
                <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;" onclick="editMenuItem('${item.foodID}')">
                    <i class="material-symbols-rounded text-sm me-2">edit</i>Edit
                </a>
            </div>
          </td>
        `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Lỗi khi lấy món ăn:', error);
  }
};


function editMenuItem(foodID) {
  window.location.href = `/admin/client/html/UpdateFood.html?foodID=${foodID}`;
}

// Xóa món ăn
const deleteMenuItem = async (foodID) => {
  if (confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
    try {
      const response = await fetch(`http://localhost:8081/restaurant/menu/${foodID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Món ăn đã bị xóa thành công!');
        fetchMenuItems();
      } else {
        alert('Không thể xóa món ăn. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa món ăn:', error);
      alert('Đã xảy ra lỗi khi xóa món ăn. Vui lòng thử lại!');
    }
  }
};

// Gọi khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', fetchMenuItems);
