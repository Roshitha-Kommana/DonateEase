function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Toggle active classes
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", () => {
    checkAuthState();
    setupEventListeners();

    // Make NGO dropdown visible but disabled initially
    document.getElementById("ngoContainer").style.display = "block";
    document.getElementById("ngoList").disabled = true;
});

//Firebase authentication check
function checkAuthState() {
    import("https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js")
        .then(({ getAuth, onAuthStateChanged }) => {
            const auth = getAuth();
                onAuthStateChanged(auth, (user) => {
                    if (!user) {
                        window.location.href = 'login.html';
                    } else {
                        console.log("User is logged in: ", user.email);
                    }
                });
            });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById("ngoList").addEventListener("change", () => {
        updateDonationTypes();
        enableDonationType();
    });
    document.getElementById("donationType").addEventListener("change", showDynamicForm);
}

function enableDonationType() {
    document.getElementById("donationType").disabled = false;
}

// Mapping of NGOs to their respective donation types
const ngoDonationMapping = {
    goonj: ["Clothes", "Others"],
    helpage: ["Clothes"],
    smile: ["Clothes", "Money", "Books"],
    teachforindia: ["Money", "Books"]
};

function updateDonationTypes() {
    const ngoList = document.getElementById('ngoList');
    const donationTypeList = document.getElementById('donationType');
    const selectedNgo = ngoList.value;

    // Clear existing donation type options
    donationTypeList.innerHTML = '<option value="" disabled selected>Select Donation Type</option>';

    // Populate donation types based on the selected NGO
    if (selectedNgo && ngoDonationMapping[selectedNgo]) {
        ngoDonationMapping[selectedNgo].forEach(donationType => {
            const option = document.createElement('option');
            option.value = donationType.toLowerCase();
            option.textContent = donationType;
            donationTypeList.appendChild(option);
        });
    }
    // Call showDynamicForm() to ensure the correct dynamic form is displayed after selecting an NGO
    showDynamicForm();
}

// Function to show dynamic form based on selected donation type
function showDynamicForm() {
    const donationType = document.getElementById('donationType').value;
    const forms = document.getElementsByClassName('dynamic-form');

    // Hide all dynamic forms initially
    for (let i = 0; i < forms.length; i++) {
        forms[i].classList.add('hidden');
    }
    // Show the dynamic form based on selected donation type, only if donation type is selected
    if (donationType) {
        document.getElementById(`${donationType}Form`).classList.remove('hidden');
    }
}
    document.addEventListener("DOMContentLoaded", function () {
    const fields = {
        name: { regex: /^[A-Za-z\s]+$/, error: "Please enter a valid name (letters only)." },
        email: { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, error: "Please enter a valid email address." },
        phone: { regex: /^\d{10}$/, error: "Please enter a valid 10-digit phone number." },
        pincode: { regex: /^\d{6}$/, error: "Please enter a valid 6-digit pincode." }
    };
    const requiredFields = ["address"];
    function validateField(input, field) {
        const errorDiv = document.getElementById(`${field}-error`);
        if (!input.value.trim()) {
            errorDiv.textContent = "This field is required.";
            return false;
        }
        if (fields[field] && !fields[field].regex.test(input.value.trim())) {
            errorDiv.textContent = fields[field].error;
            return false;
        }
        errorDiv.textContent = "";
        return true;
    }
    function validateForm() {
        let isValid = true;

        Object.keys(fields).forEach(field => {
            const input = document.getElementById(field);
            if (!validateField(input, field)) isValid = false;
        });
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            const errorDiv = document.getElementById(`${field}-error`);
            if (!input.value.trim()) {
                errorDiv.textContent = "This field is required.";
                isValid = false;
            } else {
                errorDiv.textContent = "";
            }
        });

        document.getElementById("ngoList").disabled = !isValid;
    }
    // Validate on input for instant feedback
    Object.keys(fields).forEach(field => {
        const input = document.getElementById(field);
        input.addEventListener("input", function () {
            validateField(input, field);
            validateForm();
        });
    });
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        input.addEventListener("input", function () {
            validateField(input, field);
            validateForm();
        });
    });
});

