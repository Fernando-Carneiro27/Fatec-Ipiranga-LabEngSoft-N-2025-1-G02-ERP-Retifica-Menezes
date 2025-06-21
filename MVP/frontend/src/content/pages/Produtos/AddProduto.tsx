import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Typography,
  IconButton
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRequests } from 'src/utils/requests';
import Navbar from 'src/components/Navbar/SideMenu';
import { useNavigate } from 'react-router';
import stylesAdd from 'src/content/pages/Produtos/stylesAddProduto';
import { Produto } from 'src/models/Produto';

const AdicionarProduto = () => {
  const { addProduto, criarEstoque } = useRequests();
  const navigate = useNavigate();

  const [produtoData, setProdutoData] = useState<Produto>({
    nome: '',
    descricao: '',
    valor_compra: 0,
    data_modificacao_compra: ''
  });

  const [estoqueData, setEstoqueData] = useState({
    produto_id: 0,
    quantidade_min: 0,
    quantidade_max: 0,
    quantidade_atual: 0,
    valor_produto_venda: 0
  });

  const [valorCompra, setValorCompra] = useState('');
  const [dadosCalculados, setDadosCalculados] = useState({
    lucro_desejado: '',
    valor_venda: 0
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState('');
  const [abrirAviso, setAbrirAviso] = useState(false);

  useEffect(() => {
    const valorStr = valorCompra.trim();
    const lucroStr = dadosCalculados.lucro_desejado.trim();
    const valor = parseFloat(valorStr.replace(',', '.'));
    const lucro = parseFloat(lucroStr.replace(',', '.'));

    if (!valorStr || !lucroStr || isNaN(valor) || isNaN(lucro)) {
      setDadosCalculados((prev) => ({
        ...prev,
        valor_venda: 0
      }));
      return;
    }

    const calculado = valor * (1 + lucro / 100);
    const valorVendaCalculado = parseFloat(calculado.toFixed(2));

    setDadosCalculados((prev) => ({
      ...prev,
      valor_venda: valorVendaCalculado
    }));

    setEstoqueData((prevState) => ({
      ...prevState,
      valor_produto_venda: valorVendaCalculado
    }));
  }, [valorCompra, dadosCalculados.lucro_desejado]);
  const handleMudanca = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProdutoData((dados) => ({ ...dados, [name]: value }));
  };

  const handleEnviar = async () => {
    const dataHoje = new Date().toISOString().split('T')[0];
    const produtoComData = {
      ...produtoData,
      data_modificacao_compra:
        dataHoje || new Date().toISOString().split('T')[0]
    };
    const camposObrigatorios = [
      'nome',
      'valor_compra',
      'data_modificacao_compra'
    ];
    const novosErros: Record<string, string> = {};
    camposObrigatorios.forEach((campo) => {
      if (!produtoComData[campo]) {
        novosErros[campo] = `O campo ${campo.replace('_', ' ')} é obrigatório.`;
      }
    });

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      setInfoMessage('Por favor, preencha todos os campos obrigatórios.');
      setAbrirAviso(true);
      return;
    }
    try {
      const produtoResponse = await addProduto(produtoComData);

      if (produtoResponse?.errors) {
        const apiErrors = produtoResponse.errors;
        const formattedErrors: Record<string, string> = {};
        Object.keys(apiErrors).forEach((campo) => {
          formattedErrors[campo] = apiErrors[campo].join(', ');
        });
        setErros(formattedErrors);
        setInfoMessage(
          'Erro ao adicionar produto. Verifique os campos destacados.'
        );
        setAbrirAviso(true);
        return;
      }
      const produtoId = (produtoResponse.data as any)?.id;
      if (produtoId) {
        localStorage.setItem(
          `lucro_produto_${produtoId}`,
          dadosCalculados.lucro_desejado
        );
        if (
          !estoqueData.quantidade_min ||
          !estoqueData.quantidade_max ||
          !estoqueData.quantidade_atual
        ) {
          setInfoMessage('Por favor, preencha todos os campos de estoque.');
          setAbrirAviso(true);
          return;
        }
        const estoqueResponse = await criarEstoque({
          ...estoqueData,
          produto_id: produtoId
        });

        if (estoqueResponse?.errors) {
          const apiErrors = estoqueResponse.errors;
          const formattedErrors: Record<string, string> = {};
          Object.keys(apiErrors).forEach((campo) => {
            formattedErrors[campo] = apiErrors[campo].join(', ');
          });
          setErros(formattedErrors);
          setInfoMessage(
            'Erro ao adicionar estoque. Verifique todos os campos.'
          );
          setAbrirAviso(true);
          return;
        }

        setInfoMessage('Produto cadastrado e estoque criado com sucesso!');
        setAbrirAviso(true);
        handleCancelar();
        setErros({});
      } else {
        throw new Error('Erro ao obter ID do produto');
      }
    } catch (error) {
      console.error(error);
      setInfoMessage('Erro inesperado. Tente novamente.');
      setAbrirAviso(true);
    }
  };
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };
  const handleCancelar = () => {
    setProdutoData({
      nome: '',
      descricao: '',
      valor_compra: 0,
      data_modificacao_compra: ''
    });
    setEstoqueData({
      produto_id: 0,
      quantidade_min: 0,
      quantidade_max: 0,
      quantidade_atual: 0,
      valor_produto_venda: 0
    });
    setValorCompra('');
    setDadosCalculados({ lucro_desejado: '', valor_venda: 0 });
    setErros({});
    setTimeout(() => {
      navigate('/produtos');
    }, 2500);
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Adicionar Produto</title>
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
        <Box sx={stylesAdd.headerProduto}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/126/126089.png"
            alt="Ícone Cliente"
            sx={stylesAdd.headerProdutoImg}
          />
          <Typography sx={stylesAdd.headerProdutoSpan}>
            Produto - Adicionar
          </Typography>
        </Box>

        <Box sx={stylesAdd.dadosProduto}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="Editar"
            sx={stylesAdd.dadosProdutoImg}
          />
          Dados Produto
        </Box>

        <Box sx={stylesAdd.contPrincipal}>
          <Box sx={stylesAdd.grayContainer}>
            <Box sx={stylesAdd.formContainer}>
              <Box>
                <TextField
                  label="Nome *"
                  variant="outlined"
                  fullWidth
                  name="nome"
                  value={produtoData.nome}
                  onChange={handleMudanca}
                  sx={stylesAdd.formGroup}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '15px',
                  justifyContent: 'space-between'
                }}
              >
                <TextField
                  label="Valor de compra *"
                  variant="outlined"
                  fullWidth
                  name="valor"
                  value={valorCompra}
                  inputProps={{ inputMode: 'decimal', step: '0.01' }}
                  onChange={(e) => {
                    const valorStr = e.target.value;
                    if (
                      /^[0-9]*[.,]?[0-9]*$/.test(valorStr) ||
                      valorStr === ''
                    ) {
                      setValorCompra(valorStr);
                      const valorNum = parseFloat(valorStr.replace(',', '.'));
                      if (!isNaN(valorNum)) {
                        setProdutoData({
                          ...produtoData,
                          valor_compra: valorNum
                        });
                      } else {
                        setProdutoData({ ...produtoData, valor_compra: 0 });
                      }
                    }
                  }}
                  sx={stylesAdd.formGroup}
                />

                <TextField
                  label="% Lucro desejado *"
                  variant="outlined"
                  fullWidth
                  name="lucro_desejado"
                  value={dadosCalculados.lucro_desejado}
                  onChange={(e) => {
                    setDadosCalculados((prev) => ({
                      ...prev,
                      lucro_desejado: e.target.value
                    }));
                  }}
                  sx={stylesAdd.formGroup}
                />
                <TextField
                  label="Valor de Venda"
                  variant="outlined"
                  inputProps={{ readOnly: true }}
                  fullWidth
                  name="valor_venda"
                  value={`R$ ${dadosCalculados.valor_venda.toFixed(2)}`}
                  onChange={(e) => {
                    setEstoqueData((prevState) => ({
                      ...prevState,
                      valor_produto_venda: parseFloat(
                        e.target.value.replace('R$', '').replace(',', '.')
                      )
                    }));
                  }}
                  sx={stylesAdd.formGroup}
                />
              </Box>
            </Box>
          </Box>

          {/* Estoque */}
          <Box sx={stylesAdd.boxEstoque}>
            <Typography sx={stylesAdd.estoqueLabel}>Estoque</Typography>
            <Box sx={stylesAdd.grayContEstoque}>
              <Box sx={stylesAdd.inGrayCont}>
                <TextField
                  label="Quantidade mínima"
                  variant="outlined"
                  fullWidth
                  name="quantidade_min"
                  value={estoqueData.quantidade_min}
                  onChange={(e) =>
                    setEstoqueData({
                      ...estoqueData,
                      quantidade_min: parseFloat(e.target.value) || 0
                    })
                  }
                  sx={stylesAdd.formEstoque}
                />
                <TextField
                  label="Quantidade máxima"
                  variant="outlined"
                  fullWidth
                  name="quantidade_max"
                  value={estoqueData.quantidade_max}
                  onChange={(e) =>
                    setEstoqueData({
                      ...estoqueData,
                      quantidade_max: parseFloat(e.target.value) || 0
                    })
                  }
                  sx={stylesAdd.formEstoque}
                />
                <TextField
                  label="Quantidade atual"
                  variant="outlined"
                  fullWidth
                  name="quantidade_atual"
                  value={estoqueData.quantidade_atual}
                  onChange={(e) =>
                    setEstoqueData({
                      ...estoqueData,
                      quantidade_atual: parseFloat(e.target.value) || 0
                    })
                  }
                  sx={stylesAdd.formEstoque}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={stylesAdd.obsButtons}>
            <Box sx={stylesAdd.boxObs}>
              <Typography sx={stylesAdd.observacoesLabel}>
                Observações
              </Typography>
              <TextField
                multiline
                rows={4}
                name="descricao"
                placeholder="Digite aqui..."
                value={produtoData.descricao}
                onChange={handleMudanca}
                sx={stylesAdd.observacoesInput}
              />
            </Box>
            <Box sx={stylesAdd.buttons}>
              <Button
                variant="contained"
                color="success"
                onClick={handleEnviar}
              >
                Adicionar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
            </Box>
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
                infoMessage ===
                'Produto cadastrado e estoque criado com sucesso!'
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

export default AdicionarProduto;
