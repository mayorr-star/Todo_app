const darkLightModeBtns = document.querySelectorAll("#dark-light-mode");
const todoInput = document.getElementById("text");
const clearbtn = document.getElementById("clear-btn");
const todosLeft = document.querySelector(".items_num");
const filterButtons = document.querySelectorAll("#filter-btn");
const todosWrapper = document.querySelector(".todos");
const numOfTodos = document.querySelectorAll(".items_num");
const todoContainer = document.getElementById("todo_app");
//Enter overriding the classlist

const TODOS = []; // Array of objects to store the various tasks

function addTodo(task, status) {
    TODOS.push({task, status})
}

todoInput.addEventListener("keypress", (e) => {
    const inputValue = e.currentTarget.value.trim();
    if (e.key === "Enter" && inputValue !== "" && isNaN(inputValue) ) {
        e.currentTarget.value = "";
        addTodo(inputValue, "active"); // add new todo to the TODOS array
        updateTodoList(TODOS);  // update todo list when I the press enter key
    }
})

function updateTodoList(todosArray) {
    const todoItems = todosArray.map(currentTask => {
        return `<div class="todo">
        <div class="task-container">
        <div class="task">
        <button class="check"><img src="./images/icon-check.svg" alt="icon-check" class="icon-check"></button>
        <p class="todo-item">${currentTask.task}</p>
        </div>
        <button class="cross-btn"><img src="./images/icon-cross.svg" alt="icon-cross"></button>
        </div>
        <div class="border"></div>
        </div>`
    }).join("");
    todosWrapper.innerHTML = todoItems;
    localStorage.setItem("Todos", JSON.stringify(todosArray));
    const checkButton = document.querySelectorAll(".check");
    const deleteTodoBtn = document.querySelectorAll(".cross-btn");
    updateNumberOfItems(numOfTodos, TODOS.length)
    markAsComplete(checkButton)
    deleteTask(deleteTodoBtn)
}
const todosFromLocalStorage = JSON.parse(localStorage.getItem("Todos")); // getting items for local storage
window.addEventListener("DOMContentLoaded", () => {
    updateNumberOfItems(numOfTodos, TODOS.length)
    return todosFromLocalStorage === null ? null : updateTodoList(todosFromLocalStorage)
})

function deleteTask(deletebuttons) {
    deletebuttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            TODOS.splice(index, 1);
            updateTodoList(TODOS)
        })
    })
}

function markAsComplete(todoItem) {
    let count = TODOS.length;
    todoItem.forEach((item, index) => {
        item.addEventListener("click",(e) => {
            const parent = e.currentTarget.parentNode.parentNode.parentNode;
            parent.classList.toggle("completed");
            if (parent.classList.contains("completed")) {
                TODOS[index].status = "completed";
                count--;
            } else {
                TODOS[index].status = "active";
                count++;
            }
            updateNumberOfItems(numOfTodos, count);
        })
    })
}

function updateNumberOfItems(element, itemsLeft) {
    element.forEach(elem => {
        elem.textContent = `${itemsLeft} ${itemsLeft === 1 ? `item` : `items`} left`;
    })
}

filterButtons.forEach((filterButton, index) => {
    filterButton.addEventListener("click", (e) => {
        const clickedButtonId = e.currentTarget.dataset.id;
        if (!e.currentTarget.classList.contains("current")) {
            e.currentTarget.classList.add("current");
        }
        for (let i = 0; i < filterButtons.length; i++) {
            if (i !== index && filterButtons[i].classList.contains("current")) {
                filterButtons[i].classList.remove("current")
            }
        }
        const filteredTasks = TODOS.filter(task => {
            if (task.status === clickedButtonId) {
                return task;
            }
        })
        if (clickedButtonId === "all") {
            updateTodoList(TODOS)
            updateNumberOfItems(TODOS, numOfTodos);
        } else {
            updateTodoList(filteredTasks)
            updateNumberOfItems(filteredTasks, numOfTodos);
        }
    })
})

clearbtn.addEventListener("click",() => clearCompletedTodos())
function clearCompletedTodos() {
    const indexToRemove = [];
    let removed = 0;
    for (let i = 0; i < TODOS.length; i++) {
        if (TODOS[i].status === "completed") {
            indexToRemove.push(i)
        }
    }
    for (let index of indexToRemove) {
        TODOS.splice(index - removed, 1)
        removed++
    }
    updateTodoList(TODOS)
}

darkLightModeBtns.forEach(button => {
    button.addEventListener("click", () => {
        todoContainer.classList.toggle("display-mode");
    })
})
