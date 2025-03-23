import { auth } from "./firebaseConfig.js"; // Import Firebase authentication

document.addEventListener("DOMContentLoaded", () => {
    const navLogin = document.getElementById("navLogin");
    const navLogout = document.getElementById("navLogout");
    const mobileNavLogin = document.getElementById("mobileNavLogin");
    const mobileNavLogout = document.getElementById("mobileNavLogout");

    function updateUI(isLoggedIn) {
        if (isLoggedIn) {
            if (navLogin) navLogin.style.display = "none";
            if (navLogout) navLogout.style.display = "block";
            if (mobileNavLogin) mobileNavLogin.style.display = "none";
            if (mobileNavLogout) mobileNavLogout.style.display = "block";
        } else {
            if (navLogin) navLogin.style.display = "block";
            if (navLogout) navLogout.style.display = "none";
            if (mobileNavLogin) mobileNavLogin.style.display = "block";
            if (mobileNavLogout) mobileNavLogout.style.display = "none";
        }
    }

    // 🔹 Check sessionStorage first (instant UI update)
    if (sessionStorage.getItem("userLoggedIn") === "true") {
        updateUI(true);
    } else {
        updateUI(false);
    }

    // ✅ Listen to Firebase auth state change
    auth.onAuthStateChanged((user) => {
        if (user) {
            sessionStorage.setItem("userLoggedIn", "true"); // Store login state
            updateUI(true);
        } else {
            sessionStorage.removeItem("userLoggedIn"); // Remove login state
            updateUI(false);
        }
    });

    // ✅ Logout function
    window.logoutUser = () => {
        auth.signOut()
            .then(() => {
                sessionStorage.removeItem("userLoggedIn"); // Clear session
                updateUI(false); // Instantly update UI
                window.location.href = "index.html"; // Redirect
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    };
});
