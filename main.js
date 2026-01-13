// =============================================
// SISTEMA DE CONTROLE DE ACESSO E PERMISSÕES
// =============================================

// Verifica se há usuário logado
function verificarLogin() {
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  return usuarioLogado ? JSON.parse(usuarioLogado) : null;
}

// Verifica se o usuário tem permissão de admin/editor
function temPermissaoEdicao() {
  const usuario = verificarLogin();
  return usuario && (usuario.role === 'admin' || usuario.role === 'editor');
}

// Verifica se o usuário é admin
function isAdmin() {
  const usuario = verificarLogin();
  return usuario && usuario.role === 'admin';
}

// Função de logout
function fazerLogout() {
  sessionStorage.removeItem('usuarioLogado');
  alert('Logout realizado com sucesso!');
  location.reload();
}

// Adiciona botão de logout no menu
function adicionarBotaoLogout() {
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu && !document.querySelector('.logout-btn')) {
    const logoutItem = document.createElement('li');
    logoutItem.innerHTML = '<a href="#" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Sair</a>';
    navMenu.appendChild(logoutItem);
    
    document.querySelector('.logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      fazerLogout();
    });
  }
}

// Atualiza a interface baseado no login
function atualizarInterface() {
  const usuario = verificarLogin();
  const userIcon = document.querySelector('.user-icon');
  
  if (usuario) {
    // Muda o ícone para indicar usuário logado
    if (userIcon) {
      userIcon.innerHTML = '<i class="fas fa-user-circle"></i>';
      userIcon.title = `Logado como: ${usuario.nome} (${usuario.role})`;
      userIcon.style.color = '#B87E58';
    }
    
    // Se tem permissão de edição, mostra os controles
    if (temPermissaoEdicao()) {
      mostrarControlesEdicao();
    }
    
    // Adiciona botão de logout no menu
    setTimeout(adicionarBotaoLogout, 500);
  } else {
    // Remove controles de edição
    ocultarControlesEdicao();
  }
}

// Mostra controles de edição
function mostrarControlesEdicao() {
  // Adiciona botões de edição em textos
  const textos = document.querySelectorAll('.about-text, .hero-subtitle, .servico-texto, .sobre-texto, .depo-texto');
  textos.forEach((texto, index) => {
    if (!texto.querySelector('.btn-editar')) {
      texto.style.position = 'relative';
      texto.style.paddingBottom = '50px';
      
      const btnEditar = document.createElement('button');
      btnEditar.className = 'btn-editar';
      btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
      btnEditar.onclick = () => editarTexto(texto, `texto-${index}`);
      texto.appendChild(btnEditar);
    }
  });
  
  // Adiciona botões de edição em títulos
  const titulos = document.querySelectorAll('.hero-title, .about-title, .services-title, .depoimentos-title');
  titulos.forEach((titulo, index) => {
    if (!titulo.querySelector('.btn-editar')) {
      titulo.style.position = 'relative';
      titulo.style.paddingRight = '60px';
      
      const btnEditar = document.createElement('button');
      btnEditar.className = 'btn-editar btn-editar-titulo';
      btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
      btnEditar.onclick = () => editarTexto(titulo, `titulo-${index}`);
      titulo.appendChild(btnEditar);
    }
  });
  
  // Adiciona botões de edição em imagens
  const imagens = document.querySelectorAll('.hero-photo img, .foto-alice, .foto-consultoria, .foto-bloco, .hero-slide img');
  imagens.forEach((img, index) => {
    if (!img.parentElement.querySelector('.btn-editar-img')) {
      img.parentElement.style.position = 'relative';
      
      const btnEditarImg = document.createElement('button');
      btnEditarImg.className = 'btn-editar-img';
      btnEditarImg.innerHTML = '<i class="fas fa-image"></i>';
      btnEditarImg.onclick = () => editarImagem(img, `img-${index}`);
      img.parentElement.appendChild(btnEditarImg);
    }
  });
  
  // Mostra painel de admin se for admin
  if (isAdmin()) {
    setTimeout(mostrarPainelAdmin, 1000);
  }
}

