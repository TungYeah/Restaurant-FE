function selectTable(tableID) {
    // Gửi yêu cầu POST để cập nhật trạng thái của bàn thành unavailable
    fetch(`http://localhost:8081/restaurant/tables/unavailable/${tableID}`, {
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                alert(`Bàn ${tableID} đã được cập nhật trạng thái thành không có sẵn.`);

                const tableElement = document.querySelector(`[data-table-id='${tableID}']`);
                if (tableElement) {
                    tableElement.style.backgroundColor = "red";
                    tableElement.style.color = "white";
                }
            } else {
                alert('Không thể cập nhật trạng thái bàn');
            }
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật trạng thái bàn:', error);
        });


    localStorage.setItem('tableID', tableID);


    console.log("Đang chuyển hướng đến menu...");
    window.location.href = "../view/menu.html";
}

// Gọi hàm khi trang được tải xong
document.addEventListener("DOMContentLoaded", fetchTables);