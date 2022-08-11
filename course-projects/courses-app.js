/*
    I made this after the js classes lessons (though I didn't use any classes in here) in order to organize and display the projects I've made for any courses I take.
        I also added 'Spin-off' tags for the projects (like this one) not assigned as homework for the courses.

    I've just begun watching the very next seciton of the JS course, where I'm learning about how I could hypothetically access a JSON file using 
    
*/

// Grab UI Elements
const projectTable = document.getElementById('project-table');
const projectTableHeader = document.getElementById('project-table-header');
const sortBtn = document.getElementById('sort-btn');
const infoBox = document.getElementById('info-box-wrapper');
const infoText = document.getElementById('info-text');

// A (few) setting variable(s)
let sortAsc = true;
let selectedRow = 0;
let evenColor, oddColor; // To be loaded at end of page
const upArrow = "\u25B2";
const downArrow = "\u25BC";

// Using the project array, generate table rows and populate each cell with info from each project object
// This would normally be outside of a function but this is a sort of reverse prototype function so that I can call it after I make the array of project objects. This is located at the bottom of the script since it's long and ugly.
function loadProjects() {
    projects.forEach(function(proj, i) { // Grab each project

        const tr = document.createElement('tr'); // Table row to put project info in
        tr.dataset.tags = proj.tags.toString(); // Insert the tags for the project as an element into the tr tag for easier hiding of rows later
        tr.classList.add(`${i%2===0 ? 'even' : 'odd'}-row`);
        let tags = ""; // Empty html variable to load all the filter tag buttons into

        proj.tags.forEach(function(tag) { // generate a filter tag for every tag associated with this project, and insert it into the tags string
            tags += tagMaker(tag, 'filter(this);', false) + ''; // '' is for if I want to add a comma
        });

        // if(tags.length > 0) {
            // tags = tags.slice(0,-1); // chop off the last comma (If I want a comma)
        // }

        // Create the actual cells for the tr. Includes item number, name, date, button tags created above, and the link button to open the project
        tr.innerHTML = `
            <td>${i+1}.</td>
            <td>${proj.name}</td>
            <td>${proj.date}</td>
            <td>${tags}</td>
            <td><input type="button" value="&#8680;" class="btn" onclick="openProject(${i})"></td>
            `;
        
        projectTable.appendChild(tr); // finally, add the new table row to the bottom of the table
    });
}


// Function called by the onclick element of the filter tag buttons.
// Get the tag name from the tag button, and then hide every row that does not match that tag
function filter(tag) {
    clearSelectedRow();
    // change the table header 'Tag:' to say 'Filter:' with the specificed filter tag button after it
    projectTableHeader.children[3].innerHTML = 'Filter: ' + tagMaker(tag.value, 'resetTags()', true); 

    // Loop through every child to find ones that need to be hidden
    projectTable.childNodes.forEach(function(child) {
        if(typeof child.dataset === 'undefined' || typeof child.dataset.tags === 'undefined') { return; } // Skip first row (as well as some weird ghost row -- not sure what that's about)
        child.hidden = !child.dataset.tags.split(',').includes(tag.value); // If the row's dataset doesn't contain the tag that matches our filter value, set hidden to true
    });
}

// Generates a tag button for each row's tags. Setting closeBtn to true will generate a tag to go at the top of the table next to Filters: whcih includes an X icon (fake button)
function tagMaker(value, onClick, closeBtn) {
    return `<input type="button" value="${value + (closeBtn ? '&#x2002;&#x2002;&#x2715;' : '')}" class="btn btn-tag" onclick="${onClick}">`;
}

// Show all rows, and change the header row to say Tags instead of Filter: [Filter Tag]
function resetTags() {
    projectTable.childNodes.forEach(function(child) {
        child.hidden = false;
    });

    projectTableHeader.children[3].innerHTML = 'Tags';
}

// Invert the order of the table rows
function switchOrder() {

    sortAsc = !sortAsc; // Track which order they're in as to...
    sortBtn.value = sortAsc ? upArrow : downArrow; // ...change the arrow in the button to up or down

    // Starting from third table row (skips heading and first real row), grab that row and move it to the beginning of the table
    for(let i = 2; i < projectTable.childNodes.length; i++) {
        projectTable.insertBefore( projectTable.childNodes[i] , projectTable.childNodes[2]); // move row[i] to the top of the table
    }
}

// Look for clicks on the table to highlight selected entries
projectTable.addEventListener('mousedown', function(e) {
    if(e.target.tagName === "TD" && e.target.id !== "ignore-click") { 
        selectRow( parseInt( e.target.parentElement.childNodes[1].innerHTML.slice(0,-1) )+1 );
    }
});

// Select the specified table row
function selectRow(row) {
    
    // If user has clicked on the row already selected
    if(selectedRow === row) {
        clearSelectedRow();
    }
    else { // If use clicking on a new row (regardless of if a row is currently selected)
        clearSelectedRow(); // Clear any existing selection
        selectedRow = row; 
        projectTable.childNodes[selectedRow].classList.add('selected-row'); // Change class of selected row to be highlighted

        infoBox.hidden = false; // Show the info box for the current row data

        infoText.innerHTML = projects[selectedRow-2].about; // Put the about info for the current selected project into the info box
    }
}

