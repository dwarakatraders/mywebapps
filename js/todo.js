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
        console.log(formData);
        const task = formData.get('task');
        const assignto = document.getElementById('dropdownBtn').innerText === 'Assign to' ? 'Unassigned' : document.getElementById('dropdownBtn').innerText;
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
            dropdownBtn.innerText = 'Assign to';
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
    todoListdiv.addEventListener("click", function (event) {
        if (event.target.classList.contains('delete')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            deleteToDo(id);
        } else if (event.target.classList.contains('complete-task-link')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            updateToDo(id, true); // Pass true to mark as completed
        } else if (event.target.classList.contains('reopen-task-link')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            updateToDo(id, false); // Pass false to reopen task
        } else if (event.target.classList.contains('change-assignee-link')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            const assigneeDropdown = document.querySelector(`.assignee-dropdown[data-id="${id}"]`);
            const assigneeName = document.getElementById("passignee");
            assigneeDropdown.style.display = 'block';
            assigneeName.style.display='none';
        }
        else if (event.target.classList.contains('toggle-details-btn') || event.target.classList.contains('fa')) {
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
    todoListdiv.addEventListener("change", function (event) {
        if (event.target.classList.contains('change-assignee')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            const newAssignee = event.target.value;
            changeAssignee(id, newAssignee);
        }
    });

    function changeAssignee(id, newAssignee) {
        const todo = todos.Todos.find(todo => todo.id === id);
        if (todo && todo.status === 'Open') {
            todo.assignto = newAssignee;
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
                            <div style="display: inline; float:column">
                                <p id="passignee"><strong>Assignee:</strong> ${todo.assignto}</p>
                                <div class="assignee-dropdown" data-id="${todo.id}" style="display: none;"><strong>Assignee:</strong>
                                <select class="change-assignee" data-id="${todo.id}">
                                <option value="Unassigned" ${todo.assignto === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
                                <option value="Mounika" ${todo.assignto === 'Mounika' ? 'selected' : ''}>Mounika</option>
                                <option value="Nisha" ${todo.assignto === 'Nisha' ? 'selected' : ''}>Nisha</option>
                                <option value="Saranya" ${todo.assignto === 'Saranya' ? 'selected' : ''}>Saranya</option>
                                <option value="Sindhu" ${todo.assignto === 'Sindhu' ? 'selected' : ''}>Sindhu</option>
                                <option value="Umaya" ${todo.assignto === 'Umaya' ? 'selected' : ''}>Umaya</option>
                                </select>
                                </div>
                            </div>
                            <p><strong>Status:</strong> ${todo.status}</p>
                            <p><strong>Created on:</strong> ${todo.createdon}</p>
                            ${todo.status == "Completed" ? `<p><strong>Completed on:</strong> ${todo.completedon}</p>` : ''}
                        </div>
                        <div class="task-actions">
                        ${todo.status !== "Completed" ? `<b class="complete-task-link" data-id="${todo.id}">Mark as Completed</b>` : `<b class="reopen-task-link" data-id="${todo.id}">Re-Open the Task</b>`}<br><br>
                        ${todo.status !== "Completed" ? `<b class="change-assignee-link" data-id="${todo.id}">Change Assignee</b><br><br>` : ``}
                        <i class="fa fa-trash-o delete" title="Delete" data-id="${todo.id}"></i>
                        </div>
                    </div>
                </div>               
            </li>`;
            });
        }
        else {
            todolist += '<div class="divempty">Nothing is on your to-do list. Nice work!</div>';
        }
        todolist += '</div>';
        todoListdiv.innerHTML = todolist;
        updatePaginationButtons(filteredTodos.length);
    };



    function updatePaginationButtons(totalItems) {
        const pageInfo = document.getElementById("pageInfo");
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        prevButton.disabled = currentPage === 1 || totalItems === 0;
        nextButton.disabled = currentPage === totalPages || totalItems === 0;
        prevButton.hidden = totalItems === 0;
        nextButton.hidden = totalItems === 0;
        pageInfo.hidden = totalItems === 0;
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
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.style.display === 'block') {
                    openDropdown.style.display = 'none';
                }
            }
        }
    }

    var dropdownContent = document.getElementById('dropdownContent');
    var dropdownBtn = document.getElementById('dropdownBtn');

    dropdownContent.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            var selectedOption = event.target.innerText;
            dropdownBtn.innerText = selectedOption;
            dropdownContent.style.display = 'none';
        }

    });
    dropdownBtn.addEventListener('click', function (event) {
        event.preventDefault();
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Modal JavaScript
    var modal = document.getElementById("infoModal");
    var infoIcon = document.querySelector(".info-icon");
    var span = document.getElementsByClassName("close")[0];

    infoIcon.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
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
