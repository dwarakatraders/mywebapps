(async function () {
    const data = await fetch("todos.json");
    const res = await data.json();
    const todoListdiv = document.getElementById("tasklist");
    const addbutton = document.getElementById("btnAdd");
    const txttodo = document.getElementById("taskInput");
    const ddassignto = document.getElementById("assignToSelect");
    const addTodoForm = document.getElementById("taskForm");
    const filterForm = document.getElementById("filterForm");
    const statusFilter = document.getElementById("statusFilter");
    const assignFilter = document.getElementById("assignFilter");
    const sortBy = document.getElementById("sortBy");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    let todos = res;
    const itemsPerPage = 3;
    let currentPage = 1;



    txttodo.addEventListener("input", () => {
        addbutton.disabled = txttodo.value.trim() === '';
    });

    addbutton.addEventListener("click", (e) => {
        e.preventDefault();
        let newId = todos.Todos.length > 0 ? Math.max(...todos.Todos.map(todo => todo.id)) + 1 : 1;
        const formData = new FormData(addTodoForm);
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
            addbutton.disabled = true;
            currentPage = 1;
            renderTodos();
        }
    });

    filterForm.addEventListener("change", () => {
        currentPage = 1; // Reset currentPage when filter changes
        renderTodos();
    });

    // Event listener for the delete action using event delegation
    todoListdiv.addEventListener("click", function (event) {console.log(event.target.classList);
        if (event.target.classList.contains('delete')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            deleteToDo(id);
        } else if (event.target.classList.contains('complete-task-link')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            updateToDo(id, true); // Pass true to mark as completed
        } else if (event.target.classList.contains('reopen-task-link')) { 
            const id = parseInt(event.target.getAttribute('data-id'));
            updateToDo(id, false); // Pass false to reopen task
        } else if (event.target.classList.contains('toggle-details-btn') || event.target.classList.contains('fa')) {
            const taskItem = event.target.closest('.task-item');
            const id = parseInt(taskItem.getAttribute('data-task-id'));
            toggleDetails(id, taskItem);
        }
    });
    function toggleDetails(id, taskItem) {
        let todo = todos.Todos.find(todo => todo.id == id);
        if (todo) { 
            todo.open = !todo.open;
            renderTodos();
        }
    }


    function renderTodos() {
        const status = statusFilter.value;
        const assignto = assignFilter.value;
        const sortField = sortBy.value;

        todoListdiv.innerHTML = "";
        let filteredTodos = ''

        if (status === 'All' && assignto === "All") {
            filteredTodos = todos.Todos;
        } else if (status === 'All') {
            filteredTodos = todos.Todos.filter(todo => todo.assignto === assignto);
        } else if (assignto === "All") {
            filteredTodos = todos.Todos.filter(todo => todo.status === status);
        }
        else {
            filteredTodos = todos.Todos.filter(todo => todo.status === status && todo.assignto === assignto);
        }


        if (sortField === "task") {
            filteredTodos.sort((a, b) => a.task.localeCompare(b.task));
        } else if (sortField === "createdon") {
            filteredTodos.sort((a, b) => parseDate(b.createdon) - parseDate(a.createdon));
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = currentPage * itemsPerPage;
        const paginatedTodos = filteredTodos.slice(startIndex, endIndex);

        var todolist = '<div class="list-view">'
        if (paginatedTodos.length > 0) {
            todolist += '<h2>Task List</h2>'
            paginatedTodos.forEach((todo) => {
                todolist += `<li class="task-item ${todo.open ? 'open' : ''}" data-task-id="${todo.id}">
                <div class="task-header">
                <h3><p><strong class="${todo.status === 'Completed' ? 'strikeout' : ''}">${todo.task}</strong></p><p class="nobold">${todo.status}</p></h3>
                
                    <button title="${todo.open ? 'Hide Task Detail' : 'View Task Detail'}" class="toggle-details-btn">${todo.open ? '<i class="fa fa-angle-double-down" style="font-size:24px"></i>' : '<i class="fa fa-angle-double-right" style="font-size:24px"></i>'}</button>
                </div>
                <div class="task-details">
                <div class="task-content">
                <div class="task-data">
                    <p><strong>Task:</strong> ${todo.task}</p>
                    <p><strong>Assignee:</strong> ${todo.assignto}</p>
                    <p><strong>Status:</strong> ${todo.status}</p>
                    <p><strong>Created on:</strong> ${todo.createdon}</p>
                    ${todo.status == "Completed" ? `<p><strong>Completed on:</strong> ${todo.completedon}</p>` : ''}
                    </div>
                    <div class="task-actions">
                    ${todo.status !== "Completed" ? `<b  class="complete-task-link" data-id="${todo.id}">Mark as Completed</b>` : `<b class="reopen-task-link" data-id="${todo.id}">Re-Open the Task</b>`}<br><br>
                        <i class="fa fa-trash-o delete" title="Delete" data-id="${todo.id}"></i>
                    </div>
                </div>
                </div>               
            </li>`;
            });
        }
        else {
            todolist += 'Nothing is on your to-do list. Nice work!';
        }
        todolist += '</div>';
        todoListdiv.innerHTML = todolist;
        updatePaginationButtons(filteredTodos.length);
    };



    function updatePaginationButtons(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pageInfo = document.getElementById("pageInfo");

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        pageInfo.innerHTML = `Page <span class="current-page">${currentPage}</span> of <span class="total-pages">${totalPages}</span>`;

    }
    document.getElementById('nextButton').addEventListener('click', showNextPage);
    document.getElementById('prevButton').addEventListener('click', showPrevPage);
    function showNextPage() {
        currentPage++;
        renderTodos();
    }

    function showPrevPage() {
        currentPage--;
        renderTodos();
    }

    renderTodos();

    function deleteToDo(id) {
        var result = confirm("Are you sure you want to delete this task?");
        if (result) {
            const index = todos.Todos.findIndex(todo => todo.id === id);
            if (index !== -1) {
                todos.Todos.splice(index, 1);
                renderTodos();
            }
        }
    }

    function updateToDo(id, markAsCompleted) {
        const todo = todos.Todos.find(todo => todo.id === id);
        if (todo) {
            const action = markAsCompleted ? "complete" : "reopen";
            const confirmMessage = markAsCompleted ? "Are you sure? Do you want to complete this Task?" : "Are you sure? Do you want to reopen this Task?";
            const result = confirm(confirmMessage);

            if (result) {
                todo.status = markAsCompleted ? "Completed" : "Open";
                todo.completedon = markAsCompleted ? formatDate(new Date()) : "";
                renderTodos();
            }
        }
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
