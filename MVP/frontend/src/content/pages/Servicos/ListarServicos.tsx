import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Card,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, FormControlLabel, Checkbox, DialogActions, TextField, Snackbar
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
import { useRequests } from 'src/utils/requests';
import stylesLista from 'src/content/pages/Servicos/stylesListarServicos';
import { Servico } from 'src/models/Servico';

const ListarServicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [colunasVisiveis, setColunasVisiveis] = useState({
    nome: true, id: true, valor_servico: true, status_servico: true
  });
  const [abrirCaixa, setAbrirCaixa] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [procurado, setProcurado] = useState('');
  const [servicosFiltrados, setServicosFiltrados] = useState<Servico[]>([]);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [loading, setLoading] = useState(true);

  const { getServicos, getUmServico, deleteServico } = useRequests();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarServicos = async () => {
      try {
        const response = await getServicos();
        setServicos(response.data?.servicos || []);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        setServicos([]);
      }
    };
    carregarServicos();
  }, [getServicos]);

  const handleEditar = async (id: number) => {
    try {
      const response = await getUmServico(id);
      const servico = response.data.servico;
      if (servico?.id) {
        navigate(`/servico/editar/${servico.id}`);
      } else {
        console.error('Serviço não encontrado:', id);
      }
    } catch (error) {
      console.error('Erro ao buscar serviço para edição:', error);
    }
  };
  const handleVisualizar = async (id: number) => {
    try {
      const response = await getUmServico(id);
      const servico = response.data.servico;
      if (servico?.id) {
        navigate(`/servico/${servico.id}`);
      } else {
        console.error('Serviço não encontrado:', id);
      }
    } catch (error) {
      console.error('Erro ao buscar servico a visualização:', error);
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  const handleHistorico = (id: number) => {
    setTimeout(() => {
      navigate(`/servico/historico/${id}`);
    }, 1500);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) {
      return;
    }
    try {
      console.log(`Tentando deletar serviço com ID: ${id}`);
      await deleteServico(id);
      setServicos((servicos) =>
        servicos.filter((servico) => servico.id !== id)
      );
      setInfoMessage('Serviço deletado com sucesso!');
      setMostrarAviso(true);
      console.log(`Serviço com ID ${id} deletado com sucesso!`);
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
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
      id: 'Código',
      valor_servico: 'Valor do Serviço (R$)',
      status_servico: 'Status do Serviço'
    };
    return mapColunas[coluna] || coluna;
  };

  const handlePesquisar = () => {
    const servicoProcurado = procurado.toLowerCase();
    const filtrados = servicos.filter((servico) =>
      Object.values(servico).some((valor) =>
        valor?.toString().toLowerCase().includes(servicoProcurado)
      )
    );
    if (filtrados.length === 0) setMostrarAviso(true);

    setServicosFiltrados(filtrados);
    setProcurado('');
  };

  const handleAddServico = () => {
    setTimeout(() => {
      navigate('/servico-add');
    }, 1500);
  };

  return (
    <HelmetProvider>
      <Helmet> <title>Lista dos Serviços</title> </Helmet>
      <Navbar />
      <Box>
        <Box sx={stylesLista.headerServico}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/0/109.png"
            alt="Ícone Cliente"
            sx={stylesLista.headerServicoImg}
          />
          <Box sx={stylesLista.headerServicoSpan}>Serviços</Box>
        </Box>

        <Box sx={stylesLista.buttons}>
          <Button variant="contained" color="success" 
            size="large"
            sx={{ textTransform: 'none', fontSize: '15px' }} onClick={handleAddServico}>
            <AddCircleOutlineTwoTone sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }}/>
            Adicionar
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#0c3c94', textTransform: 'none' }}
            onClick={handleAbrirCaixa}
          >
            <SettingsTwoTone sx={{ marginRight: '5px', color: 'white', fontSize: '20px' }} />
              Gerenciar colunas
          </Button>

          <Box sx={stylesLista.barraPesquisa}>
            <TextField
              placeholder="Buscar serviço"
              sx={stylesLista.campoInput}
              value={procurado}
              onChange={(e) => setProcurado(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePesquisar();
                }
              }}
            />
            <Tooltip title="Pesquisar serviço" arrow>
              <IconButton onClick={handlePesquisar} sx={stylesLista.pesquisaIcon}>
                <SearchTwoTone />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Dialog PaperProps={{ sx: stylesLista.caixa }} open={abrirCaixa} onClose={handleFecharCaixa}>
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

        <Box sx={stylesLista.servicosList}>
          <Card sx={{ width: '100%', padding: '10px', boxShadow: 'none' }}>
            <TableContainer sx={stylesLista.tableContainer}>
              <Table size="medium" aria-label="servicos table" sx={{ border: '2px solid #959494', borderRadius: '20px' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#DCDDDE', width: '100%', alignItems: 'center' }} >
                    {colunasVisiveis.nome && (
                      <TableCell sx={stylesLista.colunas}>NOME</TableCell>
                    )}
                    {colunasVisiveis.id && (
                      <TableCell sx={stylesLista.colunas}>CÓDIGO</TableCell>
                    )}
                    {colunasVisiveis.valor_servico && (
                      <TableCell sx={stylesLista.colunas}>VALOR (R$)</TableCell>
                    )}
                    {colunasVisiveis.status_servico && (
                      <TableCell sx={stylesLista.colunas}>STATUS</TableCell>
                    )}
                    <TableCell sx={stylesLista.colunas}>AÇÕES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(servicosFiltrados.length > 0 ? servicosFiltrados : servicos)
                    .length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography gutterBottom>
                          Nenhum serviço encontrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (servicosFiltrados.length > 0
                      ? servicosFiltrados
                      : servicos
                    ).map((servico) => (
                      <TableRow key={servico.id}>
                        {colunasVisiveis.nome && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>{servico.nome}</Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.id && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>{servico.id}</Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.valor_servico && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>{formatarValor(servico.valor_servico)}</Typography>
                          </TableCell>
                        )}
                        {colunasVisiveis.status_servico && (
                          <TableCell sx={stylesLista.linhas}>
                            <Typography gutterBottom>
                              {servico.status_servico}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell sx={{ borderBottom: '1px solid #959494', width: '20%' }} align="center">
                          <Tooltip title="Editar serviço" arrow>
                            <IconButton color="primary" size="small" onClick={() => handleEditar(servico.id)}>
                              <EditTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Visualizar serviço" arrow>
                            <IconButton sx={{ color: '#424242' }} size="small" onClick={() => handleVisualizar(servico.id)}>
                              <VisibilityTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Histórico do serviço" arrow>
                            <IconButton color="primary" size="small" onClick={() => handleHistorico(servico.id)}>
                              <HistoryTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Deletar serviço" arrow>
                            <IconButton color="error" size="small" onClick={() => handleDelete(servico.id)}>
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
            alignItems: 'center', justifyContent: 'center',
            bgcolor:
              infoMessage === 'Serviço deletado com sucesso!' ? 'green' : 'red',
            color: 'white', borderRadius: '5px', textAlign: 'center', fontSize: '16px', marginTop: '80px'
          }
        }}
      />
    </HelmetProvider>
  );
};

export default ListarServicos;