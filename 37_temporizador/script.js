let horas = 0, minutos = 0, segundos = 0;
let intervalo;
let pausado = false;
const atualizarDisplay = () => {
    document.getElementById('horas').textContent = String(horas).padStart(2, '0');
    document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
    document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
}

const iniciarTemporizador = () => {
    if(intervalo) clearInterval(intervalo);
    horas = parseInt(document.getElementById('entrada-horas').value);
    minutos = parseInt(document.getElementById('entrada-minutos').value);
    segundos = parseInt(document.getElementById('entrada-segundos').value);

    if(horas === 0 && minutos === 0 && segundos === 0) {
        alert('Defina um tempo válido para o temporizador!');
        return;
    }

    if(minutos > 59) {
        horas = minutos / 60 + horas;
        minutos = 59; 
        horas = Math.round(horas)
        alert('Valor arrendodado em minutos.');
    }

    if(segundos > 59) {
        minutos = segundos / 60 + minutos;
        segundos = 59; 
        minutos = Math.round(minutos)
        horas = minutos / 60 + horas;
        minutos = 59; 
        horas = Math.round(horas)
        alert('Valor arrendodado em segundos.');
    }

    // tratamento simples adicionado, não contando resto de valor decimal

    atualizarDisplay();
    pausado = false;
    intervalo = setInterval(() => {
        if(!pausado) {
            if(segundos === 0) {
                if(minutos === 0) {
                    if(horas === 0) {
                        clearInterval(intervalo);
                        alert('O tempo acabou!');
                        reiniciarBotoes();
                        return;
                    } else {
                        horas --;
                        minutos = 59;
                        segundos = 59;
                    }
                } else {
                    minutos --;
                    segundos = 59;
                }
            } else {
                segundos --;
            }
            atualizarDisplay();
        }
    }, 1000);

    document.getElementById('iniciar').disabled = true;
    document.getElementById('pausar').disabled = false;
    document.getElementById('continuar').disabled = true;
    document.getElementById('resetar').disabled = false;
}

const reiniciarBotoes = () => {
    document.getElementById('iniciar').disabled = false;
    document.getElementById('pausar').disabled = true;
    document.getElementById('continuar').disabled = true;
    document.getElementById('resetar').disabled = true;
} 

const pausarTemporizador = () => {
    pausado = true;
    document.getElementById('pausar').disabled = true;
    document.getElementById('continuar').disabled = false;
}

const continuarTemporizador = () => {
    pausado = false;
    document.getElementById('pausar').disabled = false;
    document.getElementById('continuar').disabled = true;
}

const resetarTemporizador = () => {
    clearInterval(intervalo);
    horas = 0;
    minutos = 0;
    segundos = 0;
    pausado = false;
    atualizarDisplay();
    reiniciarBotoes();
}

document.getElementById('iniciar').addEventListener('click', iniciarTemporizador);
document.getElementById('pausar').addEventListener('click', pausarTemporizador);
document.getElementById('continuar').addEventListener('click', continuarTemporizador);
document.getElementById('resetar').addEventListener('click', resetarTemporizador);

atualizarDisplay();
reiniciarBotoes();