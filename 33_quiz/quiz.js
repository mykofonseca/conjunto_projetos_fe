document.addEventListener('DOMContentLoaded', () => {
    const perguntas = [
        { pergunta: "Qual é o maior animal terrestre?", 
            opcoes: ["Elefante africano", "Rinoceronte branco", "Girafa", "Urso polar"], 
            resposta: "Elefante africano"},
        { pergunta: "Qual animal é conhecido como o 'Rei da Selva'?", 
            opcoes: ["Tigre", "Leão", "Elefante", "Gorila"],
            resposta: "Leão"},
        { pergunta: "Qual destes animais é um mamífero aquático?",
            opcoes: ["Tubarao", "Baleia-azul", "Polvo", "Camarão"],
            resposta: "Baleia-azul"},
        { pergunta: "Quantas vidas diz-se que um gato tem?", 
            opcoes: ["1", "5", "7", "9"],
            resposta: "7"},
        { pergunta: "Qual é o animal mais rápido do mundo?", 
            opcoes: ["Falcão peregrino", "Leopardo", "Guepardo", "Leão"],
            resposta: "Falcão peregrino"},
        { pergunta: "Qual desses animais é um réptil?",
            opcoes:["Sapo", "Salamandra", "Cobra", "Baleia"],
            resposta: "Cobra"},
        { pergunta: "Qual é o maior animal do mundo?",
            opcoes: ["Elefante africano", "Baleia-azul", "Girafa", "Tubarão-branco"],
            resposta: "Baleia-azul"},
        { pergunta: "O que é um Panda gigante?", 
            opcoes: ["Carnívoro", "Herbívoro", "Onívoro", "Insetívoro"],
            resposta: "Herbívoro"},
        { pergunta: "Qual destes animais é conhecido por ter uma excelente memória?",
            opcoes: ["Elefante", "Cachorro", "Gato", "Peixe"],
            resposta: "Elefante"},
        { pergunta: "Qual animal é o símbolo nacional da Austrália?",
            opcoes: ["Canguru", "Koala", "Emu", "Dingo"],
            resposta: "Canguru" }
    ];

    let perguntaAtual = 0;
    let pontuacao = 0;
    let respostasUsuario = [];
    const elementoPergunta = document.getElementById('pergunta');
    const elementoOpcoes = document.getElementById('opcoes');
    const elementoResultado = document.getElementById('resultado');
    const botaoSubmeter = document.getElementById('submeter');

    function mostrarPergunta(pergunta) {
        elementoPergunta.textContent = pergunta.pergunta;
        elementoOpcoes.innerHTML = '';
        pergunta.opcoes.forEach(opcao => {
            const label = document.createElement('label');
            const radio = document.createElement('input');

            radio.type = 'radio';
            radio.name = 'opcao';
            radio.value = opcao;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(opcao));
            elementoOpcoes.appendChild(label);
        });
    }

    function verificarResposta() {
        const opcaoSelecionada = document.querySelector('input[name="opcao"]:checked');

        if(!opcaoSelecionada) {
            alert('Por favor, selecione uma opção!');
            return;
        }

        respostasUsuario.push(opcaoSelecionada.value);

        if(opcaoSelecionada.value === perguntas[perguntaAtual].resposta) {
            pontuacao++;
        }
        perguntaAtual++;

        if(perguntaAtual < perguntas.length) {
            mostrarPergunta(perguntas[perguntaAtual]);
        } else {
            mostrarResultado();
        }
    }

    function mostrarResultado() {
        elementoPergunta.style.display = 'none';
        elementoOpcoes.style.display = 'none';
        botaoSubmeter.style.display = 'none';

        const porcentagemPontuacao = (pontuacao / perguntas.length) * 100;

        let resultadoHTML = porcentagemPontuacao >= 70 ?
        `Parabéns! Você foi aprovado com ${pontuacao} de ${perguntas.length} acertos.`:
        `Você foi aprovado. Você acertou ${pontuacao} de ${perguntas.length}.`;

        resultadoHTML += '<br><br><h2>Respostas:</h2>'

        perguntas.forEach((pergunta, index) => {
            resultadoHTML += `<p><strong>Pergunta ${index + 1}:</strong> ${pergunta.pergunta}<br>`;
            resultadoHTML += `<strong>Resposta correta:</strong> ${pergunta.resposta}<br>`;

            resultadoHTML += `<strong>Sua resposta:</strong> ${respostasUsuario[index] ? respostasUsuario[index] : 'Não respondida'}</p>`;

        });

        elementoResultado.innerHTML = resultadoHTML;
    }

    mostrarPergunta(perguntas[perguntaAtual]);
    botaoSubmeter.addEventListener('click', verificarResposta);
});