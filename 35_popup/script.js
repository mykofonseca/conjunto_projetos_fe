var modal = document.getElementById('meuModal');
var botaoModal = document.getElementById('botaoModal');
var spanFecharModal = document.getElementsByClassName("fechar")[0];
botaoModal.onclick = function() {
    modal.style.display = "block";
}

spanFecharModal.onclick = function() {
    modal.style.display = "none"
}

window.onclick = function(event) {
    if(event.target == modal) {
        modal.style.display = "none";
    }
}

var botaoAlerta = document.getElementById("botaoAlerta");
botaoAlerta.onclick = function() {
    alert("Esta é uma mensagem de alerta!");
}

var botaoNotificacao = document.getElementById("botaoNotificacao");
botaoNotificacao.onclick = function() {
    var notificacao = document.getElementById("notificacao");
    notificacao.className = "notificacao mostrar";
    setTimeout(function() {
        notificacao.className = notificacao.className.replace("mostrar", "");
    }, 3000);
}

var botaoLightbox = document.getElementById("botaoLightbox");
var lightbox = document.getElementById("lightbox");
var imagemLightbox = document.getElementById("imagemLightbox");
var spanFecharLightBox = document.getElementsByClassName("fechar")[1];
botaoLightbox.onclick = function() {
    var imagem = document.getElementById("imagem");
    imagem.style.display = "block";
    imagem.click();
    imagem.style.display = "none";
}

// erro

spanFecharLightBox.onclick = function() {
    lightbox.style.display = "none";
}

window.onclick = function(event) {
    if(event.target == lightbox) {
        lightbox.style.display = "none";
    }
}

function abrirLightbox(elemento) {
    lightbox.style.display = "block";
    imagemLightbox.src = elemento.src;
    document.getElementById("legenda").innerHTML = elemento.alt;
}

var botaoMenuContexto = document.getElementById("botaoMenuContexto");
var menuContexto = document.getElementById("menuContexto");
botaoMenuContexto.onclick = function(event) {
    event.preventDefault();
    menuContexto.style.top = "50%";
    menuContexto.style.left = "50%";
    menuContexto.style.transform = "translate(-50%, -50%)";
    menuContexto.style.display = "block";
}

window.onclick = function(event) {
    if(event.button !== 2 && event.target !== botaoMenuContexto) {
        menuContexto.style.display = "none";
    }
}

function acao1() {
    alert("Ação 1 selecionada");
    menuContexto.style.display = "none"
}

function acao2() {
    alert("Ação 2 selecionada");
    menuContexto.style.display = "none"
}

function acao3() {
    alert("Ação 3 selecionada");
    menuContexto.style.display = "none"
}

var botaoConfirmacao = document.getElementById("botaoConfirmacao");
var confirmacao = document.getElementById("confirmacao");
var spanFecharConfirmacao = document.getElementsByClassName("fechar")[2];
var botaoSim = document.getElementById('botaoSim');
var botaoNao = document.getElementById('botaoNao');
botaoConfirmacao.onclick = function() {
    confirmacao.style.display = "block";
}

spanFecharConfirmacao.onclick = function() {
    confirmacao.style.display = "none";
}

botaoSim.onclick = function() {
    confirmacao.style.display = "none"
    alert("Você clicou em 'Sim'!")
}

botaoNao.onclick = function() {
    confirmacao.style.display = "none"
    alert("Você clicou em 'Não'!")
}

window.onclick = function(event) {
    if(event.target == confirmacao) {
        confirmacao.style.display = "none";
    }
}

var botaoEntradaTexto = document.getElementById("botaoEntradaTexto");
var entradaTexto = document.getElementById("entradaTexto");
var spanFecharEntradaTexto = document.getElementsByClassName("fechar")[3];
var botaoEnviar = document.getElementById("botaoEnviar");
botaoEntradaTexto.onclick = function() {
    entradaTexto.style.display = "block";
}

spanFecharEntradaTexto.onclick = function() {
    entradaTexto.style.display = "none";
}

botaoEnviar.onclick = function() {
    var texto = document.getElementById("textoEntrada").value;
    alert("Você digitou: " + texto);
    entradaTexto.style.display = "none";
}

window.onclick = function(event) {
    if(event.target == entradaTexto) {
        entradaTexto.style.display = "none";
    }
}

