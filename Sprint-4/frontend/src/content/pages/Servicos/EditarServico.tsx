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
import { useNavigate, useParams } from 'react-router';
import stylesEditar from 'src/content/pages/Servicos/stylesEditarServico';
import { Servico, ServicoDetail } from 'src/models/Servico';
import { Produto } from 'src/models/Produto';

const EditarServico = () => {
  const { id } = useParams();
  const { editarServico, getUmServico, getProdutos } = useRequests();
  const navigate = useNavigate();

  const [servicoData, setServicoData] = useState<Servico>({
    nome: '',
    valor_servico: 0,
    status_servico: '',
    descricao_servico: '',
    data_modificacao_servico: '',
    produtos: [],
    produtos_ids: []
  });
  const [servicoOriginal, setServicoOriginal] = useState<Servico | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState('');
  const [abrirAviso, setAbrirAviso] = useState(false);
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
        setServicoOriginal(servicoComProdutos);
      } catch (error) {
        console.error('Erro ao carregar dados do serviço e produtos:', error);
      }
    };

    carregarDados();
  }, [id]);

  const handleMudanca = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServicoData((dados) => ({ ...dados, [name]: value }));
  };

  const handleEnviar = async () => {
  const dataHoje = new Date().toISOString().split('T')[0];
    
  const dadosParaEnviar = {
    ...servicoData,
    valor_servico: Number(servicoData.valor_servico),
    status_servico: servicoData.status_servico.toLowerCase(),
    produtos:
      servicoData.produtos_ids && servicoData.produtos_ids.length > 0
        ? servicoData.produtos_ids
        : servicoData.produtos?.map((p: any) => p.id) || [],
  };

  const camposObrigatorios = [
    'nome', 'valor_servico', 'status_servico', 'descricao_servico', 
  ];
  console.log('Dados antes de enviar para o backend:', dadosParaEnviar);
  const novosErros: Record<string, string> = {};
  camposObrigatorios.forEach((campo) => {
    if (dadosParaEnviar[campo] === '' || dadosParaEnviar[campo] === undefined || dadosParaEnviar[campo] === null) {
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
    const response = await editarServico(servicoData.id, dadosParaEnviar);
    console.log('Resposta da API ao editar serviço:', response);
    if (response?.errors) {
      const apiErrors = response.errors;
      const formattedErrors: Record<string, string> = {};
      Object.keys(apiErrors).forEach((campo) => {
        formattedErrors[campo] = apiErrors[campo].join(', ');
      });
      setErros(formattedErrors);
      setInfoMessage('Erro ao atualizar serviço. Verifique os campos destacados.');
      setAbrirAviso(true);
      return;
    }

    setInfoMessage('Serviço atualizado com sucesso!');
    setAbrirAviso(true);
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
    setServicoData(servicoOriginal);
    setTimeout(() => {
      navigate('/servicos');
    }, 2000);
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Editar Serviço</title>
      </Helmet>
      <Box sx={{ maxWidth: '100%', overflow: 'hidden', fontFamily: 'arial', paddingTop: '103px' }}>
        <Navbar />
        <Box sx={stylesEditar.headerServico}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/0/109.png"
            alt="Ícone Cliente"
            sx={stylesEditar.headerServicoImg}
          />
          <Typography sx={stylesEditar.headerServicoSpan}> Serviço - Editar </Typography>
        </Box>

        <Box sx={stylesEditar.dadosServico}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="Editar"
            sx={stylesEditar.dadosServicoImg}
          />
          Dados serviço
        </Box>

        <Box sx={stylesEditar.contPrincipal}>
          <Box sx={stylesEditar.grayContainer}>
            <TextField
              label="Nome *"
              variant="outlined"
              fullWidth
              name="nome"
              value={servicoData.nome}
              onChange={handleMudanca}
              sx={stylesEditar.formGroup}
            />
            <Autocomplete
              multiple
              options={listaProdutos}
              getOptionLabel={(option: Produto) => option.nome}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={servicoData.produtos}
              onChange={(event, newValue) => {
                const prodSelecionados = newValue as Produto[];
                setServicoData((dados) => ({
                  ...dados,
                  produtos: prodSelecionados,
                  produtos_ids: prodSelecionados.map((produto) => produto.id)
                }));
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produto(s)" variant="outlined" 
                  fullWidth
                  sx={{
                    ...stylesEditar.formGroup,
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
              value={servicoData.valor_servico}
              onChange={handleMudanca}
              sx={stylesEditar.formGroup}
            />
            <TextField
              label="Status *"
              variant="outlined"
              fullWidth
              name="status_servico"
              onChange={handleMudanca}
              value={servicoData.status_servico}
              sx={stylesEditar.formGroup}
            />
          </Box>

          <Box sx={stylesEditar.obsButtons}>
            <Box sx={stylesEditar.boxObs}>
              <Typography sx={stylesEditar.observacoesLabel}>Observações</Typography>
              <TextField
                multiline
                rows={7}
                name="descricao_servico"
                placeholder="Digite aqui..."
                value={servicoData.descricao_servico}
                onChange={handleMudanca}
                sx={stylesEditar.observacoesInput}
              />
            </Box>
            <Box sx={stylesEditar.buttons}>
              <Button variant="contained" color="success" onClick={handleEnviar}> Salvar  </Button>
              <Button variant="contained" color="error" onClick={handleCancelar}> Cancelar </Button>
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
                infoMessage === 'Serviço atualizado com sucesso!'
                  ? 'green'
                  : 'red',
              color: 'white', textAlign: 'center', width: '100%',
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

export default EditarServico;
