const loginForm = document.querySelector('.form-container.sign-in form');
const userLoginButton = document.querySelector('.user-login');  // Nút đăng nhập với User

// Hàm xử lý đăng nhập với user
async function loginUser(event) {
    event.preventDefault(); // Ngừng hành động mặc định của form

    const username = loginForm.querySelector('input[type="text"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value.trim();

    // Kiểm tra nếu thông tin chưa được nhập
    if (!username || !password) {
        alert("Vui lòng nhập tên người dùng và mật khẩu.");
        return;
    }

    try {
        // Gửi yêu cầu đăng nhập
        const response = await fetch('http://127.0.0.1:8081/restaurant/auth/login', {
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
            // Gửi yêu cầu để lấy thông tin người dùng bằng username
            const userResponse = await fetch(`http://127.0.0.1:8081/restaurant/auth/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!userResponse.ok) {
                throw new Error(`Không thể lấy thông tin người dùng: ${userResponse.statusText}`);
            }

            const user = await userResponse.json();
            console.log("Thông tin người dùng:", user);

            // Kiểm tra xem user có tồn tại không trước khi lưu vào localStorage
            if (user && user.userID && user.name) {
                localStorage.setItem('userID', user.userID);
                localStorage.setItem('name', user.name);
                localStorage.setItem('username', username);
                alert('Đăng nhập thành công!');
                window.location.href = "../view/selectTables.html";  // Chuyển hướng tới trang sau khi đăng nhập thành công
            } else {
                alert("Không tìm thấy thông tin tên người dùng.");
            }
        } else {
            throw new Error("Thông tin đăng nhập không chính xác.");
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        alert(`Đã có lỗi xảy ra: ${error.message}`);
    }
}

// Gán sự kiện vào nút đăng nhập với User
userLoginButton.addEventListener('click', loginUser);
