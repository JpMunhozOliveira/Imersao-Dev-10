const cardsWrapper = document.getElementById('cards-wrapper');
const filtroTipo = document.getElementById('filtro-tipo');
const filtroMarca = document.getElementById('filtro-marca');
let dados = [];
let ordemAno = 'asc'; // Padrão: mais velho primeiro
let choicesTipo;
let choicesMarca;

// Função para renderizar os cards na tela
function renderizarCards(cardsParaRenderizar) {
    cardsWrapper.innerHTML = '';

    if (cardsParaRenderizar.length === 0) {
        cardsWrapper.innerHTML = '<p class="nenhum-resultado">Nenhum resultado encontrado.</p>';
        return;
    }

    let ultimoAnoRenderizado = null;

    cardsParaRenderizar.forEach((item, index) => {

        if (item.ano !== ultimoAnoRenderizado) {
            const anoElement = document.createElement('div');
            anoElement.classList.add('timeline-year');
            anoElement.innerHTML = `<span>${item.ano}</span>`;
            cardsWrapper.appendChild(anoElement);
            ultimoAnoRenderizado = item.ano;
        }

        const article = document.createElement('article');
        article.classList.add('card');

        article.setAttribute('data-year', item.ano);

        const isEven = index % 2 === 1;
        const tituloHtml = isEven
            ? `<h2>${item.nome} <span class="card-tipo">${item.tipo}</span></h2>` // Direita
            : `<h2><span class="card-tipo">${item.tipo}</span> ${item.nome}</h2>`; // Esquerda

        const curiosidadeHtml = `<p class="card-curiosidade">${item.curiosidade}</p>`;

        const specsHtml = item.specs 
            ? `<div class="specs-container"><p><strong>Especificações:</strong></p><ul class="specs-list">${item.specs.map(spec => `<li>${spec}</li>`).join('')}</ul></div>` 
            : '';

        const imagemHtml = item.imagem ? `<img src="${item.imagem}" alt="Imagem de ${item.nome}" class="card-imagem">` : '';

        article.innerHTML = `
            <div class="card-content">
                ${imagemHtml}
                ${tituloHtml}
                <p>${item.descricao}</p>
                ${specsHtml}
                ${curiosidadeHtml}
            </div>`;

        cardsWrapper.appendChild(article);
    });
}

function aplicarFiltros() {
    cardsWrapper.classList.add('is-filtering');

    setTimeout(() => {
        const tipoSelecionado = filtroTipo.value;
        const marcaSelecionada = filtroMarca.value;

        let dadosFiltrados = dados;

        if (tipoSelecionado !== 'todos') {
            dadosFiltrados = dadosFiltrados.filter(item => item.tipo === tipoSelecionado);
        }

        if (marcaSelecionada !== 'todas') {
            dadosFiltrados = dadosFiltrados.filter(item => item.marca === marcaSelecionada);
        }

        // Ordena os resultados filtrados por ano
        if (ordemAno === 'desc') {
            dadosFiltrados.sort((a, b) => b.ano - a.ano);
        } else {
            dadosFiltrados.sort((a, b) => a.ano - b.ano);
        }

        renderizarCards(dadosFiltrados);

        cardsWrapper.classList.remove('is-filtering');
    }, 300);
}

// Função para atualizar as opções do filtro de MARCA com base no TIPO selecionado
function atualizarOpcoesMarca() {
    const tipoSelecionado = filtroTipo.value;
    const marcaAtual = filtroMarca.value;

    let marcasDisponiveis;
    if (tipoSelecionado === 'todos') {
        marcasDisponiveis = new Set(dados.map(item => item.marca));
    } else {
        marcasDisponiveis = new Set(
            dados.filter(item => item.tipo === tipoSelecionado).map(item => item.marca)
        );
    }

    const novasOpcoesMarca = [{ value: 'todas', label: 'Todas as Marcas' }];
    marcasDisponiveis.forEach(marca => novasOpcoesMarca.push({ value: marca, label: marca }));

    // O último parâmetro 'true' força a remoção das opções antigas antes de adicionar as novas.
    choicesMarca.setChoices(novasOpcoesMarca, 'value', 'label', true);

    // Se a marca selecionada anteriormente não estiver mais disponível, reseta para "Todas as Marcas"
    if (!marcasDisponiveis.has(marcaAtual) && marcaAtual !== 'todas') {
        choicesMarca.setChoiceByValue('todas');
    }
}

