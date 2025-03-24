const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;
const tasksFilePath = path.join(__dirname, 'tasks.json');

app.use(bodyParser.json());
app.use(cors());

// Função para ler as tarefas do arquivo JSON
const readTasks = () => {
  const data = fs.readFileSync(tasksFilePath, 'utf8');
  return JSON.parse(data);
};

// Função para escrever as tarefas no arquivo JSON
const writeTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
};

// Rota para obter todas as tarefas
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = req.body;
  newTask._id = Date.now().toString(); // Gerar um ID simples
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// Rota para atualizar uma tarefa existente
app.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const updatedTask = req.body;
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex((task) => task._id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Tarefa não encontrada' });
  }
});

// Rota para deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskId = req.params.id;
  const newTasks = tasks.filter((task) => task._id !== taskId);

  if (newTasks.length !== tasks.length) {
    writeTasks(newTasks);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Tarefa não encontrada' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});