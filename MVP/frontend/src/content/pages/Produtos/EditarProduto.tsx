import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRequests } from 'src/utils/requests';
import Navbar from 'src/components/Navbar/SideMenu';
import { useNavigate, useParams } from 'react-router';
import stylesEditar from 'src/content/pages/Produtos/stylesEditarProduto';
import { EstoqueUpdate, ProdutoUpdate } from 'src/models/Produto';

const EditarProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEstoque, editarEstoque, getUmProduto, editarProduto } =
    useRequests();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [estoqueData, setEstoqueData] = useState<EstoqueUpdate | null>(null);
  const [estoqueOriginal, setEstoqueOriginal] = useState<EstoqueUpdate | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [abrirAviso, setAbrirAviso] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [valorCompra, setValorCompra] = useState('');
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [lucroDesejadoInicial, setLucroDesejadoInicial] = useState('');
  const [dadosCalculados, setDadosCalculados] = useState({
    lucro_desejado: '',
    valor_venda: 0
  });
  const [produtoData, setProdutoData] = useState<{
    nome: string;
    descricao: string;
    valor_compra: number;
  }>({
    nome: '',
    descricao: '',
    valor_compra: 0
  });
  const [produtoOriginal, setProdutoOriginal] = useState<{
    nome: string;
    descricao: string;
    valor_compra: number;
  }>({
    nome: '',
    descricao: '',
    valor_compra: 0
  });

  useEffect(() => {
    const obterEstoque = async () => {
      if (id) {
        try {
          setLoading(true);
          const estoqueResponse = await getEstoque(+id);
          console.log('Resposta da API (getEstoque):', estoqueResponse);

          if (
            !estoqueResponse ||
            estoqueResponse.errors ||
            !estoqueResponse.data?.estoque
          ) {
            throw new Error(
              'Erro ao carregar estoque: ' + estoqueResponse.detail ||
                'Resposta inválida'
            );
          }

          setEstoqueData(estoqueResponse.data.estoque);
          setEstoqueOriginal(estoqueResponse.data.estoque);
          console.log('Produto ID:', estoqueResponse.data.estoque.produto.id);

          if (estoqueResponse.data.estoque.produto.id) {
            const idDoProduto = estoqueResponse.data.estoque.produto.id;
            setProdutoId(idDoProduto);

            const produtoResponse = await getUmProduto(idDoProduto);
            setProdutoData({
              nome: produtoResponse.data.produto.nome,
              descricao: produtoResponse.data.produto.descricao,
              valor_compra: produtoResponse.data.produto.valor_compra
            });
            setProdutoOriginal({
              nome: produtoResponse.data.produto.nome,
              descricao: produtoResponse.data.produto.descricao,
              valor_compra: produtoResponse.data.produto.valor_compra
            });
          }
        } catch (error) {
          console.error('Erro ao carregar estoque ou produto:', error);
          setInfoMessage(`Erro: ${error.message || 'Tente novamente.'}`);
        } finally {
          setLoading(false);
        }
      }
    };
    obterEstoque();
  }, [id]);

  useEffect(() => {
    if (produtoData && estoqueData) {
      const valorCompra = produtoData.valor_compra;
      const valorVenda = estoqueData.valor_produto_venda;

      const lucroSalvo = localStorage.getItem(`lucro_produto_${produtoId}`);
      const lucroCalculado =
        valorCompra && valorVenda && valorCompra > 0
          ? ((valorVenda - valorCompra) / valorCompra).toFixed(2)
          : '0';

      const lucroFinal = lucroSalvo ?? lucroCalculado;

      setDadosCalculados((prev) => ({
        ...prev,
        lucro_desejado: lucroFinal
      }));
      setLucroDesejadoInicial(lucroFinal);
    }
  }, [produtoData, estoqueData]);

  useEffect(() => {
    const valorStr = valorCompra.trim();
    const lucroStr = dadosCalculados.lucro_desejado.trim();
    const valor = parseFloat(valorStr.replace(',', '.'));
    const lucro = parseFloat(lucroStr.replace(',', '.'));

    if (!valorStr || !lucroStr || isNaN(valor) || isNaN(lucro)) {
      setDadosCalculados((prev) => ({
        ...prev,
        valor_venda: 0
      }));
      return;
    }

    const calculado = valor + (valor * lucro) / 100;
    const valorVendaCalculado = parseFloat(calculado.toFixed(2));
    setDadosCalculados((prev) => ({
      ...prev,
      valor_venda: valorVendaCalculado
    }));
    setEstoqueData((prevState) => ({
      ...prevState,
      valor_produto_venda: valorVendaCalculado
    }));
  }, [valorCompra, dadosCalculados.lucro_desejado]);
  useEffect(() => {
    if (produtoData?.valor_compra !== undefined) {
      const valorFormatado = produtoData.valor_compra
        .toFixed(2)
        .replace('.', ',');
      setValorCompra(valorFormatado);
    }
  }, [produtoData]);

  const handleMudanca = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'nome') {
      setProdutoData((prev) => ({
        ...prev,
        nome: value
      }));
    } else if (name === 'descricao') {
      setProdutoData((prev) => ({
        ...prev,
        descricao: value
      }));
    } else if (name === 'valor') {
      const valorCompra = parseFloat(value.replace(',', '.'));
      if (!isNaN(valorCompra)) {
        setValorCompra(value);
        setProdutoData((prev) => ({
          ...prev,
          valor: valorCompra
        }));

        const lucroDesejado =
          parseFloat(lucroDesejadoInicial.replace(',', '.')) || 0;
        const novoValorVenda = valorCompra * (1 + lucroDesejado / 100);
        setDadosCalculados((prev) => ({
          ...prev,
          valor_venda: novoValorVenda
        }));

        setEstoqueData((prevState) => ({
          ...prevState,
          valor_produto_venda: novoValorVenda
        }));
      }
    } else if (name === 'lucro_desejado') {
      const lucroDesejado = parseFloat(value.replace(',', '.'));
      if (!isNaN(lucroDesejado)) {
        setDadosCalculados((prev) => ({
          ...prev,
          lucro_desejado: value
        }));
        const valorCompra = produtoData.valor_compra || 0;
        const novoValorVenda = valorCompra * (1 + lucroDesejado / 100);
        setDadosCalculados((prev) => ({
          ...prev,
          valor_venda: novoValorVenda
        }));
        setEstoqueData((prevState) => ({
          ...prevState,
          valor_produto_venda: novoValorVenda
        }));
      }
    } else if (estoqueData) {
      setEstoqueData({ ...estoqueData, [name]: value });
    }
  };
  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estoqueData || !estoqueOriginal || !produtoData) return;

    const erros: Record<string, string[]> = {};
    const camposObrigatorios: (keyof EstoqueUpdate)[] = [
      'quantidade_min',
      'quantidade_max',
      'valor_produto_venda'
    ];
    camposObrigatorios.forEach((campo) => {
      if (!estoqueData[campo]) {
        erros[campo] = [`O campo ${campo.replace('_', ' ')} é obrigatório.`];
      }
    });
    setErrors(erros);
    if (Object.keys(erros).length > 0) {
      setInfoMessage('Por favor, preencha todos os campos obrigatórios.');
      setAbrirAviso(true);
      return;
    }

    const camposAlteradosEstoque: Partial<EstoqueUpdate> = {};
    const camposAlteradosProduto: Partial<ProdutoUpdate> = {};

    (Object.keys(estoqueData) as Array<keyof EstoqueUpdate>).forEach(
      (campo) => {
        if (estoqueData[campo] !== estoqueOriginal[campo]) {
          camposAlteradosEstoque[campo] = estoqueData[campo] as never;
        }
      }
    );

    (Object.keys(produtoData) as Array<keyof ProdutoUpdate>).forEach(
      (campo) => {
        if (produtoData[campo] !== produtoOriginal[campo]) {
          camposAlteradosProduto[campo] = produtoData[campo] as never;
        }
      }
    );

    const dadosAtualizadosEstoque: EstoqueUpdate = {
      ...estoqueOriginal,
      ...camposAlteradosEstoque,
      produto_id: estoqueData.produto_id
    };

    const dadosAtualizadosProduto: ProdutoUpdate = {
      ...produtoData,
      ...camposAlteradosProduto
    };

    try {
      let responseEstoque;
      if (Object.keys(camposAlteradosEstoque).length > 0) {
        responseEstoque = await editarEstoque(+id, dadosAtualizadosEstoque);
        if (responseEstoque.errors) {
          setErrors(responseEstoque.errors);
          setInfoMessage(
            'Erro ao atualizar estoque. Verifique os campos destacados.'
          );
          setAbrirAviso(true);
          return;
        }
      }

      let responseProduto;
      if (produtoId && Object.keys(camposAlteradosProduto).length > 0) {
        responseProduto = await editarProduto(
          produtoId,
          dadosAtualizadosProduto
        );
        if (responseProduto.errors) {
          setErrors(responseProduto.errors);
          setInfoMessage(
            'Erro ao atualizar produto. Verifique os campos destacados.'
          );
          setAbrirAviso(true);
          return;
        }
      }
      setInfoMessage('Produto e/ou estoque atualizado(s) com sucesso!');
      setTimeout(() => {
        navigate('/produtos');
      }, 2000);
      setAbrirAviso(true);
      setErrors({});
    } catch (error: any) {
      console.error('Erro ao atualizar produto/estoque:', error);
      setInfoMessage('Erro inesperado. Tente novamente.');
      setAbrirAviso(true);
    }
  };
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };
  const handleCancelar = () => {
    setEstoqueData(estoqueOriginal);
    setTimeout(() => {
      window.history.back();
    }, 2500);
  };
  if (loading || !estoqueData || !produtoData)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  const handleFecharAviso = () => {
    setAbrirAviso(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Editar Produto</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: '100%',
          overflow: 'hidden',
          fontFamily: 'arial',
          paddingTop: '103px'
        }}
      >
        <Navbar />
        <Box sx={stylesEditar.headerProduto}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/126/126089.png"
            alt="Ícone Cliente"
            sx={stylesEditar.headerProdutoImg}
          />
          <Typography sx={stylesEditar.headerProdutoSpan}>
            Produto - Editar
          </Typography>
        </Box>

        <Box sx={stylesEditar.dadosProduto}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="Editar"
            sx={stylesEditar.dadosProdutoImg}
          />
          Dados Produto
        </Box>

        <Box sx={stylesEditar.contPrincipal}>
          <Box sx={stylesEditar.grayContainer}>
            <Box sx={stylesEditar.formContainer}>
              <Box>
                <TextField
                  label="Nome *"
                  variant="outlined"
                  fullWidth
                  name="nome"
                  value={produtoData.nome}
                  onChange={handleMudanca}
                  sx={stylesEditar.formGroup}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '15px',
                  justifyContent: 'space-between'
                }}
              >
                <TextField
                  label="Valor de compra *"
                  variant="outlined"
                  fullWidth
                  name="valor"
                  value={valorCompra}
                  onChange={(e) => {
                    const somenteNumerosEVirgula = e.target.value.replace(
                      /[^\d,]/g,
                      ''
                    );
                    setValorCompra(somenteNumerosEVirgula);
                  }}
                  onBlur={(e) => {
                    const valorStr = e.target.value.replace(',', '.');
                    const valorNum = parseFloat(valorStr);
                    setProdutoData((prev) => ({
                      ...prev!,
                      valor_compra: !isNaN(valorNum) ? valorNum : 0
                    }));
                  }}
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*'
                  }}
                  sx={stylesEditar.formGroup}
                />
                <TextField
                  label="% Lucro desejado *"
                  variant="outlined"
                  fullWidth
                  name="lucro_desejado"
                  value={dadosCalculados.lucro_desejado}
                  onChange={(e) => {
                    const lucroDesejado = e.target.value.trim();
                    setDadosCalculados((prev) => ({
                      ...prev,
                      lucro_desejado: lucroDesejado
                    }));

                    if (produtoId) {
                      localStorage.setItem(
                        `lucro_produto_${produtoId}`,
                        lucroDesejado
                      );
                    }

                    const lucroDesejadoNumber = parseFloat(
                      lucroDesejado.replace(',', '.')
                    );
                    if (!isNaN(lucroDesejadoNumber)) {
                      const valorCompra = produtoData.valor_compra || 0;
                      const novoValorVenda =
                        valorCompra * (1 + lucroDesejadoNumber / 100);
                      setDadosCalculados((prev) => ({
                        ...prev,
                        valor_venda: novoValorVenda
                      }));
                      setEstoqueData((prevState) => ({
                        ...prevState,
                        valor_produto_venda: novoValorVenda
                      }));
                    }
                  }}
                  sx={stylesEditar.formGroup}
                />
                <TextField
                  label="Valor de Venda"
                  variant="outlined"
                  inputProps={{ readOnly: true }}
                  fullWidth
                  name="valor_venda"
                  value={formatarValor(dadosCalculados.valor_venda)}
                  sx={stylesEditar.formGroup}
                />
              </Box>
            </Box>
          </Box>

          {/* Estoque */}
          <Box sx={stylesEditar.boxEstoque}>
            <Typography sx={stylesEditar.estoqueLabel}>Estoque</Typography>
            <Box sx={stylesEditar.grayContEstoque}>
              <Box sx={stylesEditar.inGrayCont}>
                <TextField
                  label="Quantidade mínima"
                  variant="outlined"
                  fullWidth
                  name="quantidade_min"
                  value={estoqueData.quantidade_min}
                  onChange={(e) =>
                    setEstoqueData({
                      ...estoqueData,
                      quantidade_min: parseFloat(e.target.value) || 0
                    })
                  }
                  sx={stylesEditar.formEstoque}
                />
                <TextField
                  label="Quantidade máxima"
                  variant="outlined"
                  fullWidth
                  name="quantidade_max"
                  value={estoqueData.quantidade_max}
                  onChange={(e) =>
                    setEstoqueData({
                      ...estoqueData,
                      quantidade_max: parseFloat(e.target.value) || 0
                    })
                  }
                  sx={stylesEditar.formEstoque}
                />
                <TextField
                  label="Quantidade atual"
                  variant="outlined"
                  fullWidth
                  inputProps={{ readOnly: true }}
                  name="quantidade_atual"
                  value={estoqueData.quantidade_atual}
                  sx={stylesEditar.formEstoque}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={stylesEditar.obsButtons}>
            <Box sx={stylesEditar.boxObs}>
              <Typography sx={stylesEditar.observacoesLabel}>
                Observações
              </Typography>
              <TextField
                multiline
                rows={4}
                name="descricao"
                placeholder="Digite aqui..."
                value={produtoData.descricao}
                onChange={handleMudanca}
                sx={stylesEditar.observacoesInput}
              />
            </Box>
            <Box sx={stylesEditar.buttons}>
              <Button
                variant="contained"
                color="success"
                onClick={handleEnviar}
              >
                Salvar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
        <Snackbar
          open={abrirAviso}
          autoHideDuration={3000}
          onClose={handleFecharAviso}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message={infoMessage}
          ContentProps={{
            sx: {
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '50px',
              bgcolor:
                infoMessage ===
                'Produto e/ou estoque atualizado(s) com sucesso!'
                  ? 'green'
                  : 'red',
              color: 'white',
              textAlign: 'center',
              width: '100%',
              '& .MuiSnackbarContent-message': {
                width: 'inherit',
                textAlign: 'center'
              }
            }
          }}
        />
      </Box>
    </HelmetProvider>
  );
};

export default EditarProduto;
