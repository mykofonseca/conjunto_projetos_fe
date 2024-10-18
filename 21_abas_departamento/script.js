document.addEventListener('DOMContentLoaded', carregarDadosExcel);
let dadosDepartamentos = {};

function carregarDadosExcel() {
    fetch('funcionarios.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array'});
        const primeiraAba = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraAba];
        const dadosJson = XLSX.utils.sheet_to_json(planilha, { header: 1 });
        processarDados(dadosJson);
    });
}

function processarDados(dados) {
    const [cabecalhos, ...linhas] = dados;
    dadosDepartamentos = {};
    linhas.forEach(linha => {
        const [departamento, cargo, nome, salario] = linha;
        if(!dadosDepartamentos[departamento]) {
            dadosDepartamentos[departamento] = [];
        }
        dadosDepartamentos[departamento].push({ Cargo: cargo, Nome: nome, Salário: formatarSalario(salario) });
    });
    criarAbas(dadosDepartamentos);
    document.getElementById('indicador-carregamento').style.display = 'none';
    document.getElementById('conteudo').style.display = 'block';
}

function formatarSalario(salario) {
    return parseFloat(salario)
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function criarAbas(departamentos) {
    const tabsContainer = document.getElementById('container-abas');
    tabsContainer.innerHTML = `
        <ul class="nav nav-tabs" id="departamentoAbas" role="tablist"></ul>
        <div class="tab-content" id="departamentosConteudo"></div> 
    `;
    const navTabs = document.getElementById('departamentosAbas');
    const tabContent = document.getElementById('departamentosConteudo');
    let isActive = true;
    for(const [departamento, funcionarios] of Object.entries(departamentos)) {
        const departamentoId = departamento.replace(/\s+/g, '-').toLowerCase();
        navTabs.innerHTML += `
        <li class="nav-item">
            <a class="nav-link ${isActive ? 'active' : ''}" id="${departamentoId}-tab" data-toggle="tab" href="#${departamentoId}" role="tab"> 
                ${departamento}
            </a>
        </li>    
        `;
        tabContent.innerHTML += `
            <div class="tab-pane fade ${isActive ? 'show active' : ''}" id="${departamentoId}" role="tabpanel">
                <div class="table-responsive">
                    <table class="table table-striped table-bordered mt-3">
                        <thead class="thead-dark">
                            <tr>
                                <th onclick="ordenarTabela('${departamentoId}', 0)">Cargo</th>
                                <th onclick="ordenarTabela('${departamentoId}', 1)">Nome</th>
                                <th onclick="ordenarTabela('${departamentoId}', 2)">Salário</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${funcionarios.map(funcionario => `
                                <tr>
                                    <td>${funcionario.Cargo}</td>
                                    <td>${funcionario.Nome}</td>
                                    <td>${funcionario.Salário}</td>
                                </tr>
                                `).join('')}
                        </tbody>
                    </table>
                </div>                    
            </div>
            `;
            isActive = false;
    }
    navTabs.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = tab.getAttribute('href').substring(1);
            navTabs.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('show', 'active'));
            tab.classList.add('active');
            document.getElementById(targetId).classList.add('show', 'active');
        });
    });
    document.getElementById('campo-pesquisa').addEventListener('input', filtrarFuncionarios);
    document.getElementById('exportar-selecionado').addEventListener('click', exportarAbaSelecionada);
    document.getElementById('exportar-todos').addEventListener('click', exportarTodasAbas);
}

function ordenarTabela(departamentoId, coluna) {
    const tabela = document.querySelector(`#${departamentoId} table tbody`);
    const linhas = Array.from(tabela.rows);
    linhas.sort((a, b) => {
        const valorA = a.cells[coluna].innerText;
        const valorB = b.cells[coluna].innerText;
        if(coluna === 2) {
            return parseFloat(valorA.replace('R$', '').replace(/\./g, '').replace(',', '.')) - 
                    parseFloat(valorB.replace('R$', '').replace(/\./g, '').replace(',', '.'));
        }
        return valorA.localeCompare(valorB);
    });
    linhas.forEach(linha => tabela.appendChild(linha));
}

function exportarTodasAbas() {
    const wb = XLSX.utils.book_new();
    Object.entries(dadosDepartamentos).forEach(([departamento, funcionarios]) => {
        const ws = XLSX.utils.json_to_sheet(funcionarios);
        XLSX.utils.book_append_sheet(wb, ws, departamento);
    });
    XLSX.writeFile(wb, 'todos_departamentos.xlsx');
}

function exportarAbaSelecionada() {
    const abaAtiva = document.querySelector('.tab-pane.show.active');
    const departamentoId = abaAtiva.id;
    const departamentoNome = document.querySelector(`#${departamentoId}-tab`).innerText;
    const funcionarios = dadosDepartamentos[departamentoNome];
    const ws = XLSX.utils.json_to_sheet(funcionarios);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, departamentoNome);
    XLSX.writeFile(wb, `${departamentoNome}.xlsx`);
}

function filtrarFuncionarios(event) {
    const termo = event.target.value.toLowerCase();
    const abas = document.querySelectorAll('.tab-pane');
    abas.forEach(aba => {
        const linhas = aba.querySelectorAll('tbody tr');
        linhas.forEach(linha => {
            const nome = linha.cells[1].innerText.toLowerCase();
            if(nome.includes(termo)) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    });
}