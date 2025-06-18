const stylesEditar = {
    headerServico: {
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
    headerServicoImg: {
      marginLeft: '25px',
      marginRight: '8px',
      width: '100',
      height: '20px'
    },
    headerServicoSpan: {
      fontSize: '18px',
      letterSpacing: '0.5px'
    },
    dadosServico: {
      margin: '15px 0 5px 0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    dadosServicoImg: {
      width: '25px',
      height: '25px',
      display: 'flex',
      fontSize: '2px',
      fontWeight: 'bold',
      margin: '7px 0 7px 15px'
    },
    contPrincipal: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
      height: '100%'
    },
    grayContainer: {
      backgroundColor: '#ddd',
      padding: '15px',
      borderRadius: '8px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      alignItems: 'flexstart',
      gap: '20px',
      flex: 1,
      flexwrap: 'wrap',
      margin: '0 1rem 0 1rem',
      '@media (max-width: 1000px)': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(0, 1fr)',
        width: '80%',
        height: 'auto',
      }
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginleft: '10px',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '15px',
        marginLeft: '0'
      }
    },
    formGroup: {
      flex: '1',
      backgroundColor: 'white',
      border: '3px solid gainsboro',
      borderRadius: '5px',
      '& .MuiInputLabel-root': {
        fontSize: '16px',
        letterSpacing: '0.5px'
      },
      '@media (max-width: 768px)': {
          flexDirection: 'column',
          gap: '15px',
          width: '100%',
          marginRight: '30px'
      },
      width: '66%'
    },
    obsButtons: {
      display: 'flex',
      alignItems: 'flex-end',
      margin: '0px 0 0 -0.8rem',
      width: '100%',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: '90px'
      }
    },
    boxObs: {
      padding: '30px',
      borderRadius: '8px',
      width: '100%'
    },
    observacoesLabel: {
      letterSpacing: '0.5px',
      display: 'block',
      marginBottom: '5px',
      marginTop: '10px',
      fontSize: '16px',
      width: '100%',
      textAlign: 'left',
      '@media (max-width: 768px)': {
        width: '100%',
        marginLeft: '-26px'
      }
    },
    observacoesInput: {
      width: '75%',
      borderRadius: '5px',
      backgroundColor: 'gainsboro',
      '@media (max-width: 768px)': {
        width: '90%',
        marginLeft: '-26px'
      }
    },
    buttons: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end',
      margin: '0 40px 30px 50px',
      '@media (max-width: 768px)': {
        width: '100%',
        marginRight: '190px',
        justifyContent: 'flex-end'
      }
    },
    boxServico: {
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '15px',
      width: '100%', 
      margin: '0 20% 0 35px',
      justifyContent: 'flex-start',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        width: '100%',
      },
      
    },
    grayContServico: {
      backgroundColor: '#ddd',
      padding: '15px',
      borderRadius: '8px',
      display: 'flex',
      gap: '20px',
      width: '100%',
      flexWrap: 'wrap',
      margin: '0 1rem 0 1rem',
      '@media (max-width: 1000px)': {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '86.5%',
        margin: '0 1rem -20px 40px',
      }
    },       
  };
  
  export default stylesEditar;
