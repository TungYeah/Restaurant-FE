function selectTable(tableId) {
    alert('Bạn đã chọn Bàn ' + tableId);
    localStorage.setItem('tableID', tableId);


    console.log("Đang chuyển hướng đến menu...");
    window.location.href = "../view/menu.html";
}

document.addEventListener("DOMContentLoaded", fetchTables);
