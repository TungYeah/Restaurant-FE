document.addEventListener("DOMContentLoaded", function () {
    const userID = new URLSearchParams(window.location.search).get('userID');
    console.log('userID:', userID);

    if (!userID) {
        console.error("Không tìm thấy userID trong URL!");
        return;
    }


    fetch(`http://127.0.0.1:8081/restaurant/auth/signup/user/${userID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không tìm thấy người dùng!');
            }
            return response.json();
        })
        .then(user => {
            console.log(user);
            document.getElementById('username').value = user.username;
            document.getElementById('name').value = user.name;
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            alert('Lỗi khi tải thông tin người dùng.');
        });

    const updateUserForm = document.getElementById('updateUserForm');
    updateUserForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const name = document.getElementById('name').value;

        if (!username || !name) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        fetch(`http://127.0.0.1:8081/restaurant/auth/signup/user/${userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                name: name
            })
        })
            .then(response => {
                if (response.ok) {
                    alert("Cập nhật thông tin thành công!");
                    window.location.href = "/admin/pages/billing.html";
                } else {
                    alert("Cập nhật thông tin thất bại.");
                }
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật thông tin người dùng:', error);
                alert('Lỗi khi cập nhật thông tin người dùng.');
            });
    });
});
