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
    const table = document.querySelector('.innerz .row');

    for (const key in data) {
      const { title, imageURL, category } = data[key];

      html += `

      <div class="col" >   
  
    <div class="card1">
      <div class="image"><img class="${category}" src="${imageURL}" alt=""></div>
       <div class="content">
           <span class="title1">
           ${title}
           </span>
         
     
         <p class="desc">
         </p>
     
       
       </div>
     </div>
  
  
      
      
      </div>
    
      `;
    }
    table.innerHTML = html;
  });
}

GetTimeData();