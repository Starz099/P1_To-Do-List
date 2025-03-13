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

function savetask() {
    const txt = document.querySelector('.inp');

    const temp = txt.value;

    if(txt.value == "")
    return;
    
    const newElem = document.createElement('li');

    newElem.textContent = `${temp}`;
    newElem.setAttribute('draggable', 'true');

    newElem.classList.add('item'); // adding css to it.

    document.getElementById('listi').prepend(newElem); // add the new task to the list

    txt.value = "";
}

document.addEventListener("keydown", function (e) {
    let inputField = document.querySelector('.inp'); // only check if inputfield is active in DOM.
    if (inputField && e.key === "Enter" && inputField.value.trim() !== "") {
        savetask();
    }
});

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
});

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
        if (target && target !== draggedItem) {
            const rect = target.getBoundingClientRect(); //retrieves the size and position of the target element. returns an object
            const offset = event.clientY - rect.top; // event.clientY -> Mouse’s Y position when dropped.

            if (offset > rect.height / 2) {
                target.parentNode.insertBefore(draggedItem, target.nextSibling);
            } else {
                target.parentNode.insertBefore(draggedItem, target);
            } // If dropped in the lower half of a task, it goes below. Otherwise, it goes above.
        }
    });
});