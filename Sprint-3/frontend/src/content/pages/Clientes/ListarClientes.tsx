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
  SearchTwoTone
} from '@mui/icons-material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useNavigate } from 'react-router';
import { useRequests } from 'src/utils/requests';
import { Cliente } from 'src/models/Cliente';
import stylesLista from 'src/content/pages/Clientes/stylesListarClientes';

const ListarClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [colunasVisiveis, setColunasVisiveis] = useState({
    nome: true,
    cpf_cnpj: true,
    email: true,
    telefone: true,
    bairro: true,
    cep: true,
    endereco: true,
    status_cliente: true,
    observacao: true
  });
  const [abrirCaixa, setAbrirCaixa] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [procurado, setProcurado] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const { getClientes, deleteCliente } = useRequests();
  const navigate = useNavigate();

  useEffect(() => {
    const obterClientes = async () => {
      try {
        const response = await getClientes();
        console.log('Resposta completa da API:', response);
        console.log('Dados da API:', response.data);
        setClientes(response.data?.clientes || []);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setClientes([]);
        setInfoMessage('Nenhum cliente encontrado.');
        setMostrarAviso(true);
      }
    };
    obterClientes();
  }, [getClientes]);

  const handleEditar = (id: number) => {
    navigate(`/cliente/editar/${id}`);
  };

  const handleVisualizar = (id: number) => {
    navigate(`/cliente/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    try {
      console.log(`Tentando deletar cliente com ID: ${id}`);
      await deleteCliente(id);
      setClientes((clientes) =>
        clientes.filter((cliente) => cliente.id !== id)
      );
      setInfoMessage('Cliente deletado com sucesso!');
      setMostrarAviso(true);
      console.log(`Cliente com ID ${id} deletado com sucesso!`);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
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
      cpf_cnpj: 'CPF/CNPJ',
      email: 'Email',
      telefone: 'Telefone',
      bairro: 'Bairro',
      cep: 'CEP',
      endereco: 'Endereço',
      status_cliente: 'Status',
      observacao: 'Observação'
    };
    return mapColunas[coluna] || coluna;
  };

  const handlePesquisar = () => {
    const clienteProcurado = procurado.toLowerCase();
    const filtrados = clientes.filter((cliente) =>
      Object.values(cliente).some((valor) =>
        valor?.toString().toLowerCase().includes(clienteProcurado)
      )
    );

    if (filtrados.length === 0) setMostrarAviso(true);

    setClientesFiltrados(filtrados);
    setProcurado('');
  };

  const handleAddCliente = () => {
    setTimeout(() => {
      navigate('/cliente-add');
    }, 1500);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Lista dos Clientes</title>
      </Helmet>
      <Navbar />
      <Box>
        <Box sx={stylesLista.headerCliente}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
            alt="Ícone Cliente"
            sx={stylesLista.headerClienteImg}
          />
          <Box sx={stylesLista.headerClienteSpan}>Clientes</Box>
        </Box>

        <Box sx={stylesLista.buttons}>
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ textTransform: 'none', fontSize: '15px' }}
            onClick={handleAddCliente}
          >
            <AddCircleOutlineTwoTone
              sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }}
            />
            Adicionar
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#0c3c94', textTransform: 'none' }}
            onClick={handleAbrirCaixa}
          >
            <SettingsTwoTone
              sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }}
            />
            Gerenciar colunas
          </Button>

          <Box sx={stylesLista.barraPesquisa}>
            <TextField
              placeholder="Buscar cliente"
              sx={stylesLista.campoInput}
              value={procurado}
              onChange={(e) => setProcurado(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePesquisar();
                }
              }}
            />
            <Tooltip title="Pesquisar cliente" arrow>
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

        <Box sx={stylesLista.clientesList}>
          <Card sx={{ width: '100%', padding: '10px', boxShadow: 'none' }}>
            <TableContainer sx={stylesLista.tableContainer}>
              <Table
                size="medium"
                aria-label="clientes table"
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
                    {colunasVisiveis.nome && (
                      <TableCell sx={stylesLista.colunas}>NOME</TableCell>
                    )}
                    {colunasVisiveis.cpf_cnpj && (
                      <TableCell sx={stylesLista.colunas}>CPF / CNPJ</TableCell>
                    )}
                    {colunasVisiveis.email && (
                      <TableCell sx={stylesLista.colunas}>EMAIL</TableCell>
                    )}
                    {colunasVisiveis.telefone && (
                      <TableCell sx={stylesLista.colunas}>TELEFONE</TableCell>
                    )}
                    {colunasVisiveis.bairro && (
                      <TableCell sx={stylesLista.colunas}>BAIRRO</TableCell>
                    )}
                    {colunasVisiveis.cep && (
                      <TableCell sx={stylesLista.colunas}>CEP</TableCell>
                    )}
                    {colunasVisiveis.endereco && (
                      <TableCell sx={stylesLista.colunas}>ENDEREÇO</TableCell>
                    )}
                    {colunasVisiveis.status_cliente && (
                      <TableCell sx={stylesLista.colunas}>STATUS</TableCell>
                    )}
                    {colunasVisiveis.observacao && (
                      <TableCell sx={stylesLista.colunas}>
                        OBSERVAÇÕES
                      </TableCell>
                    )}
                    <TableCell sx={stylesLista.colunas}>AÇÕES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(clientesFiltrados.length > 0 ? clientesFiltrados : clientes)
                    .length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography gutterBottom>
                          Nenhum cliente encontrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (clientesFiltrados.length > 0
                      ? clientesFiltrados
                      : clientes
                    ).map((cliente) => (
                      <TableRow key={cliente.id}>
                        {colunasVisiveis.nome && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>{cliente.nome}</Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.cpf_cnpj && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {cliente.cpf_cnpj}
                            </Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.email && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {cliente.email}
                            </Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.telefone && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {cliente.telefone}
                            </Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.bairro && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {cliente.bairro}
                            </Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.cep && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>{cliente.cep}</Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.endereco && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {cliente.endereco}
                            </Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.status_cliente && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {cliente.status_cliente}
                            </Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.observacao && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {cliente.observacao}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell
                          sx={{ borderBottom: '1px solid #959494' }}
                          align="center"
                        >
                          <Tooltip title="Editar cliente" arrow>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditar(cliente.id)}
                            >
                              <EditTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Visualizar cliente" arrow>
                            <IconButton
                              sx={{ color: '#424242' }}
                              size="small"
                              onClick={() => handleVisualizar(cliente.id)}
                            >
                              <VisibilityTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Deletar cliente" arrow>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDelete(cliente.id)}
                            >
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
        autoHideDuration={
          infoMessage === 'Nenhum cliente encontrado.' ? 3000 : 4000
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={infoMessage}
        ContentProps={{
          sx: {
            bgcolor:
              infoMessage === 'Cliente deletado com sucesso!' ? 'green' : 'red',
            color: 'white',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '16px',
            marginTop: '80px'
          }
        }}
      />
    </HelmetProvider>
  );
};

export default ListarClientes;
