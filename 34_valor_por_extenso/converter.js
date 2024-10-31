function numeroPorExtenso(numero) {
    const unidades = ["zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove"];
    const dezenas = ["", "Dez", "Vinte", "Trinta", "Quarenta", "Cinquenta", "Sessenta", "Setenta", "Oitenta", "Noventa"];
    const especiais = ["Onze", "Doze", "Treze", "Quatorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove"];
    const centenas = ["", "Cento", "Duzentos", "Trezentos", "Quatrocentos", "Quinhentos", "Seiscentos", "Setecentos", "Oitocentos", "Novecentos"];
    const classes = [["", ""], [" Mil", " Mil"], [" Milhão", " Milhões"], [" Bilhão", " Bilhões"], [" Trilhão", " Trilhões"]];

    function converterParte(num) {
        if (num < 10) return unidades[num];
        if (num === 10) return "Dez";
        if (num < 20) return especiais[num - 11];
        if (num < 100) {
            let dec = Math.floor(num / 10);
            let uni = num % 10;
            return dezenas[dec] + (uni ? " e " + unidades[uni] : "");
        }

        let cen = Math.floor(num / 100);
        let resto = num % 100;
        return (cen === 1 && resto === 0 ? "Cem" : centenas[cen]) + (resto ? " e " + converterParte(resto) : "");
    }
    return formatarNumero(Math.abs(numero));

    function formatarNumero(num) {
        if (num === 0) return "Zero";
        let indice = 0;
        let partes = [];
        while (num > 0) {
            let pedaco = num % 100;
            let prefixo = converterParte(pedaco);
            if(pedaco > 0) {
                let sufixo = classes[indice][pedaco > 1 ? 1 : 0];
                prefixo += sufixo;
                if(prefixo.trim() !== "") {
                    partes.unshift(prefixo);
                }
            }
            num = Math.floor(num / 1000);
            indice++;
        }

        return partes.length > 0 ? partes.join(" e ").replace(/\s+/g, ' ').trim() : "Zero";
    }
    return formatarNumero(Math.abs(numero));
}

function converterParaExtenso() {
    let numero = parseFloat(document.getElementById('numeroInput').value);
    let reais = Math.floor(numero);
    let centavos = Math.round((numero - reais) * 100);
    let extensoReais = numeroPorExtenso(reais) + (reais === 1 ? ' Real' : ' Reais');
    let extensoCentavos = centavos > 0 ? numeroPorExtenso(centavos) + (centavos === 1 ? ' Centavos' : ' Centavos') : '';
    let resultado = extensoReais;

    if(extensoCentavos) resultado += ' e ' + extensoCentavos;
    document.getElementById('resultado').textContent = resultado.charAt(0).toUpperCase() + resultado.slice(1);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('numeroInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            converterParaExtenso();
        }
    });
});
