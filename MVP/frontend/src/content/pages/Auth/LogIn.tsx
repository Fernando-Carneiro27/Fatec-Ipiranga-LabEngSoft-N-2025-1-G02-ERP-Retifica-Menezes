import { useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Snackbar,
  Typography,
  Tooltip,
  Box
} from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import stylesLogin from 'src/content/pages/Auth/stylesLogIn';

const LogIn = () => {
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [usuario, setUsuario] = useState<string>('');
  const [abrirAviso, setAbrirAviso] = useState<boolean>(false);
  const [senha, setSenha] = useState<string>('');

  const senhaArmazenada = localStorage.getItem('senha');

  const navigate = useNavigate();

  const alternarMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleEnviar = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && senha === senhaArmazenada) {
      setInfoMessage('Login feito com sucesso!');
      setAbrirAviso(true);

      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } else {
      setInfoMessage('Usuário ou senha incorreto(s)');
      setAbrirAviso(true);
      setUsuario('');
      setSenha('');
    }
  };

  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Snackbar
        open={abrirAviso}
        onClose={handleFecharAviso}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
        message={infoMessage}
        ContentProps={{
          sx: {
            bgcolor:
              infoMessage === 'Login feito com sucesso!' ? 'green' : 'red',
            color: 'white',
            textAlign: 'center',
            width: '100%',
            fontSize: '1rem',
            marginRight: '40px',
            '& .MuiSnackbarContent-message': {
              width: 'inherit',
              textAlign: 'center'
            }
          }
        }}
      />
      <Grid
        container
        sx={stylesLogin.body}
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Grid container item xs={11} sm={8} md={6} lg={4}>
          <Grid item xs={12} md={11} sx={stylesLogin.containerLogin}>
            <Typography sx={stylesLogin.tituloLogin}>LOGIN</Typography>
            <Box 
              sx={stylesLogin.formularioLogin} 
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter') {
                  handleEnviar(e);
                }
              }}
            >
              <Box sx={stylesLogin.campoInput}>
                <TextField
                  fullWidth
                  placeholder="Usuário"
                  variant="outlined"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box sx={stylesLogin.campoInput}>
                <TextField
                  fullWidth
                  placeholder="Senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  variant="outlined"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={alternarMostrarSenha} edge="end">
                          {mostrarSenha ? <Tooltip title="Ocultar Senha" arrow><Visibility /></Tooltip>  
                                        : <Tooltip title="Mostrar senha" arrow><VisibilityOff /></Tooltip>}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box sx={stylesLogin.opcoesLogin}>
                <Button
                  sx={stylesLogin.opcoesLoginButton}
                  onClick={() => navigate('/redefinir-senha')}
                >
                  Esqueci minha senha
                </Button>
              </Box>
              <Button
                type="submit"
                sx={stylesLogin.botaoEntrar}
                style={{ backgroundColor: '#004b73', color: 'white' }}
                onClick={handleEnviar}
                fullWidth
              >
                Entrar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </HelmetProvider>
  );
};

export default LogIn;