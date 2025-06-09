let jardineiro;
let plantas = [];
let temperatura = 10;
let totalArvores = 0;

function setup() {
  createCanvas(600, 400);
  jardineiro = new Jardineiro(width / 2, height - 50);
}

function draw() {
  let corFundo = lerpColor(color(217, 112, 26), color(219, 239, 208), map(totalArvores, 0, 100, 0, 1));
  background(corFundo);
  mostrarInformacoes();

  temperatura += 0.05; // Slightly slower temperature increase
  jardineiro.atualizar();
  jardineiro.mostrar();

  // Update and show each plant
  for (let i = plantas.length - 1; i >= 0; i--) {
    plantas[i].mostrar();
    // Optional: Add logic here to make plants need water again over time
    // For now, they just stay watered once they are.
  }
}

function mostrarInformacoes() {
  textSize(16);
  fill(0);
  text("Temperatura: " + temperatura.toFixed(2) + "°C", 10, 30);
  text("Árvores plantadas: " + totalArvores, 10, 50);
  text("Para movimentar o personagem use as setas do teclado.", 10, 70);
  text("Pressione 'P' para plantar uma árvore.", 10, 90);
  text("Pressione 'ESPAÇO' para regar as plantas próximas.", 10, 110);
}

//---
//Classe que cria o jardineiro
class Jardineiro {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.emoji = '👨‍🌾';
    this.velocidade = 3;
    this.raioRegar = 70; // Radius for watering
  }

  atualizar() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.velocidade;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.velocidade;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.velocidade;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.velocidade;
    }

    // Keep gardener within canvas bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  mostrar() {
    textSize(32);
    text(this.emoji, this.x, this.y);
  }

  // New method to water plants
  regarPlantas() {
    for (let i = 0; i < plantas.length; i++) {
      let d = dist(this.x, this.y, plantas[i].x, plantas[i].y);
      if (d < this.raioRegar) {
        plantas[i].regar(); // Call the regar method on the plant
      }
    }
  }
}

//---
//função para criar e plantar a árvore
function keyPressed() {
  // Plant a tree
  if (key === 'p' || key === 'P') {
    let arvore = new Arvore(jardineiro.x, jardineiro.y);
    plantas.push(arvore);
    totalArvores++;
    temperatura -= 3; // Planting trees reduces temperature
    if (temperatura < 0) temperatura = 0;
  }

  // Water plants
  if (key === ' ') { // Spacebar
    jardineiro.regarPlantas();
  }
}

//---
//Classe que cria a árvore
class Arvore {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.emoji = '🌳';
    this.estaRegada = false; // New property to track if the plant is watered
  }

  mostrar() {
    textSize(32);
    // Change emoji if watered, for visual feedback
    if (this.estaRegada) {
      text('🌿', this.x, this.y); // A slightly different emoji for a watered plant
    } else {
      text(this.emoji, this.x, this.y);
    }
  }

  regar() {
    this.estaRegada = true;
    temperatura -= 0.5; // Watering a plant slightly reduces temperature
    if (temperatura < 0) temperatura = 0;
    console.log("Planta regada!"); // For debugging
  }
}