// 🔥 CONFIG FIREBASE (VOCÊ VAI TROCAR)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// -------------------------

function calcularRank(d) {
  if (d <= 2) return "E";
  if (d <= 4) return "D";
  if (d <= 6) return "C";
  if (d == 7) return "B";
  if (d == 8) return "A";
  return "S";
}

// 🔥 ADICIONAR BOSS
function adicionarBoss() {
  const nome = nomeBoss.value;
  const fraqueza = fraquezaBoss.value;
  const dificuldade = Number(dificuldadeBoss.value);
  const img = imgBoss.files[0];

  if (!nome || !img) {
    alert("Preencha tudo.");
    return;
  }

  const reader = new FileReader();
  const rank = calcularRank(dificuldade);

  reader.onload = async () => {
    await db.collection("bosses").add({
      nome,
      fraqueza,
      dificuldade,
      rank,
      img: reader.result,
      vencido: false
    });

    nomeBoss.value = "";
    fraquezaBoss.value = "";
    imgBoss.value = "";
  };

  reader.readAsDataURL(img);
}

// 🔥 CARREGAR BOSSES EM TEMPO REAL
db.collection("bosses").onSnapshot(snapshot => {
  bossesContainer.innerHTML = "";

  snapshot.forEach(doc => {
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

// 🔥 MARCAR COMO VENCIDO
function marcarVencido(id) {
  db.collection("bosses").doc(id).update({
    vencido: true
  });
}

function mostrarBotao(img) {
  img.parentElement.classList.toggle("show-btn");
}
