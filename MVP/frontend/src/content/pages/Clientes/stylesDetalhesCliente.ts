const stylesCliente = {
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerClienteImg: {
    marginLeft: '25px',
    marginRight: '8px',
    height: '20px'
  },
  headerClienteSpan: {
    fontSize: '18px',
    fontWeight: 'normal'
  },
  abas: {
    marginBottom: '15px', 
    borderBottom: '1px solid black',
    backgroundColor: '#2F2F2F', 
    '& .MuiTabs-indicator': {
      backgroundColor: '#fff', 
    }
  },
  clientesDetalhes: {
    margin: '100px auto',
    maxWidth: '60%', 
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: '#fff',
    marginTop: '8rem',
  },
  aba: {
    color: '#fff',
    fontSize: '14px',
    maxWidth: '50%',
    textTransform: 'uppercase', 
    textalign: 'center',
    padding: '10px 20px', 
    flex: 1,
    '&.Mui-selected': {
      backgroundColor: '#555' 
    }
  },
  campoCliente: {
    fontWeight: 'bold', 
    fontSize: '16px', 
    padding: '10px 0 10px 15px', 
    border: '1px solid #959494', 
    textAlign: 'left', 
    color: '#333', 
    letterSpacing: '0.4px', 
  },
  campoValor: {
    fontSize: '16px', 
    padding: '10px 0 10px 15px', 
    textAlign: 'left',
    border: '1px solid #959494',
  },
  buttonVisualizar: {
    color: 'black',
    fontSize: '16px', 
    padding: '10px 5px 10px 0', 
    textAlign: 'left',
    textTransform: 'none',
    '&:hover': {
    backgroundColor: 'transparent', 
    textDecoration: 'underline',   
  },
  },
  botaoVoltar: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& button': {
      backgroundColor: '#2F2F2F',
      color: '#fff',
      textTransform: 'none',
      fontSize: '14px',
      padding: '10px 20px',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: '#4F4F4F',
      },
    },
  },
};

export default stylesCliente;