// Oculta controles de edição
function ocultarControlesEdicao() {
  document.querySelectorAll('.btn-editar, .btn-editar-img, .painel-admin').forEach(el => el.remove());
  
  // Remove padding extra
  const textos = document.querySelectorAll('.about-text, .hero-subtitle, .servico-texto, .sobre-texto, .depo-texto');
  textos.forEach(texto => {
    texto.style.paddingBottom = '';
  });
}

// Função para editar texto
function editarTexto(elemento, id) {
  // Remove o botão de editar do texto para pegar apenas o conteúdo
  const btnEditar = elemento.querySelector('.btn-editar');
  if (btnEditar) btnEditar.style.display = 'none';
  
  const textoAtual = elemento.textContent.trim();
  
  if (btnEditar) btnEditar.style.display = '';
  
  const novoTexto = prompt('Editar texto:', textoAtual);
  
  if (novoTexto !== null && novoTexto.trim() !== '') {
    // Atualiza o texto mantendo o botão
    elemento.childNodes[0].textContent = novoTexto;
    
    // Salva a alteração
    salvarAlteracao('texto', id, novoTexto, elemento.className);
  }
}

// Função para editar imagem
function editarImagem(img, id) {
  const novaUrl = prompt('Cole a URL da nova imagem:', img.src);
  
  if (novaUrl !== null && novaUrl.trim() !== '') {
    img.src = novaUrl;
    
    // Salva a alteração
    salvarAlteracao('imagem', id, novaUrl, img.className);
  }
}

// Função para salvar alterações no localStorage
function salvarAlteracao(tipo, id, valor, classe) {
  const alteracoes = JSON.parse(localStorage.getItem('alteracoes') || '{}');
  
  alteracoes[id] = {
    tipo: tipo,
    id: id,
    classe: classe,
    valor: valor,
    data: new Date().toISOString(),
    usuario: verificarLogin().username
  };
  
  localStorage.setItem('alteracoes', JSON.stringify(alteracoes));
  
  // Feedback visual
  mostrarNotificacao('✓ Alteração salva com sucesso!', 'success');
}

// Carrega alterações salvas
function carregarAlteracoes() {
  const alteracoes = JSON.parse(localStorage.getItem('alteracoes') || '{}');
  
  Object.values(alteracoes).forEach(alt => {
    if (alt.tipo === 'texto') {
      // Tenta encontrar o elemento pelo índice
      const textos = document.querySelectorAll('.about-text, .hero-subtitle, .servico-texto, .sobre-texto, .depo-texto, .hero-title, .about-title, .services-title, .depoimentos-title');
      const elemento = Array.from(textos).find((el, index) => {
        return `texto-${index}` === alt.id || `titulo-${index}` === alt.id;
      });
      
      if (elemento) {
        elemento.childNodes[0].textContent = alt.valor;
      }
    } else if (alt.tipo === 'imagem') {
      const imagens = document.querySelectorAll('.hero-photo img, .foto-alice, .foto-consultoria, .foto-bloco, .hero-slide img');
      const img = Array.from(imagens).find((el, index) => `img-${index}` === alt.id);
      
      if (img) {
        img.src = alt.valor;
      }
    }
  });
}

