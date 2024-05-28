// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase, set, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject  } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

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
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const my_blog = document.querySelector('.my_blog');
const login_page = document.querySelector('.login');
const notify = document.querySelector('.notify');
const add_post_btn = document.querySelector('#post_btn');
const update_btn = document.querySelector('.update_btn');

onAuthStateChanged(auth, (user) => {
  if (user) {
    my_blog.classList.add('show');
    login_page.classList.add('hide');
  } else {
    my_blog.classList.remove('show');
    login_page.classList.remove('hide');
  }
});

function SignInUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
    console.log(userCredentials.user.uid);
  }).catch((error) => {
    console.error("Sign in error: ", error);
  });
}

const sign_btn = document.querySelector('#sign_in');
sign_btn.addEventListener('click', SignInUser);

const sign_out_btn = document.querySelector('#logout');
sign_out_btn.addEventListener('click', () => {
  signOut(auth).then(() => {
    notify.innerHTML = "Signed out successfully";
    setTimeout(() => {
      location.reload();
    }, 2000);
  }).catch((error) => {
    console.log("Sign out error: ", error);
  });
});

function Add_Post() {
  const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;
  const post2_content = document.querySelector('#post2_content').value;
  const post_image = document.querySelector('#post_image').files[0];
  const date = document.querySelector('#date').value;
  const venu = document.querySelector('#venu').value;
  const prerequists = document.querySelector('#prerequists').value;
  const fee = document.querySelector('#fee').value;
  const time = document.querySelector('#time').value;
  const cName = document.querySelector('#cName').value;
  const outcome = document.querySelector('#outcome').value;
  const number1 = document.querySelector('#number1').value;
  const number2 = document.querySelector('#number2').value;
  const link1 = document.querySelector('#link1').value;
  const link2 = document.querySelector('#link2').value;






  if (!post_image) {
    alert("Please select an image");
    return;
  }

  const id = Math.floor(Math.random() * 100);
  const imageRef = storageRef(storage, `images/${id}-${post_image.name}`);

  uploadBytes(imageRef, post_image).then((snapshot) => {
    return getDownloadURL(snapshot.ref);
  }).then((downloadURL) => {
    return set(ref(db, 'post/' + id), {
      title: title,
      post_content: post_content,
      post2_content: post2_content,
      
      imageURL: downloadURL, // Save the image URL in the database
      date: date,
      venu: venu,
      prerequists: prerequists,
      fee: fee,
      time: time,
      cName: cName,
      outcome: outcome,
      number1: number1,
      number2: number2,
      link1: link1,
      link2: link2
    });
  }).then(() => {
    notify.innerHTML = "Data Added";
    clearFields();
    GetPostData();
  }).catch((error) => {
    console.error("Error uploading file: ", error);
    notify.innerHTML = "Error adding data";
  });
}

add_post_btn.addEventListener('click', Add_Post);

function clearFields() {
  document.querySelector('#title').value = "";
  document.querySelector('#post_content').value = "";
  document.querySelector('#post2_content').value = "";
  document.querySelector('#post_image').value = "";
  document.querySelector('#date').value = "";
  document.querySelector('#venu').value = "";
  document.querySelector('#prerequists').value = "";
  document.querySelector('#fee').value = "";
  document.querySelector('#time').value = "";
  document.querySelector('#cName').value = "";
  document.querySelector('#outcome').value = "";
  document.querySelector('#number1').value = "";
  document.querySelector('#number2').value = "";
  document.querySelector('#link1').value = "";
  document.querySelector('#link2').value = "";
}

function GetPostData() {
  const user_ref = ref(db, 'post/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();
    let html = "";
    const table = document.querySelector('table');
    for (const key in data) {
      const { title, post_content, post2_content, imageURL } = data[key];
      html += `
        <tr>
          <td><span class="postNumber"></span></td>
          <td><img src="${imageURL}" alt="Post Image" style="width:100px;height:100px;"></td>
          <td> <b>  ${title} </b> </td>
          <td><button class="delete" onclick="delete_data(${key})">Delete</button></td>
          <td><button class="update" onclick="update_data(${key})">Update</button></td>
        </tr>
      `;
    }
    table.innerHTML = html;
  });
}

GetPostData();

