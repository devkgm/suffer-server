const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const firebaseConfig = require("./config");
const admin = initializeApp(firebaseConfig);
const adminAuth = getAuth(admin);