// Mostra notificação
function mostrarNotificacao(mensagem, tipo = 'info') {
  // Remove notificação anterior se existir
  const notifAnterior = document.querySelector('.notificacao');
  if (notifAnterior) notifAnterior.remove();
  
  const notif = document.createElement('div');
  notif.className = `notificacao notificacao-${tipo}`;
  notif.textContent = mensagem;
  document.body.appendChild(notif);
  
  // Mostra a notificação
  setTimeout(() => notif.classList.add('show'), 10);
  
  // Remove após 3 segundos
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Painel de administração
function mostrarPainelAdmin() {
  if (document.querySelector('.painel-admin')) return;
  
  const painel = document.createElement('div');
  painel.className = 'painel-admin';
  painel.innerHTML = `
    <div class="painel-header">
      <h3><i class="fas fa-cog"></i> Painel Admin</h3>
      <button class="btn-fechar-painel">×</button>
    </div>
    <div class="painel-conteudo">
      <button class="btn-admin" onclick="verHistorico()">
        <i class="fas fa-history"></i> Ver Histórico
      </button>
      <button class="btn-admin" onclick="verUsuarios()">
        <i class="fas fa-users"></i> Usuários
      </button>
      <button class="btn-admin" onclick="resetarAlteracoes()">
        <i class="fas fa-undo"></i> Resetar Alterações
      </button>
    </div>
  `;
  
  document.body.appendChild(painel);
  
  document.querySelector('.btn-fechar-painel').onclick = () => {
    painel.remove();
  };
}

// Ver histórico de alterações
function verHistorico() {
  const alteracoes = JSON.parse(localStorage.getItem('alteracoes') || '{}');
  const arrayAlteracoes = Object.values(alteracoes);
  
  if (arrayAlteracoes.length === 0) {
    alert('Nenhuma alteração registrada.');
    return;
  }
  
  let historico = '📋 HISTÓRICO DE ALTERAÇÕES\n';
  historico += '═'.repeat(40) + '\n\n';
  
  arrayAlteracoes.forEach((alt, index) => {
    historico += `${index + 1}. ${alt.tipo.toUpperCase()}\n`;
    historico += `   ID: ${alt.id}\n`;
    historico += `   Usuário: ${alt.usuario}\n`;
    historico += `   Data: ${new Date(alt.data).toLocaleString('pt-BR')}\n`;
    historico += `   Valor: ${alt.valor.substring(0, 50)}${alt.valor.length > 50 ? '...' : ''}\n\n`;
  });
  
  alert(historico);
}

// Ver usuários disponíveis
function verUsuarios() {
  const info = `
👥 USUÁRIOS DO SISTEMA

═══════════════════════════════════

🔴 ADMIN
   Usuário: admin
   Senha: 123456
   Permissões: Todas

🔴 ADMIN
   Usuário: alice
   Senha: alice123
   Permissões: Todas

🟡 EDITOR
   Usuário: editor
   Senha: editor123
   Permissões: Editar textos e imagens

🟢 USUÁRIO COMUM
   Usuário: usuario
   Senha: user123
   Permissões: Apenas visualização
  `;
  
  alert(info);
}

// Resetar alterações
function resetarAlteracoes() {
  if (confirm('⚠️ Tem certeza que deseja resetar todas as alterações?\n\nEsta ação não pode ser desfeita e todas as edições serão perdidas.')) {
    localStorage.removeItem('alteracoes');
    mostrarNotificacao('✓ Alterações resetadas!', 'success');
    setTimeout(() => location.reload(), 1500);
  }
}

// =============================================
// MODAL DE LOGIN COM VALIDAÇÃO
// =============================================

function inicializarModal() {
  const userIcon = document.querySelector('.user-icon');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  if (!userIcon || !loginModal) {
    setTimeout(inicializarModal, 100);
    return;
  }

  // Abre o modal ao clicar no ícone de usuário
  userIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Se já estiver logado, mostra opções
    const usuario = verificarLogin();
    if (usuario) {
      if (confirm(`Você está logado como: ${usuario.nome}\n\nDeseja fazer logout?`)) {
        fazerLogout();
      }
      return;
    }
    
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Fecha o modal ao clicar no X
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      fecharModal();
    });
  }

  // Fecha o modal ao clicar fora dele
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      fecharModal();
    }
  });

  // Fecha com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
      fecharModal();
    }
  });

  // Função para fechar modal
  function fecharModal() {
    loginModal.classList.remove('active');
    document.body.style.overflow = '';
    limparErros();
    if (loginForm) loginForm.reset();
  }

  // Função para mostrar erro
  function mostrarErro(input, mensagem) {
    limparErro(input);
    input.classList.add('input-error');
    const erro = document.createElement('span');
    erro.className = 'error-message';
    erro.textContent = mensagem;
    input.parentElement.insertAdjacentElement('afterend', erro);
  }

  // Função para limpar erro de um input específico
  function limparErro(input) {
    input.classList.remove('input-error');
    const erro = input.parentElement.nextElementSibling;
    if (erro && erro.classList.contains('error-message')) {
      erro.remove();
    }
  }

  // Função para limpar todos os erros
  function limparErros() {
    const erros = document.querySelectorAll('.error-message');
    erros.forEach(erro => erro.remove());
    const inputsComErro = document.querySelectorAll('.input-error');
    inputsComErro.forEach(input => input.classList.remove('input-error'));
  }

  // Validação em tempo real
  if (usernameInput) {
    usernameInput.addEventListener('input', () => {
      if (usernameInput.classList.contains('input-error')) {
        limparErro(usernameInput);
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      if (passwordInput.classList.contains('input-error')) {
        limparErro(passwordInput);
      }
    });
  }

  // Validação do formulário
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      limparErros();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      let isValid = true;
      
      if (username === '') {
        mostrarErro(usernameInput, 'Por favor, insira seu usuário');
        isValid = false;
      } else if (username.length < 3) {
        mostrarErro(usernameInput, 'O usuário deve ter pelo menos 3 caracteres');
        isValid = false;
      }
      
      if (password === '') {
        mostrarErro(passwordInput, 'Por favor, insira sua senha');
        isValid = false;
      } else if (password.length < 6) {
        mostrarErro(passwordInput, 'A senha deve ter pelo menos 6 caracteres');
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Sistema de usuários com permissões
      const usuariosValidos = [
        { 
          username: 'admin', 
          password: '123456', 
          role: 'admin',
          nome: 'Administrador'
        },
        { 
          username: 'alice', 
          password: 'alice123', 
          role: 'admin',
          nome: 'Alice Mendes'
        },
        { 
          username: 'editor', 
          password: 'editor123', 
          role: 'editor',
          nome: 'Editor'
        },
        { 
          username: 'usuario', 
          password: 'user123', 
          role: 'user',
          nome: 'Usuário Comum'
        }
      ];
      
      const usuarioEncontrado = usuariosValidos.find(
        user => user.username === username && user.password === password
      );
      
      if (usuarioEncontrado) {
        // Salva os dados do usuário na sessão
        sessionStorage.setItem('usuarioLogado', JSON.stringify({
          username: usuarioEncontrado.username,
          nome: usuarioEncontrado.nome,
          role: usuarioEncontrado.role
        }));
        
        fecharModal();
        mostrarNotificacao(`✓ Bem-vindo(a), ${usuarioEncontrado.nome}!`, 'success');
        
        // Recarrega a página para mostrar os controles de edição
        setTimeout(() => location.reload(), 1500);
      } else {
        mostrarErro(passwordInput, 'Usuário ou senha incorretos');
        passwordInput.value = '';
      }
    });
  }
}