function validateNGOSelection() {
    const ngoList = document.getElementById("ngoList");
    const errorDiv = document.getElementById("ngo-error");

    if (ngoList.value === "") {
        errorDiv.textContent = "Please select an NGO.";
        return false;
    } else {
        errorDiv.textContent = "";
        return true;
    }
}

function addBookFields() {
    const numBooksInput = document.getElementById('numBooks');
    const numBooksError = document.getElementById('numBooks-error');
    const bookDetailsContainer = document.getElementById('bookDetails');

    const numBooks = parseInt(numBooksInput.value.trim(), 10);
    
    // Clear existing fields and errors when the number changes
    bookDetailsContainer.innerHTML = ''; 
    numBooksError.textContent = ""; 

    if (isNaN(numBooks) || numBooks <= 0) {
        numBooksError.textContent = "Please enter a valid positive number of books.";
        return;
    }

    for (let i = 0; i < numBooks; i++) {
        const bookFieldSet = document.createElement('div');
        bookFieldSet.className = 'book-fieldset';
        bookFieldSet.setAttribute("data-index", i); // Helps with retrieval
    
        // Title Input
        bookFieldSet.appendChild(createInputField(`Book ${i + 1} Title:`, 'text', `bookTitle${i}`, 'Book Title', 'book-title'));
        bookFieldSet.appendChild(createErrorMessage(`bookTitle-error-${i}`));
    
        // Author Input
        bookFieldSet.appendChild(createInputField('Author:', 'text', `bookAuthor${i}`, 'Author', 'book-author'));
        bookFieldSet.appendChild(createErrorMessage(`bookAuthor-error-${i}`));
    
        // Description Input
        bookFieldSet.appendChild(createInputField('Description:', 'textarea', `bookDescription${i}`, 'Describe how useful it can be', 'book-description'));
        bookFieldSet.appendChild(createErrorMessage(`bookDescription-error-${i}`));
    
        bookDetailsContainer.appendChild(bookFieldSet);
    }
    // Attach real-time validation whenever fields are generated
    addRealTimeValidation(numBooks);
}

// Function to create input fields dynamically
function createInputField(labelText, inputType, id, placeholder) {
    const wrapper = document.createElement('div');

    const label = document.createElement('label');
    label.innerText = labelText;

    let input;
    if (inputType === 'textarea') {
        input = document.createElement('textarea');
    } else {
        input = document.createElement('input');
        input.type = inputType;
    }
    input.id = id;
    input.placeholder = placeholder;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
}

// Function to create error message spans
function createErrorMessage(id) {
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.id = id;
    return errorSpan;
}

// Handle Books Donation Form Submission
function donateBooks() {
    const numBooksInput = document.getElementById("numBooks");
    const numBooks = parseInt(numBooksInput.value.trim(), 10);
    let isValid = true;

    if (isNaN(numBooks) || numBooks <= 0) {
        document.getElementById("numBooks-error").textContent = "Please enter a valid positive number.";
        return false;
    }

    for (let i = 0; i < numBooks; i++) {
        const titleInput = document.getElementById(`bookTitle${i}`);
        const authorInput = document.getElementById(`bookAuthor${i}`);
        const descriptionInput = document.getElementById(`bookDescription${i}`);

        const titleError = document.getElementById(`bookTitle-error-${i}`);
        const authorError = document.getElementById(`bookAuthor-error-${i}`);
        const descriptionError = document.getElementById(`bookDescription-error-${i}`);

        // Clear previous error messages
        titleError.textContent = "";
        authorError.textContent = "";
        descriptionError.textContent = "";

        // Validate Title
        if (!titleInput || titleInput.value.trim() === "") {
            titleError.textContent = "Please enter the book title.";
            isValid = false;
        }

        // Validate Author
        if (!authorInput || authorInput.value.trim() === "") {
            authorError.textContent = "Please enter the author's name.";
            isValid = false;
        }

        // Validate Description
        if (!descriptionInput || descriptionInput.value.trim() === "") {
            descriptionError.textContent = "Please enter a description.";
            isValid = false;
        }
    }
    if (!isValid) {
        console.log("🚨 Book fields validation failed!");
        return false; // Prevents further execution
    }
    function redirectToConfirmation(donationType, donationDetails) {
        window.location.href = `confirmation.html?type=${encodeURIComponent(donationType)}&details=${encodeURIComponent(donationDetails)}`;
    }
    
    return true;
}

