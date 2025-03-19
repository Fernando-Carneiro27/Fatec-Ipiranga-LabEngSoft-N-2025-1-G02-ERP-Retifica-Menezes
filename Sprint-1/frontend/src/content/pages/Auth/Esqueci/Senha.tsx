import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, Snackbar } from '@mui/material';
import Logo from 'public/img/logoesquecisenha.jpg';

import { useNavigate } from 'react-router-dom';

const EsqueciSenha = () => {
  const [usuario, setUsuario] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [abrirAviso, setAbrirAviso] = useState(false);
  const navigate = useNavigate();

  const handleEnviar = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && novaSenha === confirmarSenha) {
      setInfoMessage('Redefinição de senha feita com sucesso');
      setAbrirAviso(true);

       localStorage.setItem('senha', novaSenha);

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } if (novaSenha !== confirmarSenha) {
      setInfoMessage('As senhas não coincidem');
      setAbrirAviso(true);

      setUsuario('');
      setNovaSenha('');
      setConfirmarSenha('');

    } if (usuario !== 'admin') {
      setInfoMessage('Usuário inválido');
      setAbrirAviso(true);

      setUsuario('');
      setNovaSenha('');
      setConfirmarSenha('');
    }
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <Box sx={stylesRedefinir.body}>
      <Snackbar
        open={abrirAviso}
        onClose={handleFecharAviso}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={infoMessage}
        ContentProps={{
          sx: {
            bgcolor:
              infoMessage === 'Redefinição de senha feita com sucesso' ? 'green' : 'red',
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
      <Box sx={stylesRedefinir.containerEsqueciSenha}>
        <Box
          component="img"
          src="/img/logoesquecisenha.jpg"
          alt="Logo RMENEZES"
          sx={stylesRedefinir.logo}
        />
        <Typography sx={stylesRedefinir.tituloEsqueciSenha}>
          Redefina sua senha
        </Typography>
        <Typography sx={stylesRedefinir.descricao}>
          Insira um nome de usuário válido e a nova senha.
        </Typography>
        <Box sx={stylesRedefinir.formularioEsqueciSenha}>
          <TextField
            fullWidth
            label="Usuário"
            variant="outlined"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            sx={stylesRedefinir.campoInput}
            InputLabelProps={{
              sx: stylesRedefinir.labelInput
            }}
          />
          <TextField
            fullWidth
            label="Nova senha"
            type="password"
            variant="outlined"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
            sx={stylesRedefinir.campoInput}
            InputLabelProps={{
              sx: stylesRedefinir.labelInput
            }}
          />
          <TextField
            fullWidth
            label="Confirmar nova senha"
            type="password"
            variant="outlined"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            sx={stylesRedefinir.campoInput}
            InputLabelProps={{
              sx: stylesRedefinir.labelInput
            }}
          />
          <Typography sx={stylesRedefinir.opcoesEsqueciSenha}>
            <Link href="/" sx={stylesRedefinir.linkVoltar}>
              Voltar
            </Link>
          </Typography>
          <Button
            type="submit"
            sx={stylesRedefinir.botaoRedefinirSenha}
            variant="contained"
            onClick={handleEnviar}
            fullWidth
          >
            Redefinir senha
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EsqueciSenha;

const stylesRedefinir = {
  body: {
    margin: '-10px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#b0c4d1 !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '99.3vh',
  },
  containerEsqueciSenha: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '450px'
  },
  logo: {
    width: '100px',
    height: '100px',
    marginBottom: '15px',
    borderRadius: '50%'
  },
  tituloEsqueciSenha: {
    fontSize: '20px',
    fontWeight: 'normal',
    marginBottom: '10px'
  },
  descricao: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '-10px'
  },
  formularioEsqueciSenha: {
    width: '100%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  campoInput: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    borderRadius: '5px',
    padding: '10px',
    height: '45px'
  },
  labelInput: {
    fontSize: '15px',
    textAlign: 'center',
    margin: '0.8rem 0 0 0.8rem'
  },
  opcoesEsqueciSenha: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: '15px'
  },
  linkVoltar: {
    color: '#004b73',
    textDecoration: 'none',
    fontSize: '15px'
  },
  botaoRedefinirSenha: {
    width: '400px',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '12px',
    height: '50px',
    backgroundColor: '#003b5c',
    '&:hover': {
      backgroundColor: '#003b5c'
    },
    '&:active': {
      backgroundColor: '#002740'
    }
  }
};
