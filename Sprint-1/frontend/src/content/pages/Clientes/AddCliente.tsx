import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography, IconButton, Alert } from '@mui/material';
import { useRequests } from 'src/utils/requests';
import { Cliente } from 'src/models/Cliente';
import { Close, PhotoCamera } from '@mui/icons-material';
import Navbar from 'src/components/Navbar/NavBar';

const AdicionarCliente = () => {
  const { addCliente } = useRequests();

  const [clientData, setClientData] = useState<Cliente>({
    nome: '',
    cpf_cnpj: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    bairro: '',
    tipo: '',
    status_cliente: '',
    observacao: '',
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [abrirAviso, setAbrirAviso] = useState(false);

  const handleMudanca = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientData((dados) => ({ ...dados, [name]: value }));
  };

  const handleEnviar = async () => {    
    const novosErros: Record<string, string> = {};
    const camposObrigatorios = ['nome', 'cpf_cnpj', 'email', 'telefone', 'cep', 'endereco', 'bairro', 'tipo', 'status_cliente'];

    camposObrigatorios.forEach((campo) => {
      if (!clientData[campo]) {
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
      const response = await addCliente(clientData);
      setInfoMessage('Cliente cadastrado com sucesso!');
      setAbrirAviso(true);
      setClientData({
        nome: '',
        cpf_cnpj: '',
        email: '',
        telefone: '',
        cep: '',
        endereco: '',
        bairro: '',
        tipo: '',
        status_cliente: '',
        observacao: '',
      });
      setErros({});
    } catch (error) {
      setInfoMessage('Erro ao cadastrar cliente. Tente novamente.');
      setAbrirAviso(true);
    }
  };

  const handleCancelar = () => {
    setClientData({
      nome: '',
      cpf_cnpj: '',
      email: '',
      telefone: '',
      cep: '',
      endereco: '',
      bairro: '',
      tipo: '',
      status_cliente: '',
      observacao: '',
    });
  }

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden', fontFamily: 'arial', paddingTop: '103px' }}>
      <Navbar />
      <Box sx={stylesAdd.headerCliente}>
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
          alt="Ícone Cliente"
          sx={stylesAdd.headerClienteImg}
        />
        <Typography sx={stylesAdd.headerClienteSpan}>Clientes - Adicionar</Typography>
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

      <Box sx={stylesAdd.grayContainer}>
        <Typography sx={stylesAdd.photoContainer}>
          <IconButton title="Adicionar foto de um cliente">
            <PhotoCamera
              sx={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '140px',
                backgroundColor: 'white',
                fontSize: 130,
                color: 'dimgray',
                border: '2px solid silver',
                borderRadius: '10px',
                padding: '30px',
                '&:hover': {
                  color: 'black',
                  transition: 'color 1.0s ease',
                },
              }}
            />
          </IconButton>
        </Typography>

        <Box sx={stylesAdd.formContainer}>
          <TextField
            label="Nome *"
            variant="outlined"
            fullWidth
            name="nome"
            value={clientData.nome}
            onChange={handleMudanca}
            sx={stylesAdd.formGroup}
          />
          <TextField
            label="CPF / CNPJ *"
            variant="outlined"
            fullWidth
            name="cpf_cnpj"
            value={clientData.cpf_cnpj}
            onChange={handleMudanca}
            sx={stylesAdd.formGroup}
          />
          <TextField
            label="Email *"
            variant="outlined"
            fullWidth
            name="email"
            value={clientData.email}
            onChange={handleMudanca}
            sx={stylesAdd.formGroup}
          />
        </Box>

        <Box sx={stylesAdd.formContainer}>
          <TextField
            label="Celular *"
            variant="outlined"
            fullWidth
            name="telefone"
            value={clientData.telefone}
            onChange={handleMudanca}
            sx={stylesAdd.formGroup}
          />
          <TextField
            label="CEP *"
            variant="outlined"
            fullWidth
            name="cep"
            value={clientData.cep}
            onChange={handleMudanca}
            sx={stylesAdd.formGroup}
          />
          <TextField
            label="Endereço *"
            variant="outlined"
            fullWidth
            name="endereco"
            value={clientData.endereco}
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
            value={clientData.bairro}
            onChange={handleMudanca}
            sx={stylesAdd.formGroup}
          />
          <TextField
            label="Tipo de Cliente *"
            variant="outlined"
            fullWidth
            name="tipo"
            value={clientData.tipo}
            onChange={handleMudanca}
            sx={stylesAdd.formGroup}
          />
          <TextField
            label="Status Cliente *"
            variant="outlined"
            fullWidth
            name="status_cliente"
            value={clientData.status_cliente}
            onChange={handleMudanca}
            sx={stylesAdd.formGroup}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '20px' }}>
        <Box sx={{ padding: '30px', borderRadius: '8px', width: '100%' }}>
          <Typography sx={stylesAdd.observacoesLabel}>Observações</Typography>
          <TextField
            multiline
            rows={7}
            name="observacao"
            value={clientData.observacao}
            onChange={handleMudanca}
            sx={stylesAdd.observacoesInput}
          />
        </Box>
        <Typography sx={stylesAdd.buttons}>
          <Button variant="contained" color="success" onClick={handleEnviar}>
            Adicionar
          </Button>
          <Button variant="contained" color="error" onClick={handleCancelar}>
            Cancelar
          </Button>
        </Typography>
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
            bgcolor: infoMessage === 'Cliente cadastrado com sucesso!' ? 'green' : 'red',
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
  );
};

export default AdicionarCliente;

const stylesAdd = {
  headerCliente: {
    backgroundColor: '#b0c4de',
    padding: '10px 0 10px 0',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '15px',
    marginTop: '70px',
    marginleft: '1rem',
    position: 'fixed',
    top: '0px',
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',     
  },
  headerClienteImg: {
    marginLeft: '15px',
    marginRight: '8px',
    width: '100',
    height: '20px'
  },
  headerClienteSpan: {
    fontSize: '16px',
    fontWeight: 'normal',
  },
  dadosCliente: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dadosClienteImg: {
    width: '20px',
    height: '25px',
    marginright: '1rem',
    display: 'flex',
    fontSize: '2px',
    fontWeight: 'bold',margin: '7px 0 7px 15px',
  },
  grayContainer: {
    backgroundColor: '#ddd',
    padding: '23px',
    borderRadius: '8px',
    display: 'flex',
    alignitems: 'flexstart',
    gap: '20px',
    flex: 1,
    flexwrap: 'wrap',
    margin: '0 1rem 0 1rem',
  },
  photoContainer: {
    color: '#666',
    width: '100%',
    marginRight: '180px',
    paddingBottom: '100px',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#000',
    },
  },
  formContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginleft: '10px',
  },
  formGroup: {
    flex: '1 1 calc(33.333% - 10px)',
    minWidth: '375px',
    backgroundColor: 'white',
    border: '3px solid gainsboro',
    borderRadius: '5px',
  },
  observacoesLabel: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
    margintop: '30px',
    fontSize: '16px',
    width: '100%',
    textAlign: 'left',
  },
  observacoesInput: {
    width: '75%',
    padding: '3px',
    borderRadius: '5px',
    border: '1px solid black',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    alignitems: 'flex-end',
    margin: '0 20px 30px auto',
  }
};
