displayStats();
showToTheScreen();

// IDs for Event Listeners
// -----------------------------
// Add button in modal = addBook
// Modal form details ID = bookDetails
// View Card Details ID = cardDetails
// Delete = removeBook
// title = title
// author = author
// pages = totalPages
// genre = genre
// searchBar = searchBook
// starting date = startDate
// ending date = endDate
// book completed = bookComplete
// book not completed = bookIncomplete
// DOM date id = endDate-${index}
// -----------------------------

// Our Book constructor to instantiate objects.
function Book(title, author, pages, genre, status, startDate, endDate) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.genre = genre;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
}

// Display Constructor
function Display() { }

// Clearing the input Fields of the Modal
Display.prototype.fieldClear = function () {
    let bookDetails = document.querySelector("#bookDetails");
    bookDetails.reset();
}

// Checking for trash info on Modal input
Display.prototype.checkTrash = function (newBook) {
    if (newBook.title.length <= 1 || newBook.author.length <= 2 || newBook.genre.length <= 2) {
        return false;
    }
    else {
        return true;
    }
}

// Regex Checker for invalid inputs.
Display.prototype.stringChecker = function (newBook) {
    if (newBook.title.match(/\w+/) && newBook.author.match(/\w+/) && newBook.genre.match(/\w+/) && newBook.pages.match(/^\d+$/)) {
        return true;
    }
    else return false;
}

// Function to display a status message below navBar (Add, Error, Deletion status added)
Display.prototype.showStatus = function (status, statusMessage) {
    let dismissMessage = document.querySelector("#dismissMessage");
    dismissMessage.innerHTML = `<div class="alert alert-${status} alert-dismissible fade show" role="alert">
                                    <strong>Status /</strong> ${statusMessage}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`
    setTimeout(function () {
        dismissMessage.innerHTML = ' '
    }, 3500);
}

// Event Listener for addBook
let addBook = document.querySelector("#addBook")
addBook.addEventListener('click', addBookToLibrary);
addBook.addEventListener('click', displayStats);

function addBookToLibrary() {
    // picking up the values in modal fields and assigning them to variables
    let title = document.querySelector("#title").value;
    let author = document.querySelector("#author").value;
    let pages = document.querySelector("#totalPages").value;
    let genre = document.querySelector("#genre").value;
    let bookComplete = document.querySelector("#bookComplete");
    let bookIncomplete = document.querySelector('#bookIncomplete');
    let status;
    let startDate = document.querySelector('#startDate').value;
    let endDate = document.querySelector('#endDate').value;
    if (bookComplete.checked) {
        status = "bookCompleted";
    }
    else if (bookIncomplete.checked) {
        status = "toBeRead";

    }
    if (endDate == "") {
        endDate = "To be set"
    }
    let newBook = new Book(title, author, pages, genre, status, startDate, endDate);

    // Get from Local Storage ------------------------
    let bookData = localStorage.getItem("bookData");
    if (bookData == null) {
        bookDataObject = [];
    }
    else {
        bookDataObject = JSON.parse(bookData);
    }
    // -----------------------------------------------

    let display = new Display();
    if (display.checkTrash(newBook) && display.stringChecker(newBook)) {

        // Add to Local Storage -------------------------------------------
        bookDataObject.push(newBook);
        localStorage.setItem("bookData", JSON.stringify(bookDataObject));
        // ----------------------------------------------------------------

        showToTheScreen();
        display.fieldClear();
        display.showStatus('success', `Success :), ${newBook.title} by ${newBook.author} added successfully.`);
    }
    else {
        display.fieldClear();
        display.showStatus('danger', 'Error ;<, Please check one or more of your input fields properly');
    }
}

