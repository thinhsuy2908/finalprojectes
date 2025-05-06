document.addEventListener("DOMContentLoaded", () => {
  let flashcards = [];
  let currentIndex = 0;
  let flipped = false;

  const cardBox = document.querySelector(".card-box");
  const prevBtn = document.getElementById("btn-prev");
  const nextBtn = document.getElementById("btn-next");
  const markBtn = document.getElementById("btn-mark");
  const progressText = document.getElementById("progress-text");
  const progressBar = document.querySelector(".progress-bar");
  const wordTableBody = document.querySelector("tbody");
  const categoryFilter = document.getElementById("categoryFilter");

  populateCategories();
  loadFlashcards();

  categoryFilter.addEventListener("change", loadFlashcards);

  cardBox.addEventListener("click", () => {
    if (flashcards.length === 0) return;
    flipped = !flipped;
    renderCard();
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      flipped = false;
      renderCard();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < flashcards.length - 1) {
      currentIndex++;
      flipped = false;
      renderCard();
    }
  });

  markBtn.addEventListener("click", () => {
    if (!flashcards[currentIndex]) return;
    flashcards[currentIndex].learned = !flashcards[currentIndex].learned; // Toggle
    saveFlashcard(flashcards[currentIndex]);
    renderCard();
    renderTable();
    updateProgress();
  });

  function populateCategories() {
    const categories = JSON.parse(localStorage.getItem("vocabCategories")) || [];
    categoryFilter.innerHTML = `<option value="">Tất cả</option>`;
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categoryFilter.appendChild(option);
    });
  }

  function loadFlashcards() {
    const allWords = JSON.parse(localStorage.getItem("vocabWords_v2")) || [];
    const selectedCategory = categoryFilter.value;

    flashcards = selectedCategory
      ? allWords.filter(card => card.category === selectedCategory)
      : allWords;

    currentIndex = 0;
    flipped = false;
    renderCard();
    renderTable();
    updateProgress();
  }

  function renderCard() {
    if (flashcards.length === 0) {
      cardBox.textContent = "Không có từ nào.";
      cardBox.classList.remove("learned");
      markBtn.textContent = "Mark as Learned";
      return;
    }

    const card = flashcards[currentIndex];
    cardBox.textContent = flipped ? card.description : card.name;
    cardBox.classList.toggle("learned", !!card.learned);
    markBtn.textContent = card.learned ? "Unmark as Learned" : "Mark as Learned";
  }

  function renderTable() {
    wordTableBody.innerHTML = "";
    flashcards.forEach(card => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${card.name}</td>
        <td>${card.description}</td>
        <td>${card.category}</td>
        <td>${card.learned ? "Learned" : "Not Learned"}</td>
      `;
      wordTableBody.appendChild(tr);
    });
  }

  function updateProgress() {
    const total = flashcards.length;
    const learned = flashcards.filter(c => c.learned).length;
    const percent = total ? (learned / total) * 100 : 0;

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${learned}/${total} từ đã học`;
  }

  function saveFlashcard(updatedCard) {
    const allWords = JSON.parse(localStorage.getItem("vocabWords_v2")) || [];
    const index = allWords.findIndex(
      word => word.name === updatedCard.name && word.category === updatedCard.category
    );
    if (index !== -1) {
      allWords[index] = updatedCard;
      localStorage.setItem("vocabWords_v2", JSON.stringify(allWords));
    }
  }
});
