function atualizarTotais(contadorLinhas, somaSalarios) {
    document.getElementById("contadorLinhas").textContent = contadorLinhas;
    document.getElementById("somaSalarios").textContent = somaSalarios.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function formatarSalario(salario) {
    return parseFloat(salario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function preencherDropdown(id, valores) {
    var dropdown = document.getElementById(id);
    dropdown.innerHTML = '<option value="">Todos</option>';
    valores.forEach(valor => {
        var opcao = document.createElement("option");
        opcao.value = valor;
        opcao.textContent = valor;
        dropdown.appendChild(opcao);
    });
}

function carregarDados(dados) {
    var corpoTabela = document.getElementById("corpoTabela");
    var contadorLinhas = 0;
    var somaSalarios = 0;
    var nomes = new Set(), departamentos = new Set(), cargos = new Set(), tempos = new Set(); 
    dados.forEach(funcionario => {
        contadorLinhas++;
        somaSalarios += parseFloat(funcionario.Salário);

        nomes.add(funcionario.Nome)
        departamentos.add(funcionario.Departamento)
        cargos.add(funcionario.Cargo)
        tempos.add(funcionario["Tempo de Empresa (anos)"]);
        var salarioFormatado = formatarSalario(funcionario.Salário);
        var linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${funcionario.Nome}</td>
            <td>${funcionario.Departamento}</td>
            <td>${funcionario.Cargo}</td>
            <td data-value="${funcionario.Salário}">${salarioFormatado}</td>
            <td>${funcionario["Tempo de Empresa (anos)"]}</td>
            `;
            corpoTabela.appendChild(linha);
    });
    preencherDropdown('filtroNome', nomes);
    preencherDropdown('filtroDepartamento', departamentos);
    preencherDropdown('filtroCargo', cargos);
    preencherDropdown('filtroTempo', tempos);

    atualizarTotais(contadorLinhas, somaSalarios);
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('funcionarios.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const primeiraSheet = workbook.Sheets[workbook.SheetNames[0]];
        const dadosJson = XLSX.utils.sheet_to_json(primeiraSheet);
        carregarDados(dadosJson);
    })
    .catch(error => {
        console.error('Erro ao carregar arquivo:', error);
        document.getElementById('indicador-carregamento').textContent = 'Erro ao carregar dados';
    });       
})

function filtrarTabela() {
    var filtroNome = document.getElementById("filtroNome").value.toLowerCase();
    var filtroDepartamento = document.getElementById("filtroDepartamento").value.toLowerCase();
    var filtroCargo = document.getElementById("filtroCargo").value.toLowerCase();
    var filtroTempo = document.getElementById("filtroTempo").value.toLowerCase();
    var linhas = document.getElementById("corpoTabela").rows;
    var contadorLinhas = 0;
    var somaSalarios = 0;
    for(var i = 0; i < linhas.length; i++) {
        var nome = linhas[i].cells[0].textContent.toLowerCase();
        var departamento = linhas[i].cells[1].textContent.toLowerCase();
        var cargo = linhas[i].cells[2].textContent.toLowerCase();
        var salario = parseFloat(linhas[i].cells[3].getAttribute("data-value"));
        var tempo = linhas[i].cells[4].textContent.toLowerCase();

        var exibirLinha = 
        (filtroNome === "" || nome.includes(filtroNome)) &&
        (filtroDepartamento === "" || departamento.includes(filtroDepartamento)) &&
        (filtroCargo === "" || cargo.includes(filtroCargo)) &&
        (filtroTempo === "" || tempo.includes(filtroTempo));

        if(exibirLinha) {
            linhas[i].style.display = "";
            contadorLinhas++;
            somaSalarios += salario;
        } else {
            linhas[i].style.display = "none";        
        }
    }
    atualizarTotais(contadorLinhas, somaSalarios);
}

function exportarParaExcel() {
    var tabelaOriginal = document.getElementById("tabelaFuncionarios");
    var tabelaClone = tabelaOriginal.cloneNode(true);
    var ths = tabelaClone.querySelectorAll('select');
    ths.forEach(function(th) {
        var selects = th.querySelectorAll('select');
        selects.forEach(function(select) {
            select.remove();
        });
    });
    var workbook = XLSX.utils.table_to_book(tabelaClone, {
        sheet: "Funcionarios",
        display: true
    });
    var dataAtual = new Date();
    var nomeArquivo = 'funcionarios_' + dataAtual.toLocaleDateString('pt-BR').replace(/\//g, '-') + '.xlsx';
    XLSX.writeFile(workbook, nomeArquivo);
}