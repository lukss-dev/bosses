// Importando os módulos necessários do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD5okhGhj0OS8zj1XNuc-0SJJ27cIpFsts",
  authDomain: "agenda-dcdca.firebaseapp.com",
  projectId: "agenda-dcdca",
  storageBucket: "agenda-dcdca.firebasestorage.app",
  messagingSenderId: "195952449830",
  appId: "1:195952449830:web:cf73943915cfaa7774c9e7"
};


// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Função para calcular o rank
function calcularRank(d) {
  if (d <= 2) return "E";
  if (d <= 4) return "D";
  if (d <= 6) return "C";
  if (d == 7) return "B";
  if (d == 8) return "A";
  return "S";
}

// Função para adicionar um boss
async function adicionarBoss() {
  const nome = document.getElementById('nomeBoss').value;
  const fraqueza = document.getElementById('fraquezaBoss').value;
  const dificuldade = Number(document.getElementById('dificuldadeBoss').value);
  const img = document.getElementById('imgBoss').files[0];

  if (!nome || !img) {
    alert("Preencha tudo.");
    return;
  }

  const reader = new FileReader();
  const rank = calcularRank(dificuldade);

  reader.onload = async () => {
    try {
      await addDoc(collection(db, "bosses"), {
        nome,
        fraqueza,
        dificuldade,
        rank,
        img: reader.result,
        vencido: false
      });

      // Limpando os campos após adicionar
      document.getElementById('nomeBoss').value = "";
      document.getElementById('fraquezaBoss').value = "";
      document.getElementById('imgBoss').value = "";
    } catch (error) {
      console.error("Erro ao adicionar o boss: ", error);
    }
  };

  reader.readAsDataURL(img);
}

// Função para carregar os bosses em tempo real
onSnapshot(collection(db, "bosses"), (snapshot) => {
  const bossesContainer = document.getElementById('bossesContainer');
  bossesContainer.innerHTML = "";

  snapshot.forEach((doc) => {
    const boss = doc.data();

    const card = document.createElement("div");
    card.className = "boss-card";
    if (boss.vencido) card.classList.add("vencido");

    card.innerHTML = `
      <img src="${boss.img}" onclick="mostrarBotao(this)">
      ${!boss.vencido ? `<button class="btn-vencer" onclick="marcarVencido('${doc.id}')">VENCIDO</button>` : ""}
      <div class="boss-info">
        <span class="rank ${boss.rank}">Rank ${boss.rank}</span>
        <h3>${boss.nome}</h3>
        <div class="tag">Fraqueza: ${boss.fraqueza}</div>
      </div>
    `;

    bossesContainer.appendChild(card);
  });
});

// Função para marcar um boss como vencido
async function marcarVencido(id) {
  const bossRef = doc(db, "bosses", id);
  await updateDoc(bossRef, {
    vencido: true
  });
}

// Função para mostrar o botão de marcar vencido
function mostrarBotao(img) {
  img.parentElement.classList.toggle("show-btn");
}

