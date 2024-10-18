function filtrarTabela() {
    var filtroNome = document.getElementById("filtroNome").value.toLowerCase();
    var filtroDepartamento = document.getElementById("filtroDepartamento").value.toLowerCase();
    var filtroCargo = document.getElementById("filtroCargo").value.toLowerCase();
    var filtroSalario = document.getElementById("filtroSalario").value.toLowerCase();
    var filtroTempo = document.getElementById("filtroTempo").value.toLowerCase();
    var linhas = document.getElementById("corpoTabela").rows;

    for (var i = 0; i < linhas.length; i++) {
        var nome = linhas[i].cells[0].textContent.toLowerCase();
        var departamento = linhas[i].cells[1].textContent.toLowerCase();
        var cargo = linhas[i].cells[2].textContent.toLowerCase();
        var salario = linhas[i].cells[3].textContent.toLowerCase();
        var tempo = linhas[i].cells[4].textContent.toLowerCase();
        linhas[i].style.display = 
            (nome.includes(filtroNome) || filtroNome === "") &&
            (departamento.includes(filtroDepartamento) || filtroDepartamento === "") &&
            (cargo.includes(filtroCargo) || filtroCargo === "") &&
            (salario.includes(filtroSalario) || filtroSalario === "") &&
            (tempo.includes(filtroTempo) || filtroTempo === "")
            ? "" : "none";
    }
}

function formatarSalario(salario) {
    return parseFloat(salario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function carregarDados(dados) {
    var corpoTabela = document.getElementById("corpoTabela");
    dados.forEach(funcionario => {
        var linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${funcionario.Nome}</td>
            <td>${funcionario.Departamento}</td>
            <td>${funcionario.Cargo}</td>
            <td>${formatarSalario(funcionario.Salário)}</td>
            <td>${funcionario["Tempo de Empresa (anos)"]}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('funcionarios.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            var workbook = XLSX.read(data, {type: 'array'});
            var primeiraSheet = workbook.Sheets[workbook.SheetNames[0]];
            var dadosJSON = XLSX.utils.sheet_to_json(primeiraSheet);
            carregarDados(dadosJSON);
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
});

function exportarParaExcel() {
    var tabela = document.getElementById("tabelaFuncionarios");
    var workbook = XLSX.utils.table_to_book(tabela);
    XLSX.writeFile(workbook, 'funcionarios.xlsx');
}