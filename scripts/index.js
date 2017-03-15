var inputText = document.querySelector("#todoText");
var todosList = document.querySelector("#todoList");
var todosLeft = document.querySelector("#todosLeft");
var todos = [];

inputText.onkeypress = function(e) {
    if (e.keyCode == 13) {
        todos.push({
            text: inputText.value,
            isDone: false
        });
        inputText.value = "";
        renderTodos();
    }
}

function renderTodos() {
    var todoElementTemplate = document.querySelector("div li").cloneNode(true);
    
    todos.forEach(function(todo, i){
        todoElementTemplate.querySelector("span").innerText = todo.text;
        todoElementTemplate.setAttribute("todo-index", i)
        todoElementTemplate.querySelector("input").onchange = function(e) {
            console.log(e)
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