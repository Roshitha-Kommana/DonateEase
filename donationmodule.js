// ✅ Import Firebase modules
import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "de_payment_ss"); // Replace with Cloudinary preset
    
    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dbgcxg6ct/image/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}
// ✅ Function to Submit Donation
async function submitDonation() {
    const user = auth.currentUser;
    if (!user) {
        alert("You need to log in before donating.");
        return;
    }

    // ✅ Get Form Values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    //const country = document.getElementById("country").value.trim();
    //const state = document.getElementById("state").value.trim();
    //const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const ngo = document.getElementById("ngoList").value;
    const donationType = document.getElementById("donationType").value;
    const transactionId = document.getElementById("transactionId").value.trim();
    const screenshotFile = document.getElementById("transactionScreenshot").files[0];
    if (!ngo || !donationType) {
        alert("Please select an NGO and donation type.");
        return;
    }
    
    // ✅ Ensure book validation happens only once
    if (donationType === "books") {
        const isBookValid = donateBooks();
        if (!isBookValid) {
            console.log("🚨 Book donation validation failed. Submission blocked.");
            return; // Prevents further execution
        }
    }
    // ✅ Validation for Clothes
    if (donationType === "clothes") {
        const isClothesValid = donateClothes();
        if (!isClothesValid) {
            console.log("🚨 Clothes donation validation failed. Submission blocked.");
            return;
        }
    }
    // ✅ Validation for Money
    if (donationType === "money") {
        const isMoneyValid = confirmPayment();
        if (!isMoneyValid) {
            console.log("🚨 Money donation validation failed. Submission blocked.");
            return;
        }
    }
    // ✅ Validation for Other Items
    if (donationType === "others") {
        const isOtherValid = donateOthers();
        if (!isOtherValid) {
            console.log("🚨 Other donation validation failed. Submission blocked.");
            return;
        }
    }

    let screenshotUrl = "";
    if (screenshotFile) {
        screenshotUrl = await uploadToCloudinary(screenshotFile);
        if (!screenshotUrl) {
            alert("Failed to upload screenshot. Please try again.");
            return;
        }
    }

    // ✅ Collect Donation Details Based on Type
    let donationDetails = {};

    if (donationType === "money") {
        donationDetails = {
            amount: document.getElementById("amount").value.trim(),
            transactionId: transactionId,
            screenshotUrl: screenshotUrl,
        };
    }
    else if (donationType === "books") {
        donationDetails = {
            numBooks: document.getElementById("numBooks").value.trim(),
            bookDetails: getBookDetails(),
        };
    } else if (donationType === "clothes") {
        donationDetails = {
            clothType: document.getElementById("clothType").value.trim(),
            clothSize: document.getElementById("clothSize").value.trim(),
            gender: document.getElementById("gender").value,
            age: document.getElementById("age").value.trim(),
        };
    } else if (donationType === "others") {
        donationDetails = {
            item: document.getElementById("otherItem").value.trim(),
            description: document.getElementById("otherDescription").value.trim(),
        };
    }

    // ✅ Store Donation Data under User ID
    try {
        // ✅ Store Donation Data under User ID
        const docRef = await addDoc(collection(db, "donations", user.uid, "userDonations"), {
            donorName: name,
            donorEmail: email,
            phone,
            address: { address,pincode },
            ngo,
            donationDetails,
            donationType,
            timestamp: serverTimestamp(),
        });

        console.log("✅ Donation stored successfully with ID:", docRef.id);

        // ✅ Redirect to Confirmation Page After Saving Data
        const donationMessage = JSON.stringify(donationDetails);
        window.location.href = `confirmation.html?type=${encodeURIComponent(donationType)}&details=${encodeURIComponent(donationMessage)}`;
        
    } catch (error) {
        console.error("🔥 Error saving donation:", error);
        alert("❌ Failed to save donation. Please try again.");
    }
}
// ✅ Function to Get Book Details
function getBookDetails() {
    const books = [];
    document.querySelectorAll("#bookDetails .book-fieldset").forEach((book, index) => {
        const titleInput = book.querySelector(`input[id='bookTitle${index}']`);
        const authorInput = book.querySelector(`input[id='bookAuthor${index}']`);
        const descriptionInput = book.querySelector(`textarea[id='bookDescription${index}']`);

        if (titleInput && authorInput && descriptionInput) {
            books.push({
                title: titleInput.value.trim(),
                author: authorInput.value.trim(),
                description: descriptionInput.value.trim(),
            });
        }
    });
    return books;
}

// ✅ Attach Event Listener for Form Submission
document.getElementById("donorForm").addEventListener("submit", (event) => {
    event.preventDefault();
    submitDonation();
});

// Ensure All Donation Buttons Call `submitDonation()`
document.querySelectorAll(".donate-btn").forEach((button) => {
        button.addEventListener("click", submitDonation);
    });

//donate nav link 
const navDonate = document.getElementById('navDonate');
const mobileNavDonate = document.getElementById('mobileNavDonate');

function handleDonateClick(event) {
    event.preventDefault();
    const user = auth.currentUser;

    if (user) {
        window.location.href = 'donationmain.html'; // ✅ If logged in, go to donation page
    } else {
        sessionStorage.setItem("redirectAfterLogin", "donationmain.html"); // ✅ Store redirect for login
        window.location.href = 'login.html';
    }
}
// ✅ Add event listeners for both desktop & mobile Donate links
navDonate.addEventListener('click', handleDonateClick);
mobileNavDonate.addEventListener('click', handleDonateClick);

function redirectToConfirmation(donationType, message) {
    const donationMessage = JSON.stringify(donationDetails);
    window.location.href = `confirmation.html?type=${encodeURIComponent(donationType)}&details=${encodeURIComponent(donationMessage)}`;
}