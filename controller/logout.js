document.getElementById('logout-btn')?.addEventListener('click', function (e) {
    e.preventDefault();


    localStorage.removeItem('userID');
    localStorage.removeItem('name');
    localStorage.removeItem('username');

    window.location.href = "../view/page.html";
});
