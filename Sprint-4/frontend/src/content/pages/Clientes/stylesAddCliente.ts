const stylesAdd = {
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
    fontWeight: 'normal',
    letterSpacing: '0.5px'
  },
  dadosCliente: {
    margin: '15px 0 5px 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  dadosClienteImg: {
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
    height: '100%',
  },
  grayContainer: {
    backgroundColor: '#ddd',
    padding: '23px',
    borderRadius: '8px',
    display: 'flex',
    alignitems: 'flexstart',
    gap: '20px',
    flex: 1,
    flexwrap: 'wrap',
    margin: '0 1rem 0 1rem',
    '@media (max-width: 1000px)': {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
    }
  },
  photoContainer: {
    color: '#666',
    width: '100%',
    marginRight: '180px',
    paddingBottom: '100px',
    flexshrink: 0,
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#000'
    },
    '@media (max-width: 1000px)': {
      marginLeft: '200px',
      marginBottom: '80px',
      width: '225px',
    },
  },
  formContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginleft: '10px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '15px',
      marginLeft: '0'
    }
  },
  formGroup: {
    flex: '1 1 calc(33.333% - 10px)',
    minWidth: '375px',
    backgroundColor: 'white',
    border: '3px solid gainsboro',
    borderRadius: '5px',
    '& .MuiInputLabel-root': {
      color: 'gray11',
      fontSize: '16px',
      letterSpacing: '0.5px'
    },
    display: 'flex',
    width: '100%'
  },
  obsButtons: {
    display: 'flex',
    alignItems: 'flex-end',
    margin: '0px 0 0 -0.8rem',
    width: '100%',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'center',
      marginLeft: '50px',
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
      marginLeft: '-26px',
    }
  },
  observacoesInput: {
    width: '75%',
    borderRadius: '5px',
    backgroundColor: 'gainsboro',
    '@media (max-width: 768px)': {
      width: '100%',
      marginLeft: '-26px',
    }
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
    margin: '0 40px 30px 50px',
    '@media (max-width: 768px)': {
      width: '100%',
      marginRight: '100px',
      justifyContent: 'flex-end',
    }
  }
};

export default stylesAdd;
