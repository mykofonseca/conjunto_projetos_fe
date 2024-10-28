const palavras = ['javascript', 'css', 'html', 'navegador', 'programar', 'internet', 'computador', 'teclado', 'mouse', 'monitor'];
const pontuacaoKey = 'jogoDaForcaPontuacao';
let palavraSecreta = '';
let erros = 0;
let acertos = 0;
let pontuacao = localStorage.getItem(pontuacaoKey) ? parseInt(localStorage.getItem(pontuacaoKey)) : 0;
let indicePalavra = localStorage.getItem('indicePalavra') ? parseInt(localStorage.getItem('indicePalavra')) : 0;
document.getElementById('pontuacao').textContent = pontuacao;

function escolherPalavraSecreta() {
    if(indicePalavra < palavras.length) {
        palavraSecreta = palavras[indicePalavra];
    } else {
        palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
    }
}

function montarPalavraNaTela() {
    const container = document.getElementById('palavraSecreta');
    container.innerHTML = '';
    for(let letra of palavraSecreta) {
        const span = document.createElement('span');
        span.textContent = '_';
        span.classList.add('letra');
        container.appendChild(span);
    }
}

function montarAlfabeto() {
    const alfabeto = 'abcdefghijklmnopqrstuvwxyz';
    const container = document.getElementById('alfabeto')
    container.innerHTML = '';
    for(let letra of alfabeto) {
        const button = document.createElement('button');
        button.textContent = letra.toUpperCase();
        button.onclick = () => escolherLetra(letra);
        container.appendChild(button);
    }
}

function escolherLetra(letra) {
    const spans = document.querySelectorAll('#palavraSecreta span');
    let acertou = false;
    palavraSecreta.split('').forEach((char, index) => {
        if(char === letra) {
            spans[index].textContent = char.toUpperCase();
            acertou = true;
            acertos++;
        }
    });
    document.querySelectorAll('#alfabeto button').forEach(button => {
        if(button.textContent.toLowerCase() === letra) {
            button.disabled = true;
        }
    });

    if(!acertou) {
        erros++;
        mostrarPartesDoBoneco(erros);
    }
    verificarFimDeJogo();
}

function mostrarPartesDoBoneco(erros) {
    const partes = ['corda', 'cabeca', 'corpo', 'bracoEsquerdo', 'bracoDireito', 'pernaEsquerda',  'pernaDireita'];
    if (erros <= partes.length) {
        const parte = document.getElementById(partes[erros - 1]);
        parte.style.display = 'block';
    }
}

function verificarFimDeJogo() {
    const mensagem = document.getElementById('mensagemFinal');
    if(erros === 7) {
        mensagem.textContent = 'Você perdeu!';
        document.querySelectorAll('#alfabeto button').forEach(button => button.disabled = true);
    } else if (acertos === palavraSecreta.length) {
        mensagem.textContent = 'Você venceu!';
        document.querySelectorAll('#alfabeto button').forEach(button => button.disabled = true);
        pontuacao += 1;
        indicePalavra++;
        localStorage.setItem('indicePalavra', indicePalavra);
    }
    localStorage.setItem(pontuacaoKey, pontuacao);
    document.getElementById('pontuacao').textContent = pontuacao;
}

function resetGame() {
    escolherPalavraSecreta();
    montarPalavraNaTela();
    montarAlfabeto()
    document.getElementById('mensagemFinal').textContent = '';
    erros = 0;
    acertos = 0;
    document.querySelectorAll('.parte').forEach(parte => parte.style.display = 'none');
}

escolherPalavraSecreta();
montarPalavraNaTela();
montarAlfabeto();