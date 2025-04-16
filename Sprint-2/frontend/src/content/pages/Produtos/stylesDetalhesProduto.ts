const stylesProduto = {
    headerProduto: {
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
    headerProdutoImg: {
      marginLeft: '15px',
      marginRight: '8px',
      width: '100',
      height: '20px'
    },
    headerProdutoSpan: {
      fontSize: '16px',
      fontWeight: 'normal'
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
    produtosList: {
      margin: '1rem',
      display: 'flex',
      windowWidth: '100%'
    },
    produtosDetalhes: {
      margin: '100px auto',
      maxWidth: '600px', 
      borderRadius: '10px',
      padding: '10px',
      backgroundColor: '#fff'
    },
    abas: {
      display: 'flex',
      marginBottom: '15px', 
      borderBottom: '1px solid black',
      backgroundColor: '#2F2F2F', 
    },
    aba: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      textTransform: 'uppercase', 
      textAlign: 'center',
      padding: '10px 20px', 
      width: '100%',
    },
    campoTitulo: {
      fontWeight: 'bold', 
      fontSize: '16px', 
      padding: '10px 0 10px 15px', 
      border: '1px solid black', 
      textAlign: 'left',
      width: '50%', 
      color: '#333', 
      letterSpacing: '0.4px', 
    },
    campoValor: {
      fontSize: '16px', 
      padding: '10px 0 10px 15px', 
      textAlign: 'left',
      width: '60%', 
      border: '1px solid black',
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
  
  export default stylesProduto;
  