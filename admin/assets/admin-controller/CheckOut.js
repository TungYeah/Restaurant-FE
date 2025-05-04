document.addEventListener("DOMContentLoaded", function () {
    const baseUrl = "http://localhost:8081/restaurant/checkout/revenue";

    function formatVND(amount) {
        return amount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    }

    // Hàm xử lý khi người dùng bấm "Check Date"
    window.checkDate = async function () {
        const input = document.getElementById("dateInput").value.trim();

        // Kiểm tra định dạng DD-MM-YYYY, 00-MM-YYYY, hoặc 00-00-YYYY
        if (!input.match(/^(00-\d{2}-\d{4}|(\d{2}-\d{2}-\d{4})|(\d{2}-00-\d{4}))$/)) {
            alert("❌ Định dạng ngày không hợp lệ. Dùng DD-MM-YYYY, 00-MM-YYYY hoặc 00-00-YYYY.");
            return;
        }

        const [day, month, year] = input.split("-");
        
        // Trường hợp truy vấn theo ngày cụ thể
        if (day !== "00" && month !== "00") {
            const formattedDate = `${year}-${month}-${day}`; // chuyển sang YYYY-MM-DD
            try {
                // Doanh thu ngày
                const dayRes = await fetch(`${baseUrl}/day?date=${formattedDate}`);
                const dayData = await dayRes.json();
                document.getElementById("todayRevenue").textContent = formatVND(dayData);
            } catch (err) {
                alert("❌ Không thể lấy dữ liệu doanh thu cho ngày.");
                console.error("Fetch error:", err);
            }
        }
        // Trường hợp truy vấn theo tháng
        else if (day === "00" && month !== "00") {
            const formattedMonth = `${year}-${month}`;
            try {
                // Doanh thu tháng
                const monthRes = await fetch(`${baseUrl}/month?month=${parseInt(month)}&year=${year}`);
                const monthData = await monthRes.json();
                document.getElementById("monthRevenue").textContent = formatVND(monthData);
            } catch (err) {
                alert("❌ Không thể lấy dữ liệu doanh thu cho tháng.");
                console.error("Fetch error:", err);
            }
        }
        // Trường hợp truy vấn theo năm
        else if (day === "00" && month === "00") {
            const formattedYear = `${year}`;
            try {
                // Doanh thu năm
                const yearRes = await fetch(`${baseUrl}/year?year=${year}`);
                const yearData = await yearRes.json();
                document.getElementById("yearRevenue").textContent = formatVND(yearData);
            } catch (err) {
                alert("❌ Không thể lấy dữ liệu doanh thu cho năm.");
                console.error("Fetch error:", err);
            }
        }
    };
});
