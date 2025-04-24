let acount = JSON.parse(localStorage.getItem("acountList")) || [];
function register(e) {
    e.preventDefault();
    let notion = document.getElementById("notion");
    let firstNameInput = document.getElementById("firstName");
    let lastNameInput = document.getElementById("lastName");
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let confirmPasswordInput = document.getElementById("confirmPassword");
    let name = firstNameInput.value.trim();
    let lastName = lastNameInput.value.trim();
    let email = emailInput.value.trim();
    let password = passwordInput.value;
    let checkPassword = confirmPasswordInput.value;
    const strongEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let isValid = true;
    if (!lastName) {
        lastNameInput.classList.add("is-invalid");
        isValid = false;
    } else {
        lastNameInput.classList.remove("is-invalid");
    }
    if (!name) {
        firstNameInput.classList.add("is-invalid");
        isValid = false;
    } else {
        firstNameInput.classList.remove("is-invalid");
    }
    if (!email) {
        emailInput.classList.add("is-invalid");
        isValid = false;
    } else {
        emailInput.classList.remove("is-invalid");
    }
    if (!password) {
        passwordInput.classList.add("is-invalid");
        isValid = false;
    } else {
        passwordInput.classList.remove("is-invalid");
    }
    if (!checkPassword) {
        confirmPasswordInput.classList.add("is-invalid");
        isValid = false;
    } else {
        confirmPasswordInput.classList.remove("is-invalid");
    }
    if (!strongEmailRegex.test(email)) {
        notion.innerHTML = `<p>Email không hợp lệ. Vui lòng nhập lại</p>`;
        return;
    }
    if (!passwordRegex.test(password)) {
        notion.innerHTML = `<p>Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>`;
        return;
    }
    if (password !== checkPassword) {
        alert("Mật khẩu không khớp. Vui lòng nhập lại.");
        return;
    }
    if (acount.some((account) => account.email === email)) {
        notion.innerHTML = `<p>Email đã tồn tại. Vui lòng nhập email khác.</p>`;
        return;
    }
    if (isValid) {
        const newAccount = {
            id: acount.length + 1 + "",
            firstName: name,
            lastName: lastName,
            email: email,
            password: password
        };

        acount.push(newAccount);
        localStorage.setItem("acountList", JSON.stringify(acount));
        alert("Đăng ký thành công!");
        window.location.href = "login.html";
    }
}
