import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
  Typography,
  TableHead
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/NavBar';
import { useRequests } from 'src/utils/requests';
import stylesVenda from './stylesDetalhesVenda';
import { VendaProduto, VendaProdutoDetail } from 'src/models/VendaProduto';
import { VendaServico, VendaServicoDetail } from 'src/models/VendaServico';

const DetalhesVenda = () => {
  type LocationState = {
    tipo: 'produto' | 'servico';
  };
  const { id } = useParams();
  const location = useLocation();
  const tipoVenda = location.state as LocationState;
  const [abaSelecionada, setAbaSelecionada] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getUmaVendaProduto, getUmaVendaServico } = useRequests();
  type VendaUnificada = VendaProduto | VendaServico;
  const [venda, setVenda] = useState<VendaUnificada | null>(null);
  useEffect(() => {
    const buscarVenda = async () => {
      try {
        if (!id || !tipoVenda?.tipo) {
          throw new Error('ID ou tipo da venda não fornecido.');
        }

        const dados =
          tipoVenda.tipo === 'produto'
            ? await getUmaVendaProduto(+id)
            : await getUmaVendaServico(+id);

        if (!dados || !dados.data) {
          throw new Error(dados?.detail || 'Venda não encontrada.');
        }

        if (tipoVenda.tipo === 'produto' && 'venda_produto' in dados.data) {
          setVenda(dados.data.venda_produto);
        } else if (
          tipoVenda.tipo === 'servico' &&
          'venda_servico' in dados.data
        ) {
          setVenda(dados.data.venda_servico);
        } else {
          throw new Error('Dados de venda inválidos');
        }
      } catch (error) {
        console.error('Erro ao buscar venda:', error);
        setVenda(null);
      } finally {
        setLoading(false);
      }
    };

    buscarVenda();
  }, [id, tipoVenda]);

  const formatarData = (dataString: string | null | undefined) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleAbas = (event: React.SyntheticEvent, newValue: number) => {
    setAbaSelecionada(newValue);
  };

  if (loading || !venda)
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
        <title>Detalhes da Venda</title>
      </Helmet>
      <Navbar />
      <Box sx={{ height: '70vh' }}>
        <Box sx={stylesVenda.headerVenda}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/31/31684.png"
            alt="Ícone Visualizar"
            sx={stylesVenda.headerVendaImg}
          />
          <Typography sx={stylesVenda.headerVendaSpan}>
            Venda - Visualizar
          </Typography>
        </Box>
        <Box sx={stylesVenda.vendasDetalhes}>
          <Tabs
            value={abaSelecionada}
            onChange={handleAbas}
            indicatorColor="primary"
            textColor="inherit"
            sx={stylesVenda.abas}
          >
            <Tab label="DADOS GERAIS" sx={stylesVenda.aba} />
            <Tab label="SERVIÇO OU PRODUTO" sx={stylesVenda.aba} />
            <Tab label="PAGAMENTO" sx={stylesVenda.aba} />
          </Tabs>

          {abaSelecionada === 0 && (
            <TableContainer>
              <Table size="small" aria-label="detalhes do cliente">
                <TableBody>
                  <TableRow>
                    <TableCell sx={stylesVenda.campoVenda}>
                      Código da Venda
                    </TableCell>
                    <TableCell sx={stylesVenda.campoValor}>
                      {venda.id}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesVenda.campoVenda}>
                      Nome do Cliente
                    </TableCell>
                    <TableCell sx={stylesVenda.campoValor}>
                      {venda.cliente?.nome}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesVenda.campoVenda}>
                      Data da Venda
                    </TableCell>
                    <TableCell sx={stylesVenda.campoValor}>
                      {formatarData(venda.data_venda)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesVenda.campoVenda}>
                      Data da Entrega
                    </TableCell>
                    <TableCell sx={stylesVenda.campoValor}>
                      {formatarData(venda.data_entrega)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesVenda.campoVenda}>Situação</TableCell>
                    <TableCell sx={stylesVenda.campoValor}>
                      {venda.situacao_venda}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {abaSelecionada === 1 &&
            Array.isArray(venda?.itens) &&
            venda.itens.length > 0 && (
              <TableContainer>
                <Table size="small" aria-label="itens da venda">
                  <TableBody>
                    {venda.itens.map((item, index) => {
                      const nome =
                        item.nome ??
                        item.servico?.nome ??
                        item.produto?.nome ??
                        '-';
                      const quantidade = item.quantidade ?? 1;
                      const valorUnitario = parseFloat(
                        String(
                          item.valor_unitario ??
                            item.servico?.valor_servico ??
                            item.produto?.preco_venda ??
                            '0'
                        )
                      );
                      const valorFinal = parseFloat(
                        String(
                          item.valor_total ??
                            item.valor_servico ??
                            valorUnitario * quantidade
                        )
                      );
                      const totalBruto = valorUnitario * quantidade;
                      const desconto = totalBruto - valorFinal;
                      const descontoPorcentagem =
                        totalBruto > 0
                          ? ((desconto / totalBruto) * 100).toFixed(2)
                          : '0.00';
                      const observacao = item.observacao ?? '-';

                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell sx={stylesVenda.campoVenda}>
                              {item.produto ? 'Produto' : 'Serviço'}
                            </TableCell>
                            <TableCell sx={stylesVenda.campoValor}>
                              {nome}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={stylesVenda.campoVenda}>
                              Observação
                            </TableCell>
                            <TableCell sx={stylesVenda.campoValor}>
                              {observacao}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={stylesVenda.campoVenda}>
                              Quantidade
                            </TableCell>
                            <TableCell sx={stylesVenda.campoValor}>
                              {quantidade}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={stylesVenda.campoVenda}>
                              Valor Unitário
                            </TableCell>
                            <TableCell sx={stylesVenda.campoValor}>
                              R$ {valorUnitario.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={stylesVenda.campoVenda}>
                              Desconto (%)
                            </TableCell>
                            <TableCell sx={stylesVenda.campoValor}>
                              {descontoPorcentagem}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={stylesVenda.campoVenda}>
                              Valor Total
                            </TableCell>
                            <TableCell sx={stylesVenda.campoValor}>
                              R$ {valorFinal.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          {abaSelecionada === 2 &&
            Array.isArray(venda?.itens) &&
            venda.itens.length > 0 && (
              <TableContainer>
                <Table size="small" aria-label="detalhes do pagamento">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={stylesVenda.campoVenda}>
                        Forma pagamento
                      </TableCell>
                      <TableCell sx={stylesVenda.campoValor}>
                        {venda.forma_pagamento}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={stylesVenda.campoVenda}>
                        Observações
                      </TableCell>
                      <TableCell sx={stylesVenda.campoValor}>
                        {venda.detalhes_pagamento ?? '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={stylesVenda.campoVenda}>
                        Status pagamento
                      </TableCell>
                      <TableCell sx={stylesVenda.campoValor}>
                        {venda.status_pagamento}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={stylesVenda.campoVenda}>
                        Data pagamento
                      </TableCell>
                      <TableCell sx={stylesVenda.campoValor}>
                        {formatarData(venda.data_pagamento)}
                      </TableCell>
                    </TableRow>

                    {(() => {
                      const itens = Array.isArray(venda.itens)
                        ? venda.itens
                        : [];

                      let valorBruto = 0;

                      itens.forEach((item) => {
                        const valorUnitario = parseFloat(
                          String(
                            item.valor_unitario ??
                              item.servico?.valor_servico ??
                              item.produto?.preco_venda ??
                              '0'
                          )
                        );
                        const quantidade = item.quantidade ?? 1;
                        valorBruto += valorUnitario * quantidade;
                      });

                      const valorTotal = parseFloat(
                        String(venda.valor_total ?? '0')
                      );
                      const descontoValor = valorBruto - valorTotal;
                      const descontoPorcentagem =
                        valorBruto > 0
                          ? ((descontoValor / valorBruto) * 100).toFixed(2)
                          : '0.00';

                      return (
                        <>
                          <TableRow>
                            <TableCell sx={stylesVenda.campoVenda}>
                              Desconto
                            </TableCell>
                            <TableCell sx={stylesVenda.campoValor}>
                              {descontoPorcentagem}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={stylesVenda.campoVenda}>
                              Total
                            </TableCell>
                            <TableCell sx={stylesVenda.campoValor}>
                              R$ {valorTotal.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          <Box sx={stylesVenda.botaoVoltar}>
            <Button onClick={() => window.history.back()}>Voltar</Button>
          </Box>
        </Box>
      </Box>
    </HelmetProvider>
  );
};

export default DetalhesVenda;
