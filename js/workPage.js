document.addEventListener('DOMContentLoaded', () => {
    loadWordsFromStorage(); // Tải danh sách từ vựng từ localStorage khi trang được tải
  
    // Xử lý sự kiện khi submit form
    document.getElementById('editCategoryForm').addEventListener('submit', handleFormSubmit);
    // Xử lý sự kiện khi bấm nút "Add new"
    document.querySelector('.btn-add').addEventListener('click', resetForm);
    // Xử lý sự kiện khi bấm nút xác nhận xoá
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleDeleteConfirm);
    // Xử lý sự kiện tìm kiếm
    document.getElementById('searchInput').addEventListener('input', handleSearch);
  });
  
  // Khai báo biến toàn cục để lưu chỉ số dòng đang chỉnh sửa và xóa
  let editingRowIndex = null;
  let deletingRowIndex = null;
  
  // Xử lý sự kiện submit form (Thêm / Chỉnh sửa từ vựng)
  function handleFormSubmit(e) {
    e.preventDefault();
  
    const name = document.getElementById('editCategoryName').value.trim(); // Lấy tên từ input
    const description = document.getElementById('editCategoryDescription').value.trim(); // Lấy mô tả từ input
  
    if (!name) return; // Nếu tên không hợp lệ (rỗng), dừng lại
  
    const words = getWords(); // Lấy danh sách từ vựng hiện tại
  
    if (editingRowIndex !== null) { // Nếu đang chỉnh sửa, cập nhật từ vựng
      words[editingRowIndex] = { ...words[editingRowIndex], name, description };
      editingRowIndex = null; // Reset chỉ số chỉnh sửa sau khi lưu
    } else { // Nếu là thêm mới, tạo ID và thêm từ vựng vào danh sách
      const id = Date.now().toString(); // Sử dụng thời gian hiện tại làm ID duy nhất
      words.push({ id, name, description });
    }
  
    saveWords(words); // Lưu danh sách từ vựng vào localStorage
    loadWordsFromStorage(); // Tải lại danh sách từ vựng và hiển thị
    bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide(); // Đóng modal
  }
  
  // Reset form khi bấm "Add new"
  function resetForm() {
    document.getElementById('editCategoryName').value = ''; // Xoá nội dung trong ô input tên
    document.getElementById('editCategoryDescription').value = ''; // Xoá nội dung trong ô input mô tả
    editingRowIndex = null; // Reset chỉ số dòng chỉnh sửa
  }
  
  // Hiển thị các từ vựng ra bảng
  function renderWords(words) {
    const tableBody = document.getElementById('categoryTableBody'); // Lấy phần tử tbody trong bảng
    tableBody.innerHTML = ''; // Xoá nội dung cũ của bảng
  
    words.forEach((word, index) => { // Lặp qua từng từ vựng và tạo một dòng trong bảng
      const row = document.createElement('tr'); // Tạo một dòng mới trong bảng
      row.innerHTML = `
        <td>${word.name}</td>
        <td>${word.description}</td>
        <td>Category</td>
        <td>
          <button class="btn btn-sm btn-warning">Edit</button>
          <button class="btn btn-sm btn-danger">Delete</button>
        </td>
      `;
  
      // Xử lý sự kiện khi bấm nút "Edit"
      row.querySelector('.btn-warning').addEventListener('click', () => {
        editingRowIndex = index; // Ghi nhận chỉ số dòng đang chỉnh sửa
        document.getElementById('editCategoryName').value = word.name; // Điền tên vào form
        document.getElementById('editCategoryDescription').value = word.description; // Điền mô tả vào form
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
      const words = getWords(); // Lấy danh sách từ vựng hiện tại
      words.splice(deletingRowIndex, 1); // Xoá từ vựng tại vị trí đã lưu
      saveWords(words); // Lưu lại danh sách từ vựng mới
      loadWordsFromStorage(); // Tải lại bảng và hiển thị
      deletingRowIndex = null; // Reset chỉ số xoá
      bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide(); // Đóng modal xác nhận xoá
    }
  }
  
  // Lưu danh sách từ vựng vào localStorage
  function saveWords(words) {
    localStorage.setItem('vocabWords_v2', JSON.stringify(words)); // Lưu danh sách vào localStorage với khóa riêng
  }
  
  // Lấy danh sách từ vựng từ localStorage
  function getWords() {
    return JSON.parse(localStorage.getItem('vocabWords_v2')) || []; // Lấy danh sách từ localStorage, nếu không có thì trả về mảng rỗng
  }
  
  // Load lại bảng từ localStorage
  function loadWordsFromStorage() {
    renderWords(getWords()); // Hiển thị lại danh sách từ vựng từ localStorage
  }
  
  // Xử lý sự kiện tìm kiếm
  function handleSearch() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase(); // Lấy từ khóa tìm kiếm
    const words = getWords(); // Lấy danh sách từ vựng
    const filteredWords = words.filter(word => {
      return word.name.toLowerCase().includes(searchQuery) || word.description.toLowerCase().includes(searchQuery);
    });
    renderWords(filteredWords); // Hiển thị danh sách đã lọc
  }
  