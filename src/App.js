import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [ra, setRA] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://backend-aula.vercel.app/app/login", {
        usuario: ra,
        senha: senha
      });

        if (response.data.token) {
            // Armazena o token no localStorage
            localStorage.setItem("token", response.data.token);
            onLogin(ra);
        } else {
            setError("Login falhou. Verifique suas credenciais.");
        }
    } catch (err) {
      setError("Erro no login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
            type="text"
            placeholder="RA"
            value={ra}
            onChange={(e) => setRA(e.target.value)}
        />
        <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Login"}
        </button>
        <p>
          Não tem uma conta? <button onClick={onSwitchToRegister}>Registrar-se</button>
        </p>
      </div>
  );
};

const Register = ({ onRegister }) => {
  const [ra, setRA] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    if (senha !== confirmSenha) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://backend-aula.vercel.app/app/registrar", {
        usuario: ra,
        senha: senha,
        confirma: confirmSenha
      });

        console.log("Resposta da API:", response.data);

      if (response.data._id) {
        onRegister();
      } else {
        setError(response.data.error || "Erro no registro.");
      }
    } catch (err) {
      setError("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <h2>Registro</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
            type="text"
            placeholder="RA"
            value={ra}
            onChange={(e) => setRA(e.target.value)}
        />
        <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
        />
        <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
        />
        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </div>
  );
};

const Products = () => {
    const [produtos, setProdutos] = useState([]);
    const [nome, setNome] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [preco, setPreco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");
    const [idEditando, setIdEditando] = useState(null);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token"); // Supondo que o token esteja armazenado no localStorage

    // Função para buscar produtos
    const fetchProdutos = async () => {
        try {
            const response = await axios.get("https://backend-aula.vercel.app/app/produtos", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProdutos(response.data);
        } catch (err) {
            console.error("Erro ao buscar produtos:", err);
            setError("Erro ao buscar produtos.");
        }
    };

    // Função para adicionar ou editar produto
    const handleSubmit = async (e) => {
        e.preventDefault();
        const produtoData = {
            nome,
            quantidade: Number(quantidade),
            preco: Number(preco),
            descricao,
            imagem,
        };

        try {
            if (idEditando) {
                // Atualiza produto
                const response = await axios.put("https://backend-aula.vercel.app/app/produtos", {
                    id: idEditando,
                    ...produtoData,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Verifica se produtos é um array antes de mapear
                setProdutos(prevProdutos =>
                    Array.isArray(prevProdutos) ? prevProdutos.map(p => (p._id === idEditando ? response.data : p)) : []
                );
            } else {
                // Adiciona novo produto
                const response = await axios.post("https://backend-aula.vercel.app/app/produtos", produtoData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProdutos(prevProdutos =>
                    Array.isArray(prevProdutos) ? [...prevProdutos, response.data] : [response.data]
                );
            }
            // Limpa os campos
            clearForm();
        } catch (err) {
            console.error("Erro ao salvar produto:", err);
            setError(err.response?.data?.error || "Erro ao salvar produto.");
        }
    };

    // Função para excluir produto
    const handleDelete = async (id) => {
        try {
            await axios.delete("https://backend-aula.vercel.app/app/produtos", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { id },
            });
            setProdutos(produtos.filter(produto => produto._id !== id));
        } catch (err) {
            console.error("Erro ao excluir produto:", err);
            setError(err.response?.data?.error || "Erro ao excluir produto.");
        }
    };

    const clearForm = () => {
        setNome("");
        setQuantidade("");
        setPreco("");
        setDescricao("");
        setImagem("");
        setIdEditando(null);
        setError("");
    };

    return (
        <div className="container">
            <h2>Produtos</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Formulário de Adicionar/Editar Produto */}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                <input type="number" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
                <input type="number" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} required />
                <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
                <input type="text" placeholder="Imagem" value={imagem} onChange={(e) => setImagem(e.target.value)} required />
                <button type="submit">{idEditando ? "Editar Produto" : "Adicionar Produto"}</button>
                <button type="button" onClick={clearForm}>Limpar</button>
            </form>

            <div className="button-container">
                <button onClick={fetchProdutos}>Listar Produtos</button>
                {produtos.length > 0 && (
                    <>
                        <h3>Produtos Cadastrados:</h3>
                        <ul>
                            {produtos.map((produto) => (
                                <li key={produto._id}>
                                    <p>{produto.nome} - {produto.quantidade} - R$ {produto.preco} - {produto.descricao}</p>
                                    <button onClick={() => {
                                        setNome(produto.nome);
                                        setQuantidade(produto.quantidade);
                                        setPreco(produto.preco);
                                        setDescricao(produto.descricao);
                                        setImagem(produto.imagem);
                                        setIdEditando(produto._id);
                                    }}>Editar</button>
                                    <button onClick={() => handleDelete(produto._id)}>Excluir</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [ra, setRA] = useState(null);

  const handleLogin = (ra) => {
    setRA(ra);
    setIsLoggedIn(true);
  };

  const handleSwitchToRegister = () => {
    setIsRegistering(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegistering(false);
  };

  return (
      <div>
        {isLoggedIn ? (
            <Products />
        ) : (
            isRegistering ? (
                <Register onRegister={handleSwitchToLogin} />
            ) : (
                <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
            )
        )}
      </div>
  );
}

export default App;
