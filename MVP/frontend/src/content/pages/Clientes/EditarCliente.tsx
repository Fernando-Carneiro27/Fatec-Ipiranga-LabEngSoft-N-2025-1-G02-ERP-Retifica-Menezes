import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRequests } from 'src/utils/requests';
import { ClienteUpdate } from 'src/models/Cliente';
import { PhotoCamera } from '@mui/icons-material';
import Navbar from 'src/components/Navbar/NavBar';
import { useNavigate, useParams } from 'react-router';
import stylesEditar from 'src/content/pages/Clientes/stylesEditarCliente';

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUmCliente, editarCliente } = useRequests();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [clienteData, setClienteData] = useState<ClienteUpdate | null>(null);
  const [clienteOriginal, setClienteOriginal] = useState<ClienteUpdate | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState('');
  const [abrirAviso, setAbrirAviso] = useState(false);

  useEffect(() => {
    const obterCliente = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await getUmCliente(+id);
          setClienteData(response.data.cliente);
          setClienteOriginal(response.data.cliente);
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    obterCliente();
  }, [id]);

  const handleMudanca = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (clienteData) {
      setClienteData({ ...clienteData, [e.target.name]: e.target.value });
    }
  };
  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteData || !clienteOriginal) return;

    const erros: Record<string, string[]> = {};
    const camposObrigatorios: (keyof ClienteUpdate)[] = [
      'nome',
      'cpf_cnpj',
      'email',
      'telefone',
      'cep',
      'endereco',
      'bairro',
      'tipo',
      'status_cliente'
    ];

    camposObrigatorios.forEach((campo) => {
      if (!clienteData[campo]) {
        erros[campo] = [`O campo ${campo.replace('_', ' ')} é obrigatório.`];
      }
    });

    setErrors(erros);

    if (Object.keys(erros).length > 0) {
      setInfoMessage('Por favor, preencha todos os campos obrigatórios.');
      setAbrirAviso(true);
      return;
    }

    const camposAlterados: Partial<ClienteUpdate> = {};

    (Object.keys(clienteData) as Array<keyof ClienteUpdate>).forEach(
      (campo) => {
        if (clienteData[campo] !== clienteOriginal[campo]) {
          camposAlterados[campo] = clienteData[campo] as never;
        }
      }
    );
    const dadosAtualizados: ClienteUpdate = {
      ...clienteOriginal,
      ...camposAlterados
    };

    try {
      const response = await editarCliente(+id, dadosAtualizados);

      if (response.errors) {
        setErrors(response.errors);
        setInfoMessage(
          'Erro ao atualizar cliente. Verifique os campos destacados.'
        );
        setAbrirAviso(true);
        return;
      }

      setInfoMessage('Cliente atualizado com sucesso!');
      setAbrirAviso(true);
      setTimeout(() => {
        navigate('/clientes');
      }, 1000);
      setErrors({});
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      setInfoMessage('Erro inesperado. Tente novamente.');
      setAbrirAviso(true);
    }
  };
  const handleCancelar = () => {
    setClienteData(clienteOriginal);
    setTimeout(() => {
      window.history.back();
    }, 2500);
  };

  if (loading || !clienteData)
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
        {' '}
        <title>Editar Cliente</title>{' '}
      </Helmet>
      <Box sx={{ paddingTop: '103px' }}>
        <Navbar />
        <Box sx={stylesEditar.headerCliente}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
            alt="Ícone Cliente"
            sx={stylesEditar.headerClienteImg}
          />
          <Typography sx={stylesEditar.headerClienteSpan}>
            Cliente - Editar
          </Typography>
        </Box>

        <Box sx={stylesEditar.dadosCliente}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="Editar"
            sx={stylesEditar.dadosClienteImg}
          />
          Dados Cliente
        </Box>

        <Box sx={stylesEditar.contPrincipal}>
          <Box sx={stylesEditar.grayContainer}>
            <Box sx={stylesEditar.formContainer}>
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                name="nome"
                value={clienteData?.nome || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
              />
              <TextField
                label="CPF / CNPJ"
                variant="outlined"
                fullWidth
                name="cpf_cnpj"
                value={clienteData?.cpf_cnpj || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
                error={!!errors.cpf_cnpj}
                helperText={errors.cpf_cnpj ? errors.cpf_cnpj[0] : ''}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={clienteData?.email || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
                error={!!errors.email}
                helperText={errors.email ? errors.email[0] : ''}
              />
            </Box>

            <Box sx={stylesEditar.formContainer}>
              <TextField
                label="Telefone"
                variant="outlined"
                fullWidth
                name="telefone"
                value={clienteData?.telefone || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
                error={!!errors.telefone}
                helperText={errors.telefone ? errors.telefone[0] : ''}
              />
              <TextField
                label="CEP"
                variant="outlined"
                fullWidth
                name="cep"
                value={clienteData?.cep || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
              />
              <TextField
                label="Endereço"
                variant="outlined"
                fullWidth
                name="endereco"
                value={clienteData?.endereco || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
              />
            </Box>

            <Box sx={stylesEditar.formContainer}>
              <TextField
                label="Bairro"
                variant="outlined"
                fullWidth
                name="bairro"
                value={clienteData?.bairro || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
              />
              <TextField
                label="Tipo de Cliente"
                variant="outlined"
                fullWidth
                name="tipo"
                value={clienteData?.tipo || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
              />
              <TextField
                label="Status Cliente"
                variant="outlined"
                fullWidth
                name="status_cliente"
                value={clienteData?.status_cliente || ''}
                onChange={handleMudanca}
                sx={stylesEditar.formGroup}
              />
            </Box>
          </Box>

          <Box sx={stylesEditar.obsButtons}>
            <Box sx={stylesEditar.boxObs}>
              <Typography sx={stylesEditar.observacoesLabel}>
                Observações
              </Typography>
              <TextField
                multiline
                rows={6}
                name="observacao"
                value={clienteData?.observacao || ''}
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
          onClose={() => setAbrirAviso(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message={infoMessage}
          ContentProps={{
            sx: {
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '50px',
              bgcolor:
                infoMessage === 'Cliente atualizado com sucesso!'
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

export default EditarCliente;
