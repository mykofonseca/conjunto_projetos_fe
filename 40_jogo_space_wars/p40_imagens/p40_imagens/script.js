const telaJogo = document.getElementById('telaJogo');
const contexto = telaJogo.getContext('2d');
const somTiro = document.getElementById('somTiro');
const modal = document.getElementById('modal');
const mensagemModal = document.getElementById('mensagemModal');
const botaoContinuar = document.getElementById('botaoContinuar');
const botaoTerminar = document.getElementById('botaoTerminar');

class Objeto {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }
    desenhar() {
        contexto.fillStyle = this.cor;
        contexto.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Jogador extends Objeto {
    constructor(x, y, largura, altura, imagem) {
        super(x, y, largura, altura);
        this.imagem = imagem;
        this.velocidade = 0;
        this.vidas = parseInt(localStorage.getItem('vidas'), 10) || 3;
    }
    desenhar() {
        contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        this.x += this.velocidade;
        this.x = Math.max(0, Math.min(this.x, telaJogo.width - this.largura));
    }

    mover(direcao) {
        const velocidade = 5;
        this.velocidade = 0;
    }

    perderVida() {
        this.vidas--;
        document.getElementById('vidas').innerText = `Vidas: ${this.vidas}`;

        if(this.vidas === 0) {
            localStorage.setItem('vidas', 3);
            exibirModal('Você perdeu! Game Over', false);
        }
    }

}

class Bala extends Objeto {
    constructor(x, y, largura, altura, cor, velocidade) {
        super(x, y, largura, altura, cor);
        this.velocidade = velocidade;
    }

    atualizar() {
        this.y += this.velocidade;
    }
}

class Inimigo extends Objeto {
    constructor(x, y, largura, altura, imagem) {
        super(x, y, largura, altura, imagem);
        this.imagem = imagem;
        this.chanceTIro = 0.0003;
        this.direcao = 1;
    }
    desenhar() {
        contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }
    atualizar() {
        this.x += this.direcao;
        if(Math.random() < this.chanceTIro) {
            this.atirar();
        }
    }

    atirar() {
        balasInimigas.push(new Bala(this.x + this.largura / 2 - 2, this.y + this.altura, 4, 10, 'blue', 2));
    }
}

function exibirModal(mensagem, podeContinuar) {
    mensagemModal.innerText = mensagem;
    if(podeContinuar) {
        botaoContinuar.style.display = 'inline-block';
    } else {
        botaoContinuar.style.display = 'none';
    }
    modal.style.display = 'flex';
}

class GradeInimigos {
    constructor(linhas, colunas, espacamentoInimigo, larguraInimigo, alturaInimigo) {
        this.linhas = linhas;
        this.colunas = colunas;
        this.espacamentoInimigo = espacamentoInimigo;
        this.larguraInimigo = larguraInimigo;
        this.inimigos = [];
        this.criarInimigos();
        this.velocidade = 1;
        this.direcao = 1;
        this.pontuacao = 0; 
    }

    criarInimigos() {
        this.inimigos = [];
        for(let linha = 0; linha < this.linhas; linha++) {
            for(let coluna = 0; coluna < this.colunas; coluna++) {
                this.inimigos.push(new Inimigo(
                    coluna * (this.larguraInimigo + this.espacamentoInimigo),
                    linha * (this.alturaInimigo + this.espacamentoInimigo),
                    this.larguraInimigo,
                    this.alturaInimigo,
                    imagemInimigo
                ));
            }
        }
    }
}

atualizar() {
    let atingiuParede = false;
    this.inimigos.forEach(inimigo => {
        inimigo.atualizar();
        if(inimigo.x <= 0 || inimigo.x + inimigo.largura >= telaJogo.width) {
            atingiuParede = true;
        }
    });
    if(atingiuParede) {
        this.direcao *= -1;
        const offsetY = this.alturaInimigo + this.espacamentoInimigo;
        this.inimigos.forEach(inimigo => {
            inimigo.direcao = this.direcao;
            inimigo.y += offsetY;
        });
    }

    this.inimigos.forEach(inimigo => {
        if (
            inimigo.x < jogador.x + jogador.largura &&
            inimigo.x < inimigo.largura + jogador.x &&
            inimigo.y < inimigo.largura + jogador.y &&
            inimigo.y < inimigo.altura + jogador.y &&
            inimigo.y < inimigo.y + jogador.altura &&
        ) {
            jogador.perderVida();
        }
        if(inimigo.y + inimigo.altura >= telaJogo.height) {
            jogador.perderVida();
            // linha 581, página 272
        }
    })
}