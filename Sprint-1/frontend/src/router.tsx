import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './content/pages/Auth/LogIn';
// import ListaCliente from './content/pages/Clients/ListaCliente';  
// import ClientDetail from './content/pages/Clients/ClientDetail'; 
import AdicionarCliente from './content/pages/Clientes/AddCliente';
import EsqueciSenha from './content/pages/Auth/Esqueci/Senha';
import EditarCliente from './content/pages/Clientes/EditCliente'; 


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/redefinir-senha" element={<EsqueciSenha />} />
        {/* <Route path="/clientes" element={<ListaCliente />} />*/} 
        <Route path="/cliente-add" element={<AdicionarCliente />} /> 
        <Route path="/cliente/edit/:id" element={<EditarCliente />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
