document.addEventListener('DOMContentLoaded', function() {
    const tela = document.getElementById('tela');
    const contexto = tela.getContext('2d');
    const imagemTopo = new Image();
    const imagemFundo = new Image();
    let imagesLoaded = 0;

    function checkImagesLoaded() {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            desenharImagemInicial();
        }
    }

    function desenharImagemInicial() {
        contexto.drawImage(imagemFundo, 0, 0, tela.width, tela.height);
    }

    function desenharImagem() {
        contexto.clearRect(0, 0, tela.width, tela.height);
        contexto.drawImage(imagemFundo, 0, 0, tela.width, tela.height);
        contexto.save();
        contexto.beginPath();
        contexto.arc(posicaoMouseX, posicaoMouseY, raio, 0, Math.PI * 2, true);
        contexto.clip();
        contexto.drawImage(imagemTopo, 0, 0, tela.width, tela.height);
        contexto.restore();
    }

    let posicaoMouseX = 0, posicaoMouseY = 0;
    let raio = 100;

    imagemTopo.onload = checkImagesLoaded;
    imagemFundo.onload = checkImagesLoaded;

    imagemTopo.src = './arqs_p18/imagem-superior.jpg';
    imagemFundo.src = './arqs_p18/imagem-inferior.jpg';

    tela.addEventListener('mousemove', function(e) {
        const retangulo = tela.getBoundingClientRect();
        posicaoMouseX = e.clientX - retangulo.left;
        posicaoMouseY = e.clientY - retangulo.top;
        desenharImagem();
    });

    tela.addEventListener('mouseout', function() {
        contexto.clearRect(0, 0, tela.width, tela.height);
        contexto.drawImage(imagemFundo, 0, 0, tela.width, tela.height);
    });
});