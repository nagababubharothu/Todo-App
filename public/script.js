const API = "/api/todos";

let cart = [];

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
async function addTask(taskInputValue = null) {
    const task = taskInputValue || document.getElementById("taskInput").value;

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

// SCRAPE TASK + ADD TO CART
async function scrapeTask() {
    const url = document.getElementById("urlInput").value;

    if (!url) {
        alert("Please enter a URL");
        return;
    }

    const res = await fetch("/api/scrape/data?url=" + encodeURIComponent(url));
    const data = await res.json();

    alert(`Scraped: ${data.title} ₹${data.price}`);

    // add todo
    await addTask(data.title);

    // add to cart
    cart.push({
        product: data.title,
        price: data.price,
        time: new Date().toLocaleString()
    });

    loadTodos();
}

// LOAD TODOS WITH DELETE BUTTON + DATE
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

        // DELETE BUTTON
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

// PAYMENT
function goToPayment(){
    if (cart.length === 0) {
        alert("Cart is empty");
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