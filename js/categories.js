document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesFromStorage(); // Tải dữ liệu các category từ localStorage khi trang được tải

  // Xử lý sự kiện khi submit form
  document.getElementById('editCategoryForm').addEventListener('submit', handleFormSubmit);
  // Xử lý sự kiện khi bấm nút "Add new"
  document.querySelector('.btn-add').addEventListener('click', resetForm);
  // Xử lý sự kiện khi bấm nút xác nhận xoá
  document.getElementById('confirmDeleteBtn').addEventListener('click', handleDeleteConfirm);
  // Xử lý sự kiện tìm kiếm
  document.getElementById('searchInput').addEventListener('input', handleSearch);
});

// Xử lý sự kiện submit form (Thêm / Chỉnh sửa category)
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('editCategoryName').value.trim(); // Lấy tên category từ input
  const description = document.getElementById('editCategoryDescription').value.trim(); // Lấy mô tả category từ input

  if (!name) return; // Nếu tên không hợp lệ (rỗng), dừng lại

  const categories = getCategories(); // Lấy danh sách category hiện tại

  if (editingRowIndex !== null) { // Nếu đang chỉnh sửa, cập nhật category
    categories[editingRowIndex] = { ...categories[editingRowIndex], name, description };
    editingRowIndex = null; // Reset chỉ số chỉnh sửa sau khi lưu
  } else { // Nếu là thêm mới, tạo ID và thêm category vào danh sách
    const id = Date.now().toString(); // Sử dụng thời gian hiện tại làm ID duy nhất
    categories.push({ id, name, description });
  }

  saveCategories(categories); // Lưu danh sách category vào localStorage
  loadCategoriesFromStorage(); // Tải lại danh sách category và hiển thị
  bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide(); // Đóng modal
}

// Reset form khi bấm "Add new"
function resetForm() {
  document.getElementById('editCategoryName').value = ''; // Xoá nội dung trong ô input tên
  document.getElementById('editCategoryDescription').value = ''; // Xoá nội dung trong ô input mô tả
  editingRowIndex = null; // Reset chỉ số dòng chỉnh sửa
}

// Hiển thị các category ra bảng
function renderCategories(categories) {
  const tableBody = document.getElementById('categoryTableBody'); // Lấy phần tử tbody trong bảng
  tableBody.innerHTML = ''; // Xoá nội dung cũ của bảng

  categories.forEach((category, index) => { // Lặp qua từng category và tạo một dòng trong bảng
    const row = document.createElement('tr'); // Tạo một dòng mới trong bảng
    row.innerHTML = `
      <td>${category.name}</td>
      <td>${category.description}</td>
      <td>
        <button class="btn btn-sm btn-warning">Edit</button>
        <button class="btn btn-sm btn-danger">Delete</button>
      </td>
    `;

    // Xử lý sự kiện khi bấm nút "Edit"
    row.querySelector('.btn-warning').addEventListener('click', () => {
      editingRowIndex = index; // Ghi nhận chỉ số dòng đang chỉnh sửa
      document.getElementById('editCategoryName').value = category.name; // Điền tên vào form
      document.getElementById('editCategoryDescription').value = category.description; // Điền mô tả vào form
      new bootstrap.Modal(document.getElementById('editCategoryModal')).show(); // Hiển thị modal chỉnh sửa
    });

    // Xử lý sự kiện khi bấm nút "Delete"
    row.querySelector('.btn-danger').addEventListener('click', () => {
      deletingRowIndex = index; // Ghi nhận chỉ số dòng đang xoá
      new bootstrap.Modal(document.getElementById('deleteConfirmModal')).show(); // Hiển thị modal xác nhận xoá
    });

    tableBody.appendChild(row); // Thêm dòng mới vào bảng
  });
}

// Xử lý xác nhận xoá khi bấm "Delete" trong Modal
function handleDeleteConfirm() {
  if (deletingRowIndex !== null) { // Nếu có dòng cần xoá
    const categories = getCategories(); // Lấy danh sách category hiện tại
    categories.splice(deletingRowIndex, 1); // Xoá category tại vị trí đã lưu
    saveCategories(categories); // Lưu lại danh sách category mới
    loadCategoriesFromStorage(); // Tải lại bảng và hiển thị
    deletingRowIndex = null; // Reset chỉ số xoá
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide(); // Đóng modal xác nhận xoá
  }
}

// Lưu danh sách categories vào localStorage
function saveCategories(categories) {
  localStorage.setItem('vocabCategories', JSON.stringify(categories)); // Lưu danh sách vào localStorage
}

// Lấy danh sách categories từ localStorage
function getCategories() {
  return JSON.parse(localStorage.getItem('vocabCategories')) || []; // Lấy danh sách từ localStorage, nếu không có thì trả về mảng rỗng
}

// Load lại bảng từ localStorage
function loadCategoriesFromStorage() {
  renderCategories(getCategories()); // Hiển thị lại danh sách category từ localStorage
}

// Xử lý sự kiện tìm kiếm
function handleSearch() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase(); // Lấy từ khóa tìm kiếm
  const categories = getCategories(); // Lấy danh sách category
  const filteredCategories = categories.filter(category => {
    return category.name.toLowerCase().includes(searchQuery) || category.description.toLowerCase().includes(searchQuery);
  });
  renderCategories(filteredCategories); // Hiển thị danh sách đã lọc
}
