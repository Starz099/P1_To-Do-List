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

    newElem.classList.add('item'); // adding css to it.

    document.getElementById('listi').prepend(newElem); // add the new task to the list

    txt.value = "";
}

document.querySelector('.inp').addEventListener('keydown', function (e) {
    if(e.key === "Enter" && document.querySelector('.inp').value != "") {
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