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

function getPostData() {
  const user_ref = ref(db, 'post/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();

    let html = "";
    const table = document.querySelector('.innerz .row');

    // Reverse the keys to display posts in reverse order
    const keys = Object.keys(data).reverse();
    for (const key of keys) {
      const { title, post_content, imageURL, date, venue } = data[key];

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
                <p class="card__description">${post_content} <br><br> <b>Date:</b> ${date} <br> <b>Venue:</b> ${venue}</p>
              </a>
            </div>
          </div>
        </div>
      `;
    }
    table.innerHTML = html;
  }).catch((error) => {
    console.error("Error fetching data:", error);
  });
}

getPostData();



function GetAnnounData() {
  const user_ref = ref(db, 'announcement/');
  get(user_ref).then((snapshot) => {
      const data = snapshot.val();

      let html = "";
      const announElement = document.querySelector('#announ');
      
      // Convert data object to array and reverse it
      const dataArray = Object.entries(data).reverse();
      
      dataArray.forEach(([key, { title, color }]) => {
          const textColorClass = color === 'blinking' ? 'blinking' : ''; // Check if color is 'blinking'
          html += `
              <p class="t1 ${textColorClass}">${title}</p>
          `;
      });

      announElement.innerHTML = html;
  }).catch(error => {
      console.error("Error fetching data:", error);
  });
}

// Call the function to fetch and display the data
GetAnnounData();






function GetSponsorData() {
  const user_ref = ref(db, 'sponsors/');
  get(user_ref).then((snapshot) => {
      const data = snapshot.val();

      let html = "";
      const announElement = document.querySelector('#spon');
      for (const key in data) {
        const {  imageURL, category } = data[key];
          html += `
          <img class="${category}" src="${imageURL}" alt="">
          `;
      }

      announElement.innerHTML = html;
  }).catch(error => {
      console.error("Error fetching data:", error);
  });
}

// Call the function to fetch and display the data
GetSponsorData();