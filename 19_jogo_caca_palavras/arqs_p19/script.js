const todasPalavras = [
    ['BANANA', 'MAÇÂ', 'UVA', 'PERA', 'MELANCIA'],
    ['MORANGO', 'ABACAXI', 'KIWI', 'PÊSSEGO', 'CEREJA'],
    ['LARANJA', 'LIMÃO', 'MANGA', 'COCO', 'ABACATE'],
    ['GOIABA', 'JACA', 'FIGO', 'TAMARINDO', 'AMÊNDOA'],
    ['PITANGA', 'ACEROLA', 'GRAVIOLA', 'CAJU', 'GUARANÁ'],
    ['PITAYA', 'ROMÃ', 'JABUTICABA', 'MARACUJÁ', 'FRAMBOESA'],
    ['MIRTILO', 'NECTARINA', 'CARAMBOLA', 'AMORA', 'DAMASCO'],
    ['SALSA', 'HORTELÃ', 'MANJERICÃO', 'ALECRIM', 'TOMILHO'],
    ['ORÉGANO', 'COENTRO', 'CEREFOLHO', 'LOURO', 'ERVA-DOCE'],
    ['TOMATE', 'ALFACE', 'RÚCULA', 'ESPINAFRE', 'AGRIÃO']
];

const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÇ'.split('');
const grid = document.getElementById('caça-palavras');
const listaPalavras = document.getElementById('lista-palavras');
const mensagem = document.getElementById('mensagem');
const botaoDica = document.getElementById('botao-dica');
const modalDica = document.getElementById('modal-dica');
const caçaPalavrasDica = document.getElementById('caça-palavras-dica');
const valorPontuacao = document.getElementById('valor-pontuacao');
const totalFases = 10;

let palavras = [];
let tamanho = 15;
let faseAtual = 0;
let pontos = 0;
let encontradas = 0;
let celulaInicial = null;
let celulaFinal = null;
let selecionando = false;

const criarGrid = (elementoGrid) => {
    elementoGrid.innerHTML = '';
    for(let linha = 0; linha < tamanho; linha++) {
        for(let coluna = 0; coluna < tamanho; coluna++) {
            const celula = document.createElement('div');
            celula.classList.add('celula');
            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;
            celula.dataset.letra = '';
            elementoGrid.appendChild(celula);
        }
    }
};

const colocarPalavras = (elementoGrid) => {
    palavras.forEach(palavra => {
        let colocado = false;
        while(!colocado) {
            const direcao = Math.floor(Math.random() * 8);
            const linhaInicial = Math.floor(Math.random() * tamanho);
            const colunaInicial = Math.floor(Math.random() * tamanho);
            if(podeColocarPalavra(linhaInicial, colunaInicial, palavra, direcao, elementoGrid)) {
                colocarPalavra(linhaInicial, colunaInicial, palavra, direcao, elementoGrid);
                colocado = true;
            }
        }
    });
};

const podeColocarPalavra = (linha, coluna, palavra, direcao, elementoGrid) => {
    const comprimento = palavra.length;
    for(let i = 0; i < comprimento; i++) {
        const r = linha + (direcao === 0 || direcao === 1 || direcao === 7 ? -i : direcao === 3 || direcao === 4 || direcao === 5 ? i : 0);
        const c = coluna + (direcao === 1 || direcao === 2 || direcao === 3 ? i : direcao === 5 || direcao === 6 || direcao === 7 ? -i : 0);
        if(r < 0 || r >= tamanho || c < 0 || c >= tamanho) return false;
        const celula = obterCelula(r, c, elementoGrid);
        if(celula.dataset.letra && celula.dataset.letra !== palavra[i]) return false;
    }
    return true;
};

const colocarPalavra = (linha, coluna, palavra, direcao, elementoGrid) => {
    for(let i = 0; i < palavra.length; i++) {
        const r = linha + (direcao === 0 || direcao === 1 || direcao === 7 ? -i : direcao === 3 || direcao === 4 || direcao === 5 ? i : 0);
        const c = coluna + (direcao === 1 || direcao === 2 || direcao === 3 ? i : direcao === 5 || direcao === 6 || direcao === 7 ? -i : 0);
        const celula = obterCelula(r, c, elementoGrid);
        celula.dataset.letra = palavra[i];
        celula.textContent = palavra[i];
        celula.dataset.palavra = palavra;
    }
};