window.delete_data = function (key) {
   const user_ref = ref(db, `post/${key}`);
   
   get(user_ref).then((snapshot) => {
     const data = snapshot.val();
     const imageURL = data.imageURL;
 
     // Delete the post from the database
     remove(user_ref).then(() => {
       // Delete the image from storage
       const imageRef = storageRef(storage, imageURL);
       return deleteObject(imageRef);
     }).then(() => {
       // Notify and reload the page
       notify.innerHTML = "Post and associated image deleted successfully";
       setTimeout(() => {
         location.reload();
       }, 2000);
     }).catch((error) => {
       console.error("Error deleting data: ", error);
       notify.innerHTML = "Error deleting post";
     });
   });
 }
 

window.update_data = function (key) {
   const user_ref = ref(db, `post/${key}`);
 
   get(user_ref).then((item) => {
     const data = item.val();
     document.querySelector('#title').value = data.title;
     document.querySelector('#post_content').value = data.post_content;
     document.querySelector('#post2_content').value = data.post2_content;
     document.querySelector('#date').value = data.date;
     document.querySelector('#venu').value = data.venu;
     document.querySelector('#prerequists').value = data.prerequists;
     document.querySelector('#fee').value = data.fee;
     document.querySelector('#time').value = data.time;
     document.querySelector('#cName').value = data.cName;
     document.querySelector('#outcome').value = data.outcome;
     document.querySelector('#number1').value = data.number1;
     document.querySelector('#number2').value = data.number2;
     document.querySelector('#link1').value = data.link1;
     document.querySelector('#link2').value = data.link2;

     
     update_btn.style.display = 'block';  // Show the update button
     add_post_btn.style.display = 'none'; // Hide the add post button
 
     update_btn.addEventListener('click', function Update_Form() {
      const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;
  const post2_content = document.querySelector('#post2_content').value;
  const post_image = document.querySelector('#post_image').files[0];
  const date = document.querySelector('#date').value;
  const venu = document.querySelector('#venu').value;
  const prerequists = document.querySelector('#prerequists').value;
  const fee = document.querySelector('#fee').value;
  const time = document.querySelector('#time').value;
  const cName = document.querySelector('#cName').value;
  const outcome = document.querySelector('#outcome').value;
  const number1 = document.querySelector('#number1').value;
  const number2 = document.querySelector('#number2').value;
  const link1 = document.querySelector('#link1').value;
  const link2 = document.querySelector('#link2').value;
       
       if (post_image) {
         const oldImageRef = storageRef(storage, data.imageURL);
         
         // Delete the old image first
         deleteObject(oldImageRef).then(() => {
           const newImageRef = storageRef(storage, `images/${key}-${post_image.name}`);
 
           // Upload the new image
           return uploadBytes(newImageRef, post_image).then((snapshot) => {
             return getDownloadURL(snapshot.ref);
           }).then((downloadURL) => {
             // Update the post with the new image URL
             return update(ref(db, `post/${key}`), {
              title: title,
              post_content: post_content,
              post2_content: post2_content,
              
              imageURL: downloadURL, // Save the image URL in the database
              date: date,
              venu: venu,
              prerequists: prerequists,
              fee: fee,
              time: time,
              cName: cName,
              outcome: outcome,
              number1: number1,
              number2: number2,
              link1: link1,
              link2: link2
             });
           }).then(() => {
             notify.innerHTML = "Post updated successfully";
             clearFields();
             GetPostData();
           }).catch((error) => {
             console.error("Error uploading file: ", error);
             notify.innerHTML = "Error updating post";
           });
         }).catch((error) => {
           console.error("Error deleting old image: ", error);
           notify.innerHTML = "Error deleting old image";
         });
       } else {
         update(ref(db, `post/${key}`), {
          title: title,
          post_content: post_content,
          post2_content: post2_content,
          
          imageURL: downloadURL, // Save the image URL in the database
          date: date,
          venu: venu,
          prerequists: prerequists,
          fee: fee,
          time: time,
          cName: cName,
          outcome: outcome,
          number1: number1,
          number2: number2,
          link1: link1,
          link2: link2
          
         }).then(() => {
           notify.innerHTML = "Post updated successfully";
           clearFields();
           GetPostData();
         }).catch((error) => {
           console.error("Error updating post: ", error);
           notify.innerHTML = "Error updating post";
         });
       }
 
       update_btn.style.display = 'none';  // Hide the update button
       add_post_btn.style.display = 'block'; // Show the add post button
     }, { once: true });
   });
 }
 
