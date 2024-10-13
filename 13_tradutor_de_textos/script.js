document.getElementById('btnTraduzir').addEventListener('click', function() {
    const textoOrigem = document.getElementById('textoOrigem').value;
    const idiomaOrigem = document.getElementById('idiomaOrigem').value;
    const idiomaDestino = document.getElementById('idiomaDestino').value;
    
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${idiomaOrigem}&tl=${idiomaDestino}&dt=t&q=${textoOrigem}`)

    .then(response => response.json())
    .then(data => {
        const traducao = data[0][0][0];
        
        document.getElementById('resultado').innerText = traducao;
    })

    .catch(error => console.error('Erro ao traduzir texto: ', error))
});