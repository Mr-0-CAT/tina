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

// Define the category filter
const categoryFilter = "Technical";

// Function to retrieve posts based on category filter
function getPostData(categoryFilter) {
  const user_ref = ref(db, 'post/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();

    let html = "";
    const table = document.querySelector('.innerz .row');
    for (const key in data) {
      const { title, post_content, imageURL, date, venu, category } = data[key];

      // Check if the category matches the filter
      if (category === categoryFilter) {
        // Dynamically generate the URL for the current post
        const postURL = `events/index.html?id=${key}`;

        html += `
          <div class="col">
            <div class="card1">
              <img class="img" src="${imageURL}" alt="${title}">
              <div class="card__content">
                <!-- Set the href attribute to the dynamically generated URL -->
                <a class="eve1" href="${postURL}">
                  <p class="card__title" style="background: -webkit-linear-gradient(rgb(188, 12, 241), rgb(212, 4, 4));
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;">${title}</p>
                  <p class="card__description">${post_content} <br><br> <b>Date:</b> ${date} <br> <b>Venue:</b> ${venu}</p>
                </a>
              </div>
            </div>
          </div>
        `;
      }
    }
    table.innerHTML = html;
  }).catch((error) => {
    console.error("Error fetching data:", error);
  });
}

// Call the function with the category filter
getPostData(categoryFilter);


function GetAnnounData() {
  const user_ref = ref(db, 'announcement/');
  get(user_ref).then((snapshot) => {
      const data = snapshot.val();

      let html = "";
      const announElement = document.querySelector('#announ');
      for (const key in data) {
          const { title, color } = data[key];
          html += `
              <p class="t1" style="color: ${color};">${title}</p>
          `;
      }

      announElement.innerHTML = html;
  }).catch(error => {
      console.error("Error fetching data:", error);
  });
}

// Call the function to fetch and display the data
GetAnnounData();
