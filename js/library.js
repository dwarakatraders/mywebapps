
const searchbox = document.createElement('input');
searchbox.id = 'txtBox';
searchbox.type = 'text';
searchbox.placeholder = 'Search...';
const addbutton = document.createElement('input');
addbutton.type = 'button';
addbutton.id = 'btnadd';
addbutton.value = 'Add';
searchbox.addEventListener('keyup', () => { findBooks(); });
addbutton.addEventListener('click', () => {
    document.getElementById('myForm').style.display = 'block';
    document.getElementById('divpage').style.display = 'none';
    document.getElementById('id').textContent = '';
    document.getElementById('inbookname').value = '';
    document.getElementById('inauthorname').value = '';
    document.getElementById('innopages').value = '';
    document.getElementById('rdcheckin').checked = true;
    document.getElementById('rdcheckout').checked = false;
    document.getElementById('txtBox').value = '';
    
    document.getElementById("divsearch").style.display = 'none';
    document.getElementById("divadd").style.display = 'none';
});
document.getElementById('divsearch').append(searchbox);
document.getElementById('divadd').append(addbutton);


const arrayBooks = [
    { id: 1, name: 'Ponniyin Selvan', status: 'Checked-out', author: 'Kalki', pages: 785 },
    { id: 2, name: 'Sivakamiyin Sapatham', status: 'Checked-in', author: 'Kalki', pages: 456 },
    { id: 3, name: 'Alai Osai', status: 'Checked-in', author: 'Kalki', pages: 567 },
    { id: 4, name: 'Kallikattu Ithigaasam', status: 'Checked-in', author: 'Vairamuthu', pages: 325 },
    { id: 5, name: 'Aram', status: 'Checked-in', author: 'JeyaMohan', pages: 265 }
];

function closeForm() {
    document.getElementById('myForm').style.display = 'none';
    document.getElementById('divpage').style.display = 'block';
    document.getElementById("lblbookname").style.display = 'none';
    document.getElementById("lblauthorname").style.display = 'none';
    document.getElementById("lblnopages").style.display = 'none';

    document.getElementById('id').textContent = '';
    document.getElementById('inbookname').value = '';
    document.getElementById('inauthorname').value = '';
    document.getElementById('innopages').value = '';
    document.getElementById('rdcheckin').checked = true;
    document.getElementById('rdcheckout').checked = false;

    resetSearch();
}
function findBooks() {
    let key = document.getElementById('txtBox').value;
    let arrfind = arrayBooks.filter(o => o.name.toLowerCase().includes(key.toLowerCase()));
    //let arrfind =arrayBooks.filter(o=>o.name.toLowerCase().startsWith(key.toLowerCase()));
    bindBooks(arrfind);
}
function resetSearch() {
    document.getElementById('txtBox').value = '';
    document.getElementById('txtBox').dispatchEvent(new Event('keyup'));
}
function displayBooks() {

    document.getElementById('myForm').style.display = 'none';
    document.getElementById('divpage').style.display = 'block';
    bindBooks(arrayBooks);

}
function bindBooks(arrBook) {
    var booklist = '<table class="table-fill">'
    if (arrBook.length > 0) {
        booklist += '<tr><th></th><th>Book Name</th><th>Author</th><th>Status</th><th>Remove</th><th>Edit</th></tr>'
        arrBook.forEach((items) => {
            booklist += '<tr class="row"><td>&nbsp;</td><td>' + items.name + '</td><td class="text-left">' + items.author + '</td><td class="text-left">' + items.status + '</td><td class="text-left pad-left-10"><i class="fa fa-trash-o delete" onClick="deleteBook(' + items.id + ')"></i></td><td class="text-left pad-left-10"><i class="fa fa-edit delete" onClick="editBook(' + items.id + ',\'' + items.name.replaceAll("'", "\\'") + '\',\'' + items.author.replaceAll("'", "\\'") + '\',\'' + items.status + '\',\'' + items.pages + '\');"></i></td></tr>';
        });
    }
    else {
        booklist += '<tr><td colspan="5">No Books Found!!</td></tr>';
    }
    booklist += '</table>';
    document.getElementById("divpage").innerHTML = booklist;
    document.getElementById("divsearch").style.display = 'block';
    document.getElementById("divadd").style.display = 'block';
}

