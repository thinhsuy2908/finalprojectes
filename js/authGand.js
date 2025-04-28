(function checkAuth() {
    const userData = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (userData) {
        window.location.href = "/html/home.html";
    }
    else{
        window.location.href = "../index.html";
    }
})();
  