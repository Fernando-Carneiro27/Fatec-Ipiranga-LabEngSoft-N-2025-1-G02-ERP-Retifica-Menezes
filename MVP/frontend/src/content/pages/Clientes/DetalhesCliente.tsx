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
  Tabs,
  Tab,
  CircularProgress,
  Typography
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from 'src/components/Navbar/SideMenu';
import { useRequests } from 'src/utils/requests';
import stylesCliente from './stylesDetalhesCliente';
import { Visibility } from '@mui/icons-material';

const DetalhesCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getUmCliente,
    getVendasProduto,
    getVendasServico,
    getUmaVendaProduto,
    getUmaVendaServico
  } = useRequests();
  const [cliente, setCliente] = useState(null);
  const [abaSelecionada, setAbaSelecionada] = useState(0);
  const [loading, setLoading] = useState(true);
  const [vendas, setVendas] = useState<any[]>([]);

  useEffect(() => {
    const buscarVendasPorCliente = async () => {
      try {
        if (!id) return;

        const [resProdutos, resServicos] = await Promise.all([
          getVendasProduto(),
          getVendasServico()
        ]);

        const vendasProdutos = resProdutos?.data?.vendas_produto || [];
        const vendasServicos = resServicos?.data?.vendas_servico || [];

        const vendasFiltradasProdutos = vendasProdutos.filter(
          (venda) => venda.cliente?.id === Number(id)
        );
        const vendasFiltradasServicos = vendasServicos.filter(
          (venda) => venda.cliente?.id === Number(id)
        );

        const vendasUnificadas = [
          ...vendasFiltradasProdutos.map((v) => ({
            id: v.id,
            tipo: 'produto',
            tipoDisplay: 'Produto',
            data_inicio: v.data_venda,
            data_entrega: v.data_entrega,
            status_pagamento: v.status_pagamento || 'Não informado',
            valor_total: v.valor_total ?? 0
          })),
          ...vendasFiltradasServicos.map((v) => ({
            id: v.id,
            tipo: 'servico',
            tipoDisplay: 'Serviço',
            data_inicio: v.data_venda,
            data_entrega: v.data_entrega,
            status_pagamento: v.status_pagamento || 'Não informado',
            valor_total: v.valor_total ?? 0
          }))
        ];

        const vendasOrdenadas = vendasUnificadas.sort((a, b) => {
          const dataA = new Date(a.data_inicio).getTime();
          const dataB = new Date(b.data_inicio).getTime();
          return dataB - dataA;
        });

        setVendas(vendasOrdenadas);
      } catch (error) {
        console.error('Erro ao buscar vendas do cliente:', error);
        setVendas([]);
      }
    };

    buscarVendasPorCliente();
  }, [id]);
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
  const handleVisualizar = async (id: number, tipo: 'produto' | 'servico') => {
    try {
      let detalhesVenda;

      if (tipo === 'produto') {
        detalhesVenda = await getUmaVendaProduto(id);
      } else {
        detalhesVenda = await getUmaVendaServico(id);
      }

      navigate(`/venda/${id}`, {
        state: { tipo, detalhes: detalhesVenda }
      });
    } catch (error: any) {
      console.error('Erro ao buscar detalhes da venda:', error);

      alert('Não foi possível abrir esta venda. Ela pode ter sido removida.');
    }
  };

  const formatarData = (dataString: string | null | undefined) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  if (loading || !cliente)
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
                    <TableCell sx={stylesCliente.campoCliente}>
                      CPF / CNPJ
                    </TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.cpf_cnpj}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>Email</TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.email}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>
                      Celular
                    </TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.telefone}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>CEP</TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.cep}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>
                      Endereço
                    </TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.endereco}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>
                      Bairro
                    </TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.bairro}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>
                      Tipo de Cliente
                    </TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.tipo}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={stylesCliente.campoCliente}>
                      Status Cliente
                    </TableCell>
                    <TableCell sx={stylesCliente.campoValor}>
                      {cliente.status_cliente}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {abaSelecionada === 1 && (
            <TableContainer>
              {vendas.length === 0 ? (
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography gutterBottom>
                          Este cliente não fez nenhuma compra.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={stylesCliente.campoCliente}>
                        Tipo de Venda
                      </TableCell>
                      <TableCell sx={stylesCliente.campoCliente}>
                        Data de Início
                      </TableCell>
                      <TableCell sx={stylesCliente.campoCliente}>
                        Data de Entrega
                      </TableCell>
                      <TableCell sx={stylesCliente.campoCliente}>
                        Status
                      </TableCell>
                      <TableCell sx={stylesCliente.campoCliente}>
                        Valor Total
                      </TableCell>
                      <TableCell sx={stylesCliente.campoCliente}>
                        Ação
                      </TableCell>
                    </TableRow>
                    {vendas.map((venda, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{ ...stylesCliente.campoValor, width: '150px' }}
                        >
                          {venda.tipoDisplay}
                        </TableCell>
                        <TableCell
                          sx={{ ...stylesCliente.campoValor, width: '130px' }}
                        >
                          {formatarData(venda.data_inicio)}
                        </TableCell>
                        <TableCell
                          sx={{ ...stylesCliente.campoValor, width: '140px' }}
                        >
                          {formatarData(venda.data_entrega)}
                        </TableCell>
                        <TableCell
                          sx={{ ...stylesCliente.campoValor, width: '100px' }}
                        >
                          {venda.status_pagamento}
                        </TableCell>
                        <TableCell
                          sx={{ ...stylesCliente.campoValor, width: '120px' }}
                        >
                          {formatarValor(venda.valor_total)}
                        </TableCell>
                        <TableCell
                          sx={{ ...stylesCliente.campoValor, width: '120px' }}
                        >
                          <Button
                            sx={stylesCliente.buttonVisualizar}
                            onClick={() =>
                              handleVisualizar(venda.id, venda.tipo)
                            }
                            endIcon={<Visibility />}
                          >
                            Visualizar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          )}
          <Box sx={stylesCliente.botaoVoltar}>
            <Button
              onClick={() =>
                setTimeout(() => {
                  window.history.back();
                }, 2500)
              }
            >
              Voltar
            </Button>
          </Box>
        </Box>
      </Box>
    </HelmetProvider>
  );
};

export default DetalhesCliente;
