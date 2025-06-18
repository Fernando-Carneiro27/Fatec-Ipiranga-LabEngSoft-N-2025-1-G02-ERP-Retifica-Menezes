import { alignProperty } from "@mui/material/styles/cssUtils";

const stylesMovimentacao = {
  headerMovimentacao: {
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
  headerMovimentacaoImg: {
    marginLeft: '15px',
    marginRight: '8px',
    height: '20px'
  },
  headerMovimentacaoSpan: {
    fontSize: '18px',
    fontWeight: 'normal'
  },
  caixaMov: {
    display: 'flex', 
    margin: '130px 1.7rem 0 1.7rem', 
  },
  campoMov: {
    '& .MuiInputLabel-root': { fontSize: '15px', padding: '0 0 20px 5px', transformOrigin: 'center' },
    '& .MuiOutlinedInput-root': { 
      width: '270px', height: '30px', margin: '8px 0 0 10px',
      '& input': {
        fontSize: '16px',
        marginTop: '-12px',
      },
    },
  },
  options: {
    maxHeight: '18px',
    width: '250px',
    marginLeft: '10px',
    alignItems: 'center',
    '& input': {
      height: '10px',
      fontSize: '14px'
    }
  },
  calendarios: {
    display: 'flex',
    flexDirection: 'row',    
    alignItems: 'center',     
    justifyContent: 'flex-start', 
    margin: '8px 5px 0 auto'
  },
  calendario: {
    width: '150px',
    marginLeft: '5px',
    padding: '2px 0 0 0',
    '& input': {
      height: '10px',
      fontSize: '14px'
    }
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
      height: '40px'
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
  movimentacaoList: {
    margin: '1rem',
    display: 'flex',
    windowWidth: '100%'
  },
  movimentacaoDetalhes: {
    maxWidth: '100%',
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: '#fff',
    margin: '4rem 1rem 0 1rem'
  },
  campoResumo: {
    display: 'flex',
    backgroundColor: 'black',
  },
  tituloResumo: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '10px 20px',
    width: '100%'
  },
  camposResumo: {
    fontWeight: 'bold',
    fontSize: '17px',
    padding: '10px 0',
    border: '1px solid #959494',
    backgroundColor: '#2F2F2F',
    textAlign: 'center',
    width: '100%',
    color: 'white',
    letterSpacing: '0.4px'
  },
  totaisResumo: {
    border: '2px solid gainsboro',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '10px 0',
    width: '50%',
  },
  tabelaInfo: {
    margin: '4rem 0 0 1.5rem',
    maxWidth: '96.5%',
    letterSpacing: '0.4px',
    overFlowX: 'hidden',
    tableLayout: 'fixed',
  },
  tabelaColunas: {
    backgroundColor: 'black',
  },
  titulosColunas: {
    border: '2px solid gainsboro',
    color: '#fff',
    fontSize: '17px',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '10px 0',
  },
  linhas: {
    border: '2px solid gainsboro',
    fontSize: '16px',
    textAlign: 'center',
    padding: '10px 0',
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
        backgroundColor: '#4F4F4F'
      }
    }
  }
};

export default stylesMovimentacao;
