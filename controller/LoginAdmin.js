document.addEventListener("DOMContentLoaded", function () {
    const adminLoginButton = document.querySelector('.admin-login');

    adminLoginButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const username = document.querySelector('input[name="username"]').value.trim();
        const password = document.querySelector('input[name="password"]').value.trim();

        if (!username || !password) {
            alert("Vui lòng nhập tên đăng nhập và mật khẩu.");
            return;
        }

        try {
            const loginResponse = await fetch("http://127.0.0.1:8081/restaurant/login/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            if (!loginResponse.ok) {
                throw new Error("Đăng nhập thất bại!");
            }

            const loginResult = await loginResponse.json();
            if (loginResult.result && loginResult.result.authenticated) {

                const infoResponse = await fetch(`http://127.0.0.1:8081/restaurant/admin/${username}`);
                if (!infoResponse.ok) {
                    throw new Error("Không thể lấy thông tin admin.");
                }

                const admin = await infoResponse.json();
                console.log("Thông tin admin:", admin);

                // Lưu thông tin vào localStorage
                localStorage.setItem("adminID", admin.adminID || "");
                localStorage.setItem("name", admin.name || "");
                localStorage.setItem("username", username);

                alert("Đăng nhập thành công!");
                window.location.href = "../view/dashboard.html"; // Chuyển hướng sau khi đăng nhập
            } else {
                alert("Sai tên đăng nhập hoặc mật khẩu.");
            }

        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
        }
    });
});