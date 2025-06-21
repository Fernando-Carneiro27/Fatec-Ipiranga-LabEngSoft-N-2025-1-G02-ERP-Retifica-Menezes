import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
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
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';
import stylesAdd from 'src/content/pages/Servicos/stylesAddServico';
import { ProdutoServicoItem, ServicoCreate } from 'src/models/Servico';
import { Produto } from 'src/models/Produto';

const AdicionarServico = () => {
  const { addServico, getProdutos } = useRequests();
  const navigate = useNavigate();
  const [valorStr, setValorStr] = useState('');
  const [servicoData, setServicoData] = useState<ServicoCreate>({
    nome: '',
    valor_servico: 0,
    status_servico: '',
    descricao_servico: '',
    data_modificacao_servico: '',
    itens: []
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState('');
  const [abrirAviso, setAbrirAviso] = useState(false);
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    { produto: Produto; quantidade: number }[]
  >([]);

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

  const handleMudanca = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServicoData((dados) => ({ ...dados, [name]: value }));
  };

  const handleProdutos = (_: any, novosProdutos: Produto[]) => {
    setProdutosSelecionados((prevSelecionados) => {
      const novoEstado = novosProdutos.map((produto) => {
        const existente = prevSelecionados.find(
          (p) => p.produto.id === produto.id
        );
        return {
          produto,
          quantidade: existente?.quantidade ?? 0
        };
      });
      return novoEstado;
    });
  };
  const handleRemoverProduto = (produtoId: number) => {
    const atualizados = produtosSelecionados.filter(
      (p) => p.produto.id !== produtoId
    );
    setProdutosSelecionados(atualizados);
  };
  const handleQuantidade = (produtoId: number, valor: number) => {
    if (valor < 0) return;

    setProdutosSelecionados((produtos) =>
      produtos.map((p) =>
        p.produto.id === produtoId ? { ...p, quantidade: valor } : p
      )
    );
  };

  const handleEnviar = async () => {
    const itens: ProdutoServicoItem[] = produtosSelecionados.map((p) => ({
      produto_id: p.produto.id!,
      quantidade_utilizada: p.quantidade
    }));

    const servicoInfos: ServicoCreate = {
      ...servicoData,
      itens
    };

    const camposObrigatorios = [
      'nome',
      'valor_servico',
      'status_servico'
    ] as const;

    const novosErros: Record<string, string> = {};
    camposObrigatorios.forEach((campo) => {
      if (
        !servicoInfos[campo] ||
        servicoInfos[campo] === '' ||
        servicoInfos[campo] === 0
      ) {
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
      console.log(JSON.stringify(servicoInfos, null, 2));

      const response = await addServico(servicoInfos);
      if (response?.errors) {
        const formattedErrors: Record<string, string> = {};
        Object.keys(response.errors).forEach((campo) => {
          formattedErrors[campo] = response.errors[campo].join(', ');
        });
        setErros(formattedErrors);
        setInfoMessage(
          'Erro ao adicionar serviço. Verifique os campos destacados.'
        );
        setAbrirAviso(true);
        return;
      }

      setInfoMessage('Serviço cadastrado com sucesso!');
      setAbrirAviso(true);
      handleCancelar();
      setTimeout(() => navigate('/servicos'), 2000);
    } catch (error) {
      console.error(error);
      setInfoMessage('Erro inesperado. Tente novamente.');
      setAbrirAviso(true);
    }
  };

  const handleCancelar = () => {
    setServicoData({
      nome: '',
      valor_servico: 0,
      status_servico: '',
      descricao_servico: '',
      data_modificacao_servico: '',
      itens: []
    });
    setProdutosSelecionados([]);
    setListaProdutos([]);
    setErros({});
    setTimeout(() => {
      navigate('/servicos');
    }, 2500);
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Adicionar Serviço</title>
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
        <Box sx={stylesAdd.headerServico}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/0/109.png"
            alt="Ícone Cliente"
            sx={stylesAdd.headerServicoImg}
          />
          <Typography sx={stylesAdd.headerServicoSpan}>
            Serviço - Adicionar
          </Typography>
        </Box>

        <Box sx={stylesAdd.dadosServico}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="Editar"
            sx={stylesAdd.dadosServicoImg}
          />
          Dados serviço
        </Box>

        <Box sx={stylesAdd.contPrincipal}>
          <Box sx={stylesAdd.grayContainer}>
            <TextField
              label="Nome *"
              variant="outlined"
              name="nome"
              value={servicoData.nome}
              onChange={handleMudanca}
              sx={{ ...stylesAdd.formGroup, height: '55px' }}
            />
            <TextField
              label="Valor *"
              type="number"
              variant="outlined"
              fullWidth
              name="valor_servico"
              value={valorStr}
              onChange={(e) => {
                setValorStr(e.target.value);
                setServicoData((dados) => ({
                  ...dados,
                  valor_servico: parseFloat(e.target.value) || 0
                }));
              }}
              sx={{ ...stylesAdd.formGroup, height: '55px' }}
            />
            <TextField
              label="Status *"
              variant="outlined"
              fullWidth
              name="status_servico"
              onChange={handleMudanca}
              value={servicoData.status_servico}
              sx={{ ...stylesAdd.formGroup, height: '55px' }}
            />
            <Autocomplete
              multiple
              options={listaProdutos}
              getOptionLabel={(option: Produto) => option.nome}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={produtosSelecionados.map((p) => p.produto)}
              onChange={handleProdutos}
              filterSelectedOptions
              noOptionsText="Sem opções"
              clearText="Limpar"
              closeText="Fechar"
              openText="Abrir"
              loadingText="Carregando..."
              componentsProps={{
                clearIndicator: {
                  title: 'Limpar campo'
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produto(s)"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      display: 'flex',
                      flexWrap: 'nowrap',
                      alignItems: 'flex-start',
                      overflowY: 'auto',
                      paddingRight: '40px',
                      transition: 'all 0.2s ease-in-out'
                    },
                    '& .MuiChip-root': {
                      m: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                />
              )}
              sx={{ ...stylesAdd.formGroup, height: 'auto' }}
            />
            {produtosSelecionados.map(({ produto, quantidade }) => (
              <Box
                key={produto.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'white',
                  border: '3px solid gainsboro',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  width: 'auto'
                }}
              >
                <Typography sx={{ fontWeight: 500 }}>{produto.nome}</Typography>
                <TextField
                  label="Quantidade"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={quantidade}
                  onChange={(e) =>
                    handleQuantidade(produto.id!, Number(e.target.value))
                  }
                  error={!!erros[`quantidade_${produto.id}`]}
                  helperText={erros[`quantidade_${produto.id}`]}
                  size="small"
                  sx={{ width: 100 }}
                />
                <IconButton
                  aria-label="Remover produto"
                  onClick={() => handleRemoverProduto(produto.id!)}
                  size="small"
                >
                  <CloseIcon
                    fontSize="medium"
                    sx={{
                      backgroundColor: 'red',
                      color: 'white',
                      borderRadius: '50%'
                    }}
                  />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box sx={stylesAdd.obsButtons}>
            <Box sx={stylesAdd.boxObs}>
              <Typography sx={stylesAdd.observacoesLabel}>
                Observações
              </Typography>
              <TextField
                multiline
                rows={7}
                name="descricao_servico"
                placeholder="Digite aqui..."
                value={servicoData.descricao_servico}
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
                infoMessage === 'Serviço cadastrado com sucesso!'
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

export default AdicionarServico;
