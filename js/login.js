function login(e) {
  e.preventDefault(); 
  const emailInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const acountList = JSON.parse(localStorage.getItem("acountList")) || [];
  // Tìm người dùng có email và mật khẩu trùng khớp
  const foundUser = acountList.find(user => user.email === email && user.password === password);
    if (!email || !password) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }
    if (foundUser) {
        // Lưu thông tin người dùng đang đăng nhập
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        alert("Đăng nhập thành công!");
        window.location.href = "./home.html";
    } else {
        alert("Tài khoản chưa có hoặc.Tên đăng nhập hoặc mật khẩu không đúng vui lòng kiểm tra lại.");
    }
}
function logout(e) {
  e.preventDefault();
  const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");
  if (confirmLogout) {
    // Xoá thông tin người dùng đang đăng nhập (nếu có)
    localStorage.removeItem("currentUser");
    window.location.href = "./login.html";
  }
}