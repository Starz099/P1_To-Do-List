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
    // const textPart = newElem.createElement('div');
    // const removePart = newElem.createElement('div');

    newElem.textContent = `${temp}`;

    newElem.classList.add('item'); // adding css to it.

    document.getElementById('listi').prepend(newElem);

    txt.value = "";

    // showHide();
}

if(document.querySelector('.inp'))
document.querySelector('.inp').addEventListener('keydown', function (e) {
    if(e.key === "Enter" && document.querySelector('.inp').value != "") {
        savetask();
    }
});

document.getElementById('listi').addEventListener('click', (e) => {
    if (e.target.classList.contains('item')) {
        if(e.target.style.textDecoration != "line-through") {
            e.target.style.textDecoration = "line-through";
            e.target.style.backgroundColor = "#3c4458";
        } else {
            e.target.style.textDecoration = "none";
            e.target.style.backgroundColor = "#3e5c76";
        }
    }
});