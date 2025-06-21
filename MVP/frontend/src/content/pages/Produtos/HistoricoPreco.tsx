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
import Navbar from 'src/components/Navbar/SideMenu';
import { useRequests } from 'src/utils/requests';
import stylesHistorico from 'src/content/pages/Produtos/stylesHistoricoPreco';
import { Estoque } from 'src/models/Produto';

const HistoricoProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [infoMessage, setInfoMessage] = useState('');
  const [estoqueData, setEstoqueData] = useState<Estoque | null>(null);
  const { getEstoque, getUmProduto } = useRequests();
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtoData, setProdutoData] = useState<{
    id: Number;
    nome: string;
    descricao: string;
    valor_compra: number;
  }>({
    id: 0,
    nome: '',
    descricao: '',
    valor_compra: 0
  });
  const [historicoValores, setHistoricoValores] = useState<number[]>([]);
  const [historicoDatas, setHistoricoDatas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const formataDate = (isoDate: string) => {
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
      timeZone: 'America/Sao_Paulo'
    }).format(date);
  };

  useEffect(() => {
    const obterEstoque = async () => {
      if (id) {
        try {
          setLoading(true);
          const estoqueResponse = await getEstoque(+id);
          console.log('Resposta da API (getEstoque):', estoqueResponse);

          if (
            !estoqueResponse ||
            estoqueResponse.errors ||
            !estoqueResponse.data?.estoque
          ) {
            throw new Error(
              'Erro ao carregar estoque: ' +
                (estoqueResponse.detail || 'Resposta inválida')
            );
          }

          const estoque = estoqueResponse.data.estoque;
          setEstoqueData(estoque);
          setHistoricoValores(estoque.historico_valor_venda || []);
          setHistoricoDatas(
            (estoque.historico_data_modificacao || []).map((data) =>
              formataDate(data)
            )
          );
          if (estoque.produto?.id) {
            const produtoResponse = await getUmProduto(estoque.produto.id);
            const produto = produtoResponse.data.produto;
            setProdutoData({
              id: produto.id,
              nome: produto.nome,
              descricao: produto.descricao,
              valor_compra: produto.valor_compra
            });
          }
        } catch (error) {
          console.error('Erro ao carregar estoque ou produto:', error);
          setInfoMessage(`Erro: ${error.message || 'Tente novamente.'}`);
        } finally {
          setLoading(false);
        }
      }
    };
    obterEstoque();
  }, [id]);
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };
  if (loading || !produtoData)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
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
          src="https://cdn-icons-png.flaticon.com/512/126/126089.png"
          alt="Ícone Visualizar"
          sx={stylesHistorico.headerHistoricoImg}
        />
        <Typography sx={stylesHistorico.headerHistoricoSpan}>
          Produto - Histórico de Valores de Venda
        </Typography>
      </Box>

      <Box sx={stylesHistorico.produtosDetalhes}>
        <Box sx={stylesHistorico.abas}>
          <Typography variant="h6" sx={stylesHistorico.aba}>
            {produtoData.nome}
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small" aria-label="detalhes do produto">
            <TableHead>
              <TableRow>
                <TableCell sx={stylesHistorico.campoTitulo}>
                  VALOR DE VENDA
                </TableCell>
                <TableCell sx={stylesHistorico.campoTitulo}>
                  DATA/HORA
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historicoValores.length === 0 ? (
                <TableRow>
                  <TableCell sx={stylesHistorico.campoValor}>
                    R$ {estoqueData.valor_produto_venda.toFixed(2)}
                  </TableCell>
                  <TableCell sx={stylesHistorico.campoValor}>
                    Sem modificações do valor até o momento
                  </TableCell>
                </TableRow>
              ) : (
                historicoValores.map((valor, index) => (
                  <TableRow key={index}>
                    <TableCell sx={stylesHistorico.campoValor}>
                      {formatarValor(valor)}
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

export default HistoricoProduto;
