import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Button, CircularProgress, Typography } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useRequests } from 'src/utils/requests';
import stylesProduto from 'src/content/pages/Produtos/stylesDetalhesProduto';
import { Estoque } from 'src/models/Produto';

const DetalhesProduto = () => {
  const { id } = useParams();
  const [infoMessage, setInfoMessage] = useState('');
  const [estoqueData, setEstoqueData] = useState<Estoque | null>(null);
  const { getEstoque, getUmProduto } = useRequests();
  const [lucroDesejado, setLucroDesejado] = useState<number>(0);
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtoData, setProdutoData] = useState<{ id: Number; nome: string; descricao: string; valor_compra: number; }>({
    id: 0, nome: '', descricao: '', valor_compra: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obterEstoque = async () => {
      if (id) {
        try {
          setLoading(true);
          const estoqueResponse = await getEstoque(+id);
          console.log('Resposta da API (getEstoque):', estoqueResponse);

          if ( !estoqueResponse || estoqueResponse.errors || !estoqueResponse.data?.estoque ) {
            throw new Error(
              'Erro ao carregar estoque: ' + estoqueResponse.detail ||
                'Resposta inválida'
            );
          }

          const estoque = estoqueResponse.data.estoque;
          setEstoqueData(estoque);
          console.log('Produto ID:', estoque);
          if (estoque.produto?.id) {
            const idDoProduto = estoqueResponse.data.estoque.produto.id;
            setProdutoId(idDoProduto);
            const produtoResponse = await getUmProduto(idDoProduto);
            const produto = produtoResponse.data.produto;

            setProdutoData({
              id: produto.id, nome: produto.nome, descricao: produto.descricao, valor_compra: produto.valor_compra
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
  useEffect(() => {
    if (produtoData && estoqueData) {
      const valorCompra = produtoData.valor_compra;
      const valorVenda = estoqueData.valor_produto_venda;

      if (valorCompra && valorVenda && valorCompra > 0) {
        const lucro = ((valorVenda - valorCompra) / valorCompra) * 100;
        setLucroDesejado(Number(lucro.toFixed(2)));
    }
    }
  }, [produtoData, estoqueData]);

  if (loading || !produtoData)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
    
  return (
    <HelmetProvider>
      <Helmet>
        <title>Detalhes do Produto</title>
      </Helmet>
      <Navbar />

      <Box sx={stylesProduto.headerProduto}>
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/126/126089.png"
          alt="Ícone Visualizar"
          sx={stylesProduto.headerProdutoImg}
        />
        <Typography sx={stylesProduto.headerProdutoSpan}>
          Produto - Visualizar dados
        </Typography>
      </Box>

      <Box sx={stylesProduto.produtosDetalhes}>
        <Box sx={stylesProduto.abas}>
            <Typography variant="h6" sx={stylesProduto.aba}> DADOS </Typography>
        </Box>

        <TableContainer>
        <Table size="small" aria-label="detalhes do produto">
            <TableBody>
            <TableRow>
                <TableCell sx={stylesProduto.campoTitulo}>Nome</TableCell>
                <TableCell sx={stylesProduto.campoValor}> {produtoData.nome} </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={stylesProduto.campoTitulo}>Código</TableCell>
                <TableCell sx={stylesProduto.campoValor}> {produtoData.id} </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={stylesProduto.campoTitulo}>Valor de Compra (R$)</TableCell>
                <TableCell sx={stylesProduto.campoValor}> {produtoData.valor_compra} </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={stylesProduto.campoTitulo}>Lucro Desejado (%)</TableCell>
                <TableCell sx={stylesProduto.campoValor}> {lucroDesejado}% </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={stylesProduto.campoTitulo}>Valor de Venda (R$)</TableCell>
                <TableCell sx={stylesProduto.campoValor}> {estoqueData.valor_produto_venda} </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={stylesProduto.campoTitulo}> Observações </TableCell>
                <TableCell sx={stylesProduto.campoValor}> {produtoData.descricao} </TableCell>
            </TableRow>
            </TableBody>
        </Table>
        </TableContainer>
        
        <Box sx={stylesProduto.botaoVoltar}>
            <Button onClick={() => {
                    setTimeout(() => {
                    window.history.back();
                    }, 2500);
                }}
            >Voltar</Button>
        </Box>
      </Box>
    </HelmetProvider>
  );
};

export default DetalhesProduto;