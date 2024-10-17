function adicionarNoVisor(valor) {
    document.getElementById('visor').value += valor;
}

function limparVisor() {
    document.getElementById('visor').value = '';
}

function calcular() {
    var expressao = document.getElementById('visor').value;
    var resultado = eval(expressao);
    
    if(Number.isFinite(resultado)) {
        document.getElementById('visor').value = resultado.toFixed(2);
    } else {
        document.getElementById('visor').value = 'Erro';
    }
}

document.addEventListener('keydown', function(event) {
    const tecla = event.key;
    if((tecla >= '0' && tecla <= '9') || tecla === '.' || tecla === '+' || tecla === '-' || tecla === '*' || tecla === '/' || tecla === 'Enter' || tecla === 'Backspace' || tecla === 'Escape') {
        if(tecla === 'Enter') {
            calcular();
        } else if(tecla === 'Escape') {
            limparVisor();
        } else if(tecla === 'Backspace') {
            const visor = document.getElementById('visor');
                visor.value = visor.value.slice(0, -1);
        } else {
            adicionarNoVisor(tecla);
        }
    } 
});