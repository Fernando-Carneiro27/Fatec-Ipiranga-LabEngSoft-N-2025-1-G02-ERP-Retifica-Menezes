import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  CircularProgress,
  Typography,
  TableHead
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useRequests } from 'src/utils/requests';
import stylesHistorico from 'src/content/pages/Servicos/stylesHistoricoPreco';
import { Servico } from 'src/models/Servico';

const HistoricoServico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [infoMessage, setInfoMessage] = useState('');
  const [servicoData, setServicoData] = useState<Servico | null>(null);
  const { getUmServico } = useRequests();
  const [historicoValores, setHistoricoValores] = useState<number[]>([]);
  const [historicoDatas, setHistoricoDatas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const formataDatas = (isoDate: string) => {
    const date = new Date(isoDate);
  
  if (isNaN(date.getTime())) {
    console.error('Data inválida:', isoDate); 
    return 'Data inválida'; 
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
  };

  useEffect(() => {
  const obterServico = async () => {
    if (id) {
      try {
        setLoading(true);
        const response = await getUmServico(Number(id));
        const servico = response.data?.servico;

        if (!servico) throw new Error('Serviço não encontrado.');

        setServicoData(servico);

        setHistoricoValores(servico.historico_valor_servico || []);
        setHistoricoDatas(
          (servico.historico_data_modificacao || []).map((data) =>
            formataDatas(data)
          )
        );
      } catch (error) {
        console.error('Erro ao carregar serviço:', error);
        setInfoMessage(`Erro: ${error.message || 'Tente novamente.'}`);
      } finally {
        setLoading(false);
      }
    }
  };
  obterServico();
  }, [id]);

  if (loading || !servicoData)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  return (
    <HelmetProvider>
      <Helmet>
        <title>Histórico do Produto</title>
      </Helmet>
      <Navbar />

      <Box sx={stylesHistorico.headerHistorico}>
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/0/109.png"
          alt="Ícone Visualizar"
          sx={stylesHistorico.headerHistoricoImg}
        />
        <Typography sx={stylesHistorico.headerHistoricoSpan}>
          Serviço - Histórico de Valores de Venda
        </Typography>
      </Box>

      <Box sx={stylesHistorico.servicosDetalhes}>
        <Box sx={stylesHistorico.abas}>
          <Typography  sx={stylesHistorico.aba}>
            {servicoData?.nome}
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small" aria-label="detalhes do servico">
            <TableHead>
              <TableRow>
                <TableCell sx={stylesHistorico.campoTitulo}>VALOR DE VENDA</TableCell>
                <TableCell sx={stylesHistorico.campoTitulo}>DATA/HORA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historicoValores.length === 0 ? (
                <TableRow>
                  <TableCell sx={stylesHistorico.campoValor}>
                    R$ {servicoData?.valor_servico.toFixed(2)}
                  </TableCell>
                  <TableCell sx={stylesHistorico.campoValor}>
                    Sem modificações até o momento
                  </TableCell>
                </TableRow>
              ) : (
                historicoValores.map((valor, index) => (
                  <TableRow key={index}>
                    <TableCell sx={stylesHistorico.campoValor}>
                      R$ {valor.toFixed(2)}
                    </TableCell>
                    <TableCell sx={stylesHistorico.campoValor}>
                      {historicoDatas[index]}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={stylesHistorico.botaoVoltar}>
          <Button
            onClick={() => {
              setTimeout(() => {
                navigate('/servicos');
              }, 1500);
            }}
          >
            Voltar
          </Button>
        </Box>
      </Box>
    </HelmetProvider>
  );
};

export default HistoricoServico;