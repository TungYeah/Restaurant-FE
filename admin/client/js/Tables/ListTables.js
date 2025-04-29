const fetchTables = async () => {
    try {
        const response = await fetch('http://localhost:8081/restaurant/order/tables');
        const data = await response.json();

        const tableBody = document.getElementById('tablesTable');
        tableBody.innerHTML = ''; // Xóa dữ liệu cũ nếu có

        data.forEach(table => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td class="align-middle text-center text-sm"> <!-- Căn giữa Table ID -->
              <div class="d-flex justify-content-center px-2 py-1"> <!-- Sử dụng justify-content-center để căn giữa -->
                <div class="my-auto">
                  <h6 class="mb-0 text-sm">${table.tableID}</h6>
                </div>
              </div>
            </td>
            <td class="align-middle text-center text-sm"> <!-- Căn giữa Max Capacity -->
              <p class="text-xs font-weight-bold mb-0">${table.maxCapacity} người</p>
            </td>
            <td class="align-middle text-center"> <!-- Căn giữa nút Edit/Delete -->
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
    }
};

document.addEventListener('DOMContentLoaded', fetchTables);
