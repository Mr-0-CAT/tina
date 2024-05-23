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
    const table = document.querySelector('.main');
    for (const key in data) {
      const { title, post_content, imageURL, date, venu } = data[key];

      html += `
        <div class="col">
          <div class="card1">
            <img class="img" src="${imageURL}" alt="${title}">
            <div class="card__content">
              <a class="eve1" href="/posts/${key}">
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
    table.innerHTML = html;
  });
}

getPostData();
