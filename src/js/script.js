// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase, set, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

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

function SignInUser(event) {
  event.preventDefault();  // Prevent default form submission
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      console.log(userCredentials.user.uid);
    })
    .catch((error) => {
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

// Modify Add_Post function to include selected category
function Add_Post() {
  const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;
  const post2_content = document.querySelector('#post2_content').value;
  const post_image = document.querySelector('#post_image').files[0];
  const date = document.querySelector('#date').value;
  const venue = document.querySelector('#venue').value;
  const prerequists = document.querySelector('#prerequists').value;
  const fee = document.querySelector('#fee').value;
  const time = document.querySelector('#time').value;
  const cName = document.querySelector('#cName').value;
  const outcome = document.querySelector('#outcome').value;
  const number1 = document.querySelector('#number1').value;
  const number2 = document.querySelector('#number2').value;
  const link1 = document.querySelector('#link1').value;
  const link2 = document.querySelector('#link2').value;
  const category = document.querySelector('#category').value; // Get selected category from dropdown

  if (!post_image) {
    alert("Please select an image");
    return;
  }

  const id = Date.now();
  const imageRef = storageRef(storage, `images/${id}-${post_image.name}`);

  uploadBytes(imageRef, post_image).then((snapshot) => {
    return getDownloadURL(snapshot.ref);
  }).then((downloadURL) => {
    return set(ref(db, 'post/' + id), {
      title: title,
      post_content: post_content,
      post2_content: post2_content,
      imageURL: downloadURL,
      date: date,
      venue: venue,
      prerequists: prerequists,
      fee: fee,
      time: time,
      cName: cName,
      outcome: outcome,
      number1: number1,
      number2: number2,
      link1: link1,
      link2: link2,
      category: category // Include selected category in the post data
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
  document.querySelector('#venue').value = "";
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
      <td class="separator"> <!-- Apply the separator class here -->
       <div><b>${title}</b></div> 
       <img src="${imageURL}" alt="Post Image" style="width:100px;height:100px;">
        
      </td>
      <td class="separator"><button class="delete" onclick="delete_data(${key})">Delete</button></td>
      <td class="separator"><button class="update" onclick="update_data(${key})">Update</button></td>
      <td class="separator"><a href="../events/index.html?id=${key}" class="details">View Details</a></td>
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
    document.querySelector('#venue').value = data.venue;
    document.querySelector('#prerequists').value = data.prerequists;
    document.querySelector('#fee').value = data.fee;
    document.querySelector('#time').value = data.time;
    document.querySelector('#cName').value = data.cName;
    document.querySelector('#outcome').value = data.outcome;
    document.querySelector('#number1').value = data.number1;
    document.querySelector('#number2').value = data.number2;
    document.querySelector('#link1').value = data.link1;
    document.querySelector('#link2').value = data.link2;
    document.querySelector('#category').value = data.category; // Populate category field

    update_btn.style.display = 'block';  // Show the update button
    add_post_btn.style.display = 'none'; // Hide the add post button

    update_btn.addEventListener('click', function Update_Form() {
      const title = document.querySelector('#title').value;
      const post_content = document.querySelector('#post_content').value;
      const post2_content = document.querySelector('#post2_content').value;
      const post_image = document.querySelector('#post_image').files[0];
      const date = document.querySelector('#date').value;
      const venue = document.querySelector('#venue').value;
      const prerequists = document.querySelector('#prerequists').value;
      const fee = document.querySelector('#fee').value;
      const time = document.querySelector('#time').value;
      const cName = document.querySelector('#cName').value;
      const outcome = document.querySelector('#outcome').value;
      const number1 = document.querySelector('#number1').value;
      const number2 = document.querySelector('#number2').value;
      const link1 = document.querySelector('#link1').value;
      const link2 = document.querySelector('#link2').value;
      const category = document.querySelector('#category').value; // Get selected category from dropdown

      if (post_image) {
        const oldImageRef = storageRef(storage, data.imageURL);

        // Delete the old image first
        deleteObject(oldImageRef).then(() => {
          const newImageRef = storageRef(storage, `images/${key}-${post_image.name}`);

          // Upload the new image
          return uploadBytes(newImageRef, post_image).then((snapshot) => {
            return getDownloadURL(snapshot.ref);
          }).then((downloadURL) => {
            // Update the post with the new image URL and category
            return update(ref(db, `post/${key}`), {
              title: title,
              post_content: post_content,
              post2_content: post2_content,
              imageURL: downloadURL,
              date: date,
              venue: venue,
              prerequists: prerequists,
              fee: fee,
              time: time,
              cName: cName,
              outcome: outcome,
              number1: number1,
              number2: number2,
              link1: link1,
              link2: link2,
              category: category // Include selected category in the post data
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
          date: date,
          venue: venue,
          prerequists: prerequists,
          fee: fee,
          time: time,
          cName: cName,
          outcome: outcome,
          number1: number1,
          number2: number2,
          link1: link1,
          link2: link2,
          category: category // Include selected category in the post data
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







// -------------------------------------------
const add_post_Btn1 = document.querySelector('#post_btn1');
const update_btn1 = document.querySelector('#update_btn1');
let updateKey = null; // Initialize updateKey

function Add_Announcement() {
  const title = document.querySelector('#title2').value;
  const color = document.querySelector('#colorPicker').value; // Get the selected color
  const id = Date.now(); // Use Date.now() for unique identifier

  set(ref(db, 'announcement/' + id), {
    title: title,
    color: color // Save the color in Firebase
  }).then(() => {
    notify.innerHTML = "Data Added";
    document.querySelector('#title2').value = "";
    GetAnnounData();
  }).catch(error => {
    console.error("Error adding document: ", error);
    notify.innerHTML = "Error adding data";
  });
}
add_post_Btn1.addEventListener('click', Add_Announcement);

// Get Data from Firebase Db
function GetAnnounData() {
  const user_ref = ref(db, 'announcement/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();

    let html = "";
    const table = document.querySelector('#announcement_table');
    for (const key in data) {
      const { title, color } = data[key];
      let textColorClass = '';
      switch (color) {
        case 'white':
          textColorClass = 'white';
          break;
        case 'green':
          textColorClass = 'green';
          break;
        case 'red':
          textColorClass = 'red';
          break;
        case 'blinking':
            textColorClass = 'blinking';
            break;
        default:
          textColorClass = ''; // or default color class
          break;
      }

      html += `
        <tr>
          <td><span class="postNumber"></span></td>
          <td class="${textColorClass}">${title}</td>
          <td><button class="delete" onclick="delete_data1('${key}')">Delete</button></td>
          <td><button class="update" onclick="updateAnnouncement('${key}')">Update</button></td>
        </tr>
      `;
    }

    table.innerHTML = html;
  }).catch(error => {
    console.error("Error getting documents: ", error);
  });
}

// delete_data
window.delete_data1 = function (key) {
  remove(ref(db, `announcement/${key}`)).then(() => {
    notify.innerHTML = "Data Deleted";
    GetAnnounData();
  }).catch(error => {
    console.error("Error deleting document: ", error);
    notify.innerHTML = "Error deleting data";
  });
};

// get and update data
window.updateAnnouncement = function (key) {
  const user_ref = ref(db, `announcement/${key}`);
  get(user_ref).then((item) => {
    const { title, color } = item.val();
    document.querySelector('#title2').value = title;
    const colorPicker = document.querySelector('#colorPicker');
    colorPicker.value = color; // Set color picker value
    updateKey = key;

    update_btn1.style.display = "block";
    add_post_Btn1.style.display = "none";

    // Log color value just before updating database
    console.log("Color before update:", color);
  }).catch(error => {
    console.error("Error getting document: ", error);
  });
};

update_btn1.addEventListener('click', function () {
  const title = document.querySelector('#title2').value;
  const color = document.querySelector('#colorPicker').value; // Get selected color
  if (updateKey) {
    console.log("Color before update:", color); // Log color value before updating
    update(ref(db, `announcement/${updateKey}`), {
      title: title,
      color: color // Update color value
    }).then(() => {
      notify.innerHTML = "Data Updated";
      document.querySelector('#title2').value = "";
      updateKey = null;
      update_btn1.style.display = "none";
      add_post_Btn1.style.display = "block";
      GetAnnounData();
    }).catch(error => {
      console.error("Error updating document: ", error);
      notify.innerHTML = "Error updating data";
    });
  }
});

// Initial data load
GetAnnounData();

 

// ---------------------------------------------------------------
// Function to add a new timeline post
// Function to add a new timeline post
function AddTime() {
  const title = document.querySelector('#title3').value;
  const post_image2 = document.querySelector('#post_image2').files[0];
  const category2 = document.querySelector('#category2').value;

  if (!post_image2) {
    alert("Please select an image");
    return;
  }

  const id = Date.now();
  const imageRef2 = storageRef(storage, `timeline/${id}-${post_image2.name}`);

  uploadBytes(imageRef2, post_image2).then((snapshot) => {
    return getDownloadURL(snapshot.ref);
  }).then((downloadURL) => {
    return set(ref(db, 'timeline/' + id), {
      title: title,
      imageURL: downloadURL,
      category: category2
    });
  }).then(() => {
    notify.innerHTML = "Data Added";
    clearFieldsTimeline();
    GetTimeData();
  }).catch((error) => {
    console.error("Error uploading file: ", error);
    notify.innerHTML = "Error adding data";
  });
}

document.querySelector('#post_btn3').addEventListener('click', AddTime);

function clearFieldsTimeline() {
  document.querySelector('#title3').value = "";
  document.querySelector('#post_image2').value = "";
  document.querySelector('#category2').value = "";
}

function GetTimeData() {
  const user_ref = ref(db, 'timeline/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();
    let html = "";
    const table = document.querySelector('#timeline');

    for (const key in data) {
      const { title, imageURL, category } = data[key];

      html += `
        <tr>
          <td><span class="postNumber"></span></td>
          <td class="separator">
            <div><b>${title}</b></div>
            <img src="${imageURL}" alt="Post Image" class="${category}" style="width:100px;height:100px;">
          </td>
          <td class="separator"><button class="delete" onclick="deleteTimeData('${key}')">Delete</button></td>
          <td class="separator"><button class="update" onclick="updateTimeData('${key}')">Update</button></td>
          <td class="separator"><a href="../events/index.html?id=${key}" class="details">View Details</a></td>
        </tr>
      `;
    }
    table.innerHTML = html;
  });
}

GetTimeData();

window.deleteTimeData = function (key) {
  const user_ref = ref(db, `timeline/${key}`);

  get(user_ref).then((snapshot) => {
    const data = snapshot.val();
    if (!data) {
      notify.innerHTML = "Post not found";
      return;
    }

    const imageURL = data.imageURL;
    const fileName = imageURL.split('%2F').pop().split('?')[0]; // Extract file name from URL
    const imageRef = storageRef(storage, `timeline/${fileName}`);

    // Remove post from database
    remove(user_ref).then(() => {
      // Delete image from storage
      return deleteObject(imageRef);
    }).then(() => {
      notify.innerHTML = "Post and associated image deleted successfully";
      GetTimeData();
    }).catch((error) => {
      console.error("Error deleting data: ", error);
      notify.innerHTML = "Error deleting post";
    });
  });
}

window.updateTimeData = function (key) {
  const user_ref = ref(db, `timeline/${key}`);

  get(user_ref).then((item) => {
    const data = item.val();
    if (!data) {
      notify.innerHTML = "Post not found";
      return;
    }

    document.querySelector('#title3').value = data.title;
    document.querySelector('#category2').value = data.category;

    // Display update button and hide add button
    document.querySelector('#update_btn3').style.display = 'block';
    document.querySelector('#post_btn3').style.display = 'none';

    // Bind update functionality
    document.querySelector('#update_btn3').onclick = function() {
      updatePostData(key, data.imageURL);
    };
  });
}

function updatePostData(key, oldImageURL) {
  const title = document.querySelector('#title3').value;
  const post_image2 = document.querySelector('#post_image2').files[0];
  const category2 = document.querySelector('#category2').value;

  if (post_image2) {
    const fileName = oldImageURL.split('%2F').pop().split('?')[0];
    const oldImageRef2 = storageRef(storage, `timeline/${fileName}`);
    
    deleteObject(oldImageRef2).then(() => {
      const newImageRef2 = storageRef(storage, `timeline/${key}-${post_image2.name}`);

      return uploadBytes(newImageRef2, post_image2).then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      }).then((downloadURL) => {
        return update(ref(db, `timeline/${key}`), {
          title: title,
          imageURL: downloadURL,
          category: category2
        });
      }).then(() => {
        notify.innerHTML = "Post updated successfully";
        clearFieldsTimeline();
        GetTimeData();
      }).catch((error) => {
        console.error("Error uploading file: ", error);
        notify.innerHTML = "Error updating post";
      });
    }).catch((error) => {
      console.error("Error deleting old image: ", error);
      notify.innerHTML = "Error deleting old image";
    });
  } else {
    update(ref(db, `timeline/${key}`), {
      title: title,
      category: category2
    }).then(() => {
      notify.innerHTML = "Post updated successfully";
      clearFieldsTimeline();
      GetTimeData();
    }).catch((error) => {
      console.error("Error updating post: ", error);
      notify.innerHTML = "Error updating post";
    });
  }

  document.querySelector('#update_btn3').style.display = 'none';
  document.querySelector('#post_btn3').style.display = 'block';
}





// -------------------------------------------------------------------
// Function to add sponsor data
function AddSponsor() {
  const title = document.querySelector('#title4').value;
  const post_image3 = document.querySelector('#post_image3').files[0];
  const category3 = document.querySelector('#category3').value;

  if (!post_image3) {
    alert("Please select an image");
    return;
  }

  const id = Math.floor(Math.random() * 100);
  const imageRef3 = storageRef(storage, `sponsors/${id}-${post_image3.name}`);

  uploadBytes(imageRef3, post_image3).then((snapshot) => {
    return getDownloadURL(snapshot.ref);
  }).then((downloadURL) => {
    return set(ref(db, 'sponsors/' + id), {
      title: title,
      imageURL: downloadURL,
      category: category3
    });
  }).then(() => {
    notify.innerHTML = "Data Added";
    clearFieldsSponsors();
    GetSponsorData();
  }).catch((error) => {
    console.error("Error uploading file: ", error);
    notify.innerHTML = "Error adding data";
  });
}

// Function to clear sponsor input fields
function clearFieldsSponsors() {
  document.querySelector('#title4').value = "";
  document.querySelector('#post_image3').value = "";
  document.querySelector('#category3').value = ""; 
}

// Function to retrieve sponsor data
function GetSponsorData() {
  const user_ref = ref(db, 'sponsors/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();
    let html = "";
    const table = document.querySelector('#Sponsors');

    for (const key in data) {
      const { title, imageURL, category } = data[key];

      html += `
        <tr>
          <td><span class="postNumber"></span></td>
          <td class="separator">
            <div><b>${title}</b></div>
            <img src="${imageURL}" alt="Post Image" class="${category}" style="width:100px;height:100px;">
          </td>
          <td class="separator"><button class="delete" onclick="deleteSponsorData(${key})">Delete</button></td>
          <td class="separator"><button class="update" onclick="updateSponsorData(${key})">Update</button></td>
          <td class="separator"><a href="../events/index.html?id=${key}" class="details">View Details</a></td>
        </tr>
      `;
    }
    table.innerHTML = html;
  });
}

// Function to delete sponsor data
window.deleteSponsorData = function (key) {
  const user_ref = ref(db, `sponsors/${key}`);

  get(user_ref).then((snapshot) => {
    const data = snapshot.val();
    const imageURL = data.imageURL;

    remove(user_ref).then(() => {
      const imageRef = storageRef(storage, imageURL);
      return deleteObject(imageRef);
    }).then(() => {
      notify.innerHTML = "Post and associated image deleted successfully";
    
    }).catch((error) => {
      console.error("Error deleting data: ", error);
      notify.innerHTML = "Error deleting post";
    });
  });
}

// Function to update sponsor data
window.updateSponsorData = function (key) {
  const user_ref = ref(db, `sponsors/${key}`);

  get(user_ref).then((item) => {
    const data = item.val();
    document.querySelector('#title4').value = data.title;
    document.querySelector('#category3').value = data.category;

    document.querySelector('#update_btn4').style.display = 'block';
    document.querySelector('#post_btn4').style.display = 'none';

    document.querySelector('#update_btn4').addEventListener('click', function UpdateSponsorForm() {
      const title = document.querySelector('#title4').value;
      const post_image3 = document.querySelector('#post_image3').files[0];
      const category3 = document.querySelector('#category3').value;

      if (post_image3) {
        const oldImageRef3 = storageRef(storage, data.imageURL);

        deleteObject(oldImageRef3).then(() => {
          const newImageRef3 = storageRef(storage, `sponsors/${key}-${post_image3.name}`);

          return uploadBytes(newImageRef3, post_image3).then((snapshot) => {
            return getDownloadURL(snapshot.ref);
          }).then((downloadURL) => {
            return update(ref(db, `sponsors/${key}`), {
              title: title,
              imageURL: downloadURL,
              category: category3
            });
          }).then(() => {
            notify.innerHTML = "Post updated successfully";
            clearFieldsSponsors();
            GetSponsorData();
          }).catch((error) => {
            console.error("Error uploading file: ", error);
            notify.innerHTML = "Error updating post";
          });
        }).catch((error) => {
          console.error("Error deleting old image: ", error);
          notify.innerHTML = "Error deleting old image";
        });
      } else {
        update(ref(db, `sponsors/${key}`), {
          title: title,
          category: category3
        }).then(() => {
          notify.innerHTML = "Post updated successfully";
          clearFieldsSponsors();
          GetSponsorData();
        }).catch((error) => {
          console.error("Error updating post: ", error);
          notify.innerHTML = "Error updating post";
        });
      }

      document.querySelector('#update_btn4').style.display = 'none';
      document.querySelector('#post_btn4').style.display = 'block';
    }, { once: true });
  });
}

// Bind add sponsor function to the button
document.querySelector('#post_btn4').addEventListener('click', AddSponsor);

// Populate sponsor data initially
GetSponsorData();




