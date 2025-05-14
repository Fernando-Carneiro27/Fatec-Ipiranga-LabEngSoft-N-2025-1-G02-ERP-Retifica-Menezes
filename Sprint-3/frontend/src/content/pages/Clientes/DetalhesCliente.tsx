import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Typography
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useRequests } from 'src/utils/requests';
import stylesCliente from './stylesDetalhesCliente';

const DetalhesCliente = () => {
  const { id } = useParams();
  const { getUmCliente } = useRequests();
  const [cliente, setCliente] = useState(null);
  const [abaSelecionada, setAbaSelecionada] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obterCliente = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await getUmCliente(+id);
          console.log('Dados do cliente:', response.data);
          setCliente(response.data?.cliente);
        } catch (error) {
          console.error('Erro ao buscar cliente:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    obterCliente();
  }, [id]);

  if (loading || !cliente)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );

  const handleAbas = (event: React.SyntheticEvent, newValue: number) => {
    setAbaSelecionada(newValue);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Detalhes do Cliente</title>
      </Helmet>
      <Navbar />

      <Box sx={{ height: '70vh' }}>
        <Box sx={stylesCliente.headerCliente}>
                <Box
                  component="img"
                  src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                  alt="Ícone Visualizar"
                  sx={stylesCliente.headerClienteImg}
                />
                <Typography sx={stylesCliente.headerClienteSpan}>
                  Cliente - Visualizar dados
                </Typography>
              </Box>
        <Box sx={stylesCliente.clientesDetalhes}>
          <Tabs
            value={abaSelecionada}
            onChange={handleAbas}
            indicatorColor="primary"
            textColor="inherit"
            sx={stylesCliente.abas}
          >
            <Tab label="DADOS" sx={stylesCliente.aba} />
            <Tab label="FOTO" sx={stylesCliente.aba} />
            <Tab label="VENDAS" sx={stylesCliente.aba} />
          </Tabs>

          {abaSelecionada === 0 && (
            <TableContainer>
              <Table size="small" aria-label="detalhes do cliente">
                <TableBody>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>Nome</TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.nome}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}> CPF / CNPJ </TableCell>
                    <TableCell sx={stylesCliente.campoValor}> {cliente.cpf_cnpj} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>Email</TableCell>
                    <TableCell sx={stylesCliente.campoValor}> {cliente.email} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>Celular</TableCell>
                    <TableCell sx={stylesCliente.campoValor}> {cliente.telefone} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>CEP</TableCell>
                    <TableCell sx={stylesCliente.campoValor}> {cliente.cep} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}> Endereço </TableCell>
                    <TableCell sx={stylesCliente.campoValor}> {cliente.endereco} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>Bairro</TableCell>
                    <TableCell sx={stylesCliente.campoValor}> {cliente.bairro} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}> Tipo de Cliente </TableCell>
                    <TableCell sx={stylesCliente.campoValor}> {cliente.tipo} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}> Status Cliente </TableCell>
                    <TableCell sx={stylesCliente.campoValor}> {cliente.status_cliente} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={stylesCliente.botaoVoltar}>
            <Button onClick={() => window.history.back()}>Voltar</Button>
          </Box>
        </Box>
      </Box>

    </HelmetProvider>
  );
};

export default DetalhesCliente;
