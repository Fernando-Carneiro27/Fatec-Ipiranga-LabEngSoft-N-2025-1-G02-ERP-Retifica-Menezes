const stylesAdd = {
  headerVenda: {
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
  headerVendaImg: {
    marginLeft: '25px',
    marginRight: '8px',
    height: '25px', 
  },
  headerVendaSpan: {
    fontSize: '18px',
    letterSpacing: '0.5px'
  },
  iconesVenda: {
    margin: '15px 0 5px 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  iconesVendaImg: {
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
    gridTemplateColumns: 'repeat(3, 1fr)',
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
      width: '80%',
      height: 'auto'
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
    padding: '0 0 0 -100px ',
    '& .MuiInputLabel-root': {
      fontSize: '16px',
      letterSpacing: '0.5px'
    },
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '15px',
      width: '100%'
    },
    width: '100%'
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
      width: '100%'
    }
  },
  grayContOptSP: {
    backgroundColor: '#ddd',
    padding: '15px',
    borderRadius: '8px',
    display: 'grid',
    flexDirection: 'column',
    alignItems: 'flexstart',
    gap: '20px',
    flex: 1,
    flexwrap: 'wrap',
    margin: '-20px 1rem 0 1rem',
    '@media (max-width: 1000px)': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      height: 'auto'
    }
  },
  grayContOptRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
    marginBottom: '10px',
    alignItems: 'flex-start'
  },
  grayContOpt: {
    backgroundColor: '#ddd',
    padding: '15px',
    borderRadius: '8px',
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr) auto',
    alignItems: 'flexstart',
    gap: '20px',
    flex: 1,
    flexwrap: 'wrap',
    margin: '-20px 1rem 0 1rem',
    '@media (max-width: 1000px)': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      height: 'auto'
    }
  },
  button: {
    display: 'flex',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    alignSelf: 'flex-start',
    margin: '-15px 0 0 5px',
    borderRadius: '5px',
    width: '200px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.4s ease',
    '&:hover': {
      backgroundColor: '#363636'
    },
    '@media (max-width: 768px)': {
      width: '100%',
      marginTop: '10px'
    }
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '20px 1rem 2rem 0',
    gap: '10px',
    width: '100%',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }
  }, 
};

export default stylesAdd;
