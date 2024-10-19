document.addEventListener('DOMContentLoaded', function () {
    iniciarJogo();
});

function iniciarJogo() {
    const imagens = [
        "img1.jpg",
        "img2.jpg",
        "img3.jpg",
        "img4.jpg",
        "img5.jpg",
        "img6.jpg",
        "img7.jpg",
        "img8.jpg",
        "img9.jpg",
        "img10.jpg"
    ];

    let imagensDuplicadas = [...imagens, ...imagens];
    let imagensEmbaralhadas = embaralhar(imagensDuplicadas);
    const tabuleiro = document.querySelector('.tabuleiro');
    tabuleiro.innerHTML = '';
    
    for (let i = 0; i < imagensEmbaralhadas.length; i++) {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.innerHTML = `<img src="imagens/verso.jpg" alt="Verso" data-imagem="imagens/${imagensEmbaralhadas[i]}">`;
        tabuleiro.appendChild(carta);
    }

    const cartas = document.querySelectorAll('.carta');
    let cartaVirada = null;
    let travarTabuleiro = true;
    let paresEncontrados = 0;
    mostrarImagens();

    function mostrarImagens() {
        cartas.forEach(carta => {
            const imgElement = carta.querySelector('img');
            imgElement.src = imgElement.getAttribute('data-imagem');
        });

        setTimeout(() => {
            cartas.forEach(carta => {
                carta.querySelector('img').src = 'imagens/verso.jpg';
            });
            travarTabuleiro = false;
            cartas.forEach(carta => {
                carta.addEventListener('click', virarCarta);
            });
        }, 1000);
    }

    function virarCarta() {
        if (travarTabuleiro || this === cartaVirada) return;
        
        let imgElement = this.querySelector('img');
        imgElement.src = imgElement.getAttribute('data-imagem');
        
        if (!cartaVirada) {
            cartaVirada = this;
        } else {
            verificarPar(cartaVirada, this);
            cartaVirada = null;
        }
    }
    
    function verificarPar(carta1, carta2) {
        const img1 = carta1.querySelector('img').getAttribute('data-imagem');
        const img2 = carta2.querySelector('img').getAttribute('data-imagem');
        
        if (img1 === img2) {
            carta1.removeEventListener('click', virarCarta);
            carta2.removeEventListener('click', virarCarta);
            paresEncontrados++;

            if (paresEncontrados === imagens.length) {
                fimDeJogo();
            }
        } else {
            travarTabuleiro = true;
            setTimeout(() => { 
                carta1.querySelector('img').src = 'imagens/verso.jpg';
                carta2.querySelector('img').src = 'imagens/verso.jpg';
                travarTabuleiro = false;
            }, 1000);
        }
    }

    function fimDeJogo() {
        setTimeout(() => {
            alert('Parabéns! Você encontrou todos os pares. Clique OK para recomeçar.');
            iniciarJogo();
        }, 500); 
    }

    function embaralhar(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
}