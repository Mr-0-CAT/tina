import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClkiHJX3mR4SdQQ2jzuG-n7ZNzuYD2REE",
  authDomain: "dbms-d5864.firebaseapp.com",
  projectId: "dbms-d5864",
  storageBucket: "dbms-d5864.appspot.com",
  messagingSenderId: "478043315963",
  appId: "1:478043315963:web:02a9cd2c70c4755bce5a5e",
  measurementId: "G-W7EKCZXJ0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to get URL parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get the postId from the URL
const postId = getQueryParam('id');
console.log("postId:", postId); // Debugging statement

// Check if postId exists
if (postId) {
  console.log("postId exists. Fetching post details..."); // Debugging statement
  getPostDetails(postId);
} else {
  console.error("No post ID found in URL."); // Error message
}

// Fetch post data based on ID in URL
function getPostDetails(postId) {
  console.log("Fetching post details for postId:", postId); // Debugging statement
  const post_ref = ref(db, `post/${postId}`);
  get(post_ref).then((snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log("Post data:", data);
      document.getElementById('poster').src = data.imageURL;
      document.getElementById('title').textContent = data.title;
      document.getElementById('long_description').textContent = data.post2_content;
      document.getElementById('date').textContent = data.date;
      document.getElementById('venue').textContent = data.venue;
      document.getElementById('prerequisites').textContent = data.prerequists;
      document.getElementById('fee').textContent = data.fee;
      document.getElementById('time').textContent = data.time;
      document.getElementById('cName').textContent = data.cName;
      document.getElementById('department').textContent = data.Department;
      document.getElementById('outcome').textContent = data.outcome;
      document.getElementById('number1').textContent = data.number1;
      document.getElementById('number2').textContent = data.number2;
      document.getElementById('link1').href = data.link1;
      document.getElementById('link2').href = data.link2;
    } else {
      console.error("No data found for the given post ID.");
    }
  }).catch((error) => {
    console.error("Error fetching post data:", error);
  });
}

