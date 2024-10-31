document.addEventListener('DOMContentLoaded', function () {
    fetch('dados.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            var workbook = XLSX.read(data, { type: 'array' });
            var nomeDaPlanilha = workbook.SheetNames[0];
            var planilha = workbook.Sheets[nomeDaPlanilha];
            var dadosJson = XLSX.utils.sheet_to_json(planilha);
            var seletorProduto = document.getElementById('seletorProduto');
            dadosJson.forEach(function (linha) {
                var opcao = document.createElement('option');
                opcao.value = linha['Produto'];
                opcao.textContent = linha['Produto'];
                seletorProduto.appendChild(opcao);
            });
            seletorProduto.addEventListener('change', function () {
                var produtoSelecionado = this.value;
                var dadosProduto = dadosJson.find(item => item['Produto'] === produtoSelecionado);
                if (dadosProduto) {
                    atualizarGrafico(dadosProduto);
                }
            });
            if (dadosJson.length > 0) {
                seletorProduto.value = dadosJson[0]['Produto'];
                atualizarGrafico(dadosJson[0]);
            }
        })
        .catch(error => console.error('Erro ao carregar o arquivo Excel:', error));
});

function atualizarGrafico(dadosProduto) {
    var meta = 100;
    var vendas = dadosProduto['Vendas'];
    var percentual = (vendas / meta) * 100;
    var imagemPreenchimento = document.getElementById('imagemPreenchimento');
    var percentualDiv = document.getElementById('percentual');
    var descricaoProduto = document.getElementById('descricaoProduto');
    imagemPreenchimento.style.clipPath = `inset(${100 - percentual}% 0 0 0)`;
    percentualDiv.textContent = `${percentual.toFixed(2)}%`;
    descricaoProduto.textContent = `Produto: ${dadosProduto['Produto']} - Total de Vendas: ${vendas}`;
}