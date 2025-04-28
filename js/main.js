let currentUser = JSON.parse(localStorage.getItem("currentUser"))
// Kiểm tra xem người dùng có đăng nhập hay không
if (!currentUser) {
  // Nếu không có người dùng đăng nhập (hoặc dữ liệu không hợp lệ), điều hướng đến trang login
  location.href = "../index.html"; 
} else {
  // Nếu người dùng đã đăng nhập, hiển thị nội dung trang Home
  const userDisplay = document.querySelector("#userDisplay");
  const content = document.querySelector(".content");
  userDisplay.innerHTML = currentUser.firstName; // Hiển thị tên người dùng
  content.innerHTML = `<h2 class="fw-bold mb-3">Chào mừng bạn đã quay lại học, ${currentUser.firstName}!</h2>`;
}