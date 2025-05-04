document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Tháng từ 0 → 11
    const day = String(today.getDate()).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    const formattedDate = `${year}-${monthStr}-${day}`;

    const baseUrl = "http://localhost:8081/restaurant/checkout/revenue";


    function formatVND(amount) {
        return amount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    }


    fetch(`${baseUrl}/day?date=${formattedDate}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("todayRevenue").textContent = formatVND(data);
        })
        .catch(err => console.error("Day revenue error:", err));


    fetch(`${baseUrl}/month?month=${month}&year=${year}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("monthRevenue").textContent = formatVND(data);
        })
        .catch(err => console.error("Month revenue error:", err));


    fetch(`${baseUrl}/year?year=${year}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("yearRevenue").textContent = formatVND(data);
        })
        .catch(err => console.error("Year revenue error:", err));
});
