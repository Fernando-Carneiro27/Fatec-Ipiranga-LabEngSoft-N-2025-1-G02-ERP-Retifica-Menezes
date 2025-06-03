import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './content/pages/Auth/LogIn';
// Clientes
import ListarClientes from './content/pages/Clientes/ListarClientes';
import AdicionarCliente from './content/pages/Clientes/AddCliente';
import DetalhesCliente from './content/pages/Clientes/DetalhesCliente'; 
import EsqueciSenha from './content/pages/Auth/EsqueciSenha';
import EditarCliente from './content/pages/Clientes/EditarCliente'; 
// Produtos
import ListarProdutos from './content/pages/Produtos/ListarProdutos';
import AdicionarProduto from './content/pages/Produtos/AddProduto';
import EditarProduto from './content/pages/Produtos/EditarProduto';
import DetalhesProduto from './content/pages/Produtos/DetalhesProduto';
import HistoricoPreco from './content/pages/Produtos/HistoricoPreco';
// Estoque
import ListarEstoque from './content/pages/Estoque/ListarEstoque';
import MovimentacaoEstoque from './content/pages/Estoque/MovimentacaoEstoque';
// Serviços
import ListarServicos from './content/pages/Servicos/ListarServicos';
import AdicionarServico from './content/pages/Servicos/AddServico';
import EditarServico from './content/pages/Servicos/EditarServico';
import DetalhesServico from './content/pages/Servicos/DetalhesServico';
import HistoricoServico from './content/pages/Servicos/HistoricoPreco';
// Vendas
import ListarVendas from './content/pages/Vendas/ListarVendas';
import AdicionarVenda from './content/pages/Vendas/AddVenda';
import DetalhesVenda from './content/pages/Vendas/DetalhesVenda';

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
        <Route path='/produto/historico/:id' element={<HistoricoPreco />} />
        {/* Estoque */}
        <Route path='/estoque' element={<ListarEstoque />} />
        <Route path='/movimentacao/estoque' element={<MovimentacaoEstoque />} />
        {/* Serviços */}
        <Route path="/servicos" element={<ListarServicos />} />
        <Route path="/servico/:id" element={<DetalhesServico />} />
        <Route path="/servico-add" element={<AdicionarServico />} />
        <Route path="/servico/editar/:id" element={<EditarServico />} />
        <Route path="/servico/historico/:id" element={<HistoricoServico />} />
        {/* Vendas */}
        <Route path="/vendas" element={<ListarVendas />} />
        <Route path="/venda-add" element={<AdicionarVenda />} />
        <Route path="/venda/:id" element={<DetalhesVenda />} />
        {/* <Route path="/venda/editar/:id" element={<EditarVenda />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;