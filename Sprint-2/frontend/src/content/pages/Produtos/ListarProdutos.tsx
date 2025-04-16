import React, { useState, useEffect } from 'react';
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
  AddCircleOutlineTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  VisibilityTwoTone,
  SettingsTwoTone,
  SearchTwoTone,
  HistoryToggleOffTwoTone
} from '@mui/icons-material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useNavigate } from 'react-router';
import { useRequests } from 'src/utils/requests';
import stylesLista from 'src/content/pages/Produtos/stylesListarProdutos';
import { Produto } from 'src/models/Produto';

const ListarProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [colunasVisiveis, setColunasVisiveis] = useState({
    id: true,
    nome: true,
    descricao: true,
    valor: true,
  });
  const [abrirCaixa, setAbrirCaixa] = useState(false);
  const [procurado, setProcurado] = useState('');
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [mostrarAviso, setMostrarAviso] = useState(false);

  const { getEstoque, getProdutos, deleteProduto } = useRequests();
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
      const response = await getEstoque(id);
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
  const handleHistorico = (id: number) => {
    setTimeout(() => { navigate(`/produto/${id}`); }, 1500);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    try {
      console.log(`Tentando deletar produto com ID: ${id}`);
      await deleteProduto(id);
      setProdutos((produtos) =>
        produtos.filter((produto) => produto.id !== id)
      );
      console.log(`Produto com ID ${id} deletado com sucesso!`);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
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
      id: '#ID',
      nome: 'Nome',
      descricao: 'Descrição',
      valor: 'Valor',
      data_modificacao_compra: ''
    };
    return mapColunas[coluna] || coluna;
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

  const handleAddProduto = () => {
    setTimeout(() => {
      navigate('/produto-add');
    }, 1500);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Lista dos Produtos</title>
      </Helmet>
      <Navbar />
      <Box>
        <Box sx={stylesLista.headerProduto}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
            alt="Ícone Cliente"
            sx={stylesLista.headerProdutoImg}
          />
          <Box sx={stylesLista.headerProdutoSpan}>Produtos - Visualizar</Box>
        </Box>

        <Box sx={stylesLista.buttons}>
          <Button variant="contained" color="success" size="large" sx={{ textTransform: 'none', fontSize: '15px' }} onClick={handleAddProduto}>
            <AddCircleOutlineTwoTone sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }}/>
            Adicionar
          </Button>
          <Button variant="contained" sx={{ backgroundColor: '#0c3c94', textTransform: 'none' }} onClick={handleAbrirCaixa}>
            <SettingsTwoTone sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }}/>
            Gerenciar colunas
          </Button>

          <Box sx={stylesLista.barraPesquisa}>
            <TextField
              placeholder="Buscar produto"
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
              <IconButton onClick={handlePesquisar}sx={stylesLista.pesquisaIcon}>
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
            <Button sx={stylesLista.button} onClick={handleFecharCaixa} variant="contained" color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={stylesLista.produtosList}>
          <Card sx={{ width: '100%', padding: '10px', boxShadow: 'none' }}>
            <TableContainer sx={stylesLista.tableContainer}>
              <Table
                size="medium"
                aria-label="produtos table"
                sx={{ border: '2px solid #959494', borderRadius: '20px' }}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#DCDDDE', width: '100%', alignItems: 'center' }}>
                    {colunasVisiveis.nome && (
                      <TableCell sx={stylesLista.colunas}>NOME</TableCell>
                    )}
                    {colunasVisiveis.id && (
                      <TableCell sx={stylesLista.colunas}>CÓDIGO</TableCell>
                    )}
                    {colunasVisiveis.valor && (
                      <TableCell sx={stylesLista.colunas}>VALOR (R$)</TableCell>
                    )}
                    {colunasVisiveis.descricao && (
                      <TableCell sx={stylesLista.colunas}>
                        OBSERVAÇÕES
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
                          Nenhum produto encontrado.
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
                        {colunasVisiveis.id && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>{produto.id}</Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.valor && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {produto.valor}
                            </Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.descricao && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {produto.descricao}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell
                          sx={{ borderBottom: '1px solid #959494' }}
                          align="center"
                        >
                          <Tooltip title="Editar produto" arrow>
                            <IconButton color="primary" size="small" onClick={() => handleEditar(produto.estoque?.id)}>
                              <EditTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Visualizar produto" arrow>
                            <IconButton sx={{ color: '#424242' }} size="small" onClick={() => handleVisualizar(produto.estoque?.id)}>
                              <VisibilityTwoTone />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="Histórico do produto" arrow>
                            <IconButton color="primary" size="small" onClick={() => handleHistorico(produto.id)}>
                              <HistoryToggleOffTwoTone />
                            </IconButton>
                          </Tooltip> */}
                          <Tooltip title="Deletar produto" arrow>
                            <IconButton color="error" size="small" onClick={() => handleDelete(produto.id)}>
                              <DeleteTwoTone />
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
      <Snackbar
        open={mostrarAviso}
        onClose={() => setMostrarAviso(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="Nenhum cliente encontrado."
        ContentProps={{
          sx: {
            bgcolor: 'darkred',
            color: 'white',
            fontBorderRadius: '5px',
            textAlign: 'center',
            fontSize: '16px'
          }
        }}
      />
    </HelmetProvider>
  );
};

export default ListarProdutos;