const obterCelula = (linha, coluna, elementoGrid) => {
    return elementoGrid.querySelector(`.celula[data-linha='${linha}'][data-coluna='${coluna}']`);
};

const preencherCelulasVazias = (elementoGrid) => {
    const celulas = elementoGrid.querySelectorAll('.celula');
    celulas.forEach(celula => {
        if(!celula.dataset.letra) {
            const letraAleatoria = letras[Math.floor(Math.random() * letras.length)];
            celula.dataset.letra = letraAleatoria;
            celula.textContent = letraAleatoria;
        }
    });
};

const iniciarFase = () => {
    encontradas = 0;
    palavras = todasPalavras[faseAtual];
    listaPalavras.innerHTML = '';
    palavras.forEach(palavra => {
        const li = document.createElement('li');
    });
    criarGrid(grid);
    colocarPalavras(grid);
    preencherCelulasVazias(grid);
};

const iniciarJogo = () => {
    pontos = parseInt(localStorage.getItem('cacaPalavrasPontos')) || 0;
    faseAtual = parseInt(localStorage.getItem('cacaPalavrasFase')) || 0;
    valorPontuacao.textContent = pontos;
    iniciarFase();
};

iniciarJogo();

const mostrarDicas = () => {
    criarGrid(caçaPalavrasDica);
    for(let linha = 0; linha < tamanho; linha++) {
        for(let coluna = 0; coluna < tamanho; coluna++) {
            const celulaPrincipal = obterCelula(linha, coluna, grid);
            const celulaDica = obterCelula(linha, coluna, caçaPalavrasDica);
            celulaDica.dataset.letra = celulaPrincipal.dataset.letra;
            celulaDica.textContent = celulaPrincipal.textContent;
            if(celulaPrincipal.classList.contains('selecionada')) {
                celulaDica.classList.add('selecionada');
            }
            if(celulaPrincipal.dataset.palavra) {
                celulaDica.classList.add('dica');
            }
        }
    }

    modalDica.style.display = 'block';
};

const fecharModal = () => {
    modalDica.style.display = 'none';
};

botaoDica.addEventListener('click', mostrarDicas);

const selecionarPalavra = (inicio, fim) => {
    const linhaInicial = parseInt(inicio.dataset.linha);
    const colunaInicial = parseInt(inicio.dataset.coluna);
    const linhaFinal = parseInt(fim.dataset.linha);
    const colunaFinal = parseInt(fim.dataset.coluna);

    const palavra = [];
    let direcao = null;
    if(linhaInicial === linhaFinal) {
        direcao = colunaInicial < colunaFinal ? 2 : 6;
    } else if (colunaInicial === colunaFinal) {
        direcao = linhaFinal < linhaFinal ? 4 : 0;
    } else if (linhaInicial < linhaFinal && colunaInicial < colunaFinal) {
        direcao = 3;
    } else if (linhaInicial < linhaFinal && colunaInicial > colunaFinal) {
        direcao = 5;
    } else if (linhaInicial > linhaFinal && colunaInicial < colunaFinal) {
        direcao = 1;
    } else if (linhaInicial > linhaFinal && colunaInicial > colunaFinal) {
        direcao = 7;
    }
    if (direcao !== null) {
        let r = linhaInicial;
        let c = colunaInicial;
        while (r !== linhaFinal || c !== colunaFinal) {
            const celula = obterCelula(r, c, grid);
            palavra.push(celula);
            if(direcao === 0 || direcao === 1 || direcao === 7) r--;
            if(direcao === 3 || direcao === 4 || direcao === 5) r++;
            if(direcao === 1 || direcao === 2 || direcao === 3) c++;
            if(direcao === 5 || direcao === 6 || direcao === 7) c--;
        }
        palavra.push(fim);

        if(verificarPalavraValida(palavra)) {
            palavra.forEach(celula => celula.classList.add('selecionada'));
            riscarPalavra(palavra[0].dataset.palavra);
            encontradas++;
            verificarConclusao();
        }
    }
};

const verificarConclusao = () => {
    if(encontradas === palavras.length) {
        pontos += 10;
        localStorage.setItem('cacaPalavrasPontos', pontos);
        localStorage.setItem('cacaPalavrasFase', faseAtual);
        valorPontuacao.textContent = pontos;
        mensagem.style.display = 'block';
    }
};

// linha 797, página 117