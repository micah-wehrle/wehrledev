/*

    I don't think I'm going to work ahead on this project, as I am not fully understanding ES5. I wouldn't say I'm neglecting it, but I'd rather just do the project along with Brad and then perhaps I'll do the ES6 portion on my own.
    For now, this script will be the ES5 version.

    Ok, I just followed along with his video. I didn't really do anything differently.

    A few thoughts. I really don't like instantiating the UI 'class' (is it called a class in ES5?), and then using that instantiated object to call methods that have nothing to do with the object.
        I don't know if ES5 supports static functions, but they should be static functions. It's a waste of memory (I think? It's bad practice at least in an environment where static class methods are possible) so I think I can objectively say it's bad. Not blaming brad, maybe just blaming ES5.
    
    I also polished up a few things he didn't include, such as if you click anywhere on a book in the list it will still print the message saying the book was removed. 
        I also don't know if it's good practice but I worked ahead a little bit at one point, and I added an onclick element to the X table row block thing, which made it just automatically delete itself. I don't know if this counts as extra "listeners", and maybe it really is just better to add the listener to the whole table.
            I guess the downside to onclick is you lose flexibility to easily do other things when it is clicked, but perhaps the downside to a big listener is you're going to be triggering some code unecessarily if the user clicks anywhere in the table.


*/

// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}


// UI Constructor
function UI() {
}

UI.prototype.addBookToList = function(book) {
    
    const list = document.getElementById('book-list');

    // // Create tr (table row)
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">[X]<a></td>
    `;
    // Here's how I originally made the td delete itself:
    // <td onclick="this.parentElement.parentElement.removeChild(this.parentElement)">[X]</td>
    // But fine we'll do it brad's way

    list.appendChild(row);
}

UI.prototype.clearFields = function() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

UI.prototype.showAlert = function(msg, className) {
    // Create div
    const div = document.createElement('div');
    // Add classess
    div.className = 'alert ' + className;

    div.appendChild(document.createTextNode(msg));

    const container = document.querySelector('.container');

    const form = document.querySelector('#book-form');

    container.insertBefore(div, form);

    setTimeout(() => {
        // I originally did querySelectorAll and removed all of them with a for each, but then the subsequent timeouts could delete anything placed after the delete wave too soon.
        document.querySelector('.alert').remove();
    }, 3000);
}

UI.prototype.deleteBook = function(target) {
    if(target.className === 'delete') {
        target.parentElement.parentElement.remove();
        return true;
    }

    return false;
}

// Listeners
document.getElementById('book-form').addEventListener('submit', function(e) {

    // Get from form
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
        
    // Create ui element
    const ui = new UI();

    if(title !== '' && author !== '' && isbn !== '') { // all fields filled!
        // Create book
        const book = new Book(title, author, isbn);

        ui.addBookToList(book);

        ui.clearFields();

        ui.showAlert('Book added successfully!', 'success');
    }
    else { // Missing something!
        
        ui.showAlert('Please fill in all fields, friend!', 'error');
    }


    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click',function(e) {

    const ui = new UI();
    
    // Brad should have addded a return to this bad boy so that it would let you know if the user actually clicks on the X
    if(ui.deleteBook(e.target)) {
        ui.showAlert('Book deleted.', 'success');
    }


    e.preventDefault();
});