// =============================================
// SLIDER HERO (AUTOMÁTICO)
// =============================================
if (document.querySelector('.hero-slider')) {
  const heroSlides = document.querySelectorAll('.hero-slide');
  let heroIndex = 0;

  function nextHeroSlide() {
    heroSlides[heroIndex].classList.remove('active');
    heroIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].classList.add('active');
  }

  setInterval(nextHeroSlide, 5000);
  heroSlides[0].classList.add('active');
}

// =============================================
// SLIDER PRINCIPAL COM SETAS E PONTINHOS
// =============================================
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");

  if (!slides.length) return;

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  slides[slideIndex - 1].classList.add("active");
  if (dots.length) dots[slideIndex - 1].classList.add("active");
}

// Eventos das setas
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

if (prevBtn) prevBtn.addEventListener("click", () => plusSlides(-1));
if (nextBtn) nextBtn.addEventListener("click", () => plusSlides(1));

// Auto play
setInterval(() => {
  plusSlides(1);
}, 6000);

// =============================================
// SLIDER DE DEPOIMENTOS
// =============================================
let depoIndex = 0;
const depoSlides = document.querySelectorAll(".depo-slide");

function mostrarDepo(i) {
  depoSlides.forEach(s => s.classList.remove("active"));
  if (depoSlides[i]) depoSlides[i].classList.add("active");
}

const depoPrev = document.querySelector(".depo-prev");
const depoNext = document.querySelector(".depo-next");

