// --- FIREBASE CONFIG ---
// Replace these values with your Firebase project info
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let cards = [];
let current = 0;
let cramMode = false;

// Load flashcards from Firebase
db.collection("flashcards").get().then(snapshot => {
  snapshot.forEach(doc => cards.push({id: doc.id, ...doc.data()}));
  if (cards.length > 0) showCard(0);
});

// --- FUNCTIONS ---
function showCard(index) {
  current = index;
  document.getElementById("question").innerText = cards[current].question;
  document.getElementById("answer").innerText = cards[current].answer;
  document.getElementById("answer").style.display = "none";
}

function showAnswer() {
  document.getElementById("answer").style.display = "block";
}

function nextCard() {
  if (cards.length === 0) return;
  if (cramMode) {
    // pick random card
    current = Math.floor(Math.random() * cards.length);
  } else {
    current++;
    if (current >= cards.length) current = 0;
  }
  showCard(current);
}

function addCardPrompt() {
  const q = prompt("Enter question:");
  const a = prompt("Enter answer:");
  if (q && a) {
    db.collection("flashcards").add({question: q, answer: a}).then(docRef => {
      cards.push({id: docRef.id, question: q, answer: a});
      alert("Card added!");
    });
  }
}

function editCardPrompt() {
  if (cards.length === 0) return;
  const q = prompt("Edit question:", cards[current].question);
  const a = prompt("Edit answer:", cards[current].answer);
  if (q && a) {
    const cardId = cards[current].id;
    db.collection("flashcards").doc(cardId).update({question: q, answer: a});
    cards[current].question = q;
    cards[current].answer = a;
    showCard(current);
    alert("Card updated!");
  }
}

function deleteCard() {
  if (cards.length === 0) return;
  const confirmDelete = confirm("Are you sure you want to delete this card?");
  if (confirmDelete) {
    const cardId = cards[current].id;
    db.collection("flashcards").doc(cardId).delete();
    cards.splice(current, 1);
    if (cards.length === 0) {
      document.getElementById("question").innerText = "No cards!";
      document.getElementById("answer").innerText = "";
    } else {
      if (current >= cards.length) current = 0;
      showCard(current);
    }
  }
}

function toggleCramMode() {
  cramMode = !cramMode;
  alert("Cram Mode " + (cramMode ? "ON" : "OFF"));
}
