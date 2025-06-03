const stylesLista = {
  headerEstoque: {
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
  headerEstoqueImg: {
    marginLeft: '25px',
    marginRight: '8px',
    height: '20px'
  },
  headerEstoqueSpan: {
    fontSize: '18px',
    fontWeight: 'normal',
    letterSpacing: '0.5px'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    margin: '130px 20px 20px 2rem'
  },
  caixa: {
    border: '2px solid gainsboro',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '10px',
    height: 'auto',
    width: 'auto',
    maxWidth: '400px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    overflowX: 'hidden'
  },
  tituloCaixa: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: '4px 0 5px 0'
  },
  conteudoCaixa: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    alignProperty: 'center',
    justifyContent: 'center'
  },
  checkbox: {
    fontSize: '15px',
    color: '#1C1C1C'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '10px'
  },
  button: {
    textTransform: 'none',
    fontSize: '14px',
    padding: '5px 15px'
  },
  barraPesquisa: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: '1rem',
    marginLeft: 'auto',
    width: '300px'
  },
  campoInput: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      fontSize: '14px',
      borderRadius: '5px 0 0 5px',
      height: '40px',
      letterspacing: '0.5px'
    }
  },
  pesquisaIcon: {
    backgroundColor: '#0c3c94',
    color: '#fff',
    height: '40px',
    width: '40px',
    borderRadius: '0 5px 5px 0',
    '&:hover': {
      backgroundColor: 'royalblue'
    }
  },
  estoqueList: {
    margin: '1rem',
    display: 'flex',
    windowWidth: '100%'
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto'
  },
  colunas: {
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #959494',
    gap: '10px',
    letterspacing: '0.5px'
  },
  linhas: {
    fontSize: '12px',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #959494',
    letterspacing: '0.5px'
  }
};

export default stylesLista;
