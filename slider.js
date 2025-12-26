let indiceAtual = 0;
const slides = document.querySelectorAll(".primary-slide");
const totalSlides = slides.length;

// Função que troca para o próximo slide
function proximoSlide() {
  // Remove a classe active do slide atual
  slides[indiceAtual].classList.remove("active");
  
  // Avança o índice
  indiceAtual = (indiceAtual + 1) % totalSlides;
  
  // Adiciona active no próximo slide
  slides[indiceAtual].classList.add("active");
}

// Troca automaticamente a cada 8 segundos
setInterval(proximoSlide, 8000);

// Garante que o primeiro slide comece visível
slides[indiceAtual].classList.add("active");



// Slider manual com setas e pontinhos
let slideIndex = 1;
showSlides(slideIndex);

// Função para avançar/retroceder
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Função para ir direto pro slide clicado (pontinhos)
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Função principal que mostra o slide correto
function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  // Remove "active" de todos
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  // Adiciona "active" no slide e dot atual
  slides[slideIndex - 1].classList.add("active");
  dots[slideIndex - 1].classList.add("active");
}

// Eventos das setas
document.querySelector(".prev").addEventListener("click", () => plusSlides(-1));
document.querySelector(".next").addEventListener("click", () => plusSlides(1));

// Auto play (troca automático a cada 6 segundos) - opcional
// Comenta ou remove as duas linhas abaixo se não quiser auto play
setInterval(() => {
  plusSlides(1);
}, 6000);


// Slider de depoimentos
let depoIndex = 0;
const depoSlides = document.querySelectorAll(".depo-slide");

function mostrarDepo(i) {
  depoSlides.forEach(s => s.classList.remove("active"));
  depoSlides[i].classList.add("active");
}

document.querySelector(".depo-prev").addEventListener("click", () => {
  depoIndex = (depoIndex - 1 + depoSlides.length) % depoSlides.length;
  mostrarDepo(depoIndex);
});

document.querySelector(".depo-next").addEventListener("click", () => {
  depoIndex = (depoIndex + 1) % depoSlides.length;
  mostrarDepo(depoIndex);
});




// js/main.js - Todos os scripts do site em um arquivo só (organizado e seguro)

document.addEventListener('DOMContentLoaded', function () {

  // ====================
  // 1. FECHA O MENU HAMBURGER AO CLICAR EM LINKS
  // ====================
  const menuToggle = document.getElementById('menu-toggle');
  const menuLinks = document.querySelectorAll('.nav-menu a');

  if (menuToggle && menuLinks.length > 0) {
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.checked = false;
      });
    });
  }

  // ====================
  // 2. SLIDER AUTOMÁTICO (se você estiver usando o primary-slider)
  // ====================
  const primarySlides = document.querySelectorAll('.primary-slide');
  if (primarySlides.length > 0) {
    let indiceAtual = 0;
    const totalSlides = primarySlides.length;

    function proximoSlide() {
      primarySlides[indiceAtual].classList.remove('active');
      indiceAtual = (indiceAtual + 1) % totalSlides;
      primarySlides[indiceAtual].classList.add('active');
    }

    // Troca a cada 8 segundos
    setInterval(proximoSlide, 8000);

    // Garante o primeiro slide ativo
    primarySlides[indiceAtual].classList.add('active');
  }

  // ====================
  // 3. OUTROS SCRIPTS FUTUROS (depoimentos, etc.)
  // ====================
  // Adicione aqui outros códigos no futuro, sempre dentro do DOMContentLoaded

});