// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3hXNcnFRFg1nKNb1bee-FSshKzHONqz4",
  authDomain: "riziq-international.firebaseapp.com",
  projectId: "riziq-international",
  storageBucket: "riziq-international.appspot.com",
  messagingSenderId: "986369618056",
  appId: "1:986369618056:web:6fca68c0003469d41c6f3d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services (GLOBAL)
const auth = firebase.auth();
const db = firebase.firestore();
