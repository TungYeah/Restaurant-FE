function fetchTables() {
    fetch('http://localhost:8081/restaurant/order/tables')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let tablesList = document.getElementById('tables-list');
            tablesList.innerHTML = '';
            data.forEach(table => {
                let tableItem = `
                    <div class="table" onclick="selectTable(${table.tableID})" data-table-id="${table.tableID}">
                        Bàn ${table.tableID}
                    </div>
                `;
                tablesList.innerHTML += tableItem;
            });
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu bàn:', error));
}

