import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Snackbar,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRequests } from 'src/utils/requests';
import Navbar from 'src/components/Navbar/NavBar';
import { useNavigate } from 'react-router';
import stylesAdd from 'src/content/pages/Estoque/stylesGerenciarEstoque';
import { EstoqueUpdate, Produto } from 'src/models/Produto';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const GerenciarEstoque = () => {
  interface EstoqueAlteracao {
    produto_id: number;
    quantidade_atual: number;
    valor_produto_venda: number;
    quantidade_min: number;
    quantidade_max: number;
    novaEntrada: number;
  }
  const { getProdutos, editarEstoque, editarProduto } = useRequests();
  const navigate = useNavigate();
  const [estoqueItens, setEstoqueItens] = useState<EstoqueAlteracao[]>([]);
  const [estoqueAlterado, setEstoqueAlterado] = useState<{
    [produtoId: number]: number;
  }>({});
  const [valorCompraAlterado, setValorCompraAlterado] = useState<{
    [produtoId: number]: number;
  }>({});
  const [valorCompraTexto, setValorCompraTexto] = useState<{
    [produtoId: number]: string;
  }>({});
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [abrirAviso, setAbrirAviso] = useState(false);
  useEffect(() => {
    const obterProdutos = async () => {
      try {
        const response = await getProdutos();
        const produtos = response.data?.produto ?? [];
        setListaProdutos(produtos);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
    obterProdutos();
  }, []);
  const handleNovaEntrada = (produtoId: number, valor: number) => {
    setEstoqueAlterado((prev) => ({
      ...prev,
      [produtoId]: valor
    }));

    setEstoqueItens((prev) =>
      prev.map((item) =>
        item.produto_id === produtoId ? { ...item, novaEntrada: valor } : item
      )
    );
  };

  const handleAdicionarItem = () => {
    setEstoqueItens((prev) => [
      ...prev,
      {
        produto_id: null,
        quantidade_atual: 0,
        valor_produto_venda: 0,
        quantidade_min: 0,
        quantidade_max: 0,
        novaEntrada: 0
      }
    ]);
  };
  const handleRemoverItem = (index: number) => {
    setEstoqueItens((prev) => prev.filter((_, i) => i !== index));
  };
  const handleValorCompraChange = (produtoId: number, valor: number) => {
    setValorCompraAlterado((prev) => ({
      ...prev,
      [produtoId]: valor
    }));

    const lucroStr = localStorage.getItem(`lucro_produto_${produtoId}`);
    const lucro = lucroStr ? parseFloat(lucroStr.replace(',', '.')) : 0;

    if (!isNaN(lucro)) {
      const valorVenda = valor * (1 + lucro / 100);

      setEstoqueItens((prev) =>
        prev.map((item) =>
          item.produto_id === produtoId
            ? {
                ...item,
                valor_produto_venda: parseFloat(valorVenda.toFixed(2))
              }
            : item
        )
      );
    }
  };
  const handleSalvarAlteracoes = async () => {
    const atualizacoes: EstoqueUpdate[] = Object.entries(estoqueAlterado).map(
      ([produtoIdStr, novaEntrada]) => {
        const produtoId = Number(produtoIdStr);
        const entrada = Number(novaEntrada);
        const itemOriginal = estoqueItens.find(
          (item) => item.produto_id === produtoId
        );

        return {
          produto_id: produtoId,
          quantidade_entrada: entrada,
          valor_produto_venda: itemOriginal?.valor_produto_venda || 0
        };
      }
    );

    if (
      atualizacoes.length === 0 &&
      Object.keys(valorCompraAlterado).length === 0
    ) {
      setInfoMessage('Nenhuma alteração feita.');
      setAbrirAviso(true);
      return;
    }

    try {
      for (const atualizacao of atualizacoes) {
        const produtoId = atualizacao.produto_id;

        await editarEstoque(produtoId, {
          quantidade_entrada: atualizacao.quantidade_entrada,
          valor_produto_venda: atualizacao.valor_produto_venda
        });

        const novoValorCompra = valorCompraAlterado[produtoId];
        if (novoValorCompra !== undefined) {
          await editarProduto(produtoId, {
            valor_compra: novoValorCompra
          });
        }
      }
      setInfoMessage('Estoque atualizado com sucesso!');
      setAbrirAviso(true);
      handleCancelar();
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      setInfoMessage('Erro ao atualizar estoque ou produto. Tente novamente.');
      setAbrirAviso(true);
    }
  };
  
  const totalCompras = useMemo(() => {
    return estoqueItens.reduce((total, item) => {
      const produto = listaProdutos.find((p) => p.id === item.produto_id);
      const valorAtualizado = produto
        ? valorCompraAlterado[produto.id] ?? produto.valor_compra
        : 0;
      const novaEntrada = item.novaEntrada || 0;
      return total + novaEntrada * valorAtualizado;
    }, 0);
  }, [estoqueItens, listaProdutos, valorCompraAlterado]);
  const handleCancelar = () => {
    setListaProdutos([]);
    setEstoqueAlterado({});
    setValorCompraAlterado({});
    setEstoqueItens([]);
    setTimeout(() => {
      navigate('/estoque');
    }, 2500);
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Gerenciar Estoque</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: '100%',
          overflow: 'hidden',
          fontFamily: 'arial',
          paddingTop: '103px'
        }}
      >
        <Navbar />
        <Box sx={stylesAdd.headerVenda}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/68/68374.png"
            alt="Ícone Cliente"
            sx={stylesAdd.headerVendaImg}
          />
          <Typography sx={stylesAdd.headerVendaSpan}>
            Gerenciar Estoque
          </Typography>
        </Box>

        <Box sx={stylesAdd.contPrincipal}>
          <Box sx={stylesAdd.grayContProd}>
            {estoqueItens.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                  Nenhum produto adicionado. Clique no botão abaixo para
                  adicionar.
                </Typography>

                <Button
                  variant="contained"
                  sx={stylesAdd.button}
                  onClick={() => handleAdicionarItem()}
                >
                  Adicionar Produto
                </Button>
              </Box>
            ) : (
              <>
                {estoqueItens.map((item, index) => {
                  const produto = listaProdutos.find(
                    (p) => p.id === item.produto_id
                  );
                  const valorAtualizado = produto
                    ? valorCompraAlterado[produto.id] ?? produto.valor_compra
                    : 0;
                  const quantidadeAtual = produto
                    ? produto.estoque?.quantidade_atual || 0
                    : 0;
                  const novaEntrada = item.novaEntrada || 0;
                  const subtotal = novaEntrada * valorAtualizado;

                  return (
                    <Box
                      key={index}
                      sx={{ display: 'flex', ...stylesAdd.grayContOptRow }}
                    >
                      <TextField
                        label="Código do produto"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={produto ? produto.id : ''}
                        inputProps={{ readOnly: true }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '170px' }}
                      />
                      <Autocomplete<Produto>
                        options={listaProdutos}
                        getOptionLabel={(option: Produto) => option.nome}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        value={produto || null}
                        onChange={(event, newValue) => {
                          const atualiza = [...estoqueItens];
                          if (newValue && typeof newValue !== 'string') {
                            atualiza[index].produto_id = newValue.id;
                          } else {
                            atualiza[index].produto_id = undefined;
                          }
                          setEstoqueItens(atualiza);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Produto"
                            variant="outlined"
                            fullWidth
                            sx={{ ...stylesAdd.formGroup, width: '370px' }}
                          />
                        )}
                      />

                      <TextField
                        label="Quantidade atual"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={quantidadeAtual}
                        inputProps={{ readOnly: true }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '130px' }}
                      />
                      <TextField
                        label="Valor unitário"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={
                          produto
                            ? valorCompraTexto[produto.id] ??
                              valorCompraAlterado[produto.id]?.toString() ??
                              produto.valor_compra?.toString() ??
                              ''
                            : ''
                        }
                        onChange={(e) => {
                          if (produto) {
                            setValorCompraTexto((prev) => ({
                              ...prev,
                              [produto.id]: e.target.value
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          if (produto) {
                            const valorStr = e.target.value.replace(',', '.');
                            const valorNum = parseFloat(valorStr);
                            handleValorCompraChange(
                              produto.id,
                              isNaN(valorNum) ? 0 : valorNum
                            );
                          }
                        }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '150px' }}
                      />
                      <TextField
                        label="Quantidade a ser adicionada"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={estoqueAlterado[produto?.id] || ''}
                        onChange={(e) => {
                          const novaQtd = parseInt(e.target.value) || 0;
                          handleNovaEntrada(produto?.id, novaQtd);
                        }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '250px' }}
                      />

                      <TextField
                        label="Subtotal"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={formatarValor(subtotal)}
                        inputProps={{ readOnly: true }}
                        sx={{ ...stylesAdd.formGroup, maxWidth: '130px' }}
                      />

                      <Tooltip title="Excluir produto" arrow>
                        <IconButton
                          sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                          color="error"
                          onClick={() => handleRemoverItem(index)}
                          size="large"
                        >
                          <CancelRoundedIcon
                            sx={{
                              fontSize: '32px',
                              backgroundColor: 'white',
                              borderRadius: '50%'
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                })}

                <Button
                  variant="contained"
                  sx={stylesAdd.button}
                  onClick={() =>
                    setEstoqueItens((prev) => [
                      ...prev,
                      {
                        produto_id: undefined,
                        quantidade_atual: 0,
                        valor_produto_venda: 0,
                        quantidade_min: 0,
                        quantidade_max: 0,
                        novaEntrada: 0
                      }
                    ])
                  }
                >
                  Adicionar Produto
                </Button>
                <TextField
                  label="Valor total"
                  type="text"
                  variant="outlined"
                  value={formatarValor(totalCompras)}
                  inputProps={{ readOnly: true }}
                  sx={{
                    ...stylesAdd.formGroup,
                    maxWidth: '200px',
                    marginLeft: 'auto',
                    marginRight: '67px'
                  }}
                />
              </>
            )}
          </Box>

          <Box sx={stylesAdd.buttons}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleSalvarAlteracoes();
              }}
            >
              Registrar
            </Button>
            <Button variant="contained" color="error" onClick={handleCancelar}>
              Cancelar
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={abrirAviso}
          autoHideDuration={3000}
          onClose={handleFecharAviso}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message={infoMessage}
          ContentProps={{
            sx: {
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '50px',
              bgcolor:
                infoMessage === 'Estoque atualizado com sucesso!'
                  ? 'green'
                  : 'red',
              color: 'white',
              textAlign: 'center',
              width: '100%',
              '& .MuiSnackbarContent-message': {
                width: 'inherit',
                textAlign: 'center'
              }
            }
          }}
        />
      </Box>
    </HelmetProvider>
  );
};

export default GerenciarEstoque;
