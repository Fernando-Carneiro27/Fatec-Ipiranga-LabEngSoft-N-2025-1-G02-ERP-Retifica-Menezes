import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Snackbar,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import stylesRedefinir from 'src/content/pages/Auth/stylesEsqueciSenha';

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
    }
    if (novaSenha !== confirmarSenha || novaSenha === '') {
      setInfoMessage('As senhas não coincidem');
      setAbrirAviso(true);

      setUsuario('');
      setNovaSenha('');
      setConfirmarSenha('');
    }
    if (usuario !== 'admin') {
      setInfoMessage('Usuário inválido');
      setAbrirAviso(true);

      setUsuario('');
      setNovaSenha('');
      setConfirmarSenha('');
    }
    if (usuario === '' || novaSenha === '' || confirmarSenha === '') {
      setInfoMessage('Todos os campos precisam ser preenchidos');
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
    <HelmetProvider>
      <Helmet>
        <title>Redefinir Senha</title>
      </Helmet>
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
                infoMessage === 'Redefinição de senha feita com sucesso'
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
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Grid container item xs={11} sm={8} md={6} lg={4}>
            <Grid item xs={12} md={11} sx={stylesRedefinir.containerEsqueciSenha}>
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
              <Box 
                sx={stylesRedefinir.formularioEsqueciSenha}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter') {
                    handleEnviar(e);
                  }
                }}
              >
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
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </HelmetProvider>
  );
};

export default EsqueciSenha;