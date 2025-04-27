document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.form-container');



    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = signupForm.querySelector('input[name="username"]').value;
        const name = signupForm.querySelector('input[name="name"]').value;
        const password = signupForm.querySelector('input[name="password"]').value;

        try {
            const response = await fetch('http://127.0.0.1:8081/restaurant/auth/signup/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, name })
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(`Tài khoản tồn tại: ${errorResult.message || response.statusText}`);
            }

            const result = await response.json();
            alert('Đăng ký thành công!');


            window.location.href = '/admin/pages/billing.html';


        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            alert(error.message);
        }
    });
})