function clearSelectedRow() {

    if(selectedRow !== 0) { // In case the function is called when there is no row selected
        projectTable.childNodes[selectedRow].classList.remove('selected-row') // remove selected class from whatever cell was highlighted
        selectedRow = 0;

        infoBox.hidden = true; // Hide and clear the info box
        infoText.innerHTML = '';
    }
}

function openProject(projNum) {
    // Open the selected project (or project passed to function) in a new window, using the url additive from the project table
    window.open(`./${projects[
            (typeof projNum === 'undefined' || projNum === -1 ? selectedRow-2 : projNum)  
        ].link}/`, '_blank');
}



// JSON of projects. I tried putting this in its own file but that isn't really practical with js (I think)
// I also have tag variables so I can easily change the name of any tags across all projects
const tagJS = "JS Course",
    tagLocStg = "Local Storage",
    tagCanvas = "Canvas",
    tagSpinoff = "Spin-off",
    tagCustCSS = "Robust Stylesheet",
    tagAjax = "Ajax",
    tagWIP = "WIP"
;

const projects = [
    {
        "name":"Task Manager",
        "date":"July 31, 2022",
        "tags":[tagJS,tagLocStg],
        "link":"task-manager",
        "about":"The first project I made in the JavaScript course on Udemy. For the most part I followed along with the full lesson to create the project. I tweaked a few features on my own but for the most part it is pretty much the same as in the course. Looking back it's pretty basic and I don't like some of the (beginner) design choices but I am going to leave it as is."
    },
    
    {
        "name":"Loan Calculator",
        "date":"August 1, 2022",
        "tags":[tagJS,tagCanvas],
        "link":"loan-calculator",
        "about":"The second JavaScript Udemy project. This was the first project I decided to work ahead on the JS side, after watching the UI portion of the videos. I was successful in creating everything as I wanted, except I watched the videos to get the formulas for calculating the loan numbers. I deviated in using an animated canvas instead of a gif for the loading icon. Check out the .js file to read more about that."
    },

    {
        "name":"Number Guesser",
        "date":"August 2, 2022",
        "tags":[tagJS,tagCanvas],
        "link":"number-guesser",
        "about":"The third JavaScript Udemy project. I followed my new standard procedue, watch the UI videos and then work ahead on the scripting side myself. In this case I also decided to change up the UI quite a bit as well. I added difficulties (because it seemed odd to make the range customizable but never use that feature), and anther canvas for fun."
    },

    {
        "name":"Book List",
        "date":"August 5, 2022",
        "tags":[tagJS,tagCanvas,tagLocStg],
        "link":"book-list",
        "about":"The fourth JavaScript Udemy project. Because we created two different versions of the .js file, and the first type is using a difficult and depreciated system, I followed the videos through most of the project. I added my own tweaks here and there, but it's a pretty boring project so I just hurried through it. I created the ES6 .js file on my own and then watched the corresponding videos. I added the book-saving feature prior to the videos as well."
    },

    {
        "name":"Physics Demo",
        "date":"August 6, 2022",
        "tags":[tagSpinoff,tagCanvas,tagCustCSS,tagWIP],
        "link":"physics-demo",
        "about":"My first spin-off project which was not assigned by any course. I wanted to play around with classes a little more, so I made a simple physics simulation with a canvas, and managed the moving bodies with classes. I also learned a lot of html and css with this project, as it was the first where I made my own custom stylesheet for the buttons. It needs a lot of work, so I will improve it as I am able."
    },

    {
        "name":"Project List",
        "date":"August 7, 2022",
        "tags":[tagSpinoff,tagCustCSS],
        "link":"#",
        "about":"My second spin-off project and also a sort of culmination of everything learned so far. I decided to have one page that had links to all the projects I've made so far, and this is what I settled on. I didn't want to go too overkill and show off a little sample any of the projects here, the point is just to be a jump point to quickly see all the projects and view any at a click. It was fun to add tags and create the code to manage all of that. I learned a lot about html and css in this project as well, and will continue to add projects to it as they are made. I hope for this page to persist through my entire web development journey."
    },

    {
        "name":"Joke Generator",
        "date":"August 8, 2022",
        "tags":[tagJS, tagCanvas, tagAjax],
        "link":"joke-generator",
        "about":"Snap back to reality, made a few fun projects and now I need to get back to course work. This is my fifth Udemy JS project."
    },

    // { // Consider how early this project is in development, I'm excluding it from the main list for now
    //     "name":"Canvas Builder",
    //     "date":"August 11, 2022",
    //     "tags":[tagSpinoff, tagCanvas, tagWIP],
    //     "link":"canvas-builder",
    //     "about":"After getting the cowboy hat together in the Joke Generator project, I realized it would be nice to have a tool to create better canvas art, specifically in relation to lines and curves. Without such a tool, you are stuck with an irritating and inefficent guess and check process."
    // },




    // {
    //     "name":"",
    //     "date":"",
    //     "tags":[],
    //     "link":"",
    //     "about":""
    // },
];

loadProjects();