// Função para atualizar as opções do filtro de TIPO com base na MARCA selecionada
function atualizarOpcoesTipo() {
    const marcaSelecionada = filtroMarca.value;
    const tipoAtual = filtroTipo.value;

    let tiposDisponiveis;
    if (marcaSelecionada === 'todas') {
        tiposDisponiveis = new Set(dados.map(item => item.tipo));
    } else {
        tiposDisponiveis = new Set(
            dados.filter(item => item.marca === marcaSelecionada).map(item => item.tipo)
        );
    }

    const novasOpcoesTipo = [{ value: 'todos', label: 'Todos os Tipos' }];
    tiposDisponiveis.forEach(tipo => novasOpcoesTipo.push({ value: tipo, label: tipo }));

    // O último parâmetro 'true' força a remoção das opções antigas antes de adicionar as novas.
    choicesTipo.setChoices(novasOpcoesTipo, 'value', 'label', true);

    // Se o tipo selecionado anteriormente não estiver mais disponível, reseta para "Todos os Tipos"
    if (!tiposDisponiveis.has(tipoAtual) && tipoAtual !== 'todos') {
        choicesTipo.setChoiceByValue('todos');
    }
}


function limparFiltros() {
    cardsWrapper.classList.add('is-filtering');

    setTimeout(() => {
        choicesTipo.setChoiceByValue('todos');
        choicesMarca.setChoiceByValue('todas');

        // Após limpar, é preciso repopular os filtros com todas as opções
        atualizarOpcoesMarca();
        atualizarOpcoesTipo();

        aplicarFiltros();
    }, 300);
}


// Popula o dropdown de filtro com os tipos únicos do JSON
function popularFiltros() {
    filtroTipo.innerHTML = '<option value="todos">Todos os Tipos</option>';
    filtroMarca.innerHTML = '<option value="todas">Todas as Marcas</option>';

    const tiposIniciais = [];
    new Set(dados.map(item => item.tipo)).forEach(tipo => tiposIniciais.push({ value: tipo, label: tipo }));

    const marcasIniciais = [];
    new Set(dados.map(item => item.marca)).forEach(marca => marcasIniciais.push({ value: marca, label: marca }));

    choicesTipo = new Choices(filtroTipo, {
        itemSelectText: 'Selecionar',
        removeItemButton: false,
        searchPlaceholderValue: 'Pesquisar tipo...',
    });
    choicesTipo.setChoices(tiposIniciais, 'value', 'label', false);

    choicesMarca = new Choices(filtroMarca, {
        itemSelectText: 'Selecionar',
        removeItemButton: false,
        searchPlaceholderValue: 'Pesquisar marca...',
    });
    choicesMarca.setChoices(marcasIniciais, 'value', 'label', false);

}

async function carregarDadosIniciais() {
    const resposta = await fetch('data.json');
    dados = await resposta.json();
    ordemAno = 'asc';
    dados.sort((a, b) => a.ano - b.ano);
    popularFiltros();
    renderizarCards(dados);
}

// Função para alternar a ordem de ordenação por ano
function alternarOrdem() {
    const botaoOrdenar = document.getElementById('botao-ordenar');
    if (ordemAno === 'asc') {
        ordemAno = 'desc'; // Muda para ordenar por mais novo
        botaoOrdenar.textContent = 'Ordenar por mais novo'; // O botão agora oferece a opção de voltar para "mais novo"
    } else {
        ordemAno = 'asc'; // Muda para ordenar por mais velho
        botaoOrdenar.textContent = 'Ordenar por mais antigo'; // O botão agora oferece a opção de voltar para "mais antigo"
    }
    aplicarFiltros();
}

filtroTipo.addEventListener('change', () => {
    atualizarOpcoesMarca(); // Atualiza as marcas disponíveis
    aplicarFiltros();     // Aplica o filtro para renderizar os cards
});

filtroMarca.addEventListener('change', () => {
    atualizarOpcoesTipo(); // Atualiza os tipos disponíveis
    aplicarFiltros();    // Aplica o filtro para renderizar os cards
});

document.getElementById('botao-ordenar').addEventListener('click', alternarOrdem); 
document.getElementById('botao-limpar').addEventListener('click', limparFiltros); 

carregarDadosIniciais();

// --- Lógica para o menu de filtros mobile ---
const toggleButton = document.getElementById('botao-toggle-filtros');
if (toggleButton) {
    const filterRow = document.querySelector('.filter-row');
    toggleButton.addEventListener('click', () => {
        const isActive = filterRow.classList.toggle('is-active');
        toggleButton.textContent = isActive ? 'Ocultar Filtros' : 'Exibir Filtros';
    });
}