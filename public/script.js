const API = "/api/todos";

// Signup
async function signup(){
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,email,password})
    });

    if(res.ok){
        alert("Signup successful");
        window.location.href="login.html";
    }
}

// Login
async function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    });

    const data = await res.json();

    if(res.ok){
        localStorage.setItem("token", data.token);
        window.location.href="dashboard.html";
    }else{
        alert(data.message);
    }
}

// Add task
async function addTask(){
    const task = document.getElementById("taskInput").value;

    await fetch(API,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": localStorage.getItem("token")
        },
        body:JSON.stringify({task})
    });

    loadTodos();
}

// Load todos
async function loadTodos(){
    const res = await fetch(API,{
        headers:{
            "Authorization": localStorage.getItem("token")
        }
    });

    const todos = await res.json();

    const list = document.getElementById("todoList");
    if(!list) return;

    list.innerHTML="";

    todos.forEach(todo=>{
        const li = document.createElement("li");
        li.innerText = todo.task;

        const btn = document.createElement("button");
        btn.innerText="Delete";

        btn.onclick = async ()=>{
            await fetch(API+"/"+todo._id,{
                method:"DELETE",
                headers:{
                    "Authorization": localStorage.getItem("token")
                }
            });
            loadTodos();
        };

        li.appendChild(btn);
        list.appendChild(li);
    });
}

// Logout
function logout(){
    localStorage.removeItem("token");
    window.location.href="login.html";
}

loadTodos();