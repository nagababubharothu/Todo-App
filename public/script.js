const API = "/api/todos";

let cart = [];
let currentPrice = 0;
let currentProduct = "";

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

function showLogin() {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("todoSection").style.display = "none";
}

function showTodo() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("todoSection").style.display = "block";
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

// SCRAPE
async function scrapeTask() {
    const url = document.getElementById("urlInput").value;

    const res = await fetch("/api/scrape/data?url=" + encodeURIComponent(url));
    const data = await res.json();

    currentPrice = data.price;
    currentProduct = data.title;

    alert(`${data.title} ₹${data.price}`);

    // ADD TODO
    await addTask(data.title);

    // ADD CART
    cart.push({
        product: data.title,
        price: data.price,
        time: new Date().toLocaleString()
    });

    loadTodos();
}

// LOAD TODOS WITH DATE
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

        const date = new Date(todo.createdAt).toLocaleString();
        li.innerText = `${todo.task} (${date})`;

        list.appendChild(li);
    });
}

// PAYMENT
function goToPayment(){
    if (cart.length === 0) {
        alert("Cart empty");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    localStorage.setItem("amount", total);
    localStorage.setItem("cart", JSON.stringify(cart));

    window.location.href = "/payment.html";
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    showLogin();
}