// Remove error messages dynamically when the user starts typing
function addRealTimeValidation(numBooks) {
    for (let i = 0; i < numBooks; i++) {
        const titleInput = document.getElementById(`bookTitle${i}`);
        const authorInput = document.getElementById(`bookAuthor${i}`);
        const descriptionInput = document.getElementById(`bookDescription${i}`);

        if (!titleInput || !authorInput || !descriptionInput) continue;

        titleInput.addEventListener("input", function () {
            document.getElementById(`bookTitle-error-${i}`).textContent = "";
        });

        authorInput.addEventListener("input", function () {
            document.getElementById(`bookAuthor-error-${i}`).textContent = "";
        });

        descriptionInput.addEventListener("input", function () {
            document.getElementById(`bookDescription-error-${i}`).textContent = "";
        });
    }
}

// Real-time validation for Number of Books input (also resets book fields if changed)
document.getElementById('numBooks').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, ''); // Allow only numbers
    document.getElementById('numBooks-error').textContent = this.value.trim() && parseInt(this.value) > 0
        ? "" : "Please enter a valid positive number of books.";

    // Auto-reset book fields when number of books changes
    document.getElementById('bookDetails').innerHTML = ''; 
});

// Handle Clothes Donation Form Submission
function donateClothes() {
    const clothType = document.getElementById('clothType');
    const clothSize = document.getElementById('clothSize');
    const gender = document.getElementById('gender');
    const age = document.getElementById('age');

    const clothTypeError = document.getElementById('clothType-error');
    const clothSizeError = document.getElementById('clothSize-error');
    const genderError = document.getElementById('gender-error');
    const ageError = document.getElementById('age-error');

    let isValid = true;

    // Clear previous error messages
    clothTypeError.textContent = "";
    clothSizeError.textContent = "";
    genderError.textContent = "";
    ageError.textContent = "";

    if (!clothType.value.trim()) {
        clothTypeError.textContent = "Please enter the type of cloth.";
        isValid = false;
    }

    if (!clothSize.value.trim()) {
        clothSizeError.textContent = "Please enter the size of the cloth.";
        isValid = false;
    }

    if (!gender.value.trim()) {
        genderError.textContent = "Please select the gender.";
        isValid = false;
    }

    if (!age.value.trim() || isNaN(age.value) || parseInt(age.value) <= 0) {
        ageError.textContent = "Please enter a valid positive age.";
        isValid = false;
    }

    if (!isValid) {
        console.log("🚨 Clothes validation failed!");
        return false;
    }    
    return true;
}

// Remove error messages dynamically when the user starts typing
document.getElementById('clothType').addEventListener('input', function () {
    document.getElementById('clothType-error').textContent = this.value.trim() ? "" : "Please enter the type of cloth.";
});

document.getElementById('clothSize').addEventListener('input', function () {
    document.getElementById('clothSize-error').textContent = this.value.trim() ? "" : "Please enter the size of the cloth.";
});

document.getElementById('gender').addEventListener('change', function () {
    document.getElementById('gender-error').textContent = this.value.trim() ? "" : "Please select the gender.";
});

document.getElementById('age').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, ''); // Allow only numbers
    document.getElementById('age-error').textContent = (this.value.trim() && parseInt(this.value) > 0) ? "" : "Please enter a valid positive age.";
});