function deleteBook(id) {
    var result = confirm("Are you sure you want to delete this Book?");
    if (result) {
        resetSearch();
        //Logic to delete the item
        var i = arrayBooks.length;
        while (i--) {
            if (arrayBooks[i] && arrayBooks[i].hasOwnProperty('id') && arrayBooks[i]['id'] === id) {

                arrayBooks.splice(i, 1);
            }
        }
        displayBooks();
    }
}

function editBook(id, name, author, status, pages) {
    resetSearch();
    document.getElementById('myForm').style.display = 'block';
    document.getElementById('divpage').style.display = 'none';
    
    document.getElementById("divsearch").style.display = 'none';
    document.getElementById("divadd").style.display = 'none';

    document.getElementById('id').textContent = id;
    document.getElementById('inbookname').value = name;
    document.getElementById('inauthorname').value = author;
    document.getElementById('innopages').value = pages;
    document.getElementById('rdcheckin').checked = status == 'Checked-in' ? true : false;
    document.getElementById('rdcheckout').checked = status == 'Checked-out' ? true : false;
}

function saveBook() {
    resetSearch();
    let inid = document.getElementById('id').textContent;
    let inname = document.getElementById('inbookname').value;
    let inauthor = document.getElementById('inauthorname').value;
    let inpages = document.getElementById('innopages').value;
    let instatus = (document.getElementById('rdcheckin').checked) ? "Checked-in" : "Checked-out";


    addBook(inid, inname, inauthor, instatus, inpages);

    /* document.getElementById("lblbookname").style.display = 'none';
     document.getElementById("lblauthorname").style.display = 'none';
     document.getElementById('id').textContent = '';
     document.getElementById('inbookname').value = '';
     document.getElementById('inauthorname').value = '';
     document.getElementById('rdcheckin').checked = true;
     document.getElementById('rdcheckout').checked = false;*/
}

function addBook(id, name, author, status, pages) {
    document.getElementById("divsearch").style.display = 'none';
    document.getElementById("divadd").style.display = 'none';
    if (name == '') {
        document.getElementById("lblbookname").style.display = 'block';
    }
    else if (author == '') {
        document.getElementById("lblbookname").style.display = 'none';
        document.getElementById("lblauthorname").style.display = 'block';
    }
    else if (pages == '') {
        document.getElementById("lblbookname").style.display = 'none';
        document.getElementById("lblauthorname").style.display = 'none';
        document.getElementById("lblnopages").style.display = 'block';
    }
    else if (isNaN(pages)) {
        document.getElementById("lblbookname").style.display = 'none';
        document.getElementById("lblauthorname").style.display = 'none';
        document.getElementById("lblnopages").style.display = 'block';
    }
    else if (id != '') {
        document.getElementById("lblbookname").style.display = 'none';
        document.getElementById("lblauthorname").style.display = 'none';
        document.getElementById("lblnopages").style.display = 'none';
        updateBook(id, name, author, status, pages);
    }
    else {
        document.getElementById("lblbookname").style.display = 'none';
        document.getElementById("lblauthorname").style.display = 'none';
        document.getElementById("lblnopages").style.display = 'none';
        let inid = arrayBooks[arrayBooks.length - 1].id + 1;
        arrayBooks.push({ id: inid, name: name, status: status, author: author, pages: pages });
        displayBooks();
    }
   

}

function updateBook(id, name, author, status, pages) {
    let i = arrayBooks.length;
    while (i--) {
        if (arrayBooks[i]['id'] == id) {
            arrayBooks[i].name = name;
            arrayBooks[i].author = author;
            arrayBooks[i].status = status;
            arrayBooks[i].pages = pages;
            break;
        }
    }
    displayBooks();
}
// Modal JavaScript
var modal = document.getElementById("infoModal");
var infoIcon = document.querySelector(".info-icon");
var span = document.getElementsByClassName("close")[0];

infoIcon.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function closeApp(x) {
    // Send a message to the parent document to hide the iframe
    if (x == 0) {
        document.getElementById('container').style.display = 'block';
        document.getElementById('libicon').style.display = 'none';
    }
    else {
        document.getElementById('container').style.display = 'none';
        document.getElementById('libicon').style.display = 'block';

    }
}

