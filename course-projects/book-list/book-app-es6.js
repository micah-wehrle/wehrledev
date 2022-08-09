/*
    Now that I survived the ES5 class script, I will be designing this script without watching Brad's video.
    I will also attempt to add the local storage feature, and spice it up as I see fit.

    Ok, I think that about does it. I was able to do most of it from memory, and only copied some of the code that needed to be done a very specific way (such as the UI static methods)
    I also added some smarter filtering, so you can't add two books with the same ISBN. I also added an error notice if for some reason a book fails to load (which in this instance may only be duplicate ISBN)
    To be honest (I am only guessing this is how Brad will do it, and maybe this falls under his "I'm doing things simple now, we will learn better practice later" clause), but I don't like my operational method of storing the books as being just in the html
        I would rather have an array of books and then update that when I add/remove books, and use it when I save/load the books from storage.
        I won't implement this here, but I hope to be able to in a future project.
    
    Since it's all working how I want, I will watch his conversion to ES6 video as well as his storage feature video
    Here are my thoughts and changes:
    
        Ha! He just copied and pasted too
        Funny we also independantly created a separate class to handle storage.
        I did not know about DOMContentLoaded event listener so I added that portion as well
        I'm not going to mess with adding local storage to the ES5 version. To my knowledge, there is no reason to mess with ES5 other than general JS practice. I will do so if instructed but at this point of I'm getting plenty of extra-curricular practice.
        Overall he did things pretty similarly. The procedure is a little different but everything works the same.
        
*/

// Book Class
class Book {

    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class Storage {
    
    constructor() { // Not sure if this really matters. Wish I could make static classes
        console.error('Storage is not meant to be instantiated!');
    }

    static loadBooks() { // Pulls book list from local storage and creates all 
        const bookStorage = localStorage.getItem('books');

        if(bookStorage !== null && bookStorage !== '[]') {
            let failedBooks = 0;
            let books = JSON.parse(bookStorage);
            books.forEach(function(book) {
                // Counts how many timess addBook returns false
                failedBooks += !UI.addBook(new Book(book[0], book[1], book[2])); // See this new Book crap is silly on this scale. 
            });

            if(failedBooks === 0) { // Let's the user know how many books were loaded
                UI.showAlert(`Sucessfully loaded ${books.length} book(s).`, 'success'); // I could add a ternary here as I have done in previous projects but considering the fact I made this project twice I'm just ready to move on
            }
            else {
                UI.showAlert(`Loaded ${books.lenth - failedBooks} sucessfully but failed to load ${failedBooks} book(s)`, 'error');
            }
        }
    }

    // Go through the HTML and yank out every book, and add it to storage.

    static saveBooks() {
        const list = document.getElementById('book-list');
        let books = [];
        list.childNodes.forEach(function(bookData) {
            let book = [];
            for(let i = 0; i < 3; i++) {
                book.push(bookData.children[i].innerHTML);
            }
            books.push(book);
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

}

// Wish I could make a static class
class UI {
    constructor() {
        console.error('UI is not meant to be instantiated!');
    }

    // The following 3  pulled form ES5 script
    static addBook(book) {
        const list = document.getElementById('book-list');
        
        // Not sure the best way to do this. This will hopefully be the most time and space efficient
        let foundDuplicate = false;
        list.childNodes.forEach(function(existingBook) {
            
            if(foundDuplicate) {
                return;
            }

            if(book.isbn === existingBook.children[2].innerHTML) {
                foundDuplicate = true;
                return;
            }
        });

        if(foundDuplicate) {
            return false;
        }



        // Create tr (table row)
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">[X]<a></td>
        `;

        list.appendChild(row);

        return true;
    }

    static clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    static showAlert(msg, className) {
        // Create div
        const div = document.createElement('div');
        // Add classess
        div.className = 'alert ' + className;
    
        div.appendChild(document.createTextNode(msg));
    
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
    
        container.insertBefore(div, form);
    
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }
}

// Grab necessary UI elements
const titleForm = document.getElementById('title'),
    authorForm = document.getElementById('author'),
    isbnForm = document.getElementById('isbn');

// Listeners
document.getElementById('book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if(titleForm.value !== '' && authorForm.value !== '' && isbnForm.value !== '') {
        // I understand this is a hypothetical framework for an expandable application but this seems silly. Book class seems pointless.
        const book = new Book(titleForm.value, authorForm.value, isbnForm.value);
        
        if(UI.addBook(book)) {
            Storage.saveBooks();
            UI.showAlert('Book added!', 'success');
            UI.clearFields();
        }
        else {
            UI.showAlert('That book is already in the list!', 'error');
        }
    }
    else {
        UI.showAlert('Please make sure all fields are filled.', 'error');
    }
    
});

document.getElementById('book-list').addEventListener('mousedown', function(e) {

    if(e.target.className === 'delete') {
        e.target.parentElement.parentElement.remove();
        Storage.saveBooks();
        UI.showAlert('Book removed successfully.', 'success');
    }

    e.preventDefault();
});

document.addEventListener("DOMContentLoaded", function() {
    Storage.loadBooks();
});