// Adding Book Cards to the screen
function showToTheScreen() {

    let bookData = localStorage.getItem("bookData");
    if (bookData == null) {
        bookDataObject = [];
    }
    else {
        bookDataObject = JSON.parse(bookData);
    }

    let viewCardDetails = " ";

    bookDataObject.forEach(function (element, index) {

        // User completed the book
        if (element.status == "bookCompleted") 
        {
            viewCardDetails += `<div class="book-temp my-2 mx-2 card" style="width: 20rem;">
                                    <div class="card-body">
                                        <h5 class="card-title">${element.title}</h5>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">By : ${element.author}</li>
                                        <li class="list-group-item">${element.pages} pages</li>
                                        <li class="list-group-item">Genre : ${element.genre}</li>
                                        <li class="list-group-item"> From : ${element.startDate}</li>
                                        <li class="list-group-item"> To : ${element.endDate}</li>
                                        <li class="list-group-item text-center">
                                            <button type="button" class="btn btn-success" id="toBeRead" onclick="changeToTbr(this.id, ${index})">Completed</button>
                                        </li>
                                    </ul>
                                    <div class="card-body text-center">
                                        <button id = ${index} onclick = "deleteBookCard(this.id)" class="btn btn-dark">Delete</button>
                                    </div>
                                </div>`;
        }

        // User is yet to complete the book
        else if (element.status == "toBeRead") 
        {
            viewCardDetails += `<div class="book-temp my-2 mx-2 card" style="width: 20rem;">
                                    <div class="card-body">
                                        <h5 class="card-title mb-3">${element.title}</h5>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">By : ${element.author}</li>
                                        <li class="list-group-item">${element.pages} pages</li>
                                        <li class="list-group-item">Genre : ${element.genre}</li>
                                        <li class="list-group-item">From : ${element.startDate}</li>
                                        <li class="list-group-item">To : ${element.endDate}</li>
                                        <li class="list-group-item text-center">
                                            <button type="button" class="btn btn-danger" id="bookCompleted" onclick="changeToComplete(this.id, ${index})">To Be Read</button>
                                        </li>
                                    </ul>
                                    <div class="card-body text-center">
                                        <div class="dropdown mb-3">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                                Set an End Date
                                            </button>
                                            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                                                <li>
                                                    <input class="drop-down button mx-1" type="date" id="endDate-${index}">
                                                    <label>
                                                        <button class="mx-1" onclick="editEndDate(${index})">Submit</button>
                                                    </label>
                                                </li>
                                            </ul>
                                            <button id = ${index} onclick = "deleteBookCard(this.id)" class="btn btn-dark">Delete</button>
                                        </div>
                                    </div>
                                </div>`;
        }
    
    });

    let cardDetails = document.querySelector("#cardDetails");
    let emptyLib = document.querySelector("#emptyLib");
    if (bookDataObject.length == 0) {
        emptyLib.innerHTML = `It's Silent in here mate. Giddy up, start adding your books `;
        cardDetails.innerHTML = " ";
    }
    else {
        cardDetails.innerHTML = viewCardDetails;
        emptyLib.innerHTML = " ";
    }

}

// Function to delete books from the library
function deleteBookCard(index) {
    let bookData = localStorage.getItem("bookData");
    if (bookData == null) {
        bookDataObject = [];
    }
    else {
        bookDataObject = JSON.parse(bookData);
    }
    bookDataObject.splice(index, 1);
    localStorage.setItem("bookData", JSON.stringify(bookDataObject));
    let displayDeletion = new Display();
    displayDeletion.showStatus('dark', `Your book has been deleted, refresh if you may`);
    showToTheScreen();
    displayStats();
}

// Function to toggle read status to "To Be Read"
function changeToTbr(buttonStatus, indice) {
    let bookData = localStorage.getItem("bookData");
    if (bookData == null) {
        bookDataObject = [];
    }
    else {
        bookDataObject = JSON.parse(bookData);
    }
    bookDataObject[indice].status = buttonStatus;
    localStorage.setItem("bookData", JSON.stringify(bookDataObject));
    showToTheScreen();
}

// Function to toggle read status to "Book Completed"
function changeToComplete(buttonStatus, indice) {
    let bookData = localStorage.getItem("bookData");
    if (bookData == null) {
        bookDataObject = [];
    }
    else {
        bookDataObject = JSON.parse(bookData);
    }
    bookDataObject[indice].status = buttonStatus;
    localStorage.setItem("bookData", JSON.stringify(bookDataObject));
    showToTheScreen();
}

// Displaying User Stats
function displayStats() {
    let userData = document.querySelector("#userData");
    let bookData = localStorage.getItem("bookData");
    if (bookData == null) {
        bookDataObject = [];
    }
    else {
        bookDataObject = JSON.parse(bookData);
    }
    let numBooks = bookDataObject.length;
    let numPages = 0;
    for (let i = 0; i < numBooks; i++) {
        numPages += parseInt(bookDataObject[i].pages);
    }
    if (numBooks == 1) {
        userData.innerHTML = `That's <strong>${numBooks} book</strong> and <strong>${numPages} pages</strong>! Let's pump those numbers`;
    }
    else {
        userData.innerHTML = `That's <strong>${numBooks} books</strong> and <strong>${numPages} pages</strong>! Let's pump those numbers`;
    }
}

// Editing the end date
function editEndDate(indice) {
    let editEndDateValue = document.getElementById(`endDate-${indice}`).value;
    let bookData = localStorage.getItem("bookData");
    if (bookData == null) {
        bookDataObject = [];
    }
    else {
        bookDataObject = JSON.parse(bookData);
    }
    if (editEndDateValue) {
        bookDataObject[indice].endDate = editEndDateValue;
    }
    else {
        bookDataObject[indice].endDate = " -- ";
    }
    localStorage.setItem("bookData", JSON.stringify(bookDataObject));
    showToTheScreen();    
}