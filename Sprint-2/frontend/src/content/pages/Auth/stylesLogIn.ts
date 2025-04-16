const stylesLogin = {
    body: {
      boxSizing: 'border-box',
      fontFamily: 'Arial',
      backgroundColor: '#b0c4d1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '110vh',
      overflow: 'hidden',
    },
    containerLogin: {
      marginBottom: '70px',
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '530px'
    },
    tituloLogin: {
      textAlign: 'center',
      marginBottom: '50px',
      fontSize: '25px',
      fontWeight: 500,
    },
    formularioLogin: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginTop: '15px',
      alignItems: 'center'
    },
    campoInput: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginBottom: '10px',
      borderRadius: '5px',
      padding: '12px',
      height: '30px'
    },
    iconeInput: {
      fontSize: '18px',
      color: '#004b73',
      marginRight: '10px'
    },
    inputField: {
      border: 'none',
      outline: 'none',
      width: '100%',
      fontSize: '16px'
    },
    opcoesLogin: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      alignItems: 'center',
      marginBottom: '50px'
    },
    opcoesLoginButton: {
      textTransform: 'none',
      outline: 'none',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#004b73'
      }
    },
    linkSenha: {
      color: '#004b73',
      textDecoration: 'none',
      fontSize: '14px',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    botaoEntrar: {
      width: '100%',
      padding: '12px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '18px',
      cursor: 'pointer',
      marginTop: '20px',
      height: '50px',
      '&:hover': {
        backgroundColor: '#003b5c'
      }
    }
  };

export default stylesLogin;