document.getElementById('enviar').addEventListener('click', function() {
    const diferencaValor = parseFloat(document.getElementById('valor_cliente').value) - 
                           (parseFloat(document.getElementById('valor_item').value) * 
                            parseInt(document.getElementById('quantos_itens').value));

    const novoPedido = document.createElement('tr');
    novoPedido.dataset.valorItem = (parseFloat(document.getElementById('valor_item').value) * 
                                    parseInt(document.getElementById('quantos_itens').value)).toFixed(2);
    novoPedido.dataset.valorCliente = parseFloat(document.getElementById('valor_cliente').value).toFixed(2);

    novoPedido.innerHTML = `
        <td>${document.getElementById('nome_cliente').value}</td>
        <td>${document.getElementById('telefone_cliente').value}</td>
        <td>${document.getElementById('servico').value}</td>
        <td>${parseFloat(document.getElementById('valor_item').value).toFixed(2)}</td>
        <td>${parseInt(document.getElementById('quantos_itens').value)}</td>
        <td>${document.getElementById('forma_de_pagamento').value}</td>
        <td>${parseFloat(document.getElementById('valor_cliente').value).toFixed(2)}</td>
        <td>${document.getElementById('data').value}</td>
        <td><button class="btn btn-danger excluir">Excluir</button></td>
    `;

    document.getElementById('historico_corpo').appendChild(novoPedido);

    document.getElementById('nome_cliente').value = '';
    document.getElementById('telefone_cliente').value = '';
    document.getElementById('servico').value = '';
    document.getElementById('valor_item').value = '';
    document.getElementById('quantos_itens').value = '';
    document.getElementById('forma_de_pagamento').value = '';
    document.getElementById('valor_cliente').value = '';
    document.getElementById('data').value = '';

    salvarHistorico();
    calcularTotal();
    atualizarCorHistorico();

    novoPedido.querySelector('.excluir').addEventListener('click', function() {
        novoPedido.remove();
        salvarHistorico();
        calcularTotal();
        atualizarCorHistorico();
    });
});

document.getElementById('imprimir').addEventListener('click', function() {
    window.print();
});

document.getElementById('pesquisar').addEventListener('click', function() {
    const dataFiltro = document.getElementById('data_filtro').value;
    filtrarPorData(dataFiltro);
});

function salvarHistorico() {
    const historicoDiv = document.getElementById('historico_corpo');
    localStorage.setItem('historico', historicoDiv.innerHTML);
}

function carregarHistorico() {
    const historicoDiv = document.getElementById('historico_corpo');
    historicoDiv.innerHTML = localStorage.getItem('historico') || '';

    const botoesExcluir = historicoDiv.querySelectorAll('.excluir');
    botoesExcluir.forEach(botao => {
        botao.addEventListener('click', function() {
            botao.parentElement.parentElement.remove();
            salvarHistorico();
            calcularTotal();
            atualizarCorHistorico();
        });
    });
    atualizarCorHistorico();
}

function filtrarPorData(dataFiltro) {
    const historicoDiv = document.getElementById('historico_corpo');
    const pedidos = historicoDiv.getElementsByTagName('tr');
    for (let pedido of pedidos) {
        const dataPedido = pedido.cells[7].innerText;
        if (dataPedido === dataFiltro || dataFiltro === '') {
            pedido.style.display = '';
        } else {
            pedido.style.display = 'none';
        }
    }
}

function calcularTotal() {
    let valorTotal = 0;
    let valorPagoTotal = 0;

    const pedidos = document.getElementById('historico_corpo').getElementsByTagName('tr');
    for (let pedido of pedidos) {
        const valorItem = parseFloat(pedido.dataset.valorItem);
        const valorPago = parseFloat(pedido.dataset.valorCliente);

        valorTotal += valorItem;
        valorPagoTotal += valorPago;
    }

    document.getElementById('total_valor').innerText = 'Total: R$ ' + valorTotal.toFixed(2);
    const diferenca = valorPagoTotal - valorTotal;
    document.getElementById('diferenca_valor').innerText = 'valor de troco : R$ ' + diferenca.toFixed(2);
}

function atualizarCorHistorico() {
    const pedidos = document.getElementById('historico_corpo').getElementsByTagName('tr');
    for (let pedido of pedidos) {
        const valorItem = parseFloat(pedido.dataset.valorItem);
        const valorPago = parseFloat(pedido.dataset.valorCliente);

        if (valorPago >= valorItem) {
            pedido.style.backgroundColor = 'darkgreen'; // Verde escuro
        } else if (valorPago < valorItem) {
            pedido.style.backgroundColor = 'darkred'; // Vermelho bem escuro
        } else if (valorPago === 0) {
            pedido.style.backgroundColor = 'black'; // Preto
        }
    }
}



carregarHistorico();
