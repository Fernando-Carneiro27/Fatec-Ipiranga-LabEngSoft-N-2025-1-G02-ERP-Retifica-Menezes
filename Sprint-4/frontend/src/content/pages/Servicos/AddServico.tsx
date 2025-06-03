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
import Navbar from 'src/components/Navbar/NavBar';
import { useNavigate } from 'react-router';
import stylesAdd from 'src/content/pages/Servicos/stylesAddServico';
import { Servico } from 'src/models/Servico';
import { Produto } from 'src/models/Produto';

const AdicionarServico = () => {
  const { addServico, getProdutos } = useRequests();
  const navigate = useNavigate();
  const [valorStr, setValorStr] = useState('');
  const [servicoData, setServicoData] = useState<Servico>({
    nome: '', valor_servico: 0, status_servico: '', descricao_servico: '', data_modificacao_servico: '', produtos: [], produtos_ids: []
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState('');
  const [abrirAviso, setAbrirAviso] = useState(false);
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);

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

  const handleEscolheProduto = (produtosSelecionados: Produto[]) => {
    setServicoData((dados): Servico => {
      return {
        ...dados,
        produtos_ids: produtosSelecionados.map((produto) => produto.id!),
        produtos: produtosSelecionados
      };
    });
  };

  const handleEnviar = async () => {
    const dataHoje = new Date().toISOString().split('T')[0];
    const servicoComData = {
      ...servicoData,
      data_modificacao_servico: dataHoje,
      produtos_ids: servicoData.produtos_ids || []
    };

    const camposObrigatorios = [
      'nome', 'valor_servico', 'status_servico', 'data_modificacao_servico',
    ];

    const novosErros: Record<string, string> = {};
    camposObrigatorios.forEach((campo) => {
      if (
        !servicoComData[campo] ||
        (Array.isArray(servicoComData[campo]) &&
          servicoComData[campo].length === 0)
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
      const response = await addServico(servicoComData);

      if (response?.errors) {
        const apiErrors = response.errors;
        const formattedErrors: Record<string, string> = {};
        Object.keys(apiErrors).forEach((campo) => {
          formattedErrors[campo] = apiErrors[campo].join(', ');
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
      setTimeout(() => {
        navigate('/servicos');
      }, 2000);
      setErros({});
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
      produtos: [],
      produtos_ids: []
    });
    setErros({});
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Adicionar Serviço</title>
      </Helmet>
      <Box sx={{ maxWidth: '100%', overflow: 'hidden', fontFamily: 'arial', paddingTop: '103px' }}>
        <Navbar />
        <Box sx={stylesAdd.headerServico}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/0/109.png"
            alt="Ícone Cliente"
            sx={stylesAdd.headerServicoImg}
          />
          <Typography sx={stylesAdd.headerServicoSpan}>Serviço - Adicionar</Typography>
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
              fullWidth
              name="nome"
              value={servicoData.nome}
              onChange={handleMudanca}
              sx={stylesAdd.formGroup}
            />
            <Autocomplete
              multiple
              options={listaProdutos}
              getOptionLabel={(option: Produto) => option.nome}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={servicoData.produtos || []}
              onChange={(event, newValue) => {
                const prodSelecionados = newValue as Produto[];
                setServicoData((dados) => ({
                  ...dados,
                  produtos_ids: prodSelecionados.map((produto) => produto.id!),
                  produtos: prodSelecionados
                }));
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produto(s)" variant="outlined" 
                  fullWidth
                  sx={{
                    ...stylesAdd.formGroup,
                    width: '100%',
                    '@media (max-width: 800px)': { gap: '15px', width: '380px' },
                    '& .MuiInputBase-root': {
                      display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'thin',
                      '&::-webkit-scrollbar': { height: '6px', width: '6px' },
                      '&::-webkit-scrollbar-thumb': { backgroundColor: 'gainsboro', borderRadius: '4px' }
                    },
                    '& .MuiChip-root': { margin: '2px' },
                    '& .MuiOutlinedInput-root': { overflow: 'visible' }
                  }}
                />
              )}
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
              sx={stylesAdd.formGroup}
            />
            <TextField
              label="Status *"
              variant="outlined"
              fullWidth
              name="status_servico"
              onChange={handleMudanca}
              value={servicoData.status_servico}
              sx={stylesAdd.formGroup}
            />
          </Box>

          <Box sx={stylesAdd.obsButtons}>
            <Box sx={stylesAdd.boxObs}>
              <Typography sx={stylesAdd.observacoesLabel}>Observações</Typography>
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
              <Button variant="contained" color="success" onClick={handleEnviar}> Adicionar </Button>
              <Button  variant="contained" color="error" onClick={handleCancelar}> Cancelar </Button>
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
            sx: { alignItems: 'center', justifyContent: 'center', marginTop: '50px',
              bgcolor:
                infoMessage === 'Serviço cadastrado com sucesso!'
                  ? 'green'
                  : 'red',
              color: 'white',
              textAlign: 'center',
              width: '100%',
              '& .MuiSnackbarContent-message': {
                width: 'inherit', textAlign: 'center'
              }
            }
          }}
        />
      </Box>
    </HelmetProvider>
  );
};

export default AdicionarServico;