if (depoPrev) {
  depoPrev.addEventListener("click", () => {
    depoIndex = (depoIndex - 1 + depoSlides.length) % depoSlides.length;
    mostrarDepo(depoIndex);
  });
}

if (depoNext) {
  depoNext.addEventListener("click", () => {
    depoIndex = (depoIndex + 1) % depoSlides.length;
    mostrarDepo(depoIndex);
  });
}

// =============================================
// FECHA MENU HAMBURGER AO CLICAR EM LINKS
// =============================================
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const menuLinks = document.querySelectorAll('.nav-menu a');

  if (menuToggle && menuLinks.length > 0) {
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.checked = false;
      });
    });
  }
});

// =============================================
// CALENDÁRIO DE AGENDAMENTO
// =============================================
if (document.getElementById('calendario-dias')) {
  const mesAtual = new Date();
  let mesExibido = new Date(mesAtual);
  let diaSelecionado = null;

  function renderizarCalendario() {
    const ano = mesExibido.getFullYear();
    const mes = mesExibido.getMonth();
    
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('mes-ano').textContent = `${meses[mes]} ${ano}`;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    const calendarioDias = document.getElementById('calendario-dias');
    calendarioDias.innerHTML = '';

    for (let i = 0; i < primeiroDia; i++) {
      const diaVazio = document.createElement('div');
      diaVazio.classList.add('dia', 'vazio');
      calendarioDias.appendChild(diaVazio);
    }

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const diaElemento = document.createElement('div');
      diaElemento.classList.add('dia');
      diaElemento.textContent = dia;

      const dataAtual = new Date(ano, mes, dia);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (dataAtual.getTime() === hoje.getTime()) {
        diaElemento.classList.add('hoje');
      }

      if (dataAtual < hoje) {
        diaElemento.classList.add('indisponivel');
      } else {
        diaElemento.addEventListener('click', () => selecionarDia(diaElemento, dia));
        
        if (dia === 27) {
          diaElemento.classList.add('tem-compromisso');
        }
      }

      calendarioDias.appendChild(diaElemento);
    }
  }

  function selecionarDia(elemento, dia) {
    document.querySelectorAll('.dia.selecionado').forEach(d => d.classList.remove('selecionado'));
    elemento.classList.add('selecionado');
    diaSelecionado = dia;

    const btnProximo = document.querySelector('.btn-proximo');
    if (btnProximo) {
      btnProximo.classList.add('ativo');
    }
    
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const diaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const data = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), dia);
    
    const disponibilidadeInfo = document.querySelector('.disponibilidade-info');
    if (disponibilidadeInfo) {
      disponibilidadeInfo.innerHTML = `
        <p>Disponibilidade para <strong>${diaSemana[data.getDay()]}, ${dia} de ${meses[mesExibido.getMonth()]}</strong></p>
        <p style="margin-top: 10px;">Indisponível</p>
      `;
    }
  }

  const btnMesAnterior = document.getElementById('mes-anterior');
  const btnMesProximo = document.getElementById('mes-proximo');

  if (btnMesAnterior) {
    btnMesAnterior.addEventListener('click', () => {
      mesExibido.setMonth(mesExibido.getMonth() - 1);
      renderizarCalendario();
    });
  }

  if (btnMesProximo) {
    btnMesProximo.addEventListener('click', () => {
      mesExibido.setMonth(mesExibido.getMonth() + 1);
      renderizarCalendario();
    });
  }

  renderizarCalendario();

  setTimeout(() => {
    const dia27 = Array.from(document.querySelectorAll('.dia')).find(d => d.textContent === '27' && !d.classList.contains('vazio'));
    if (dia27) {
      selecionarDia(dia27, 27);
    }
  }, 100);
}

// =============================================
// INICIALIZAÇÃO GLOBAL
// =============================================

// Carrega alterações quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    carregarAlteracoes();
    atualizarInterface();
    inicializarModal();
  }, 200);
});

// Também executa após carregamento completo
window.addEventListener('load', () => {
  atualizarInterface();
  inicializarModal();
});