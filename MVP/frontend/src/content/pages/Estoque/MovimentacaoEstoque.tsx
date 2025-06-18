import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  TableHead,
  Autocomplete,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useRequests } from 'src/utils/requests';
import stylesMovimentacao from 'src/content/pages/Estoque/stylesMovimentacaoEstoque';
import { Movimentacao } from 'src/models/Produto';

const MovimentacaoEstoque = () => {
  const { getMovimentacoes } = useRequests();
  const [infoMessage, setInfoMessage] = useState('');
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todas as Movimentações');

  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    const [dia, mes, ano] = mov.data.split('/').map(Number);
    const dataMovimentacao = new Date(ano, mes - 1, dia);

    const dataIni = dataInicial ? new Date(dataInicial.trim()) : null;
    const dataFimRaw = dataFinal ? new Date(dataFinal.trim()) : null;

    let dataFimAjustada = null;
    if (dataFimRaw) {
      dataFimAjustada = new Date(dataFimRaw);
      dataFimAjustada.setDate(dataFimAjustada.getDate() + 1);
      dataFimAjustada.setHours(0, 0, 0, 0);
    }

    const dentroDoPeriodo =
      (!dataIni || dataMovimentacao >= dataIni) &&
      (!dataFimAjustada || dataMovimentacao <= dataFimAjustada);

    const tipoNormalizado = filtroTipo.toLowerCase();
    const tipoCondicao =
      tipoNormalizado === 'todas as movimentações' ||
      mov.tipo === tipoNormalizado.slice(0, -1);

    console.log({
      dataMovimentacao: dataMovimentacao.toISOString().slice(0, 10),
      dataIni: dataIni?.toISOString().slice(0, 10),
      dataFim: dataFimAjustada?.toISOString().slice(0, 10),
      dentroDoPeriodo,
      tipoCondicao,
      resultadoFinal: dentroDoPeriodo && tipoCondicao
    });

    return dentroDoPeriodo && tipoCondicao;
  });

  useEffect(() => {
    const obterMovimentacoes = async () => {
      try {
        const response = await getMovimentacoes();
        if (response?.data?.movimentacoes?.length) {
          setMovimentacoes(response.data.movimentacoes);
          setLoading(false);
        } else {
          setInfoMessage('Nenhuma movimentação encontrada.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao obter movimentações:', error);
        setInfoMessage('Erro ao obter movimentações.');
        setLoading(false);
      }
    };
    obterMovimentacoes();
  }, []);

  const formatarData = (dataString: string | null | undefined) => {
    if (!dataString) return '';

    const [dia, mes, ano] = dataString.split('/').map(Number);
    if (!dia || !mes || !ano) return 'Data inválida';

    const data = new Date(ano, mes - 1, dia);
    if (isNaN(data.getTime())) return 'Data inválida';

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const totalEntradas = movimentacoesFiltradas.filter(
    (m) => m.tipo === 'compra'
  ).length;
  const totalSaidas = movimentacoesFiltradas.filter(
    (m) => m.tipo === 'venda'
  ).length;

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <HelmetProvider>
      <Helmet>
        <title>Movimentações do Estoque</title>
      </Helmet>
      <Navbar />

      <Box sx={stylesMovimentacao.headerMovimentacao}>
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/68/68374.png"
          alt="Ícone Visualizar"
          sx={stylesMovimentacao.headerMovimentacaoImg}
        />
        <Typography sx={stylesMovimentacao.headerMovimentacaoSpan}>
          Movimentações do Estoque
        </Typography>
      </Box>

      <Box>
        <Box sx={stylesMovimentacao.caixaMov}>
          <Typography variant="subtitle1" sx={{ marginTop: '8px' }}>
            Movimentações:
          </Typography>
          <Autocomplete
            options={['Todas as Movimentações', 'Compras', 'Vendas']}
            value={filtroTipo}
            onChange={(event, newValue) =>
              setFiltroTipo(newValue || 'Todas as Movimentações')
            }
            renderInput={(params) => (
              <TextField {...params} sx={stylesMovimentacao.campoMov} />
            )}
            clearOnEscape
          />
          <Box sx={stylesMovimentacao.calendarios}>
            <Typography variant="subtitle1">Data Inicial:</Typography>
            <TextField
              type="date"
              variant="outlined"
              value={dataInicial}
              size="small"
              sx={stylesMovimentacao.calendario}
              onChange={(e) => {
                const novaData = e.target.value;
                if (dataFinal && new Date(novaData) > new Date(dataFinal)) {
                  setDataFinal(novaData);
                }
                setDataInicial(novaData);
              }}
            />
            <Typography variant="subtitle1" sx={{ marginLeft: '15px' }}>
              Data Final:
            </Typography>
            <TextField
              type="date"
              variant="outlined"
              value={dataFinal}
              size="small"
              sx={stylesMovimentacao.calendario}
              onChange={(e) => {
                const novaData = e.target.value;
                if (dataInicial && new Date(novaData) < new Date(dataInicial)) {
                  setDataInicial(novaData);
                }
                setDataFinal(novaData);
              }}
            />
            {(dataInicial || dataFinal) && (
              <Tooltip title="Limpar datas" arrow>
                <IconButton
                  aria-label="Limpar datas"
                  onClick={() => {
                    setDataInicial('');
                    setDataFinal('');
                  }}
                  sx={{ marginLeft: '15px' }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      <TableContainer>
        <Table
          size="small"
          aria-label="detalhes das movimentações"
          sx={stylesMovimentacao.tabelaInfo}
        >
          <TableHead>
            <TableRow sx={stylesMovimentacao.tabelaColunas}>
              <TableCell sx={stylesMovimentacao.titulosColunas}>
                PRODUTO
              </TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>DATA</TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>TIPO</TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>
                QUANTIDADE
              </TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>
                CUSTO UNITÁRIO
              </TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>
                CUSTO TOTAL
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {movimentacoesFiltradas.map((mov, index) => (
              <TableRow key={index}>
                <TableCell sx={stylesMovimentacao.linhas}>
                  {mov.produto}
                </TableCell>
                <TableCell sx={stylesMovimentacao.linhas}>
                  {formatarData(mov.data)}
                </TableCell>
                <TableCell sx={stylesMovimentacao.linhas}>{mov.tipo}</TableCell>
                <TableCell sx={stylesMovimentacao.linhas}>
                  {mov.quantidade}
                </TableCell>
                <TableCell sx={stylesMovimentacao.linhas}>
                  {mov.valor_unitario.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </TableCell>
                <TableCell sx={stylesMovimentacao.linhas}>
                  {(mov.valor_unitario * mov.quantidade).toLocaleString(
                    'pt-BR',
                    { style: 'currency', currency: 'BRL' }
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={stylesMovimentacao.movimentacaoDetalhes}>
        <Box sx={stylesMovimentacao.campoResumo}>
          <Typography variant="h6" sx={stylesMovimentacao.tituloResumo}>
            RESUMO PERÍODO
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Typography sx={stylesMovimentacao.camposResumo}>ENTRADAS</Typography>
          <Typography sx={stylesMovimentacao.camposResumo}>SAÍDAS</Typography>
        </Box>

        <TableContainer>
          <Table size="small" aria-label="detalhes das movimentações">
            <TableBody>
              <TableCell sx={stylesMovimentacao.totaisResumo}>
                {totalEntradas}
              </TableCell>
              <TableCell sx={stylesMovimentacao.totaisResumo}>
                {totalSaidas}
              </TableCell>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={stylesMovimentacao.botaoVoltar}>
          <Button
            onClick={() => {
              setTimeout(() => {
                window.history.back();
              }, 2500);
            }}
          >
            Voltar
          </Button>
        </Box>
      </Box>
    </HelmetProvider>
  );
};

export default MovimentacaoEstoque;
