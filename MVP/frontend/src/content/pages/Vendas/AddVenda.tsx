import React, { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Snackbar,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { addVendaProduto, useRequests } from 'src/utils/requests';
import Navbar from 'src/components/Navbar/SideMenu';
import { useNavigate } from 'react-router';
import stylesAdd from 'src/content/pages/Vendas/stylesAddVenda';
import { Servico } from 'src/models/Servico';
import { VendaServico, VendaServicoItem } from 'src/models/VendaServico';
import { VendaItem, VendaProduto } from 'src/models/VendaProduto';
import { Produto } from 'src/models/Produto';
import { Cliente } from 'src/models/Cliente';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const RegistrarVenda = () => {
  const obterDataAtual = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };
  const { addVendaServico, getServicos, getProdutos, getClientes } =
    useRequests();
  const navigate = useNavigate();
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );
  const [vendaServicoData, setVendaServicoData] = useState<VendaServico>({
    cliente_id: 0,
    cliente: null,
    data_venda: obterDataAtual(),
    data_pagamento: '',
    forma_pagamento: '',
    situacao_venda: '',
    status_pagamento: '',
    detalhes_pagamento: '',
    valor_total: 0,
    itens_data: []
  });
  const [vendasServicosItens, setVendasServicosItens] = useState<
    VendaServicoItem[]
  >([]);
  const [vendaProdutoData, setVendaProdutoData] = useState<VendaProduto>({
    cliente_id: 0,
    cliente: null,
    data_venda: obterDataAtual(),
    data_pagamento: '',
    forma_pagamento: '',
    situacao_venda: '',
    status_pagamento: '',
    detalhes_pagamento: '',
    valor_total: 0,
    itens_data: []
  });
  const [vendasProdutosItens, setVendasProdutosItens] = useState<VendaItem[]>(
    []
  );
  const [erros, setErros] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState('');
  const [abrirAviso, setAbrirAviso] = useState(false);
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [formaPagamento, setFormaPagamento] = useState<string>('');
  const [listaServicos, setListaServicos] = useState<Servico[]>([]);
  const [vendaProdutoSucesso, setVendaProdutoSucesso] = useState(false);
  const [vendaServicoSucesso, setVendaServicoSucesso] = useState(false);
  const [descontosServicos, setDescontosServicos] = useState<{
    [key: number]: number;
  }>({});
  const [descontosProdutos, setDescontosProdutos] = useState<{
    [key: number]: number;
  }>({});
  const [descontoTotal, setDescontoTotal] = useState<number>(0);

  useEffect(() => {
    const dataHoje = new Date().toLocaleDateString('en-CA');
    setVendaServicoData((prev) => ({
      ...prev,
      data_venda: dataHoje
    }));
    setVendaProdutoData((prev) => ({
      ...prev,
      data_venda: dataHoje
    }));
  }, []);
  useEffect(() => {
    const obterProdutos = async () => {
      try {
        const response = await getProdutos();
        const produtos = response.data?.produto ?? [];
        setListaProdutos(produtos);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
    obterProdutos();
  }, []);
  useEffect(() => {
    const obterClientes = async () => {
      try {
        const response = await getClientes();
        const clientes = response.data?.clientes ?? [];
        setListaClientes(clientes);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };
    obterClientes();
  }, []);

  useEffect(() => {
    const obterServicos = async () => {
      try {
        const response = await getServicos();
        const servicos = response.data?.servicos ?? [];
        setListaServicos(servicos);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };
    obterServicos();
  }, []);
  type Venda = VendaProduto | VendaServico;
  const validarCamposObrigatorios = (
    dados: Venda,
    tipo: 'produto' | 'servico',
    outroTipoItens: VendaItem[] | VendaServicoItem[]
  ) => {
    const erros: Record<string, string> = {};

    if (!dados.cliente_id) {
      erros['cliente'] = 'Cliente é obrigatório';
    }
    if (!dados.forma_pagamento || dados.forma_pagamento.trim() === '') {
      erros['forma_pagamento'] = 'Forma de pagamento é obrigatória';
    }
    if (!dados.situacao_venda || dados.situacao_venda.trim() === '') {
      erros['situacao_venda'] = 'Situação da venda é obrigatória';
    }
    if (!dados.status_pagamento || dados.status_pagamento.trim() === '') {
      erros['status_pagamento'] = 'Status do pagamento é obrigatório';
    }
    if (!dados.valor_total || dados.valor_total <= 0) {
      erros['valor_total'] = 'Valor total deve ser maior que zero';
    }
    if (!dados.data_venda) {
      erros['data_venda'] = 'A data da venda é obrigatória.';
    }
    const itensPreenchidos = dados.itens && dados.itens.length > 0;
    const outroItensPreenchidos = outroTipoItens && outroTipoItens.length > 0;

    if (!itensPreenchidos && !outroItensPreenchidos) {
      erros['itens_data'] = 'Adicione pelo menos um produto ou serviço';
    }
    if (
      outroTipoItens.some(
        (item) => item.quantidade <= 0 || item.valor_total_itens <= 0
      )
    ) {
      erros['itens_data'] =
        'Todos os itens devem ter quantidade e subtotal válidos';
    }
    return erros;
  };

  const handleMudanca = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState1: React.Dispatch<React.SetStateAction<any>>,
    setState2: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;

    setState1((dados) => ({ ...dados, [name]: value }));
    setState2((dados) => ({ ...dados, [name]: value }));
  };
  const handleRemoverItemVenda = (itemIndex: number) => {
    setVendasProdutosItens((prev) => prev.filter((_, i) => i !== itemIndex));
  };
  const handleMudancaVendaProduto = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendasProdutosItens((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };
  const handleMudancaVendaServico = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendasServicosItens((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };
  const handleRemoverItemServico = (itemIndex: number) => {
    setVendasServicosItens((prev) => prev.filter((_, i) => i !== itemIndex));
  };
  const definirMensagemSucesso = (
    produto: boolean,
    servico: boolean
  ): string => {
    if (produto && servico) {
      return 'Venda de produto e serviço cadastradas com sucesso!';
    }
    if (produto) return 'Venda de produto cadastrada com sucesso!';
    if (servico) return 'Venda de serviço cadastrada com sucesso!';
    return 'Venda cadastrada com sucesso!';
  };
  const handleEnviarVendasServicos = async () => {
    if (!clienteSelecionado) {
      exibirAviso('Selecione um cliente para a venda!');
      return;
    }

    const itensCalculados = vendasServicosItens.map((item) => {
      const idServico = item.servico.id;
      const desconto = descontosServicos[idServico] || 0;
      const subtotal = item.quantidade * item.valor_unitario;
      const valorTotalItem = subtotal * (1 - desconto / 100);

      return {
        servico_id: idServico,
        quantidade: item.quantidade,
        valor_servico: Number(item.valor_unitario.toFixed(2)),
        descricao: item.descricao ?? '',
        desconto,
        valor_total_itens: Number(valorTotalItem.toFixed(2))
      };
    });

    const somaItens = itensCalculados.reduce(
      (total, item) => total + item.valor_total_itens,
      0
    );

    const valorTotalComDesconto = somaItens * (1 - descontoTotal / 100);

    const vendaComData: any = {
      ...vendaServicoData,
      cliente_id: clienteSelecionado.id,
      data_venda:
        vendaServicoData.data_venda || new Date().toISOString().split('T')[0],
      valor_total: Number(valorTotalComDesconto.toFixed(2)),
      itens_data: itensCalculados,
      desconto_total: descontoTotal
    };

    if (!vendaComData.data_pagamento) delete vendaComData.data_pagamento;

    const errosServico = validarCamposObrigatorios(
      vendaComData,
      'servico',
      vendasServicosItens
    );
    if (Object.keys(errosServico).length) {
      setErros(errosServico);
      exibirAviso('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const response = await addVendaServico(vendaComData);
      if (response?.errors) throw new Error(JSON.stringify(response.errors));

      setVendaServicoSucesso(true);
      setInfoMessage(definirMensagemSucesso(vendaProdutoSucesso, true));
      setAbrirAviso(true);
      handleCancelar();
    } catch (err) {
      console.error(err);
      setInfoMessage('Erro ao adicionar venda. Verifique os campos.');
      setAbrirAviso(true);
    }
  };

  const handleEnviarVendaProduto = async () => {
    if (!clienteSelecionado) {
      exibirAviso('Selecione um cliente para a venda!');
      return;
    }

    const itensCalculados = vendasProdutosItens.map((item) => {
      const idProduto = item.produto.id;
      const desconto = descontosProdutos[idProduto] || 0;
      const subtotal = item.quantidade * item.valor_unitario;
      const valorTotalItem = subtotal * (1 - desconto / 100);

      return {
        produto_id: idProduto,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        descricao: item.descricao ?? '',
        desconto,
        valor_total_itens: Number(valorTotalItem.toFixed(2))
      };
    });

    const somaItens = itensCalculados.reduce(
      (total, item) => total + item.valor_total_itens,
      0
    );

    const valorTotalComDesconto = somaItens * (1 - descontoTotal / 100);

    const vendaComData: any = {
      ...vendaProdutoData,
      cliente_id: clienteSelecionado.id,
      data_venda:
        vendaProdutoData.data_venda || new Date().toISOString().split('T')[0],
      valor_total: Number(valorTotalComDesconto.toFixed(2)),
      itens_data: itensCalculados,
      desconto_total: descontoTotal
    };

    if (!vendaComData.data_pagamento) delete vendaComData.data_pagamento;

    const errosProduto = validarCamposObrigatorios(
      vendaComData,
      'produto',
      vendasProdutosItens
    );
    if (Object.keys(errosProduto).length) {
      setErros(errosProduto);
      exibirAviso('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const response = await addVendaProduto(vendaComData);
      if (response?.errors) throw new Error(JSON.stringify(response.errors));

      setVendaProdutoSucesso(true);
      setInfoMessage(definirMensagemSucesso(true, vendaServicoSucesso));
      setAbrirAviso(true);
      handleCancelar();
    } catch (err) {
      console.error(err);
      setInfoMessage('Erro ao adicionar venda de produto.');
      setAbrirAviso(true);
    }
  };

  const exibirAviso = (mensagem: string) => {
    setInfoMessage(mensagem);
    setAbrirAviso(true);
  };
  const handleCancelar = () => {
    setVendaServicoData({
      cliente_id: 0,
      cliente: null,
      data_venda: obterDataAtual(),
      data_pagamento: '',
      forma_pagamento: '',
      situacao_venda: '',
      status_pagamento: '',
      detalhes_pagamento: '',
      valor_total: 0,
      itens_data: []
    });
    setVendaProdutoData({
      cliente_id: 0,
      cliente: null,
      data_venda: obterDataAtual(),
      data_pagamento: '',
      forma_pagamento: '',
      situacao_venda: '',
      status_pagamento: '',
      valor_total: 0,
      itens_data: []
    });
    setVendasServicosItens([]);
    setVendasProdutosItens([]);
    setClienteSelecionado(null);
    setErros({});
    setDescontoTotal(0);
    setFormaPagamento('');
    setTimeout(() => {
      navigate('/vendas');
    }, 2500);
    setVendaProdutoSucesso(false);
    setVendaServicoSucesso(false);
  };
  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };
  const servicoInicial: Servico = {
    id: 0,
    nome: '',
    descricao_servico: '',
    valor_servico: 0,
    data_modificacao_servico: '',
    status_servico: ''
  };
  const produtoInicial: Produto = {
    id: 0,
    nome: '',
    descricao: '',
    valor_compra: 0,
    data_modificacao_compra: '',
    estoque: undefined
  };

  const calcularTotalComDesconto = (
    quantidade: number,
    valorUnitario: number,
    desconto: number
  ) => quantidade * valorUnitario * (1 - desconto / 100);

  const totalServicos = useMemo(
    () =>
      vendasServicosItens.reduce(
        (acc, item) =>
          acc +
          calcularTotalComDesconto(
            item.quantidade,
            item.valor_unitario,
            descontosServicos[item.servico.id] || 0
          ),
        0
      ),
    [vendasServicosItens, descontosServicos]
  );
  const totalProdutos = useMemo(
    () =>
      vendasProdutosItens.reduce(
        (acc, item) =>
          acc +
          calcularTotalComDesconto(
            item.quantidade,
            item.valor_unitario,
            descontosProdutos[item.produto.id] || 0
          ),
        0
      ),
    [vendasProdutosItens, descontosProdutos]
  );
  const totalBruto = totalServicos + totalProdutos;
  const totalComDesconto = useMemo(
    () => totalBruto * (1 - descontoTotal / 100),
    [totalBruto, descontoTotal]
  );
  useEffect(() => {
    const totalFinal =
      (totalServicos + totalProdutos) * (1 - descontoTotal / 100);

    setVendaServicoData((prev) => ({
      ...prev,
      valor_total: totalFinal
    }));
    setVendaProdutoData((prev) => ({
      ...prev,
      valor_total: totalFinal
    }));
  }, [totalServicos, totalProdutos, descontoTotal]);
  const desabilitarCampos =
    vendasProdutosItens.length === 0 && vendasServicosItens.length === 0;

  return (
    <HelmetProvider>
      <Helmet>
        <title>Adicionar Venda</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: '100%',
          overflow: 'hidden',
          fontFamily: 'arial',
          paddingTop: '103px'
        }}
      >
        <Navbar />
        <Box sx={stylesAdd.headerVenda}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/31/31684.png"
            alt="Ícone Cliente"
            sx={stylesAdd.headerVendaImg}
          />
          <Typography sx={stylesAdd.headerVendaSpan}>
            Venda - Adicionar
          </Typography>
        </Box>

        <Box sx={stylesAdd.iconesVenda}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="Adicionar"
            sx={stylesAdd.iconesVendaImg}
          />
          Dados gerais
        </Box>

        <Box sx={stylesAdd.contPrincipal}>
          <Box sx={stylesAdd.grayContainer}>
            <TextField
              label="Código do cliente"
              variant="outlined"
              fullWidth
              name="cliente_codigo"
              value={clienteSelecionado?.id ?? ''}
              InputProps={{ readOnly: true }}
              sx={stylesAdd.formGroup}
            />
            <Autocomplete<Cliente>
              options={listaClientes}
              getOptionLabel={(option: Cliente) => option.nome}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={clienteSelecionado}
              onChange={(event, newValue) => {
                if (newValue && typeof newValue !== 'string') {
                  setClienteSelecionado(newValue);
                  setVendaServicoData((prev) => ({
                    ...prev,
                    cliente: newValue
                  }));
                  setVendaProdutoData((prev) => ({
                    ...prev,
                    cliente: newValue
                  }));
                } else {
                  setClienteSelecionado(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente *"
                  variant="outlined"
                  fullWidth
                  sx={stylesAdd.formGroup}
                />
              )}
            />
            <Autocomplete
              options={['Entregue', 'Em andamento', 'Cancelada']}
              value={vendaServicoData.situacao_venda}
              onChange={(event, newValue) => {
                setVendaServicoData((prev) => ({
                  ...prev,
                  situacao_venda: newValue || ''
                }));
                setVendaProdutoData((prev) => ({
                  ...prev,
                  situacao_venda: newValue || ''
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Situação *"
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...stylesAdd.formGroup,
                    '@media (max-width: 800px)': {
                      gap: '15px',
                      width: '380px'
                    },
                    '& .MuiInputBase-root': {
                      display: 'flex',
                      flexWrap: 'nowrap',
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      scrollbarWidth: 'thin',
                      '&::-webkit-scrollbar': { height: '6px', width: '6px' },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'gainsboro',
                        borderRadius: '4px'
                      }
                    },
                    '& .MuiChip-root': { margin: '2px' },
                    '& .MuiOutlinedInput-root': { overflow: 'visible' }
                  }}
                />
              )}
            />
            <TextField
              label="Data de venda *"
              type="date"
              variant="outlined"
              fullWidth
              name="data_venda"
              value={vendaServicoData.data_venda}
              onChange={(e) =>
                handleMudanca(e, setVendaServicoData, setVendaProdutoData)
              }
              sx={stylesAdd.formGroup}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data de entrega"
              type="date"
              variant="outlined"
              fullWidth
              name="data_entrega"
              value={vendaServicoData.data_entrega ?? ''}
              onChange={(e) =>
                setVendaServicoData((prev) => ({
                  ...prev,
                  data_entrega: e.target.value
                }))
              }
              sx={stylesAdd.formGroup}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          {/* Serviços */}
          <Box
            sx={{ ...stylesAdd.iconesVenda, width: '100%', marginBottom: '0' }}
          >
            <Box
              component="img"
              src="https://cdn-icons-png.flaticon.com/512/0/109.png"
              alt="Adicionar Serviço"
              sx={stylesAdd.iconesVendaImg}
            />
            Serviços
          </Box>
          <Box sx={stylesAdd.grayContOptSP}>
            {vendasServicosItens.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                  Nenhum serviço adicionado. Clique no botão abaixo para
                  adicionar.
                </Typography>

                <Button
                  variant="contained"
                  sx={stylesAdd.button}
                  onClick={() =>
                    setVendasServicosItens((prev) => [
                      ...prev,
                      {
                        servico: servicoInicial,
                        descricao: '',
                        quantidade: 1,
                        valor_unitario: 0
                      }
                    ])
                  }
                >
                  Adicionar Serviço
                </Button>
              </Box>
            ) : (
              <>
                {vendasServicosItens.map((itemServico, itemIndex) => {
                  const idServico = itemServico.servico.id;
                  const desconto = descontosServicos[idServico] || 0;
                  const subtotalBruto =
                    itemServico.quantidade * itemServico.valor_unitario;
                  const subtotalComDesconto =
                    subtotalBruto * (1 - desconto / 100);

                  return (
                    <Box
                      key={itemIndex}
                      sx={{ display: 'flex', ...stylesAdd.grayContOptRow }}
                    >
                      <Autocomplete<Servico>
                        options={listaServicos}
                        getOptionLabel={(option: Servico) => option?.nome ?? ''}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        value={
                          itemServico.servico && itemServico.servico.id
                            ? listaServicos.find(
                                (s) => s.id === itemServico.servico.id
                              ) ?? null
                            : null
                        }
                        onChange={(event, newValue: Servico | null) => {
                          const atualiza = [...vendasServicosItens];
                          atualiza[itemIndex].servico = newValue!;
                          atualiza[itemIndex].descricao =
                            newValue?.descricao_servico ?? '';
                          atualiza[itemIndex].valor_unitario =
                            newValue?.valor_servico ?? 0;
                          atualiza[itemIndex].valor_total_itens =
                            (atualiza[itemIndex].quantidade ?? 0) *
                            (newValue?.valor_servico ?? 0) *
                            (1 -
                              (descontosServicos[newValue?.id ?? 0] ?? 0) /
                                100);

                          setVendasServicosItens(atualiza);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Serviço"
                            variant="outlined"
                            fullWidth
                            sx={{ ...stylesAdd.formGroup, width: '370px' }}
                          />
                        )}
                      />

                      <TextField
                        label="Observação do serviço"
                        variant="outlined"
                        disabled
                        fullWidth
                        value={itemServico.descricao}
                        sx={stylesAdd.formGroup}
                        name="descricao"
                        onChange={(e) =>
                          handleMudancaVendaServico(itemIndex, e)
                        }
                      />

                      <TextField
                        label="Quantidade"
                        type="number"
                        variant="outlined"
                        fullWidth
                        name="quantidade"
                        value={
                          itemServico.quantidade === 0
                            ? ''
                            : itemServico.quantidade
                        }
                        onChange={(e) => {
                          const valor = parseFloat(e.target.value) || 0;
                          const atualiza = [...vendasServicosItens];
                          atualiza[itemIndex].quantidade = valor;
                          const descontoAtual =
                            descontosServicos[idServico] || 0;
                          atualiza[itemIndex].valor_total_itens =
                            valor *
                            atualiza[itemIndex].valor_unitario *
                            (1 - descontoAtual / 100);
                          setVendasServicosItens(atualiza);
                        }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '90px' }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Valor unitário"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={itemServico.valor_unitario}
                        inputProps={{ readOnly: true }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '150px' }}
                      />

                      <TextField
                        label="Desconto"
                        type="number"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          )
                        }}
                        value={desconto === 0 ? '' : desconto}
                        onChange={(e) => {
                          const input = e.target.value;
                          const novoDesconto =
                            input === '' ? 0 : parseFloat(input);
                          setDescontosServicos((prev) => ({
                            ...prev,
                            [idServico]: novoDesconto
                          }));

                          const atualiza = [...vendasServicosItens];
                          const quantidadeAtual =
                            atualiza[itemIndex].quantidade || 0;
                          const valorUnitarioAtual =
                            atualiza[itemIndex].valor_unitario || 0;
                          atualiza[itemIndex].valor_total_itens =
                            quantidadeAtual *
                            valorUnitarioAtual *
                            (1 - novoDesconto / 100);
                          setVendasServicosItens(atualiza);
                        }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '150px' }}
                      />

                      <TextField
                        label="Subtotal"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={subtotalComDesconto.toFixed(2)}
                        inputProps={{ readOnly: true }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '110px' }}
                      />

                      <Tooltip title="Excluir serviço" arrow>
                        <IconButton
                          sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                          color="error"
                          onClick={() => handleRemoverItemServico(itemIndex)}
                          size="large"
                        >
                          <CancelRoundedIcon
                            sx={{
                              fontSize: '32px',
                              backgroundColor: 'white',
                              borderRadius: '50%'
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                })}

                <Button
                  variant="contained"
                  sx={stylesAdd.button}
                  onClick={() =>
                    setVendasServicosItens((prev) => [
                      ...prev,
                      {
                        servico: servicoInicial,
                        descricao: '',
                        quantidade: 1,
                        valor_unitario: 0,
                        valor_total_itens: 0
                      }
                    ])
                  }
                >
                  Adicionar Serviço
                </Button>
              </>
            )}
          </Box>
          {/* Produtos */}
          <Box
            sx={{
              ...stylesAdd.iconesVenda,
              width: '100%',
              marginTop: '-5px',
              marginBottom: '0'
            }}
          >
            <Box
              component="img"
              src="https://cdn-icons-png.flaticon.com/512/126/126089.png"
              alt="Adicionar Serviço"
              sx={stylesAdd.iconesVendaImg}
            />
            Produtos
          </Box>
          <Box sx={stylesAdd.grayContOptSP}>
            {vendasProdutosItens.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                  Nenhum produto adicionado. Clique no botão abaixo para
                  adicionar.
                </Typography>

                <Button
                  variant="contained"
                  sx={stylesAdd.button}
                  onClick={() =>
                    setVendasProdutosItens((prev) => [
                      ...prev,
                      {
                        produto: produtoInicial,
                        descricao: '',
                        quantidade: 1,
                        valor_unitario: 0
                      }
                    ])
                  }
                >
                  Adicionar Produto
                </Button>
              </Box>
            ) : (
              <>
                {vendasProdutosItens.map((itemProduto, itemIndex) => {
                  const idProduto = itemProduto.produto?.id ?? 0;
                  const desconto = descontosProdutos[idProduto] || 0;
                  const subtotalBruto =
                    itemProduto.quantidade * itemProduto.valor_unitario;
                  const subtotalComDesconto =
                    subtotalBruto * (1 - desconto / 100);
                  return (
                    <Box
                      key={itemIndex}
                      sx={{ display: 'flex', ...stylesAdd.grayContOptRow }}
                    >
                      <Autocomplete<Produto>
                        options={listaProdutos}
                        getOptionLabel={(option: Produto) => option.nome}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        value={itemProduto.produto || null}
                        onChange={(event, newValue: Produto | null) => {
                          if (newValue) {
                            const atualiza = [...vendasProdutosItens];
                            atualiza[itemIndex].produto = newValue;
                            atualiza[itemIndex].descricao =
                              newValue.descricao || '';
                            atualiza[itemIndex].valor_unitario =
                              newValue.estoque?.valor_produto_venda || 0;
                            setVendasProdutosItens(atualiza);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Produto"
                            variant="outlined"
                            fullWidth
                            sx={{ ...stylesAdd.formGroup, width: '370px' }}
                          />
                        )}
                      />

                      <TextField
                        label="Observação do produto"
                        variant="outlined"
                        disabled
                        fullWidth
                        value={itemProduto.descricao}
                        sx={stylesAdd.formGroup}
                      />

                      <TextField
                        label="Quantidade"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={
                          itemProduto.quantidade === 0
                            ? ''
                            : itemProduto.quantidade
                        }
                        onChange={(e) => {
                          const valor = parseFloat(e.target.value) || 0;
                          const atualiza = [...vendasProdutosItens];
                          atualiza[itemIndex].quantidade = valor;
                          const descontoAtual =
                            descontosProdutos[idProduto] || 0;
                          const novoSubtotal =
                            valor *
                            atualiza[itemIndex].valor_unitario *
                            (1 - descontoAtual / 100);
                          atualiza[itemIndex].valor_total_itens = novoSubtotal;
                          setVendasProdutosItens(atualiza);
                        }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '90px' }}
                        InputLabelProps={{ shrink: true }}
                      />

                      <TextField
                        label="Valor unitário"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={itemProduto.valor_unitario}
                        inputProps={{ readOnly: true }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '150px' }}
                      />

                      <TextField
                        label="Desconto"
                        type="number"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          )
                        }}
                        value={
                          descontosProdutos[idProduto] === 0
                            ? ''
                            : descontosProdutos[idProduto]
                        }
                        onChange={(e) => {
                          const input = e.target.value;
                          const novoDesconto =
                            input === '' ? 0 : parseFloat(input);
                          setDescontosProdutos((prev) => ({
                            ...prev,
                            [idProduto]: novoDesconto
                          }));

                          const atualiza = [...vendasProdutosItens];
                          const quantidadeAtual =
                            atualiza[itemIndex].quantidade || 0;
                          const valorUnitarioAtual =
                            atualiza[itemIndex].valor_unitario || 0;
                          const novoSubtotal =
                            quantidadeAtual *
                            valorUnitarioAtual *
                            (1 - novoDesconto / 100);
                          atualiza[itemIndex].valor_total_itens = novoSubtotal;
                          setVendasProdutosItens(atualiza);
                        }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '150px' }}
                      />

                      <TextField
                        label="Subtotal"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={subtotalComDesconto.toFixed(2)}
                        inputProps={{ readOnly: true }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '110px' }}
                      />

                      <Tooltip title="Excluir produto" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { backgroundColor: 'transparent' }
                          }}
                          color="error"
                          onClick={() => handleRemoverItemVenda(itemIndex)}
                          size="large"
                        >
                          <CancelRoundedIcon
                            sx={{
                              fontSize: '32px',
                              backgroundColor: 'white',
                              borderRadius: '50%'
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                })}

                <Button
                  variant="contained"
                  sx={stylesAdd.button}
                  onClick={() =>
                    setVendasProdutosItens((prev) => [
                      ...prev,
                      {
                        produto: produtoInicial,
                        descricao: '',
                        quantidade: 0,
                        valor_unitario: 0,
                        valor_total_itens: 0
                      }
                    ])
                  }
                >
                  Adicionar Produto
                </Button>
              </>
            )}
          </Box>
          {/* Pagamento */}
          <Box
            sx={{
              ...stylesAdd.iconesVenda,
              width: '100%',
              marginTop: '-5px',
              marginBottom: '0'
            }}
          >
            <Box
              component="img"
              src="https://cdn-icons-png.flaticon.com/512/71/71227.png"
              alt="Adicionar Serviço"
              sx={stylesAdd.iconesVendaImg}
            />
            Pagamento
          </Box>
          <Box sx={stylesAdd.grayContOpt}>
            <Autocomplete
              options={[
                'Pix',
                'Cartão de crédito',
                'Cartão de débito',
                'Dinheiro'
              ]}
              freeSolo={false}
              value={formaPagamento}
              onChange={(event, newValue) => {
                const valor = newValue || '';
                setFormaPagamento(valor);
                setVendaServicoData((prev) => ({
                  ...prev,
                  forma_pagamento: valor
                }));
                setVendaProdutoData((prev) => ({
                  ...prev,
                  forma_pagamento: valor
                }));
              }}
              disabled={desabilitarCampos}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Forma de pagamento"
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...stylesAdd.formGroup,
                    '@media (max-width: 800px)': {
                      gap: '15px',
                      width: '380px'
                    },
                    '& .MuiInputBase-root': {
                      display: 'flex',
                      flexWrap: 'nowrap',
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      scrollbarWidth: 'thin',
                      '&::-webkit-scrollbar': { height: '6px', width: '6px' },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'gainsboro',
                        borderRadius: '4px'
                      }
                    },
                    '& .MuiChip-root': { margin: '2px' },
                    '& .MuiOutlinedInput-root': { overflow: 'visible' }
                  }}
                />
              )}
            />
            <TextField
              label="Observações"
              variant="outlined"
              disabled={desabilitarCampos}
              fullWidth
              name="detalhes_pagamento"
              onChange={(e) => {
                const { value } = e.target;
                setVendaServicoData((prev) => ({
                  ...prev,
                  detalhes_pagamento: value
                }));
                setVendaProdutoData((prev) => ({
                  ...prev,
                  detalhes_pagamento: value
                }));
              }}
              sx={stylesAdd.formGroup}
            />
            <Autocomplete
              options={['Pendente', 'Pago']}
              value={vendaServicoData.status_pagamento}
              onChange={(_, newValue) => {
                setVendaServicoData((prev) => ({
                  ...prev,
                  status_pagamento: newValue || ''
                }));
                setVendaProdutoData((prev) => ({
                  ...prev,
                  status_pagamento: newValue || ''
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status do pagamento *"
                  sx={stylesAdd.formGroup}
                  fullWidth
                />
              )}
              disabled={desabilitarCampos}
            />
            <TextField
              label="Data de pagamento"
              type="date"
              variant="outlined"
              disabled={desabilitarCampos}
              fullWidth
              onChange={(e) => {
                const { value } = e.target;
                setVendaServicoData((prev) => ({
                  ...prev,
                  data_pagamento: value
                }));
                setVendaProdutoData((prev) => ({
                  ...prev,
                  data_pagamento: value
                }));
              }}
              sx={stylesAdd.formGroup}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Desconto"
              type="number"
              variant="outlined"
              disabled={desabilitarCampos}
              fullWidth
              value={descontoTotal === 0 ? '' : descontoTotal}
              onChange={(e) => {
                const desconto = parseFloat(e.target.value) || 0;
                setDescontoTotal(desconto);
              }}
              sx={stylesAdd.formGroup}
            />
            <TextField
              label="Total"
              type="number"
              variant="outlined"
              disabled={desabilitarCampos}
              fullWidth
              value={totalComDesconto.toFixed(2)}
              sx={stylesAdd.formGroup}
            />
          </Box>

          <Box sx={stylesAdd.buttons}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (vendasServicosItens.length > 0) {
                  handleEnviarVendasServicos();
                }
                if (vendasProdutosItens.length > 0) {
                  handleEnviarVendaProduto();
                }
              }}
            >
              Registrar
            </Button>
            <Button variant="contained" color="error" onClick={handleCancelar}>
              Cancelar
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={abrirAviso}
          autoHideDuration={3000}
          onClose={handleFecharAviso}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message={infoMessage}
          ContentProps={{
            sx: {
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '50px',
              bgcolor: infoMessage.includes('sucesso') ? 'green' : 'red',
              color: 'white',
              textAlign: 'center',
              width: '100%',
              '& .MuiSnackbarContent-message': {
                width: 'inherit',
                textAlign: 'center'
              }
            }
          }}
        />
      </Box>
    </HelmetProvider>
  );
};

export default RegistrarVenda;
