var inputText = document.querySelector("#todoText");
var todosList = document.querySelector("#todoList");
var todosLeft = document.querySelector("#todosLeft");
var clearCompleted = document.querySelector("#clearCompleted");

var todos = [
    {
        text: "first todo",
        isDone: false
    }
];

inputText.onkeypress = function(e) {
    if (e.keyCode == 13) {
        todos.push({
            text: inputText.value,
            isDone: false
        });
        inputText.value = "";
        renderTodos();
        countActiveTodos();
    }
}

clearCompleted.onclick = function() {
    todos.forEach(function(todo, i) {
        if(todo.isDone == true) {
            var li = document.querySelector("li[todo-index='" + i + "']");
            todos.splice(i, 1);
            todosList.removeChild(li);
        }
    });
}

function renderTodos() {
    var todoElementTemplate = document.querySelector("div li").cloneNode(true);
    
    if(todos.length == 0) {
        todosList.innerHTML = "";
        return;
    }

    todos.forEach(function(todo, i){
        todoElementTemplate.querySelector("span").innerText = todo.text;
        todoElementTemplate.setAttribute("todo-index", i)
        todoElementTemplate.querySelector("input").onchange = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            var todo = todos[todoIndex];

            if(e.path[0].checked) {
                li.setAttribute("class","todo-done");
                todo.isDone = true;
            } else {
                li.setAttribute("class","");
                todo.isDone = false;
            }
            countActiveTodos();
        }
        todoElementTemplate.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            todos.splice(todoIndex, 1);

            todosList.removeChild(li);
            // renderTodos();
            countActiveTodos();
        }
        todosList.appendChild(todoElementTemplate);
    });
}

function countActiveTodos() {
    var activeTodos = todos.filter(function(todo){
        return todo.isDone == false;
    });

    todosLeft.innerText = activeTodos.length;
}

renderTodos();
countActiveTodos();