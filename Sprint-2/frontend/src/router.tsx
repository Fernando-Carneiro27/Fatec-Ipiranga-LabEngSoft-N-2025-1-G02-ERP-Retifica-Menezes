import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './content/pages/Auth/LogIn';
// Clientes
import ListarClientes from './content/pages/Clientes/ListarClientes';
import DetalhesCliente from './content/pages/Clientes/DetalhesCliente'; 
import AdicionarCliente from './content/pages/Clientes/AddCliente';
import EsqueciSenha from './content/pages/Auth/EsqueciSenha';
import EditarCliente from './content/pages/Clientes/EditarCliente'; 
// Produtos
import AdicionarProduto from './content/pages/Produtos/AddProduto';
import EditarProduto from './content/pages/Produtos/EditarProduto';
import ListarProdutos from './content/pages/Produtos/ListarProdutos';
import DetalhesProduto from './content/pages/Produtos/DetalhesProduto';


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/redefinir-senha" element={<EsqueciSenha />} />
        {/* Clientes */}
        <Route path="/clientes" element={<ListarClientes />} />
        <Route path="/cliente/:id" element={<DetalhesCliente />} />
        <Route path="/cliente-add" element={<AdicionarCliente />} /> 
        <Route path="/cliente/editar/:id" element={<EditarCliente />} />
        {/* Produtos */}
        <Route path="/produtos" element={<ListarProdutos />} />
        <Route path="/produto/:id" element={<DetalhesProduto />} />
        <Route path="/produto-add" element={<AdicionarProduto />} />
        <Route path="/produto/editar/:id" element={<EditarProduto />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
