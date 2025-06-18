const stylesHome = {
  conteudo: {
    padding: '24px',
    marginTop: '64px',
  },
  boxCards:{
    display: 'flex',
    margin: '0 0 24px 35px',
  },
  cardReceber: {
    width: '400px',
    height: '150px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    marginRight: '20px',
    textAlign: 'left',
  },
  cardPagar: {
    width: '400px',
    height: '150px',
    backgroundColor: 'orange',
    color: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    textAlign: 'left',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: '8px',
  },
  icon: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  },
  cardTitulo: {
    fontWeight: 500,
  },
  paper: {
    marginLeft: '35px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '70%',
    border: '2px solid #e0e0e0',
  },
  calendarioTitulo: {
    margin: '10px',
  },
  modalStyle: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    padding: '16px',
  },
};

export default stylesHome;