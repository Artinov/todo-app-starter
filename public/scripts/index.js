var inputText = document.querySelector("#todoText");
var todosList = document.querySelector("#todoList");
var todosLeft = document.querySelector("#todosLeft");
var clearCompleted = document.querySelector("#clearCompleted");
var markAllCompleted = document.querySelector("#markAllCompleted");

var showAll = document.querySelector("#showAll");
var showActive = document.querySelector("#showActive");
var showCompleted = document.querySelector("#showCompleted");

var todoIndexValue = 0;
var globalTodoFilter = null;

var todos = [];

inputText.onkeypress = function(e) {
    if (e.keyCode == 13) {
        todoIndexValue++;

        var id = new Date();
        id = id.toString();
        id = btoa(id);

        var newTodo = {
            text: inputText.value,
            isDone: false,
            index: todoIndexValue,
            id: id
        }


        $.ajax({
            url: "/todo/add",
            method: "POST",
            data: newTodo
        }).then(function(res) {
            console.log(res)

            if (res == true) {
                todos.push(newTodo);
                updateLocalStorage();
                inputText.value = "";
                renderTodos(globalTodoFilter);
                countActiveTodos();
            } else {
                alert("Error when saving todo: " + res)
            }
        })


    }
}

clearCompleted.onclick = function() {
    todos.forEach(function(todo, i) {
        if (todo.isDone == true) {
            var li = document.querySelector("li[todo-index='" + todo.index + "']");
            todosList.removeChild(li);
        }
    });

    todos = todos.filter(function(todo) {
        return todo.isDone == false;
    });

    updateLocalStorage();
}

markAllCompleted.onclick = function() {
    var activeTodos = todos.filter(function(todo) {
        return todo.isDone == false;
    }).length;

    if (activeTodos == 0) {
        todos.forEach(function(todo) {
            changeTodoStatus(todo, "", false);
        });
    } else {
        todos.forEach(function(todo) {
            changeTodoStatus(todo, "todo-done", true);
        });
    }

    countActiveTodos();
}

function changeTodoStatus(todo, liClass, todoState) {
    var li = document.querySelector("li[todo-index='" + todo.index + "']");
    var checkbox = li.querySelector("input");

    todo.isDone = todoState;
    checkbox.checked = todoState;
    li.setAttribute("class", "list-group-item " + liClass);
    updateLocalStorage();
}

showActive.onclick = function() {
    renderTodos(false);
}

showAll.onclick = function() {
    renderTodos(null);
}

showCompleted.onclick = function() {
    renderTodos(true);
}

function renderTodos(todoFilter) {
    highlighButton(todoFilter);
    globalTodoFilter = todoFilter;

    var filteredTodos = todos;
    todosList.innerHTML = "";

    if (todos.length == 0) {
        todosList.innerHTML = "";
        return;
    }

    if (todoFilter != null) {
        todosList.innerHTML = "";
        filteredTodos = filteredTodos.filter(function(todo) {
            return todo.isDone == todoFilter;
        });
    }

    filteredTodos.forEach(function(todo) {
        var todoElementTemplate = document.querySelector("div#hollow li").cloneNode(true);

        todoElementTemplate.querySelector("span").innerText = todo.text;
        todoElementTemplate.setAttribute("todo-index", todo._id)

        if (todo.isDone == true) {
            todoElementTemplate.setAttribute("class", "list-group-item todo-done")
            todoElementTemplate.querySelector("input").checked = true;
        }

        todoElementTemplate.querySelector("input").onchange = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            var todo = todos.filter(function(todo) {
                return todo._id == todoIndex;
            });

            todo = todos.indexOf(todo[0]);
            todo = todos[todo];

            if (e.path[0].checked) {
                todo.isDone = true;
            } else {
                todo.isDone = false;
            }

            $.ajax({
                url: "/todo/update",
                method: "POST",
                data: todo
            }).then(function(res) {
                if (res == true) {
                    if (e.path[0].checked) {
                        li.setAttribute("class", "list-group-item todo-done");
                    } else {
                        li.setAttribute("class", "list-group-item");
                    }
                    countActiveTodos();
                    updateLocalStorage();
                } else {
                    alert(res);
                }
            })


        }
        todoElementTemplate.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            var todo = todos.filter(function(todo) {
                return todo._id == todoIndex;
            });

            $.ajax({
                url: "/todo/delete",
                method: "POST",
                data: todo[0]
            }).then(function(res) {
                if (res == true) {
                    init();
                } else {
                    alert(res);
                }
            })


        }
        todosList.appendChild(todoElementTemplate);
    });
}

function highlighButton(todoFilter) {
    document.querySelectorAll("div.btn-group .btn").forEach(function(button) {
        button.setAttribute("class", "btn btn-default");
    });

    switch (todoFilter) {
        case true:
            showCompleted.setAttribute("class", "btn btn-primary");
            break;
        case false:
            showActive.setAttribute("class", "btn btn-primary");
            break;
        case null:
            showAll.setAttribute("class", "btn btn-primary");
            break;
    }
}

function countActiveTodos() {
    var activeTodos = todos.filter(function(todo) {
        return todo.isDone == false;
    });

    todosLeft.innerText = activeTodos.length;
}

function updateLocalStorage() {
    // localStorage.setItem("todos", JSON.stringify(todos));
}

function init() {
    // var localStorageTodos = localStorage.todos;

    // if (localStorageTodos != undefined) {
    //     todos = JSON.parse(localStorageTodos);
    // }

    $.ajax({
        url: "/todo",
        method: "GET"
    }).then(function(res) {
        todos = res;

        renderTodos(null);
        countActiveTodos();
    })
}

init();