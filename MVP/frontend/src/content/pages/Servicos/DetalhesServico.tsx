import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Button, CircularProgress, Typography } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useRequests } from 'src/utils/requests';
import stylesServico from 'src/content/pages/Servicos/stylesDetalhesServico';
import { Servico } from 'src/models/Servico';
import { Produto } from 'src/models/Produto';

const DetalhesServico = () => {
  const { id } = useParams();
  const [infoMessage, setInfoMessage] = useState('');
  const [servicoData, setServicoData] = useState<Servico>({
    nome: '',
    valor_servico: 0,
    status_servico: '',
    descricao_servico: '',
    data_modificacao_servico: '',
    produtos: [],
    produtos_ids: []
  });
  const { getUmServico, getProdutos } = useRequests();
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [respServico, respProdutos] = await Promise.all([
          getUmServico(Number(id)),
          getProdutos()
        ]);

        const servicoDetail = respServico?.data;
        const servico = servicoDetail.servico;
        const produtos = respProdutos?.data?.produto ?? [];
        setListaProdutos(produtos);

        const servicoComProdutos: Servico = {
          ...servico,
          produtos: servico.produtos,
          produtos_ids: servico.produtos.map((p: Produto) => p.id)
        };

        setServicoData(servicoComProdutos);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do serviço e produtos:', error);
      }
    };

    carregarDados();
  }, [id]);
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  if (loading || !servicoData)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <HelmetProvider>
      <Helmet>
        <title>Detalhes do Servico</title>
      </Helmet>
      <Navbar />
      <Box sx={stylesServico.headerServico}>
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/0/109.png"
          alt="Ícone Visualizar"
          sx={stylesServico.headerServicoImg}
        />
        <Typography sx={stylesServico.headerServicoSpan}> Serviço - Visualizar dados </Typography>
      </Box>

      <Box sx={stylesServico.servicosDetalhes}>
        <Box sx={stylesServico.abas}>
          <Typography variant="h6" sx={stylesServico.aba}>
            DADOS
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small" aria-label="detalhes do produto">
            <TableBody>
              <TableRow>
                <TableCell sx={stylesServico.campoTitulo}>Nome</TableCell>
                <TableCell sx={stylesServico.campoValor}>
                  {servicoData.nome}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={stylesServico.campoTitulo}>Produtos</TableCell>
                <TableCell sx={stylesServico.campoValor}>
                  {servicoData.produtos.length > 0
                    ? servicoData.produtos
                        .map((produto) => produto.nome)
                        .join(', ')
                    : 'Nenhum produto associado a este serviço.'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={stylesServico.campoTitulo}>
                  Valor de Venda (R$)
                </TableCell>
                <TableCell sx={stylesServico.campoValor}>
                  {formatarValor(servicoData.valor_servico)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={stylesServico.campoTitulo}>Status</TableCell>
                <TableCell sx={stylesServico.campoValor}>
                  {servicoData.status_servico}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={stylesServico.campoTitulo}>
                  Observações
                </TableCell>
                <TableCell sx={stylesServico.campoValor}>
                  {servicoData.descricao_servico}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={stylesServico.botaoVoltar}>
          <Button
            onClick={() => {
              setTimeout(() => {
                window.history.back();
              }, 2500);
            }}>
            Voltar
          </Button>
        </Box>
      </Box>
    </HelmetProvider>
  );
};

export default DetalhesServico;