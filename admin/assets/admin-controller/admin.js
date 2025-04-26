document.addEventListener("DOMContentLoaded", function () {
    let userList = document.getElementById('user-list');

    // Lấy thông tin người dùng từ API và hiển thị
    fetch(`http://127.0.0.1:8081/restaurant/auth/users`)
        .then(response => response.json())
        .then(users => {
            displayUserInfo(users); // Hiển thị thông tin người dùng
        })
        .catch(error => {
            console.error('Không thể lấy thông tin người dùng:', error);
            userList.innerHTML = '<p>Không tìm thấy thông tin người dùng.</p>';
        });

    const displayUserInfo = (users) => {
        userList.innerHTML = '';

        users.forEach(userData => {
            let userItem = `
                <li class="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
                    <div class="d-flex flex-column">
                        <h6 class="mb-3 text-sm">${userData.name || 'Name Placeholder'}</h6>
                        <span class="mb-2 text-xs">User ID: <span class="text-dark font-weight-bold ms-sm-2">${userData.userID || 'No User ID'}</span></span>
                        <span class="mb-2 text-xs">Username: <span class="text-dark ms-sm-2 font-weight-bold">${userData.username || 'No Username'}</span></span>
                        <span class="text-xs">Name: <span class="text-dark ms-sm-2 font-weight-bold">${userData.name || 'No Name'}</span></span>
                    </div>
                    <div class="ms-auto text-end">
                        <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;" onclick="deleteUser('${userData.userID}')">
                            <i class="material-symbols-rounded text-sm me-2">delete</i>Delete
                        </a>
                        <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
                            <i class="material-symbols-rounded text-sm me-2">edit</i>Edit
                        </a>
                    </div>
                </li>
            `;
            userList.innerHTML += userItem;
        });
    };


    window.deleteUser = function (userID) {
        if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            fetch(`http://127.0.0.1:8081/restaurant/auth/users/${userID}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        alert("Người dùng đã được xóa thành công.");
                        location.reload();
                    } else {
                        alert("Không thể xóa người dùng.");
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi xóa người dùng:', error);
                    alert('Lỗi khi xóa người dùng.');
                });
        }
    };
});
