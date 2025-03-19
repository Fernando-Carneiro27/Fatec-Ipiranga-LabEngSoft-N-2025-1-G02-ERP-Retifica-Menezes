import React, { useState } from 'react';
import {
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Box,
    Snackbar,
    Typography,
} from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
    const [infoMessage, setInfoMessage] = useState<string>('');
    const [usuario, setUsuario] = useState<string>("");
    const [abrirAviso, setAbrirAviso] = useState<boolean>(false);
    const [senha, setSenha] = useState<string>("");
    
    const senhaArmazenada = localStorage.getItem('senha');

    const navigate = useNavigate(); 

    const alternarMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    const handleEnviar = (e) => {
        e.preventDefault();
        if (usuario === 'admin' && senha === senhaArmazenada) {
            setInfoMessage('Login feito com sucesso!');
            setAbrirAviso
            (true);

            setTimeout(() => {
                navigate('/clientes');
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
        <Box sx={stylesLogin.body}>
            <Box sx={stylesLogin.containerLogin}>
            <Snackbar
                open={abrirAviso}
                onClose={handleFecharAviso}
                autoHideDuration={2000} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message={infoMessage}
                ContentProps={{
                    sx: {
                        bgcolor: infoMessage === 'Login feito com sucesso!' ? 'green' : 'red',
                        color: 'white',
                        textAlign: 'center',
                        width: '100%',
                        '& .MuiSnackbarContent-message': {
                            width: 'inherit',
                            textAlign: 'center',
                        },
                    },
                }}
            />
            <Typography sx={stylesLogin.tituloLogin}>
                LOGIN
            </Typography>
            <Box sx={stylesLogin.formularioLogin} onSubmit={handleEnviar}>
                <Typography sx={stylesLogin.campoInput}>
                    <TextField
                        fullWidth
                        placeholder="Usuário"
                        variant="outlined"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <Person />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Typography>
                <Typography sx={stylesLogin.campoInput}>
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
                                <InputAdornment position='start'>
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={alternarMostrarSenha} edge="end">
                                        {mostrarSenha ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Typography>
                <Typography sx={stylesLogin.opcoesLogin}>
                    <Button 
                        sx={stylesLogin.opcoesLoginButton} 
                        onClick={() => navigate('/redefinir-senha')}>Esqueci minha senha</Button>
                </Typography>
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
        </Box>
    </Box>
    );
};

export default LogIn;

const stylesLogin = {
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
    containerLogin: {
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
      height: '450px',
    },
    tituloLogin: {
      textAlign: 'center',
      marginBottom: '50px',
      fontSize: '25px',
      fontWeight: 500,
      justifyContent: 'center',
    },
    formularioLogin: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginTop: '15px',
      alignItems: 'center',
    },
    campoInput: {
      display: 'flex',
      alignItems: 'center',
      width: '400px',
      marginBottom: '10px',
      borderRadius: '5px',
      padding: '12px',
      height: '30px',
    },
    iconeInput: {
      fontSize: '18px',
      color: '#004b73',
      marginRight: '10px',
    },
    inputField: {
      border: 'none',
      outline: 'none',
      width: '100%',
      fontSize: '16px',
    },
    opcoesLogin: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      alignItems: 'center',
      marginBottom: '40px',
    },
    opcoesLoginButton: {
      textTransform: 'none',
      outline: 'none',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#004b73',
      },
    },
    linkSenha: {
      color: '#004b73',
      textDecoration: 'none',
      fontSize: '14px',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    botaoEntrar: {
      width: '400px',
      padding: '12px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '18px',
      cursor: 'pointer',
      marginTop: '20px',
      height: '50px',
      '&:hover': {
        backgroundColor: '#003b5c',
      },
    },
  };
  