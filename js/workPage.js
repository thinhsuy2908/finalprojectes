document.addEventListener('DOMContentLoaded', () => {
  loadCategories().then(() => {
    loadWordsFromStorage(); // Gọi sau khi danh mục đã load xong
  });

  document.getElementById('editCategoryForm').addEventListener('submit', handleFormSubmit);
  document.querySelector('.btn-add').addEventListener('click', resetForm);
  document.getElementById('confirmDeleteBtn').addEventListener('click', handleDeleteConfirm);
  document.getElementById('searchInput').addEventListener('input', handleSearch);

  // Chỉ lọc khi người dùng chọn danh mục
  document.querySelectorAll('#categorySelect')[0].addEventListener('change', () => {
    currentPage = 1;
    loadWordsFromStorage();
  });
});

// Biến toàn cục
let editingRowIndex = null;
let deletingRowIndex = null;
let currentPage = 1;
const wordsPerPage = 3;

// Load danh mục
function loadCategories() {
  return new Promise((resolve) => {
    const categoriesData = JSON.parse(localStorage.getItem("vocabCategories")) || [];
    const selects = document.querySelectorAll('#categorySelect');
    selects.forEach(select => {
      select.innerHTML = '<option value="">All Categories</option>';
      categoriesData.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
      });
    });
    resolve();
  });
}

// Form submit
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('editCategoryName').value.trim();
  const description = document.getElementById('editCategoryDescription').value.trim();
  const category = document.querySelectorAll('#categorySelect')[1].value;

  if (!name || !category) return;

  const words = getWords();

  if (editingRowIndex !== null) {
    words[editingRowIndex] = { ...words[editingRowIndex], name, description, category };
    editingRowIndex = null;
  } else {
    const id = Date.now().toString();
    words.push({ id, name, description, category });
  }

  saveWords(words);
  currentPage = 1;
  loadWordsFromStorage();
  bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
}

// Reset form
function resetForm() {
  document.getElementById('editCategoryName').value = '';
  document.getElementById('editCategoryDescription').value = '';
  document.querySelectorAll('#categorySelect')[1].value = '';
  editingRowIndex = null;
}

// Render từ vựng
function renderWords(words) {
  const tableBody = document.getElementById('categoryTableBody');
  tableBody.innerHTML = '';

  const startIndex = (currentPage - 1) * wordsPerPage;
  const paginatedWords = words.slice(startIndex, startIndex + wordsPerPage);

  paginatedWords.forEach((word, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${word.name}</td>
      <td>${word.description}</td>
      <td>${word.category}</td>
      <td>
        <button class="btn btn-sm btn-warning">Edit</button>
        <button class="btn btn-sm btn-danger">Delete</button>
      </td>
    `;

    row.querySelector('.btn-warning').addEventListener('click', () => {
      const fullWords = getWords();
      const realIndex = startIndex + index;
      editingRowIndex = realIndex;
      document.getElementById('editCategoryName').value = word.name;
      document.getElementById('editCategoryDescription').value = word.description;
      document.querySelectorAll('#categorySelect')[1].value = word.category;
      new bootstrap.Modal(document.getElementById('editCategoryModal')).show();
    });

    row.querySelector('.btn-danger').addEventListener('click', () => {
      const realIndex = startIndex + index;
      deletingRowIndex = realIndex;
      new bootstrap.Modal(document.getElementById('deleteConfirmModal')).show();
    });

    tableBody.appendChild(row);
  });

  renderPagination(words.length);
}

// Render phân trang
function renderPagination(totalWords) {
  const totalPages = Math.ceil(totalWords / wordsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  const prevItem = document.createElement('li');
  prevItem.className = 'page-item ' + (currentPage === 1 ? 'disabled' : '');
  prevItem.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  prevItem.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadWordsFromStorage();
    }
  });
  pagination.appendChild(prevItem);

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = 'page-item ' + (currentPage === i ? 'active' : '');
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageItem.addEventListener('click', () => {
      currentPage = i;
      loadWordsFromStorage();
    });
    pagination.appendChild(pageItem);
  }

  const nextItem = document.createElement('li');
  nextItem.className = 'page-item ' + (currentPage === totalPages ? 'disabled' : '');
  nextItem.innerHTML = `<a class="page-link" href="#">Next</a>`;
  nextItem.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadWordsFromStorage();
    }
  });
  pagination.appendChild(nextItem);
}

// Xác nhận xoá
function handleDeleteConfirm() {
  if (deletingRowIndex !== null) {
    const words = getWords();
    words.splice(deletingRowIndex, 1);
    saveWords(words);
    loadWordsFromStorage();
    deletingRowIndex = null;
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
  }
}

// Lưu và lấy từ
function saveWords(words) {
  localStorage.setItem('vocabWords_v2', JSON.stringify(words));
}

function getWords() {
  return JSON.parse(localStorage.getItem('vocabWords_v2')) || [];
}

// Load từ và lọc theo tìm kiếm + danh mục
function loadWordsFromStorage() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.querySelectorAll('#categorySelect')[0].value;
  let words = getWords();

  words = words.filter(word => {
    const matchesSearch = word.name.toLowerCase().includes(searchQuery) ||
                          word.description.toLowerCase().includes(searchQuery);
    const matchesCategory = !selectedCategory || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  renderWords(words);
}

// Tìm kiếm
function handleSearch() {
  currentPage = 1;
  loadWordsFromStorage();
}
