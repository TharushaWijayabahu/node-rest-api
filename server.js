const { Client } = require("pg")
const express = require("express")
const app = express();
app.use(express.json())

const connectionString = 'postgres://postgres:password@localhost:5432/jobspot';

const client = new Client({
    connectionString: connectionString
    // "user": "postgres",
    // "password": "password",
    // "host": "http://localhost/",
    // "port": 5432,
    // "database": "jobspot"
})

app.get("/todos", async (req, res) => {
    const rows = await readTodos();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
})

app.post("/todos", async (req, res) => {
    let result = {}
    try {

        const reqJson = req.body;
        await createTodo(reqJson.todo)
        result.success = true;
    }
    catch (e) {
        result.success = false;
    }
    finally {
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }

})
app.delete("/todos", async (req, res) => {
    let result = {}
    try {

        const reqJson = req.body;
        await deleteTodo(reqJson.id)
        result.success = true;
    }
    catch (e) {
        result.success = false;
    }
    finally {
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }

})

app.listen(8080, () => console.log("Web server is listening.. on port 8080"))

start()

async function start() {
    await connect();
}

async function connect() {
    try {
        await client.connect();
    }
    catch (e) {
        console.error(`Failed to connect ${e}`)
    }
}

async function readTodos() {
    try {
        const results = await client.query("select id, text from todos");
        return results.rows;
    }
    catch (e) {
        return [];
    }
}

async function createTodo(todoText) {

    try {
        await client.query("insert into todos (text) values ($1)", [todoText]);
        return true
    }
    catch (e) {
        return false;
    }
}



async function deleteTodo(id) {

    try {
        await client.query("delete from todos where id = $1", [id]);
        return true
    }
    catch (e) {
        return false;
    }
}
