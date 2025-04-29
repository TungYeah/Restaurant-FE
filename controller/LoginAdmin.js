document.addEventListener('DOMContentLoaded', () => {
    const adminLoginButton = document.querySelector('.admin-login');

    async function loginAdmin(event) {
        event.preventDefault();
        const form = adminLoginButton.closest('form');
        const username = form.querySelector('input[name="username"]').value.trim();
        const password = form.querySelector('input[name="password"]').value.trim();

        if (!username || !password) {
            alert("Vui lòng nhập tên đăng nhập và mật khẩu.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8081/restaurant/auth/login/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Lỗi khi gửi yêu cầu đăng nhập:", errorText);
                throw new Error(`Đăng nhập không thành công: ${response.statusText}`);
            }

            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                console.error("Phản hồi không phải JSON:", errorText);
                alert("Lỗi: Phản hồi từ server không phải là JSON.");
                return;
            }

            const responseJson = await response.json();
            console.log("Dữ liệu trả về từ server:", responseJson);

            if (responseJson.result && responseJson.result.authenticated) {
                const adminResponse = await fetch(`http://127.0.0.1:8081/restaurant/auth/admin/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!adminResponse.ok) {
                    throw new Error(`Không thể lấy thông tin Admin: ${adminResponse.statusText}`);
                }

                const admin = await adminResponse.json();
                console.log("Thông tin Admin:", admin);

                if (admin && admin.adminID && admin.name) {
                    localStorage.setItem('adminID', admin.adminID);
                    localStorage.setItem('adminName', admin.name);
                    localStorage.setItem('username', username);
                    window.location.href = "/admin/pages/dashboard.html";
                } else {
                    alert("Không tìm thấy thông tin Admin.");
                }
            } else {
                throw new Error("Thông tin đăng nhập không chính xác.");
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            alert(`Đã có lỗi xảy ra: ${error.message}`);
        }
    }


    adminLoginButton.addEventListener('click', loginAdmin);
});
