const API = "/api/todos";

// ON LOAD
window.onload = function () {
    const token = localStorage.getItem("token");

    if (token) {
        showTodo();
        loadTodos();
    } else {
        showLogin();
    }
};

// SHOW LOGIN
function showLogin() {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("todoSection").style.display = "none";
}

// SHOW TODO
function showTodo() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("todoSection").style.display = "block";
}

// SIGNUP
async function signup() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await fetch("/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password})
    });

    alert("Signup successful");
    window.location.href = "login.html";
}

// LOGIN
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("token", data.token);
        showTodo();
        loadTodos();
    } else {
        alert(data.message);
    }
}

// ADD TASK
async function addTask() {
    const task = document.getElementById("taskInput").value;

    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({task})
    });

    loadTodos();
}

// SCRAPE TASK
async function scrapeTask() {
    const url = document.getElementById("urlInput").value;

    const res = await fetch("/api/scrape/data?url=" + url);
    const data = await res.json();

    alert("Scraped: " + data[0]);

    // add first scraped item as todo
    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({task: data[0]})
    });

    loadTodos();
}

// LOAD TODOS
async function loadTodos() {
    const res = await fetch(API, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    });

    const todos = await res.json();

    const list = document.getElementById("todoList");
    list.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.innerText = todo.task;

        const btn = document.createElement("button");
        btn.innerText = "❌";
        btn.classList.add("delete");

        btn.onclick = async () => {
            await fetch(API + "/" + todo._id, {
                method: "DELETE",
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            loadTodos();
        };

        li.appendChild(btn);
        list.appendChild(li);
    });
}

// PAYMENT NAVIGATION
function goToPayment(){
    window.location.href = "/payment.html";
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    showLogin();
}