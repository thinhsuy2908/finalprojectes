function showMessage(type, message) {
  const messageBox = document.getElementById("messageBox");
  messageBox.className = `alert alert-${type}`;
  messageBox.textContent = message;
  messageBox.classList.remove("d-none");
  setTimeout(() => messageBox.classList.add("d-none"), 3000);
}

function login(e) {
  e.preventDefault(); 
  const emailInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const acountList = JSON.parse(localStorage.getItem("acountList")) || [];

  if (!email || !password) {
    showMessage("warning", "Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const foundUser = acountList.find(user => user.email === email && user.password === password);

  if (foundUser) {
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    showMessage("success", "Đăng nhập thành công!");
    setTimeout(() => {
      window.location.href = "./home.html";
    }, 1000);
  } else {
    showMessage("danger", "Sai email hoặc mật khẩu.");
  }
}

function logout(e) {
  e.preventDefault();
  // Tạo xác nhận tùy chỉnh
  const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");
  if (confirmLogout) {
    localStorage.removeItem("currentUser");
    window.location.href = "./login.html";
  }
}
