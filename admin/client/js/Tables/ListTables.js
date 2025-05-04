const fetchTables = async () => {
  try {
    const response = await fetch('http://localhost:8081/restaurant/tables');
    const data = await response.json();

    const tableBody = document.getElementById('tablesTable');
    tableBody.innerHTML = '';  // Xóa danh sách bàn cũ

    data.forEach(table => {
      const row = document.createElement('tr');

      const statusClass = table.tableStatus === 'AVAILABLE' ? 'text-success' :
                          table.tableStatus === 'OCCUPIED' ? 'text-danger' :
                          table.tableStatus === 'RESERVED' ? 'text-warning' : 'text-secondary';

      row.innerHTML = `
        <td class="align-middle text-center text-sm">
          <div class="d-flex justify-content-center px-2 py-1">
            <div class="my-auto">
              <h6 class="mb-0 text-sm">${table.tableID}</h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm">
          <p class="text-xs font-weight-bold mb-0">${table.maxCapacity} người</p>
        </td>
        <td class="align-middle text-center text-sm">
          <div class="d-flex justify-content-center px-2 py-1">
            <div class="my-auto">
              <h6 class="mb-0 text-sm ${statusClass}">${table.tableStatus}</h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center">
          <div class="ms-auto text-end">
            <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;" onclick="deleteTable('${table.tableID}')">
              <i class="material-symbols-rounded text-sm me-2">delete</i>Delete
            </a>
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;" onclick="editTable('${table.tableID}')">
              <i class="material-symbols-rounded text-sm me-2">edit</i>Edit
            </a>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bàn ăn:', error);
    alert('Đã xảy ra lỗi khi lấy danh sách bàn ăn. Vui lòng thử lại!');
  }
};

function editTable(tableID) {
  window.location.href = `/admin/client/html/UpdateTable.html?tableID=${tableID}`;
}

const deleteTable = async (tableID) => {
  if (confirm("Bạn có chắc chắn muốn xóa bàn ăn này?")) {
    try {
      const response = await fetch(`http://localhost:8081/restaurant/tables/deleteTable/${tableID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Bàn ăn đã bị xóa thành công!');
        fetchTables(); // Cập nhật lại danh sách bàn sau khi xóa
      } else {
        alert('Không thể xóa bàn ăn. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa bàn ăn:', error);
      alert('Đã xảy ra lỗi khi xóa bàn ăn. Vui lòng thử lại!');
    }
  }
};

document.addEventListener('DOMContentLoaded', fetchTables);
