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
  CircularProgress,
  Typography,
  TableHead,
  Autocomplete,
  TextField
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useRequests } from 'src/utils/requests';
import stylesMovimentacao from 'src/content/pages/Estoque/stylesMovimentacaoEstoque';
import { Estoque } from 'src/models/Produto';

const MovimentacaoEstoque = () => {
  const { id } = useParams();
  const [infoMessage, setInfoMessage] = useState('');
  const [estoqueData, setEstoqueData] = useState<Estoque | null>(null);
  const { getEstoque, getUmProduto } = useRequests();
  const [lucroDesejado, setLucroDesejado] = useState<number>(0);
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtoData, setProdutoData] = useState<{
    id: Number;
    nome: string;
    descricao: string;
    valor: number;
  }>({
    id: 0,
    nome: '',
    descricao: '',
    valor: 0
  });
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const obterEstoque = async () => {
  //       if (id) {
  //         try {
  //           setLoading(true);
  //           const estoqueResponse = await getEstoque(+id);
  //           console.log('Resposta da API (getEstoque):', estoqueResponse);

  //           if ( !estoqueResponse || estoqueResponse.errors || !estoqueResponse.data?.estoque ) {
  //             throw new Error(
  //               'Erro ao carregar estoque: ' + estoqueResponse.detail ||
  //                 'Resposta inválida'
  //             );
  //           }

  //           const estoque = estoqueResponse.data.estoque;
  //           setEstoqueData(estoque);
  //           console.log('Produto ID:', estoque);
  //           if (estoque.produto?.id) {
  //             const idDoProduto = estoqueResponse.data.estoque.produto.id;
  //             setProdutoId(idDoProduto);
  //             const produtoResponse = await getUmProduto(idDoProduto);
  //             const produto = produtoResponse.data.produto;

  //             setProdutoData({
  //               id: produto.id, nome: produto.nome, descricao: produto.descricao, valor: produto.valor
  //             });
  //           }
  //         } catch (error) {
  //           console.error('Erro ao carregar estoque ou produto:', error);
  //           setInfoMessage(`Erro: ${error.message || 'Tente novamente.'}`);
  //         } finally {
  //           setLoading(false);
  //         }
  //       }
  //     };
  //     obterEstoque();
  //   }, [id]);
  //   useEffect(() => {
  //     if (produtoData && estoqueData) {
  //       const valorCompra = produtoData.valor;
  //       const valorVenda = estoqueData.valor_produto_venda;

  //       if (valorCompra && valorVenda && valorCompra > 0) {
  //         const lucro = ((valorVenda - valorCompra) / valorCompra) * 100;
  //         setLucroDesejado(Number(lucro.toFixed(2)));
  //     }
  //     }
  //   }, [produtoData, estoqueData]);

  //   if (loading || !produtoData)
  //     return (
  //       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //         <CircularProgress />
  //       </Box>
  //     );

  return (
    <HelmetProvider>
      <Helmet>
        <title>Movimentações do Estoque</title>
      </Helmet>
      <Navbar />

      <Box sx={stylesMovimentacao.headerMovimentacao}>
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/126/126089.png"
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
            options={['Todas as Movimentações', 'Produtos', 'Serviços']}
            defaultValue="Todas as Movimentações"
            renderInput={(params) => (
              <TextField {...params} sx={stylesMovimentacao.campoMov} />
            )}
          />
          <Box sx={stylesMovimentacao.calendarios}>
            <Typography variant="subtitle1">Data Inicial:</Typography>
            <TextField
              type="date"
              variant="outlined"
              size="small"
              sx={stylesMovimentacao.calendario}
            />
            <Typography variant="subtitle1" sx={{ marginLeft: '15px' }}>
              Data Final:
            </Typography>
            <TextField
              type="date"
              variant="outlined"
              size="small"
              sx={stylesMovimentacao.calendario}
            />
          </Box>
        </Box>
      </Box>

      <TableContainer>
        <Table size="small" aria-label="detalhes das movimentações" sx={stylesMovimentacao.tabelaInfo}>
          <TableHead>
            <TableRow sx={stylesMovimentacao.tabelaColunas}>
              <TableCell sx={stylesMovimentacao.titulosColunas}>PRODUTO</TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>DATA</TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>TIPO</TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>QUANTIDADE MOVIMENTADA</TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>CUSTO UNITÁRIO</TableCell>
              <TableCell sx={stylesMovimentacao.titulosColunas}>CUSTO TOTAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={stylesMovimentacao.linhas}>aobaa</TableCell>
              <TableCell sx={stylesMovimentacao.linhas}>asdasd</TableCell>
              <TableCell sx={stylesMovimentacao.linhas}>asdasd</TableCell>
              <TableCell sx={stylesMovimentacao.linhas}>asdasd</TableCell>
              <TableCell sx={stylesMovimentacao.linhas}>asdasd</TableCell>
              <TableCell sx={stylesMovimentacao.linhas}>asdasd</TableCell>
            </TableRow>
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
              <TableCell sx={stylesMovimentacao.linhasResumo}>aobaa</TableCell>
              <TableCell sx={stylesMovimentacao.linhasResumo}>asdasd</TableCell>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={stylesMovimentacao.botaoVoltar}>
          <Button
            onClick={() => {
              setTimeout(() => {
                window.history.back();
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

export default MovimentacaoEstoque;
