const express = require("express");

const fs = require("fs");

const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./tasks.json";

function readTasks() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, "[]");
    };

    return JSON.parse(fs.readFileSync(FILE_PATH));
};

function writeTasks(task) { 
    fs.writeFileSync(FILE_PATH, JSON.stringify(task, null, 2));
}

// Definição de rotas da API(Endpoints)

// GET /tasks (Lista todas as Tarefas)
app.get("/tasks", (req, res) => {
    res.json(readTasks());
});

// GET /tasks/:id (Buscar por tafera especifica)
app.get("/tasks/id", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id == req.params.id);
    task ? res.json(task) : res.status(404).json({message:"Task not found"});
});

// POST /tasks (Criar uma nova tafera)
app.post("/tasks", (req, res) => {
    const tasks = readTasks();

    const newTask = {
        id: Date.now(),
        title: req.body.title, 
        description: req.body.description || "",
        completed: false
    }
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// PUT /tasks/:id (Atualizar tafera existente)
app.put("/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id == req.params.id);
    if (taskIndex === -1) return res.status(404).json({message: "Task not found"});

    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };

    writeTasks(tasks);
    res.json(tasks[taskIndex]);
})

// DELETE /tasks/:id (Excluir uma tafera)
app.delete("/tasks/:id", (req, res) => {
    let tasks = readTasks()

    tasks = tasks.filter(t => t.id != req.params.id);
    writeTasks(tasks);
    res.status(204).send();
})


app.listen(PORT, () => console.log(`Server Running on http://localhost:${PORT}`))