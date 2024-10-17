document.addEventListener('DOMContentLoaded', function() {
    const tela = document.getElementById('tela');
    const contexto = tela.getContext('2d');
    const imagemTopo = new Image();
    const imagemFundo = new Image();

    imagemTopo.src = 'imagem-superior.jpg';
    imagemFundo.src = 'imagem-inferior.jpg';
    let posicaoMouseX = 0, posicaoMouseY = 0;
    let raio = 100;

    function desenharImagem() {
        contexto.clearRect(0, 0, tela.width, tela.height);
        contexto.drawImage(imagemFundo, 0, 0, tela.width, tela.height);
        contexto.save();
        contexto.beginPath();
        contexto.arc(posicaoMouseX, posicaoMouseY, raio, 0, Math.PI * 2, true);
        contexto.clip();
        contexto.drawImage(imagemTopo, 0, 0, tela.width, tela.height);
        contexto.restore();

        imagemFundo.onload = imagemTopo.onload = function() {
            desenharImagem();
        }
    };

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

// erro no carregamento direto da imagem quando pouse na página