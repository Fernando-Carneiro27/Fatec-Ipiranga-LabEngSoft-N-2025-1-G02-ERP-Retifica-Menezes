import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  DialogActions,
  TextField,
  Snackbar,
  Autocomplete
} from '@mui/material';
import {
  AddCircleOutlineTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  VisibilityTwoTone,
  SettingsTwoTone,
  SearchTwoTone,
  HistoryTwoTone
} from '@mui/icons-material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useNavigate } from 'react-router';
import {
  getUmaVendaProduto,
  getUmaVendaServico,
  useRequests
} from 'src/utils/requests';
import stylesLista from 'src/content/pages/Vendas/stylesListarVendas';
import { Servico } from 'src/models/Servico';
import { VendaServico, VendaServicoItem } from 'src/models/VendaServico';
import { VendaItem, VendaProduto } from 'src/models/VendaProduto';

const ListarVendas = () => {
  type VendaLista = {
    id: number;
    cliente: string;
    data: string;
    situacao: string;
    status: string;
    valor_total: number;
    tipo: 'servico' | 'produto';
  };
  const opcoesMeses = [
    'Todos',
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);
  const [abrirCaixa, setAbrirCaixa] = useState(false);
  const [vendas, setVendas] = useState<VendaLista[]>([]);
  const [colunasVisiveis, setColunasVisiveis] = useState({
    id: true,
    nome: true,
    data_venda: true,
    situacao_venda: true,
    status_venda: true,
    valor: true
  });
  const [procurado, setProcurado] = useState('');
  const [vendasFiltradas, setVendasFiltradas] = useState<VendaLista[]>([]);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const {
    getVendasServico,
    getVendasProduto,
    deleteVendaServico,
    deleteVendaProduto
  } = useRequests();
  const navigate = useNavigate();

  useEffect(() => {
    if (mesSelecionado === 'Todos') {
      setVendasFiltradas(vendas);
      return;
    }
    const mesIndex = opcoesMeses.indexOf(mesSelecionado) - 1;
    const vendasDoMes = vendas.filter((venda) => {
      const dataVenda = new Date(venda.data);
      return dataVenda.getMonth() === mesIndex;
    });
    setVendasFiltradas(vendasDoMes);
  }, [mesSelecionado, vendas]);
  useEffect(() => {
    const carregarVendas = async () => {
      setLoading(true);
      try {
        const [resServicos, resProdutos] = await Promise.all([
          getVendasServico(),
          getVendasProduto()
        ]);
        console.log('Serviços:', resServicos);
        console.log('Produtos:', resProdutos);
        const vendasServicos: VendaLista[] = (
          resServicos.data?.vendas_servico || []
        ).map((v: VendaServico) => ({
          id: v.id,
          cliente: v.cliente.nome,
          data: v.data_venda,
          situacao: v.situacao_venda,
          status: v.status_pagamento,
          valor_total: Number(v.valor_total),
          tipo: 'servico'
        }));

        const vendasProdutos: VendaLista[] = (
          resProdutos.data?.vendas_produto || []
        ).map((v: VendaProduto) => ({
          id: v.id,
          cliente: v.cliente.nome,
          data: v.data_venda,
          situacao: v.situacao_venda,
          status: v.status_pagamento,
          valor_total: Number(v.valor_total),
          tipo: 'produto'
        }));

        setVendas([...vendasServicos, ...vendasProdutos]);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        setVendas([]);
      } finally {
        setLoading(false);
      }
    };

    carregarVendas();
  }, [getVendasServico, getVendasProduto]);

  const handleVisualizar = async (id: number, tipo: 'produto' | 'servico') => {
    try {
      let detalhesVenda;

      if (tipo === 'produto') {
        detalhesVenda = await getUmaVendaProduto(id);
      } else {
        detalhesVenda = await getUmaVendaServico(id);
      }
      navigate(`/venda/${id}`, {
        state: { tipo, detalhes: detalhesVenda }
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda:', error);
    }
  };
  const handleDelete = async (id: number, tipo: 'servico' | 'produto') => {
    if (!window.confirm('Tem certeza que deseja excluir esta venda?')) {
      return;
    }
    try {
      if (tipo === 'servico') {
        await deleteVendaServico(id);
      } else {
        await deleteVendaProduto(id);
      }
      setVendas((vendas) =>
        vendas.filter((venda) => venda.id !== id || venda.tipo !== tipo)
      );
      setInfoMessage('Venda excluída com sucesso!');
      setMostrarAviso(true);
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
    }
  };

  const handleSelecionaColunas = (coluna: string) => {
    setColunasVisiveis((colunas) => ({
      ...colunas,
      [coluna]: !colunas[coluna]
    }));
  };

  const formatarNomes = (coluna: string) => {
    const mapColunas = {
      id: 'Código Venda',
      nome: 'Cliente',
      data_venda: 'Data de Venda',
      situacao_venda: 'Situação',
      status_venda: 'Status',
      valor: 'Valor'
    };
    return mapColunas[coluna] || coluna;
  };
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };
  const handlePesquisar = () => {
    const vendaProcurada = procurado.toLowerCase();
    const filtradas = vendas.filter((venda) =>
      Object.values(venda).some((valor) =>
        valor?.toString().toLowerCase().includes(vendaProcurada)
      )
    );
    if (filtradas.length === 0) setMostrarAviso(true);
    setVendasFiltradas(filtradas);
    setProcurado('');
  };
  const handleAbrirCaixa = () => {
    setAbrirCaixa(true);
  };

  const handleFecharCaixa = () => {
    setAbrirCaixa(false);
  };

  const handleAddVenda = () => {
    setTimeout(() => {
      navigate('/venda-add');
    }, 1500);
  };
  const formatarData = (data: string | Date) => {
    const dateObj = new Date(data);
    return dateObj.toLocaleDateString('pt-BR');
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Vendas - Gerais</title>
      </Helmet>
      <Navbar />
      <Box>
        <Box sx={stylesLista.headerVenda}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/31/31684.png"
            alt="Ícone Venda"
            sx={stylesLista.headerVendaImg}
          />
          <Box sx={stylesLista.headerVendaSpan}>Vendas - Gerais</Box>
        </Box>

        <Box sx={stylesLista.buttons}>
          <Button
            variant="contained"
            color="success"
            sx={{
              textTransform: 'none',
              fontSize: '15px',
              height: '50px',
              width: '150px'
            }}
            onClick={handleAddVenda}
          >
            <AddCircleOutlineTwoTone
              sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }}
            />
            Adicionar
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#0c3c94',
              textTransform: 'none',
              height: '50px',
              width: '200px'
            }}
            onClick={handleAbrirCaixa}
          >
            <SettingsTwoTone
              sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }}
            />
            Gerenciar colunas
          </Button>
          <Autocomplete
            options={opcoesMeses}
            sx={{
              width: 180,
              ml: 2,
              '& .MuiInputBase-root': {
                height: 52, 
                fontSize: 16
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Mês" variant="outlined" />
            )}
            value={mesSelecionado}
            onChange={(event, newValue) => setMesSelecionado(newValue)}
          />
          <Box sx={stylesLista.barraPesquisa}>
            <TextField
              placeholder="Buscar venda"
              sx={stylesLista.campoInput}
              value={procurado}
              onChange={(e) => setProcurado(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePesquisar();
                }
              }}
            />
            <Tooltip title="Pesquisar venda" arrow>
              <IconButton
                onClick={handlePesquisar}
                sx={stylesLista.pesquisaIcon}
              >
                <SearchTwoTone />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Dialog
          PaperProps={{ sx: stylesLista.caixa }}
          open={abrirCaixa}
          onClose={handleFecharCaixa}
        >
          <DialogTitle sx={stylesLista.tituloCaixa}>
            Gerenciar Colunas
          </DialogTitle>
          <DialogContent sx={stylesLista.conteudoCaixa}>
            {Object.keys(colunasVisiveis).map((coluna) => (
              <FormControlLabel
                key={coluna}
                control={
                  <Checkbox
                    checked={colunasVisiveis[coluna]}
                    onChange={() => handleSelecionaColunas(coluna)}
                  />
                }
                label={formatarNomes(coluna)}
                sx={stylesLista.checkbox}
              />
            ))}
          </DialogContent>
          <DialogActions sx={stylesLista.actions}>
            <Button
              sx={stylesLista.button}
              onClick={handleFecharCaixa}
              variant="contained"
              color="primary"
            >
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          sx={{
            marginLeft: '30px',
            display: 'flex',
            alignItems: 'start-end',
            gap: 2,
            mb: 1
          }}
        >
          <Box sx={stylesLista.cores}>
            <Box sx={stylesLista.legendaServico} />
            <Typography variant="h6">Serviço</Typography>
          </Box>
          <Box sx={stylesLista.cores}>
            <Box sx={stylesLista.legendaProduto} />
            <Typography variant="h6">Produto</Typography>
          </Box>
        </Box>
        <Box sx={stylesLista.vendasList}>
          <Card sx={{ width: '100%', padding: '10px', boxShadow: 'none' }}>
            <TableContainer sx={stylesLista.tableContainer}>
              <Table
                size="medium"
                aria-label="servicos table"
                sx={{ border: '2px solid #959494', borderRadius: '20px' }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: '#DCDDDE',
                      width: '100%',
                      alignItems: 'center'
                    }}
                  >
                    {colunasVisiveis.id && (
                      <TableCell sx={stylesLista.colunas}>
                        CÓDIGO VENDA
                      </TableCell>
                    )}
                    {colunasVisiveis.nome && (
                      <TableCell sx={stylesLista.colunas}>CLIENTE</TableCell>
                    )}
                    {colunasVisiveis.data_venda && (
                      <TableCell sx={stylesLista.colunas}>DATA</TableCell>
                    )}
                    {colunasVisiveis.situacao_venda && (
                      <TableCell sx={stylesLista.colunas}>SITUAÇÃO</TableCell>
                    )}
                    {colunasVisiveis.status_venda && (
                      <TableCell sx={stylesLista.colunas}>STATUS</TableCell>
                    )}
                    {colunasVisiveis.valor && (
                      <TableCell sx={stylesLista.colunas}>VALOR (R$)</TableCell>
                    )}
                    <TableCell sx={stylesLista.colunas}>AÇÕES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(vendasFiltradas.length > 0 ? vendasFiltradas : vendas)
                    .length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography gutterBottom>
                          Nenhuma venda encontrada.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (vendasFiltradas.length > 0 ? vendasFiltradas : vendas).map(
                      (venda) => (
                        <TableRow
                          key={`${venda.id}-${venda.tipo}-${venda.data}`}
                          sx={{
                            backgroundColor:
                              venda.tipo === 'servico' ? 'white' : '#F0F8FF'
                          }}
                        >
                          {colunasVisiveis.id && (
                            <TableCell
                              sx={{ ...stylesLista.linhas, width: '150px' }}
                            >
                              <Typography gutterBottom>{venda.id}</Typography>
                            </TableCell>
                          )}
                          {colunasVisiveis.nome && (
                            <TableCell sx={stylesLista.linhas}>
                              <Typography gutterBottom>
                                {venda.cliente}
                              </Typography>
                            </TableCell>
                          )}
                          {colunasVisiveis.data_venda && (
                            <TableCell
                              sx={{ ...stylesLista.linhas, width: '200px' }}
                            >
                              <Typography gutterBottom>
                                {formatarData(venda.data)}
                              </Typography>
                            </TableCell>
                          )}
                          {colunasVisiveis.situacao_venda && (
                            <TableCell
                              sx={{ ...stylesLista.linhas, width: '220px' }}
                            >
                              <Typography gutterBottom>
                                {venda.situacao}
                              </Typography>
                            </TableCell>
                          )}
                          {colunasVisiveis.status_venda && (
                            <TableCell
                              sx={{ ...stylesLista.linhas, width: '220px' }}
                            >
                              <Typography gutterBottom>
                                {venda.status}
                              </Typography>
                            </TableCell>
                          )}
                          {colunasVisiveis.valor && (
                            <TableCell
                              sx={{ ...stylesLista.linhas, width: '200px' }}
                            >
                              <Typography gutterBottom>
                                {formatarValor(venda.valor_total)}
                              </Typography>
                            </TableCell>
                          )}

                          <TableCell
                            sx={{
                              borderBottom: '1px solid #959494',
                              width: '80px'
                            }}
                            align="center"
                          >
                            <Tooltip title="Visualizar detalhes" arrow>
                              <IconButton
                                sx={{ color: '#424242' }}
                                size="small"
                                onClick={() =>
                                  handleVisualizar(venda.id, venda.tipo)
                                }
                              >
                                <VisibilityTwoTone />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Deletar venda" arrow>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleDelete(venda.id, venda.tipo)
                                }
                              >
                                <DeleteTwoTone />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>
      <Snackbar
        open={mostrarAviso}
        onClose={() => setMostrarAviso(false)}
        autoHideDuration={
          infoMessage === 'Nenhuma venda encontrada.' ? 3000 : 4000
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={infoMessage}
        ContentProps={{
          sx: {
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '80px',
            bgcolor:
              infoMessage === 'Venda excluída com sucesso!' ? 'green' : 'red',
            color: 'white',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '16px'
          }
        }}
      />
    </HelmetProvider>
  );
};

export default ListarVendas;
