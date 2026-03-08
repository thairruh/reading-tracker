import { initializeApp, getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Work around Firebase TS typing bug for React Native persistence
const {
    initializeAuth,
    getReactNativePersistence,
} = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyDOBEouVE2e4h6f5sL1kN-4Wg943e9O4bs",
    authDomain: "reading-tracker-ead2b.firebaseapp.com",
    projectId: "reading-tracker-ead2b",
    storageBucket: "reading-tracker-ead2b.firebasestorage.app",
    messagingSenderId: "382447219386",
    appId: "1:382447219386:web:30b6c3de2b41f8dad9c883",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = (() => {
    try {
        return initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
        });
    } catch {
        return getAuth(app);
    }
})();

const db = getFirestore(app);

export { app, auth, db };