const express = require('express');
const app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get } = require("firebase/database");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClkiHJX3mR4SdQQ2jzuG-n7ZNzuYD2REE",
  authDomain: "dbms-d5864.firebaseapp.com",
  projectId: "dbms-d5864",
  storageBucket: "dbms-d5864.appspot.com",
  messagingSenderId: "478043315963",
  appId: "1:478043315963:web:02a9cd2c70c4755bce5a5e",
  measurementId: "G-W7EKCZXJ0J"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Configure Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/event/:id', (req, res) => {
  const postId = req.params.id;
  const postRef = ref(db, `post/${postId}`);

  get(postRef).then((snapshot) => {
    const postData = snapshot.val();
    if (postData) {
      res.render('event.njk', postData);
    } else {
      res.status(404).send('Event not found');
    }
  }).catch((error) => {
    console.error("Error fetching event:", error);
    res.status(500).send('Internal Server Error');
  });
});

// Define other routes as needed...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
