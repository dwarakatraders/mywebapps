//Library

dragElement(document.getElementById("libcontainer"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


document.getElementById('btnmyApps').addEventListener('click', () => {
  const dropupMenu = document.getElementById('dropupMenu');
  if (dropupMenu.classList.contains('active')) {
    dropupMenu.classList.remove('active');
    setTimeout(() => {
      dropupMenu.style.display = 'none';
    }, 400); // match this duration to the transition duration
  } else {
    dropupMenu.style.display = 'block';
    setTimeout(() => {
      dropupMenu.classList.add('active');
    }, 10); // small delay to ensure display: block is applied before transition
  }
});

document.addEventListener('click', (event) => {
  const dropupMenu = document.getElementById('dropupMenu');
  const isClickInsideButton = document.getElementById('btnmyApps').contains(event.target);
  const isClickInsideMenu = dropupMenu.contains(event.target);

  if (!isClickInsideButton && !isClickInsideMenu) {
    dropupMenu.classList.remove('active');
    setTimeout(() => {
      dropupMenu.style.display = 'none';
    }, 400); // match this duration to the transition duration
  }
});

function hideFrame() {
  document.getElementById('libcontainer').style.display = 'block';
  document.getElementById('todocontainer').style.display = 'none';
  document.getElementById('calccontainer').style.display = 'none';
}

//To-Do List
dragElement(document.getElementById("todocontainer"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//Calc
//Drag script-->

dragElement(document.getElementById("calccontainer"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function closeOpenApp(x) {
  //  hide the iframe
  if (x == 0) {
    document.getElementById('libcontainer').style.display = 'block';
    document.getElementById('todocontainer').style.display = 'none';
    document.getElementById('calccontainer').style.display = 'none';
  }
  else if (x == 1) {
    document.getElementById('libcontainer').style.display = 'none';

  } else if (x == 2) {
    document.getElementById('todocontainer').style.display = 'block';
    document.getElementById('libcontainer').style.display = 'none';
    document.getElementById('calccontainer').style.display = 'none';
  }
  else if (x == 3) {
    document.getElementById('todocontainer').style.display = 'none';
  }
  else if (x == 4) {
    document.getElementById('calccontainer').style.display = 'block';
    document.getElementById('todocontainer').style.display = 'none';
    document.getElementById('libcontainer').style.display = 'none';
  }
  else if (x == 5) {
    document.getElementById('calccontainer').style.display = 'none';
  }
}