// Handle Others Donation Form Submission
function donateOthers() {
    const otherItem = document.getElementById("otherItem");
    const otherDescription = document.getElementById("otherDescription");
    const itemError = document.getElementById("otherItem-error");
    const descriptionError = document.getElementById("otherDescription-error");

    let isValid = true;

    itemError.textContent = "";
    descriptionError.textContent = "";

    if (!otherItem.value.trim()) {
        itemError.textContent = "Please enter the item name.";
        isValid = false;
    }

    if (!otherDescription.value.trim()) {
        descriptionError.textContent = "Please enter a description.";
        isValid = false;
    }

    if (!isValid) {
        console.log("🚨 Other donation validation failed!");
        return false;
    }
    return true;
}

// Remove error message when the user starts typing
document.getElementById('otherItem').addEventListener('input', function () {
    document.getElementById('otherItem-error').textContent = "";
});

document.getElementById('otherDescription').addEventListener('input', function () {
    document.getElementById('otherDescription-error').textContent = "";
});

// Function to show or hide the payment section based on the donation type
function proceedToPayment() {
    const donationType = document.getElementById('donationType').value;
    const donationAmountInput = document.getElementById('amount');
    const donationAmount = donationAmountInput.value.trim();
    const amountError = document.getElementById('amount-error');

    let isValid = true;

    // Clear previous error messages
    amountError.textContent = "";

    // Validate amount input
    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
        amountError.textContent = "Please enter a valid positive donation amount.";
        isValid = false;
    }

    if (!isValid) return; // Stop function execution if validation fails

    // Update donation amount on the payment page
    document.getElementById('donationAmount').innerText = donationAmount;

    // Hide donation form, show payment section
    document.getElementById('donation-section').classList.add('hidden');
    document.getElementById('payment-section').classList.remove('hidden');

    // Generate QR code dynamically if donation type is money
    if (donationType === 'money') {
        generateQRCode(donationAmount);
        document.getElementById('qrCodeImage').classList.remove('hidden');
    } else {
        document.getElementById('qrCodeImage').classList.add('hidden');
    }
}

// Attach event listener to the Proceed to Payment button
document.getElementById("proceedToPayment").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent unwanted form submission
    proceedToPayment();
});

// Remove error message when the user starts typing
document.getElementById('amount').addEventListener('input', function () {
    const amountError = document.getElementById('amount-error');

    // Allow only numbers and a single decimal point
    this.value = this.value.replace(/[^0-9.]/g, '');

    if (this.value.trim() !== "" && !isNaN(this.value) && parseFloat(this.value) > 0) {
        amountError.textContent = "";
    }
});

function confirmPayment() {
    const transactionIdInput = document.getElementById('transactionId');
    const screenshotInput = document.getElementById('transactionScreenshot');

    const transactionId = transactionIdInput.value.trim();
    const screenshot = screenshotInput.files.length;

    const transactionError = document.getElementById('transactionError');
    const screenshotError = document.getElementById('screenshotError');

    let isValid = true;

    transactionError.textContent = "";
    screenshotError.textContent = "";

    if (!transactionId) {
        transactionError.textContent = "Please enter your transaction ID!";
        isValid = false;
    }

    if (!screenshot) {
        screenshotError.textContent = "Please upload the payment screenshot!";
        isValid = false;
    }

    
    return isValid; // ✅ Returns true or false based on validation
}
// Remove error message when the user starts typing
document.getElementById('transactionId').addEventListener('input', function() {
    document.getElementById('transactionError').textContent = '';
});

// Remove error message when the user uploads a file
document.getElementById('transactionScreenshot').addEventListener('change', function() {
    if (this.files.length > 0) {
        document.getElementById('screenshotError').textContent = '';
    }
});
function generateQRCode(amount) {
    const upiId = "9494189399@ibl";
    const payeeName = "DonateEase_NGO";
    const qrLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    document.getElementById("qrCodeImage").src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrLink)}&size=200x200`;
}