function fetchTables() {
    fetch('http://localhost:8081/restaurant/tables')
        .then(response => response.json())
        .then(data => {
            let tablesList = document.getElementById('tables-list');
            tablesList.innerHTML = '';  // Xóa danh sách bàn cũ trước khi thêm mới
            data.forEach(table => {
                // Kiểm tra trạng thái của bàn và thay đổi màu sắc
                let colorStyle = table.tableStatus === "UNAVAILABLE" ? "background-color: red; color: white;" : "";
                let tableItem = `
                    <div class="table" style="${colorStyle}" onclick="selectTable(${table.tableID})" data-table-id="${table.tableID}">
                        Bàn ${table.tableID}
                    </div>
                `;
                tablesList.innerHTML += tableItem;
            });
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu bàn:', error));
}