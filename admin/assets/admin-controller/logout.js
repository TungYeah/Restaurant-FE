document.querySelector("#signOutLink").addEventListener("click", function (event) {
    event.preventDefault();

    console.log("Sign Out clicked");


    localStorage.removeItem('adminID');
    localStorage.removeItem('adminName');
    localStorage.removeItem('username');

    window.location.href = "/view/page.html";
});
