# DonateEase

### Connecting Donors with NGOs Effortlessly

DonateEase is a web platform that connects donors with NGOs and individuals in need. Users can donate money, books, clothes, and other essential items, track their past donations, and make payments seamlessly via QR code.

---

## 🚀 Features

### **Frontend**
- **User-Friendly Interface** – Simple and interactive donation process.
- **Dynamic Forms** – Forms adjust based on the selected donation type.
- **NGO Selection** – Donors can browse and choose NGOs before donating.
- **Donation History** – Users can view past donations.
- **Secure Authentication** – Firebase authentication ensures safe user logins.

### **Backend**
- **Firebase Firestore** – Stores user profiles, donation details, and NGO data.
- **Payment Processing** – QR code-based payments for monetary donations.
- **Image Upload (Cloudinary)** – Stores payment screenshots securely.
- **Authentication** – Firebase Authentication manages user sign-in/sign-up.

---

## 🔧 Tech Stack

### **Frontend**
- HTML, CSS, JavaScript
- Firebase Authentication

### **Backend & Database**
- Firebase Firestore (stores user & donation details)
- Cloudinary (stores payment screenshots)

### **External Services**
- Cloudinary – Stores payment proof images
- UPI Payment Gateway – Handles money donations

---

## 📂 Project Structure

```
DonateEase/
│── index.html           # Homepage
│── donate.html          # Donation Form Page
│── ngo.html             # NGO List Page
│── profile.html         # User Profile & History
│── login.css            # Styling for login page
│── ngo.css              # Styling for NGO list
│── donationmodule.js    # Handles form submissions & Cloudinary uploads
│── firebaseConfig.js    # Firebase Authentication & Firestore Configuration
│── firebase.json        # Firebase Hosting Configuration
│── README.md            # Project Documentation
```

---

## 🔧 Setup & Installation

### **1. Clone the Repository**
```sh
git clone https://github.com/your-username/DonateEase.git
cd DonateEase
```

### **2. Configure Firebase**
Update `firebaseConfig.js` with your Firebase project credentials:
```js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
```

### **3. Configure Cloudinary (For Payment Screenshots)**
Replace `CLOUDINARY_UPLOAD_URL` in `donationmodule.js`:
```js
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload";
```

### **4. Run Locally**
You can open `index.html` in a browser or use a local server:
```sh
npx live-server
```

---

## 📜 License
This project is licensed under the MIT License.

---

## 📞 Contact
For any queries, contact:
- 📧 Email: roshithakommana18@gmail.com
- 🔗 GitHub: [Roshitha-Kommana](https://github.com/Roshitha-Kommana)
