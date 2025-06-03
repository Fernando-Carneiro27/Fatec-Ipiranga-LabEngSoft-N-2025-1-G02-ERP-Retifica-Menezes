import React, { useState } from 'react';
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
import { Cliente } from 'src/models/Cliente';
import { PhotoCamera } from '@mui/icons-material';
import Navbar from 'src/components/Navbar/NavBar';
import { useNavigate } from 'react-router';
import stylesAdd from 'src/content/pages/Clientes/stylesAddCliente';

const AdicionarCliente = () => {
  const { addCliente } = useRequests();

  const navigate = useNavigate();

  const [clienteData, setClienteData] = useState<Cliente>({
    nome: '', cpf_cnpj: '', email: '', telefone: '', cep: '',
    endereco: '', bairro: '', tipo: '', status_cliente: '', observacao: ''
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [abrirAviso, setAbrirAviso] = useState(false);

  const handleMudanca = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClienteData((dados) => ({ ...dados, [name]: value }));
  };

  const handleEnviar = async () => {
    const novosErros: Record<string, string> = {};
    const camposObrigatorios = [
      'nome', 'cpf_cnpj', 'email', 'telefone', 'cep',
      'endereco', 'bairro', 'tipo', 'status_cliente'
    ];
  
    camposObrigatorios.forEach((campo) => {
      if (!clienteData[campo]) {
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
      const response = await addCliente(clienteData);

      if (response.errors) {
        const apiErrors = response.errors;
        const novosErros: Record<string, string> = {};
  
        Object.keys(apiErrors).forEach((campo) => {
          novosErros[campo] = apiErrors[campo].join(', ');
        });
  
        setErros(novosErros);
        setInfoMessage('Erro ao cadastrar cliente. Verifique os campos destacados.');
        setAbrirAviso(true);
        return;
      }

      setInfoMessage('Cliente cadastrado com sucesso!');
      setAbrirAviso(true);
      setClienteData({
        nome: '', cpf_cnpj: '', email: '', telefone: '', cep: '',
        endereco: '', bairro: '', tipo: '', status_cliente: '', observacao: ''
      });
      setTimeout(() => {
        navigate('/clientes');
      }, 2000);
      setErros({});
    } catch (error: any) {
      setInfoMessage('Erro inesperado. Tente novamente.');
      setAbrirAviso(true);
    }
  };

  const handleCancelar = () => {
    setClienteData({ 
      nome: '', cpf_cnpj: '', email: '', telefone: '', cep: '',
      endereco: '', bairro: '', tipo: '', status_cliente: '',observacao: ''
    });
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <HelmetProvider>
      <Helmet> <title>Cadastrar Cliente</title> </Helmet>
      <Box sx={{ maxWidth: '100%', overflow: 'hidden', fontFamily: 'arial', paddingTop: '103px' }}>
        <Navbar />
        <Box sx={stylesAdd.headerCliente}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
            alt="Ícone Cliente"
            sx={stylesAdd.headerClienteImg}
          />
          <Typography sx={stylesAdd.headerClienteSpan}>
            Cliente - Cadastrar
          </Typography>
        </Box>

        <Box sx={stylesAdd.dadosCliente}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="Editar"
            sx={stylesAdd.dadosClienteImg}
          />
            Dados Cliente
        </Box>

        <Box sx={stylesAdd.contPrincipal}>
          <Box sx={stylesAdd.grayContainer}>
            <Box sx={stylesAdd.photoContainer}>
              <IconButton title="Adicionar foto de um cliente">
                <PhotoCamera
                  sx={{ position: 'absolute', top: '0', left: '0', width: '140px', backgroundColor: 'white',
                        fontSize: 130, color: 'dimgray', border: '2px solid silver', borderRadius: '10px',
                        padding: '30px', '&:hover': { color: 'black', transition: 'color 1.0s ease' }
                  }}
                />
              </IconButton>
            </Box>

            <Box sx={stylesAdd.formContainer}>
              <TextField
                label="Nome *"
                variant="outlined"
                fullWidth
                name="nome"
                value={clienteData.nome}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
              />
              <TextField
                label="CPF / CNPJ *"
                variant="outlined"
                fullWidth
                name="cpf_cnpj"
                value={clienteData.cpf_cnpj}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
                error={!!erros.cpf_cnpj} 
                helperText={erros.cpf_cnpj}
              />
              <TextField
                label="Email *"
                variant="outlined"
                fullWidth
                name="email"
                value={clienteData.email}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
                error={!!erros.email}
                helperText={erros.email}
              />
            </Box>

            <Box sx={stylesAdd.formContainer}>
              <TextField
                label="Telefone *"
                variant="outlined"
                fullWidth
                name="telefone"
                value={clienteData.telefone}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
                error={!!erros.telefone}
                helperText={erros.telefone}
              />
              <TextField
                label="CEP *"
                variant="outlined"
                fullWidth
                name="cep"
                value={clienteData.cep}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
              />
              <TextField
                label="Endereço *"
                variant="outlined"
                fullWidth
                name="endereco"
                value={clienteData.endereco}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
              />
            </Box>

            <Box sx={stylesAdd.formContainer}>
              <TextField
                label="Bairro *"
                variant="outlined"
                fullWidth
                name="bairro"
                value={clienteData.bairro}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
              />
              <TextField
                label="Tipo de Cliente *"
                variant="outlined"
                fullWidth
                name="tipo"
                value={clienteData.tipo}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
              />
              <TextField
                label="Status Cliente *"
                variant="outlined"
                fullWidth
                name="status_cliente"
                value={clienteData.status_cliente}
                onChange={handleMudanca}
                sx={stylesAdd.formGroup}
              />
            </Box>
          </Box>

          <Box sx={stylesAdd.obsButtons}>
            <Box sx={stylesAdd.boxObs}>
              <Typography sx={stylesAdd.observacoesLabel}>Observações</Typography>
                <TextField
                  multiline
                  rows={6}
                  name="observacao"
                  value={clienteData.observacao}
                  onChange={handleMudanca}
                  sx={stylesAdd.observacoesInput}
                />
            </Box>
            <Box sx={stylesAdd.buttons}>
              <Button variant="contained" color="success" onClick={handleEnviar}>
                Adicionar
              </Button>
              <Button variant="contained" color="error" onClick={handleCancelar}>
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
            sx: { alignItems: 'center', justifyContent: 'center', marginTop: '50px',
                  bgcolor: infoMessage === 'Cliente cadastrado com sucesso!' ? 'green' : 'red',
                  color: 'white', textAlign: 'center', width: '100%',
                  '& .MuiSnackbarContent-message': { width: 'inherit', textAlign: 'center' }
            }
          }}
        />
      </Box>
    </HelmetProvider>
  );
};

export default AdicionarCliente;