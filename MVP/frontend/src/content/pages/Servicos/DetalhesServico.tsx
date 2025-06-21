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
  Typography
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/SideMenu';
import { useRequests } from 'src/utils/requests';
import stylesServico from 'src/content/pages/Servicos/stylesDetalhesServico';
import { Servico } from 'src/models/Servico';
import { Produto } from 'src/models/Produto';

const DetalhesServico = () => {
  const { id } = useParams();
  const [servicoData, setServicoData] = useState<Servico | null>(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    { produto: Produto; quantidade: number }[]
  >([]);
  const { getUmServico, getProdutos } = useRequests();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [respServico, respProdutos] = await Promise.all([
          getUmServico(Number(id)),
          getProdutos()
        ]);

        const servico: Servico = respServico?.data?.servico;
        const produtos: Produto[] = respProdutos?.data?.produto ?? [];

        const selecionados = (servico.itens_detalhados ?? [])
          .map((item) => {
            const produto = produtos.find((p) => p.id === item.produto_id);
            return produto
              ? { produto, quantidade: item.quantidade_utilizada }
              : null;
          })
          .filter(Boolean) as { produto: Produto; quantidade: number }[];

        setProdutosSelecionados(selecionados);
        setServicoData(servico);
      } catch (error) {
        console.error('Erro ao carregar dados do serviço e produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [id, getUmServico, getProdutos]);
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
        <Typography sx={stylesServico.headerServicoSpan}>
          Serviço - Visualizar dados
        </Typography>
      </Box>

      <Box sx={stylesServico.servicosDetalhes}>
        <Box sx={stylesServico.abas}>
          <Typography variant="h6" sx={stylesServico.aba}>
            DADOS
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small" aria-label="detalhes do serviço">
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
                  {produtosSelecionados.length > 0
                    ? produtosSelecionados
                        .map((p) => `${p.produto.nome} (x${p.quantidade})`)
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
                navigate('/servicos');
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

export default DetalhesServico;
