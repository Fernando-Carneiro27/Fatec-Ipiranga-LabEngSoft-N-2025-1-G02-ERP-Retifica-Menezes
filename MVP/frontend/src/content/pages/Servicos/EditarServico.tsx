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
import { useNavigate, useParams } from 'react-router';
import stylesEditar from 'src/content/pages/Servicos/stylesEditarServico';
import {
  Servico,
  ServicoUpdate,
  ProdutoServicoItem,
  ProdutoServicoDetalhado
} from 'src/models/Servico';
import { Produto } from 'src/models/Produto';
import CloseIcon from '@mui/icons-material/Close';

const EditarServico = () => {
  const { id } = useParams();
  const { editarServico, getUmServico, getProdutos } = useRequests();
  const navigate = useNavigate();

  const [servicoData, setServicoData] = useState<
    Omit<Servico, 'itens_detalhados'>
  >({
    id: Number(id),
    nome: '',
    valor_servico: 0,
    status_servico: '',
    descricao_servico: '',
    data_modificacao_servico: '',
    historico_valor_servico: [],
    historico_data_modificacao: [],
    produtos: []
  });
  const [servicoOriginal, setServicoOriginal] = useState<Servico | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState('');
  const [abrirAviso, setAbrirAviso] = useState(false);
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    { produto: Produto; quantidade: number }[]
  >([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [respServico, respProdutos] = await Promise.all([
          getUmServico(Number(id)),
          getProdutos()
        ]);
        const produtos: Produto[] = respProdutos?.data?.produto ?? [];
        setListaProdutos(produtos);
        const servico: Servico = respServico?.data?.servico;
        setServicoOriginal(servico);

        setServicoData({
          id: servico.id,
          nome: servico.nome,
          valor_servico: servico.valor_servico,
          status_servico: servico.status_servico,
          descricao_servico: servico.descricao_servico || '',
          data_modificacao_servico: servico.data_modificacao_servico,
          historico_valor_servico: servico.historico_valor_servico,
          historico_data_modificacao: servico.historico_data_modificacao,
          produtos: servico.produtos ?? []
        });

        const itensDet: ProdutoServicoDetalhado[] =
          servico.itens_detalhados ?? [];
        const selecionados = itensDet
          .map((item) => {
            const prod = produtos.find((p) => p.id === item.produto_id);
            return prod
              ? { produto: prod, quantidade: item.quantidade_utilizada }
              : null;
          })
          .filter(Boolean) as { produto: Produto; quantidade: number }[];
        setProdutosSelecionados(selecionados);
      } catch (e) {
        console.error('Erro ao carregar dados do serviço:', e);
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
  const handleProdutos = (_: any, novosProdutos: Produto[]) => {
    setProdutosSelecionados((prevSelecionados) => {
      return novosProdutos.map((produto) => {
        const existente = prevSelecionados.find(
          (p) => p.produto.id === produto.id
        );
        return { produto, quantidade: existente?.quantidade ?? 1 };
      });
    });
  };
  const handleQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade < 1) return;
    setProdutosSelecionados((prev) =>
      prev.map((p) => (p.produto.id === produtoId ? { ...p, quantidade } : p))
    );
  };
  const handleRemoverProduto = (produtoId: number) => {
    setProdutosSelecionados((prev) =>
      prev.filter((p) => p.produto.id !== produtoId)
    );
  };

  const handleEnviar = async () => {
    const itens: ProdutoServicoItem[] = produtosSelecionados.map((p) => ({
      produto_id: p.produto.id!,
      quantidade_utilizada: p.quantidade
    }));
    const servicoUpdateData: ServicoUpdate = {
      nome: servicoData.nome,
      valor_servico: servicoData.valor_servico,
      status_servico: servicoData.status_servico.toLowerCase(),
      descricao_servico: servicoData.descricao_servico,
      itens
    };

    const obrig = ['nome', 'valor_servico', 'status_servico'] as const;
    const novosErros: Record<string, string> = {};
    obrig.forEach((campo) => {
      if (!servicoUpdateData[campo] && servicoUpdateData[campo] !== 0) {
        novosErros[campo] = `O campo ${campo.replace('_', ' ')} é obrigatório.`;
      }
    });
    setErros(novosErros);
    if (Object.keys(novosErros).length) {
      setInfoMessage('Por favor, preencha todos os campos obrigatórios.');
      setAbrirAviso(true);
      return;
    }

    try {
      const resp = await editarServico(Number(id), servicoUpdateData);
      if (resp?.errors) {
        const formatted: Record<string, string> = {};
        Object.keys(resp.errors).forEach((c) => {
          formatted[c] = resp.errors[c].join(', ');
        });
        setErros(formatted);
        setInfoMessage('Erro ao atualizar serviço. Verifique os campos.');
        setAbrirAviso(true);
        return;
      }

      setInfoMessage('Serviço atualizado com sucesso!');
      setAbrirAviso(true);
      setTimeout(() => navigate('/servicos'), 2000);
    } catch (e) {
      console.error(e);
      setInfoMessage('Erro inesperado. Tente novamente.');
      setAbrirAviso(true);
    }
  };

  const handleCancelar = () => {
    if (servicoOriginal) {
      navigate('/servicos');
    } else {
      navigate('/servicos');
    }
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Editar Serviço</title>
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
        <Box sx={stylesEditar.headerServico}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/0/109.png"
            alt="Ícone Cliente"
            sx={stylesEditar.headerServicoImg}
          />
          <Typography sx={stylesEditar.headerServicoSpan}>
            Serviço - Editar
          </Typography>
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
              value={servicoData.status_servico}
              onChange={handleMudanca}
              sx={stylesEditar.formGroup}
            />
            <Autocomplete
              multiple
              options={listaProdutos}
              getOptionLabel={(option: Produto) => option.nome}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={produtosSelecionados.map((p) => p.produto)}
              onChange={handleProdutos}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produto(s)"
                  variant="outlined"
                  fullWidth
                />
              )}
              filterSelectedOptions
              sx={stylesEditar.formGroup}
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

          <Box sx={stylesEditar.obsButtons}>
            <Box sx={stylesEditar.boxObs}>
              <Typography sx={stylesEditar.observacoesLabel}>
                Observações
              </Typography>
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
              <Button
                variant="contained"
                color="success"
                onClick={handleEnviar}
              >
                Salvar
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
              bgcolor: infoMessage.includes('sucesso') ? 'green' : 'red',
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

export default EditarServico;
