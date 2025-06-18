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
  Snackbar
} from '@mui/material';
import {
  EditTwoTone,
  VisibilityTwoTone,
  SettingsTwoTone,
  SearchTwoTone,
  AddShoppingCart,
  CompareArrowsTwoTone
} from '@mui/icons-material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useNavigate } from 'react-router';
import { useRequests } from 'src/utils/requests';
import stylesLista from 'src/content/pages/Estoque/stylesListarEstoque';
import { Produto } from 'src/models/Produto';
import { Estoque } from 'src/models/Produto';

const ListarEstoque = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [colunasVisiveis, setColunasVisiveis] = useState({
    nome: true,
    valor_compra: true,
    valor_venda: true,
    quantidade_atual: true
  });
  const [abrirCaixa, setAbrirCaixa] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [procurado, setProcurado] = useState('');
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [loading, setLoading] = useState(true);

  const { getEstoque, getProdutos } = useRequests();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await getProdutos();
        setProdutos(response.data?.produto || []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setProdutos([]);
      }
    };
    carregarProdutos();
  }, [getProdutos]);

  const handleEditar = async (id: number) => {
    try {
      const response = await getEstoque(+id);
      const estoque = response.data.estoque;
      if (estoque?.id) {
        navigate(`/produto/editar/${estoque.id}`);
      } else {
        console.error('Estoque não encontrado para o produto:', id);
      }
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
    }
  };
  const handleVisualizar = async (id: number) => {
    try {
      const response = await getEstoque(id);
      const estoque = response.data.estoque;
      if (estoque?.id) {
        navigate(`/produto/${estoque.id}`);
      } else {
        console.error('Estoque não encontrado para o produto:', id);
      }
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
    }
  };

  const handleAbrirCaixa = () => {
    setAbrirCaixa(true);
  };
  const handleFecharCaixa = () => {
    setAbrirCaixa(false);
  };
  const handleSelecionaColunas = (coluna: string) => {
    setColunasVisiveis((colunas) => ({
      ...colunas,
      [coluna]: !colunas[coluna]
    }));
  };
  const formatarNomes = (coluna: string) => {
    const mapColunas = {
      nome: 'Nome',
      valor_compra: 'Valor de Compra',
      valor_venda: 'Valor de Venda',
      quantidade_atual: 'Quantidade Atual'
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
    const prodProcurado = procurado.toLowerCase();
    const filtrados = produtos.filter((produto) =>
      Object.values(produto).some((valor) =>
        valor?.toString().toLowerCase().includes(prodProcurado)
      )
    );
    if (filtrados.length === 0) setMostrarAviso(true);

    setProdutosFiltrados(filtrados);
    setProcurado('');
  };

  const handleGerenciarEstoque = () => {
    setTimeout(() => {
      navigate('/gerenciar-estoque');
    }, 1500);
  };
  const handleMovimentacao = () => {
    setTimeout(() => {
      navigate('/movimentacao-estoque');
    }, 2500);
  };
  return (
    <HelmetProvider>
      <Helmet>
        <title>Lista do Estoque</title>
      </Helmet>
      <Navbar />
      <Box>
        <Box sx={stylesLista.headerEstoque}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/68/68374.png"
            alt="Ícone Cliente"
            sx={stylesLista.headerEstoqueImg}
          />
          <Box sx={stylesLista.headerEstoqueSpan}>Estoque</Box>
        </Box>

        <Box sx={stylesLista.button}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#2EBBC5', textTransform: 'none' }}
            onClick={handleGerenciarEstoque}
          >
            <SettingsTwoTone
              sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }}
            />
            Gerenciar estoque
          </Button>

          <Box sx={stylesLista.barraPesquisa}>
            <TextField
              placeholder="Buscar por produto"
              sx={stylesLista.campoInput}
              value={procurado}
              onChange={(e) => setProcurado(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePesquisar();
                }
              }}
            />
            <Tooltip title="Pesquisar produto" arrow>
              <IconButton
                onClick={handlePesquisar}
                sx={stylesLista.pesquisaIcon}
              >
                <SearchTwoTone />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={stylesLista.estoqueList}>
          <Card sx={{ width: '100%', padding: '10px', boxShadow: 'none' }}>
            <TableContainer sx={stylesLista.tableContainer}>
              <Table
                aria-label="produtos table"
                sx={{ border: '2px solid #959494', borderRadius: '20px' }}
                size="medium"
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: '#DCDDDE',
                      width: '100%',
                      alignItems: 'center'
                    }}
                  >
                    {colunasVisiveis.nome && (
                      <TableCell sx={stylesLista.colunas}>NOME</TableCell>
                    )}
                    {colunasVisiveis.valor_compra && (
                      <TableCell sx={stylesLista.colunas}>
                        VALOR DE COMPRA
                      </TableCell>
                    )}
                    {colunasVisiveis.valor_venda && (
                      <TableCell sx={stylesLista.colunas}>
                        VALOR DE VENDA
                      </TableCell>
                    )}
                    {colunasVisiveis.quantidade_atual && (
                      <TableCell sx={stylesLista.colunas}>
                        QUANTIDADE ATUAL
                      </TableCell>
                    )}
                    <TableCell sx={stylesLista.colunas}>AÇÕES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(produtosFiltrados.length > 0 ? produtosFiltrados : produtos)
                    .length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography gutterBottom>
                          Nenhum produto registrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (produtosFiltrados.length > 0
                      ? produtosFiltrados
                      : produtos
                    ).map((produto) => (
                      <TableRow key={produto.id}>
                        {colunasVisiveis.nome && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>{produto.nome}</Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.valor_compra && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {formatarValor(produto.valor_compra)}
                            </Typography>
                          </TableCell>
                        )}

                        {colunasVisiveis.valor_venda && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {produto.estoque?.valor_produto_venda !==
                              undefined
                                ? formatarValor(
                                    produto.estoque.valor_produto_venda
                                  )
                                : 'Carregando...'}
                            </Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.quantidade_atual && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {produto.estoque?.quantidade_atual ??
                                'Carregando...'}{' '}
                              unidades
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell
                          sx={{
                            borderBottom: '1px solid #959494',
                            width: '15%'
                          }}
                          align="center"
                        >
                          <Tooltip title="Editar produto" arrow>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditar(produto.estoque?.id)}
                            >
                              <EditTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Visualizar estoque" arrow>
                            <IconButton
                              sx={{ color: '#424242' }}
                              size="small"
                              onClick={() =>
                                handleVisualizar(produto.estoque?.id)
                              }
                            >
                              <VisibilityTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Movimentações do estoque" arrow>
                            <IconButton
                              sx={{ color: 'green' }}
                              size="small"
                              onClick={handleMovimentacao}
                            >
                              <CompareArrowsTwoTone />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>
    </HelmetProvider>
  );
};

export default ListarEstoque;
