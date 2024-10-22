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

// Function to retrieve timeline posts
function GetTimeData() {
  const user_ref = ref(db, 'timeline/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();
    let html = "";
    const table = document.querySelector('.gallery');

    // Convert data object to an array and reverse it
    const dataArray = Object.entries(data).reverse();

    dataArray.forEach(([key, { title, imageURL1, imageURL2, imageURL3, category }]) => {
      html += `
       <div class="first" style="border-bottom: 2px solid #000;border-top: 2px solid #000;">
        
          <h1><i>${title}</i></h1>
  
  <div class="row">
  
  <div class="col-md-4"><img class="${category}" src="${imageURL1}" alt=""></div>
  <div class="col-md-4"><img class="${category}" src="${imageURL2}" alt=""></div>
  <div class="col-md-4"><img class="${category}" src="${imageURL3}" alt=""></div>

  
  </div>
  
      </div>
      `;
    });

    table.innerHTML = html;
  }).catch(error => {
    console.error("Error fetching data:", error);
  });
}

// Call the function to fetch and display the data
GetTimeData();
