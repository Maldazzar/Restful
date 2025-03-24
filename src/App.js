import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, themes } from "./themes";
import axios from "axios";
import './App.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://backend-aula.vercel.app/app/login", {
        usuario: email,
        senha: senha
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        onLogin(email);
      } else {
        window.alert("Login falhou. Verifique suas credenciais.");
      }
    } catch (err) {
      window.alert("Erro no login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Agenda Pessoal</h1>
      <h2>Área Login</h2>
      <p className="subtitle">Entre com suas credenciais</p>
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Digite sua senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={handleLogin} className="button" disabled={loading}>
        {loading ? "Entrando..." : "Login"}
      </button>
      <p>
        Não tem uma conta?{" "}
        <button onClick={onSwitchToRegister} className="register-link">
          Registre-se
        </button>
      </p>
    </div>
  );
};

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
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
        usuario: email,
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
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Digite sua senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <input
        type="password"
        placeholder="Digite novamente a sua senha"
        value={confirmSenha}
        onChange={(e) => setConfirmSenha(e.target.value)}
      />
      <button onClick={handleRegister} className="button" disabled={loading}>
        {loading ? "Registrando..." : "Registrar"}
      </button>
      <button className="back-button" onClick={onSwitchToLogin}>Voltar</button>
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState(""); // Estado para controlar qual formulário exibir
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [idEditing, setIdEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === "listar") {
      fetchTasks();
    }
  }, [view]);

  // Função para buscar tarefas
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError("Erro ao buscar tarefas.");
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setIdEditing(null);
    setError("");
  };

  const handleAddClick = () => {
    setView("adicionar");
    clearForm();
  };

  const handleListClick = () => {
    setView("listar");
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setIdEditing(task._id);
    setView("adicionar");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      setError("Erro ao deletar tarefa.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = {
      title,
      description,
      dueDate,
      priority,
    };

    try {
      if (idEditing) {
        await axios.put(`http://localhost:5000/tasks/${idEditing}`, task);
      } else {
        await axios.post('http://localhost:5000/tasks', task);
      }
      fetchTasks();
      setView("listar");
    } catch (err) {
      console.error("Erro ao salvar tarefa:", err);
      setError("Erro ao salvar tarefa.");
    }
  };

  return (
    <div className="container">
      {view === "" ? (
        <>
          <button onClick={handleAddClick} className="button">Adicionar Tarefa</button>
          <button onClick={handleListClick} className="button">Listar Tarefas</button>
        </>
      ) : view === "listar" ? (
        <>
          <h2>Lista de Tarefas</h2>
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Data de Vencimento: {task.dueDate}</p>
              <p>Prioridade: {task.priority}</p>
              <button onClick={() => handleEdit(task)}>Editar</button>
              <button onClick={() => handleDelete(task._id)}>Deletar</button>
            </div>
          ))}
          <button onClick={handleAddClick} className="button">Adicionar Tarefa</button>
        </>
      ) : (
        <>
          <h2>{idEditing ? "Editar Tarefa" : "Adicionar Tarefa"}</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              placeholder="Data de Vencimento"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Prioridade"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
            <button type="submit" className="button">{idEditing ? "Salvar" : "Adicionar"}</button>
          </form>
          <button className="back-button" onClick={handleListClick}>Voltar</button>
        </>
      )}
    </div>
  );
};

const Calculator = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    if (isNaN(number1) || isNaN(number2)) {
      setResult("Por favor, insira números válidos.");
      return;
    }

    let res;
    switch (operation) {
      case "add":
        res = number1 + number2;
        break;
      case "subtract":
        res = number1 - number2;
        break;
      case "multiply":
        res = number1 * number2;
        break;
      case "divide":
        if (number2 === 0) {
          setResult("Não é possível dividir por zero.");
          return;
        }
        res = number1 / number2;
        break;
      default:
        res = "Operação inválida.";
    }
    setResult(res);
  };

  return (
    <div className="calculator">
      <h2>Calculadora</h2>
      <input
        type="number"
        placeholder="Número 1"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
      />
      <input
        type="number"
        placeholder="Número 2"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
      />
      <select value={operation} onChange={(e) => setOperation(e.target.value)}>
        <option value="add">Somar</option>
        <option value="subtract">Subtrair</option>
        <option value="multiply">Multiplicar</option>
        <option value="divide">Dividir</option>
      </select>
      <button onClick={handleCalculate} className="button">Calcular</button>
      {result !== null && <p>Resultado: {result}</p>}
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [theme, setTheme] = useState("dark");

  const handleLogin = (email) => {
    setIsLoggedIn(true);
  };

  const handleSwitchToRegister = () => {
    setIsRegistering(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegistering(false);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />
      <div>
        <button className="theme-toggle-button" onClick={toggleTheme}>Alterar Tema</button>
        {isLoggedIn ? (
          <>
            <Calculator />
            <Tasks />
          </>
        ) : (
          isRegistering ? (
            <Register onRegister={handleSwitchToLogin} onSwitchToLogin={handleSwitchToLogin} />
          ) : (
            <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
          )
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;