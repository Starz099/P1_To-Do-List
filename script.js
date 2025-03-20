//showing the pop-up to add task
function showHide() {
    const inpp = document.querySelector('.inp'); // Selects the first element with class 'inp'
    const conf = document.querySelector('.confirm');
    if (inpp) {
        inpp.style.display = inpp.style.display === 'none' ? 'block' : 'none';
        conf.style.display = conf.style.display === 'none' ? 'block' : 'none';

        if(inpp.style.display === 'block')
        inpp.focus();

    }
    const txt = document.querySelector('.inp');

    if(txt.value != "") {
        txt.value = "";
    }
}

//saving the task in list
function savetask() {
    const txt = document.querySelector('.inp');

    const temp = txt.value;

    if(temp.trim() === "")
    return;
    
    const newElem = createTaskElement(temp);

    newElem.setAttribute('draggable', 'true');

    document.getElementById('listi').prepend(newElem); // add the new task to the list
    saveTasksToLocalStorage();
    txt.value = "";
}

//creating new tasks for list
function createTaskElement(taskText) {
    let li = document.createElement("li");
    li.classList.add("item");
    li.draggable = true;
    li.textContent = taskText;

    //options bar
    let optionBar = document.createElement("div");
    optionBar.classList.add("options");

    // Edit button
    let editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "✏️";
    editBtn.setAttribute('title', 'edit');

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "❌";
    deleteBtn.setAttribute('title', 'delete');

    // Append elements
    li.appendChild(optionBar);
    optionBar.appendChild(editBtn);
    optionBar.appendChild(deleteBtn);

    return li;
}

//options functionality
if(document.getElementById('listi')) {
    document.getElementById('listi').addEventListener('click', function (event) {
        let target = event.target;

        // edit button
        if(target.classList.contains("edit-btn")) {
            let Task = target.parentElement.parentElement; // The <li> element
            let taskText = Task.firstChild; // The text node

            // Create an input field
            let input = document.createElement("input");
            input.type = "text";
            input.value = taskText.textContent.trim();
            input.classList.add("edit-input"); // For styling

            // Replace text with input field
            Task.replaceChild(input, taskText);
            input.focus(); // Auto-focus the input

            // Handle saving on blur (click outside) or Enter key
            function saveTask() {
                let newText = input.value.trim();
                if (newText !== "") {
                    let newTextNode = document.createTextNode(newText);
                    Task.replaceChild(newTextNode, input); // Replace input with updated text
                } else {
                    Task.replaceChild(taskText, input); // Restore old text if empty
                }
                saveTasksToLocalStorage();
            }

            input.addEventListener("blur", saveTask); // Save when clicking outside
            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    saveTask();
                }
            });
        }

        // delete button
        if(target.classList.contains("delete-btn")) {
            let ops = target.parentElement;
            ops.parentElement.remove();
            saveTasksToLocalStorage();
        }
    });
}

//adding elements
document.addEventListener("keydown", function (e) {
    let inputField = document.querySelector('.inp'); // only check if inputfield is active in DOM.
    if (inputField && e.key === "Enter" && inputField.value.trim() !== "") {
        savetask();
    }
});

// marking task as completed
if(document.getElementById("listi")) {
    document.getElementById("listi").addEventListener('click', (event) => {
        if (event.target.tagName === "LI") {
            let task = event.target;
            
            if (task.classList.contains("completed")) {
                // Task is completed → Mark it as pending again (move to top)
                task.classList.remove("completed");
                task.parentNode.prepend(task); // Move to the top
            } else {
                // Task is pending → Mark it as completed (move to bottom)
                task.classList.add("completed");
                task.parentNode.appendChild(task); // Move to the bottom
            }
        }
        saveTasksToLocalStorage();
    });
}

// drag and shuffle list logic
document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("listi");

    let draggedItem = null; // Stores the item being dragged

    // Handle drag start
    document.addEventListener("dragstart", function (event) {
        if (event.target.tagName === "LI") {
            draggedItem = event.target;
            event.target.classList.add("dragging");
            event.dataTransfer.effectAllowed = "move"; // This tells the browser that the dragged item should be moved, not copied or linked.
        }
    });

    // Handle drag end
    document.addEventListener("dragend", function (event) {
        if (event.target.tagName === "LI") {
            event.target.classList.remove("dragging");
            draggedItem = null;
        }
    });

    // Allow dropping by preventing default behavior
    list.addEventListener("dragover", function (event) {
        event.preventDefault(); // this is required, or else the browser won't allow dropping by default.
    });

    // Handle drop logic
    list.addEventListener("drop", function (event) {
        event.preventDefault();

        let target = event.target;
        // If the user drops it on something else (like empty space), it prevents errors.
        while (target && target.nodeName !== "LI") {
            target = target.parentElement;
        }

        // check if the position should be changed or not
        if((draggedItem.classList.contains('completed') && target.classList.contains('completed')) || (!draggedItem.classList.contains('completed') && !target.classList.contains('completed')))
        {
            if (target && target !== draggedItem) {
                const rect = target.getBoundingClientRect(); //retrieves the size and position of the target element. returns an object
                const offset = event.clientY - rect.top; // event.clientY -> Mouse’s Y position when dropped.

                if (offset > rect.height / 2) {
                    target.parentNode.insertBefore(draggedItem, target.nextSibling);
                } else {
                    target.parentNode.insertBefore(draggedItem, target);
                } // If dropped in the lower half of a task, it goes below. Otherwise, it goes above.
            }
        }

        //Save new order after drag is completed
        saveTasksToLocalStorage();
    });
});

// to update the local storage
function saveTasksToLocalStorage() {
    let tasks = [];
    document.querySelectorAll('.item').forEach(task => {
        tasks.push({
            text: task.firstChild.textContent.trim(),  // Extract task text
            completed: task.classList.contains('completed') // Check completion status
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks)); // Store as JSON string
}

// to load tasks from local storage
function loadTasksFromLocalStorage() {
    let storedTasks = localStorage.getItem('tasks'); // Get stored data
    if (storedTasks) {
        let tasks = JSON.parse(storedTasks); // Convert back to array

        clearTaskList(); // Clears the task list before adding new ones

        tasks.forEach(task => {
            let taskElement = createTaskElement(task.text);
            if (task.completed) {
                taskElement.classList.add('completed'); // Mark completed tasks
            }
            document.querySelector('#listi').append(taskElement); // here append will not change the desired order because the data is already stored in correct 
        });
    }
}   

// to clear task list before addding new ones.
function clearTaskList() {
  document.querySelector("#listi").replaceChildren();
}

// to load the existing tasks even after refresh
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);