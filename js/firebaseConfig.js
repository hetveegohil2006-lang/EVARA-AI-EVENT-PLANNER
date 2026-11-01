// EVARA Private Concierge — Firebase Configuration & Initialization
// Initializes Firebase App, Auth, and Firestore instances.

const firebaseConfig = {
  apiKey: "AIzaSyCy4up0-htWmLQLmulYMDgqNEVb0Jc_soQ",
  authDomain: "my-evara-project.firebaseapp.com",
  projectId: "my-evara-project",
  storageBucket: "my-evara-project.firebasestorage.app",
  messagingSenderId: "495611783938",
  appId: "1:495611783938:web:33d1cea8b320b48e0cb01b",
  measurementId: "G-EGZENGPFQ9"
};

let app = null;
let auth = null;
let db = null;

if (typeof firebase !== 'undefined') {
  if (!firebase.apps || !firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
  auth = firebase.auth();
  db = firebase.firestore();

  // Try enabling offline persistence for seamless local operation
  try {
    db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not supported in this browser');
      }
    });
  } catch (e) {
    // Persistence may already be active or unsupported
  }
} else {
  console.warn('Firebase SDK compat scripts not loaded yet. Waiting for initialization.');
}

window.firebaseConfig = firebaseConfig;
window.firebaseApp = app;
window.auth = auth;
window.db = db;
