document.addEventListener('DOMContentLoaded', carregarDadosExcel);
let dadosEstudantes = {};

function carregarDadosExcel() {
    fetch('notas_estudantes.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const primeiraAba = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraAba];
        const dadosJson = XLSX.utils.sheet_to_json(planilha, {header: 1});
        processarDados(dadosJson);
    })
    .catch(error => {
        console.error('Erro ao carregar arquivo:', error);
        document.getElementById('indicador-carregamento').textContent = 'Erro ao carregar dados';
    });
}

function processarDados(dados) {
    const [cabecalhos, ...linhas] = dados;
    dadosEstudantes = {};
    
    linhas.forEach(linha => {
        const [nome, turma, ...notasEFaltas] = linha;
        const notas = notasEFaltas.slice(0, -1).map(nota => parseFloat(nota) || 0);
        const faltas = parseInt(notasEFaltas[notasEFaltas.length - 1]) || 0;
        
        if(!dadosEstudantes[turma]) {
            dadosEstudantes[turma] = [];
        }
        
        const media = calcularMedia(notas);
        const status = determinarStatus(media, faltas);
        dadosEstudantes[turma].push({ 
            Nome: nome, 
            Notas: notas, 
            Faltas: faltas, 
            Media: media, 
            Status: status 
        });
    });
    
    criarAbas(dadosEstudantes);
    document.getElementById('indicador-carregamento').style.display = 'none';
    document.getElementById('conteudo').style.display = 'block';
}

function criarAbas(turmas) {
    const abasTurmas = document.getElementById('abasTurmas');
    const conteudoAbas = document.getElementById('conteudoAbas');
    abasTurmas.innerHTML = '';
    conteudoAbas.innerHTML = '';
    
    let ativo = true;
    
    for (const [turma, estudantes] of Object.entries(turmas)) {
        const turmaId = turma.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
        
        const abaItem = document.createElement('li');
        abaItem.className = 'aba-item';
        
        const abaLink = document.createElement('a');
        abaLink.className = `aba-link${ativo ? ' ativa' : ''}`;
        abaLink.textContent = turma;
        abaLink.setAttribute('data-turma-id', turmaId);
        abaLink.onclick = () => selecionarAba(turmaId);
        
        abaItem.appendChild(abaLink);
        abasTurmas.appendChild(abaItem);

        const conteudoAba = document.createElement('div');
        conteudoAba.className = `conteudo-aba${ativo ? ' ativa' : ''}`;
        conteudoAba.id = turmaId;
        
        conteudoAba.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-bordered mt-3">
                    <thead class="thead-dark">
                        <tr>
                            <th onclick="ordenarTabela('${turmaId}', 0)">Nome</th>
                            <th onclick="ordenarTabela('${turmaId}', 1)">Nota 1</th>
                            <th onclick="ordenarTabela('${turmaId}', 2)">Nota 2</th>
                            <th onclick="ordenarTabela('${turmaId}', 3)">Nota 3</th>
                            <th onclick="ordenarTabela('${turmaId}', 4)">Nota 4</th>
                            <th onclick="ordenarTabela('${turmaId}', 5)">Faltas</th>
                            <th onclick="ordenarTabela('${turmaId}', 6)">Média</th>
                            <th onclick="ordenarTabela('${turmaId}', 7)">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${estudantes.map((estudante, index) => `
                            <tr data-id="${turma}-${index}">
                                <td>${estudante.Nome}</td>
                                ${estudante.Notas.map(nota => `<td>${nota.toFixed(2)}</td>`).join('')}
                                <td>${estudante.Faltas}</td>
                                <td>${estudante.Media.toFixed(2)}</td>
                                <td class="${removerAcentos(estudante.Status.replace(/\s+/g, '-').toLowerCase())}">${estudante.Status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        conteudoAbas.appendChild(conteudoAba);
        ativo = false;
    }
}

function selecionarAba(turmaId) {
    const abaLinks = document.querySelectorAll('.aba-link');
    const conteudoAbas = document.querySelectorAll('.conteudo-aba');
    
    abaLinks.forEach(link => link.classList.remove('ativa'));
    conteudoAbas.forEach(conteudo => conteudo.classList.remove('ativa'));
    
    document.querySelector(`[data-turma-id="${turmaId}"]`).classList.add('ativa');
    document.getElementById(turmaId).classList.add('ativa');
}

function calcularMedia(notas) {
    if (notas.length === 0) return 0;
    const soma = notas.reduce((acc, nota) => acc + nota, 0);
    return soma / notas.length;
}

function determinarStatus(media, faltas) {
    if (faltas > 10) {
        return 'Reprovado por Faltas';
    } else if (media >= 7) {
        return 'Aprovado';
    } else if (media >= 5) {
        return 'Recuperação';
    } else {
        return 'Reprovado por Nota';
    }
}

function ordenarTabela(turmaId, coluna) {
    const tabela = document.querySelector(`#${turmaId} table tbody`);
    const linhas = Array.from(tabela.rows);
    let ordem = true; 
    
    linhas.sort((a, b) => {
        const valorA = a.cells[coluna].innerText;
        const valorB = b.cells[coluna].innerText;
        
        if (!isNaN(valorA) && !isNaN(valorB)) {
            return ordem ? parseFloat(valorA) - parseFloat(valorB) : parseFloat(valorB) - parseFloat(valorA);
        }
        return ordem ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
    });
    
    linhas.forEach(linha => tabela.appendChild(linha));
    ordem = !ordem;
}

function filtrarEstudantes(event) {
    const termo = event.target.value.toLowerCase();
    const abas = document.querySelectorAll('.conteudo-aba');
    
    abas.forEach(aba => {
        const linhas = aba.querySelectorAll('tbody tr');
        linhas.forEach(linha => {
            const conteudo = Array.from(linha.cells)
                .map(cell => cell.textContent.toLowerCase())
                .join(' ');
            
            linha.style.display = conteudo.includes(termo) ? '' : 'none';
        });
    });
}

function exportarNotasFiltradas() {
    const wb = XLSX.utils.book_new();
    let encontrouLinhas = false;
    
    for (const [turma, _] of Object.entries(dadosEstudantes)) {
        const turmaId = turma.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
        const tabela = document.querySelector(`#${turmaId} table tbody`);
        
        if (tabela) {
            const linhasVisiveis = Array.from(tabela.rows).filter(row => row.style.display !== 'none');
            
            if (linhasVisiveis.length > 0) {
                encontrouLinhas = true;
                const dadosFiltrados = linhasVisiveis.map(linha => {
                    const cells = linha.cells;
                    return {
                        Nome: cells[0].innerText,
                        'Nota 1': cells[1].innerText,
                        'Nota 2': cells[2].innerText,
                        'Nota 3': cells[3].innerText,
                        'Nota 4': cells[4].innerText,
                        Faltas: cells[5].innerText,
                        Media: cells[6].innerText,
                        Status: cells[7].innerText
                    };
                });

                const ws = XLSX.utils.json_to_sheet(dadosFiltrados);
                XLSX.utils.book_append_sheet(wb, ws, turma);
            }
        }
    }
    
    if (encontrouLinhas) {
        XLSX.writeFile(wb, 'notas_estudantes_filtrados.xlsx');
    } else {
        alert('Nenhuma linha visível para exportar.');
    }
}

function removerAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('campo-pesquisa').addEventListener('input', filtrarEstudantes);
    document.getElementById('exportar-filtrados').addEventListener('click', exportarNotasFiltradas);
});