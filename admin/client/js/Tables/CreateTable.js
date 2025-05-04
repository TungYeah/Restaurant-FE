document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createTableForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const maxCapacity = document.getElementById('maxCapacity').value;

        try {
            const response = await fetch('http://localhost:8081/restaurant/tables/createTable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    maxCapacity: maxCapacity
                })
            });

            if (!response.ok) {
                throw new Error('Tạo bàn thất bại');
            }

            const data = await response.json();


            form.reset();
            window.location.href = "/admin/pages/tables.html";
        } catch (error) {
            console.error('Lỗi khi tạo bàn:', error);
            alert('Đã xảy ra lỗi khi tạo bàn!');
        }
    });
});
