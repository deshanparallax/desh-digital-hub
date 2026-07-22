import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Keys for the external expense-tracker-f0560 project
const expenseTrackerConfig = {
  apiKey: "AIzaSyCWYrkA4DzdQoOcbZyi1UP-x0imyQafmiM",
  authDomain: "expense-tracker-f0560.firebaseapp.com",
  projectId: "expense-tracker-f0560",
  storageBucket: "expense-tracker-f0560.firebasestorage.app",
  messagingSenderId: "1015482084016",
  appId: "1:1015482084016:web:40f6273eca16596b1ae975",
  measurementId: "G-BM5TM1T5N1"
};

// Initialize secondary app
const expenseApp = initializeApp(expenseTrackerConfig, "ExpenseTrackerApp");
const expenseDb = getFirestore(expenseApp);

export const syncSaleToExpenseTracker = async (saleAmount, description = "POS Sale") => {
  try {
    await addDoc(collection(expenseDb, "transactions"), {
      type: "Income",
      category: "Business",
      subcategory: "POS Sync",
      amount: parseFloat(saleAmount),
      description: description,
      date: new Date().toISOString(),
      isTracked: true
    });
    console.log("Successfully synced sale to Expense Tracker!");
  } catch (error) {
    console.error("Failed to sync to Expense Tracker: ", error);
  }
};
