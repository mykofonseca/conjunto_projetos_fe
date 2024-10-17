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
let selecionad0 = false;

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
                colocarPalavras(linhaInicial, colunaInicial, palavra, direcao, elementoGrid);
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

// linha 268, slide 98/124