(async function () {
    const data = await fetch("todos.json");
    const res = await data.json();
    const todoListdiv = document.getElementById("divtodolist");
    const openbutton = document.getElementById("btnopen");
    const allbutton = document.getElementById("btnall");
    const compbutton = document.getElementById("btncomp");
    const addbutton = document.getElementById("btnadd");
    const txttodo = document.getElementById("txtTodo");        
    const ddassignto = document.getElementById("ddassignto");
    const tasktooltip = document.getElementById('taskTooltip');
    const addTodoForm = document.getElementById("addform");
    const chkslide = document.getElementById("chkSlide");
    let typeSelected = 'All';
    let todos = res;
    const itemsPerPage = 3;
    let currentPage = 1;

    //alert(chkslide.checked);
    chkslide.addEventListener("click", (e) => {
        if (chkslide.checked) {
            document.getElementById('swithText').textContent = 'Swith to List View:';
        }
        else {
            document.getElementById('swithText').textContent = 'Swith to Details View:';
        }
        renderTodos(typeSelected, currentPage);;
    });

    addbutton.addEventListener("click", (e) => {

        if (!txttodo.checkValidity()) {
            txttodo.classList.add('invalid');
            tasktooltip.classList.add('show');
            e.preventDefault(); // Prevent form submission
        } else {
            txttodo.classList.remove('invalid');
            tasktooltip.classList.remove('show');

            let newId = todos.Todos.length > 0 ? Math.max(...todos.Todos.map(todo => todo.id)) + 1 : 1;
            const formData = new FormData(addTodoForm);
            //const values = [...formData.entries()];
            const task = formData.get('task');
            const assignto = formData.get('assignto');
            if (task) {
                let toDoData = {
                    task: task,
                    id: newId,
                    status: "Open",                        
                    assignto: assignto,
                    createdon: formatDate(new Date()),
                    completedon: ""
                };
                todos.Todos.push(toDoData);
                addTodoForm.reset();

                currentPage = 1;
                renderTodos(typeSelected, currentPage);
            }
        }

    });

    // Event listener for the delete action using event delegation
    todoListdiv.addEventListener("click", function (event) {
        if (event.target.classList.contains('delete')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            deleteToDo(id);
        }
    });

    // Event listener for the update action using event delegation
    todoListdiv.addEventListener("click", function (event) {
        if (event.target.type === 'checkbox') {
            const id = parseInt(event.target.getAttribute('data-id'));
            updateToDo(id, event.target);
        }
    });

    function renderTodos(type, page) {
        todoListdiv.innerHTML = "";
        let count = 0;
        let filltertodo = '';
        todos.Todos.sort((a, b) => parseDate(b.createdon) - parseDate(a.createdon));
        typeSelected = type;
        if (type == 'All') {

            filltertodo = todos.Todos;
        }
        else {
            filltertodo = todos.Todos.filter(element => element.status == type);
        }
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;
        const paginatedTodos = filltertodo.slice(startIndex, endIndex);

        var todolist = '<table class="table-todo">'
        if (paginatedTodos.length > 0) {
            todolist += '<tr><td colspan="2"></td></tr>'
            paginatedTodos.forEach((todo) => {
                count++;
                if (chkslide.checked) {
                    todolist += '<tr><td class="pad-left-30' + (todo.status == "Completed" ? ' strike-out' : '') + ' ">' + todo.task + '</td><td class="pad-left-5"><i class="fa fa-trash-o delete" data-id="' + todo.id + '"></i></td></tr><tr><td class="pad-left-30" colspan="2">Status: ' + todo.status + '</td></tr><tr><td class="pad-left-30" colspan="2">Assign to: ' + todo.assignto + '</td></tr><tr><td class="pad-left-30">Created On: ' + todo.createdon + '</td><td class="pad-right-15"><input  type="checkbox"' + (todo.status == "Completed" ? ' checked' : '') + ' data-id="' + todo.id + '" ></td></tr>'+(todo.status == "Completed"?('<tr><td colspan="2" class="pad-left-30"> Completed On: '+todo.completedon + '</td></tr>'):'');
                }
                else {
                    todolist += '<tr><td class="pad-left-30' + (todo.status == "Completed" ? ' strike-out' : '') + ' ">' + todo.task + '</td><td class="pad-left-5"><i class="fa fa-trash-o delete" data-id="' + todo.id + '"></i></td></tr><tr><td colspan="2" class="pad-left-30">' + todo.status + '</td></tr>';
                }
                //console.log(todolist);
                if (count != paginatedTodos.length) {
                    todolist += '<tr><td colspan="2"><hr></td></tr>'
                }
                else {
                    todolist += '<tr><td colspan="2" class="pad-zero"></td></tr>'
                }
            });
        }
        else {
            todolist += '<tr><td >Nothing is on your to-do list. Nice work!</td></tr>';
        }
        todoListdiv.innerHTML = todolist;
        document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${Math.ceil(filltertodo.length / itemsPerPage)}`;
    };

    allbutton.addEventListener("click", () => {
        openbutton.className = openbutton.className.replace(" active", "");
        compbutton.className = compbutton.className.replace(" active", "");
        allbutton.className = allbutton.className.includes(" active") ? allbutton.className : allbutton.className + " active";
        typeSelected = 'All';
        currentPage=1;
        renderTodos('All', currentPage);
    });
    openbutton.addEventListener("click", () => {
        allbutton.className = allbutton.className.replace(" active", "");
        compbutton.className = compbutton.className.replace(" active", "");
        openbutton.className = openbutton.className.includes(" active") ? openbutton.className : openbutton.className + " active";
        typeSelected = 'Open';
        currentPage=1;
        renderTodos('Open', currentPage);
    });
    compbutton.addEventListener("click", () => {
        allbutton.className = allbutton.className.replace(" active", "");
        openbutton.className = openbutton.className.replace(" active", "");
        compbutton.className = compbutton.className.includes(" active") ? compbutton.className : compbutton.className + " active";
        typeSelected = 'Completed';
        currentPage=1;
        renderTodos('Completed', currentPage);
    });

    function showNextPage() {
        let fillteredlist=typeSelected=='All'? todos.Todos : todos.Todos.filter(element => element.status == typeSelected);
        if (currentPage < Math.ceil(fillteredlist.length / itemsPerPage)) {
            currentPage++;
            renderTodos(typeSelected, currentPage);
        }
    }

    function showPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderTodos(typeSelected, currentPage);
        }
    }

    document.getElementById('nextButton').addEventListener('click', showNextPage);
    document.getElementById('prevButton').addEventListener('click', showPrevPage);

    // allbutton.className="buttonAll allbutton active";
    renderTodos('All', currentPage);


    function deleteToDo(id) {
        var result = confirm("Are you sure you want to delete this task?");
        if (result) {
            // Find the index of the todo item to delete
            var indexToDelete = todos.Todos.findIndex(todo => todo.id === id);
            if (indexToDelete !== -1) {
                // Delete the item
                todos.Todos.splice(indexToDelete, 1);

                // Calculate the number of items on the current page
                const itemsOnCurrentPage = todos.Todos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length;

                // If the current page is empty after deletion, move to the previous page
                if (itemsOnCurrentPage === 0 && currentPage > 1) {
                    currentPage--;
                }
                renderTodos(typeSelected, currentPage);
            }
        }
    }

    function updateToDo(id, ele) {
        var result = "";
        if (!ele.checked) {
            result = confirm("Are you sure? you want to reopen this Task ?");
        }
        else {
            result = confirm("Are you sure? Do you completed this Task ?");
        }
        if (result) {
            let i = todos.Todos.length;
            while (i--) {
                if (todos.Todos[i]['id'] == id) {
                    todos.Todos[i].status = (todos.Todos[i].status == "Completed" ? "Open" : "Completed");
                    todos.Todos[i].completedon = (todos.Todos[i].status == "Completed" ? formatDate(new Date()) : "");
                    break;
                }
            }
        }
        renderTodos(typeSelected, currentPage);
    }

    function formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1; // Months are zero-indexed
        let year = date.getFullYear();

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'

        // Pad single digit values with a leading zero
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
    }

    function parseDate(dateString) {
        // Example format: "23/06/2024, 02:11:11 PM"
        let dateParts = dateString.split(", ");
        let datePart = dateParts[0].split("/");
        let timePart = dateParts[1].split(/[: ]/);

        let day = parseInt(datePart[0], 10);
        let month = parseInt(datePart[1], 10) - 1; // Months are zero-indexed in JavaScript Date objects
        let year = parseInt(datePart[2], 10);
        let hour = parseInt(timePart[0], 10);
        let minute = parseInt(timePart[1], 10);
        let second = parseInt(timePart[2], 10);
        let period = timePart[3];

        // Adjust for PM/AM period
        if (period === "PM" && hour < 12) {
            hour += 12;
        } else if (period === "AM" && hour === 12) {
            hour = 0;
        }

        // console.log(`Parsed date: ${year}-${month + 1}-${day} ${hour}:${minute}:${second} ${period}`);
        return new Date(year, month, day, hour, minute, second);
    }

})();

