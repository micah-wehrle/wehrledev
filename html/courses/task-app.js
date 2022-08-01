/*

    This script was largely designed by Brad from the Udemy JS course, but I took the liberty of adding the following:

    A few custom alerts, such as blocking duplicate tasks from being added, and adding additional info to them such as number of tasks being deleted.
    I also coded most of the local storage section before watching the video. I don't love the way he did it, and admittedly mine isn't ideal either.
        I would prefer to have more dedicated functions that could be called -- I hate copying and pasting my own code. You should write it once and put it in a function if it needs to be called again (like how the create li element code is repeated in the add task button event and also when the DOM loads and the tasks are pulled from storage).
        For the purpose of this site I sort of just went with the simplest option. If you (whoever you are) want me to redesign this script to be more efficent as described above I would be happy to do so, thanks.

    A few thoughts:
        This is the first time in a long time I have coded along to a tutorial/lesson. I wrote pretty much everything Brad did until I got to the point I understood what was supposed to be going on, and then I worked ahead of the videos.
        At this point I am pretty unfamiliar with HTML philosophy but I feel like I'm catching on at a satisfying rate for now.

        There are a few features I am not thrilled about, but I'm just going to press on with the lessons. As noted above, if you think I should rewrite anything I'd be happy to.

*/

// UI Variables
const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// Load all event listeners
loadEventListeners();

// This was my solution, I like his better (though need to add a function to generate the li instead of copy/passte code).
// Load tasks from storage
// let firstLoad = true;
// loadTasksFromStorage();
// firstLoad = false;

function loadEventListeners() {
    // Event: DOM loaded
    document.addEventListener('DOMContentLoaded',loadTasks());

    // Event: Add task
    taskForm.addEventListener('submit', addTask);

    // Event: Delete task
    taskList.addEventListener('click', deleteTask); // This is how Brad did it -- I don't like this, it assumes the only reason you'd click on the list is to remove a task. What if I want to add a star to be able to favorite list items?

    // Event: WIPE ALL TASKS
    clearBtn.addEventListener('click', clearTasks);

    // Event: Filter tasks
    filter.addEventListener('keyup', filterTasks);
}

// Function to add a task
function addTask(e) {

    if(taskInput.value === '') {
        alert('Please add a task before submitting');
    }
    else { // He didn't put this in an else but it seems fitting to do so.

        let foundDuplicate = false; 
        // He didn't do this, but let's make sure the task isn't already in there.
        for(let i = 0; i < taskList.childElementCount; i++) {
            if(taskList.children[i].textContent === taskInput.value) {
                alert('That task is already in the list!');
                foundDuplicate = true;
                break;
            }
        }

        if(!foundDuplicate) {
            
            // Create new li of task
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.appendChild(document.createTextNode(taskInput.value)); // add text from form input field to li

            // Create delete button for task li
            const link = document.createElement('a');
            link.className = 'delete-item secondary-content'; // secondary-content puts someting element to the right of an li in materialize style sytem
            link.innerHTML = '<i class="fa fa-remove"></i>'; // add X to link

            // I added an event listener to every X, he wants to add one to the entire task list
            // link.addEventListener('click', deleteTaskFromX);

            li.appendChild(link);

            taskList.appendChild(li);

            taskInput.value = '';
        }

        // if(!firstLoad) {
            saveTasksToStorage();
        // }
    }

    e.preventDefault();
}


// I had to google a lot of syntax but I added this prior to the video
function deleteTaskFromX(e) {
    taskList.removeChild(e.target.parentElement.parentElement);
}

function deleteTask(e) {
    if(e.target.parentElement.classList.contains('delete-item')) {
        // taskList.removeChild(e.target.parentElement.parentElement);

        // Brad did it this way:
        if(confirm(`Are you sure you want to delete task: ${e.target.parentElement.parentElement.textContent}`)) {
            e.target.parentElement.parentElement.remove();
        }
        else {
            taskInput.value = 'Grow up and delete something every once in a while.';
            addTask(e);
        }
    }

    e.preventDefault();
}

function clearTasks(e) {

    // ensure there's more than one existing task, and if so confirm if user wants to delete them.
    if(taskList.childNodes.length > 0 && confirm(`Are you sure you want to delete${taskList.childNodes.length > 1 ? ' all' : ''} ${taskList.childNodes.length} task${taskList.childNodes.length > 1 ? 's' : ''}?`)) {
        // I found this little ditty online, as I wrote this part before he did
        //taskList.innerHTML = ''; // Ok looks like brad did this too.
        
        // He is claiming a while loop is faster! I will write it out myself now.
        // He shared a link that I think is broken. Here's what I found:
        // https://www.measurethat.net/Benchmarks/Show/34/0/innerhtml-vs-removechild
        // I don't know how the length of the list might compare, but this site says removeChild is faster. 

        do { // since I already made sure it wasn't empty, a do/while seems more efficient and save a check
            taskList.removeChild(taskList.firstChild);
        }
        while(taskList.firstChild);

        filter.value = '';

        saveTasksToStorage();
    }
    
    e.preventDefault();
}

function filterTasks(e) {
    // loop through all taskss
    for(let i = 0; i < taskList.childElementCount; i++) {
        if(!taskList.children[i].textContent.toUpperCase().includes(filter.value.toUpperCase())) { // if the content of a task doesn't match filter at all, hide it
            taskList.children[i].style.display = 'none';
        }
        else { // ensure all other tasks are visible as filter text is added and removed
            taskList.children[i].style.display = 'block'; 
        }
    }
}

// Called to generate the list of tasks and save to local storage
function saveTasksToStorage() {
    let tasks = [];

    for(let i = 0; i < taskList.childElementCount; i++) {
        tasks.push(taskList.children[i].textContent);
    }

    localStorage.setItem('TaskList', JSON.stringify(tasks));
}

function loadTasksFromStorage() {

    let taskJSON = localStorage.getItem('TaskList');
    if(taskJSON !== null) {
        JSON.parse(taskJSON).forEach(function(task) {
            taskInput.value = task;
            addTask(new Event(null)); 
        });
    }
    
}

function loadTasks() {

    let taskJSON = localStorage.getItem('TaskList');
    if(taskJSON !== null) {
        JSON.parse(taskJSON).forEach(function(task) {
            
            // Ripped right from addTask above

            const li = document.createElement('li');
            li.className = 'collection-item';
            li.appendChild(document.createTextNode(task)); // add text from form input field to li

            // Create delete button for task li
            const link = document.createElement('a');
            link.className = 'delete-item secondary-content'; // secondary-content puts someting element to the right of an li in materialize style sytem
            link.innerHTML = '<i class="fa fa-remove"></i>'; // add X to link

            // I added an event listener to every X, he wants to add one to the entire task list
            // link.addEventListener('click', deleteTaskFromX);

            li.appendChild(link);

            taskList.appendChild(li);

        });
    }
}