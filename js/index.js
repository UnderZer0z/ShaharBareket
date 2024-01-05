/**
 * Todo: 
 * finish writing the about me section
 * add my own version of the trex chrome game
 * add all of my projects and create a Project Modals box for each
 * add a way to contact me ? maybe ? idk
 * think about what kind of sections do i want to add
 */  

function scrollDrag(){
    let mouseDown = false;
    let startX, scrollLeft;
    const slider = document.getElementById('projects');

    const startDragging = (e) => {
        mouseDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }

    const stopDragging = (e) => {
     mouseDown = false;
    }

    const move = (e) => {
        e.preventDefault();
        if(!mouseDown) { return; }
        const x = e.pageX - slider.offsetLeft;
        const scroll = x - startX;
        slider.scrollLeft = scrollLeft - scroll;
    }

    // Add the event listeners
    slider.addEventListener('mousemove', move, false);
    slider.addEventListener('mousedown', startDragging, false);
    slider.addEventListener('mouseup', stopDragging, false);
    slider.addEventListener('mouseleave', stopDragging, false);

}

function insertToText(){
    let birth_date = new Date(934146180 * 1000);
    let month_diff = new Date(Date.now() - birth_date.getTime()); 
    let age = Math.abs(month_diff.getUTCFullYear() - 1970 );
    document.getElementById('age').innerText = age;
    document.querySelector('[rel="stylesheet"]').sheet.insertRule(
    `i#age:hover::after {
        content: "${birth_date}";
        display: inline;
        position: absolute;
        background: black;
        border-radius: 4px;
        padding: 2px 10px;
        margin-top: -18px;
    }`);
}
insertToText()

// init
if(window.innerWidth > 768 ){
    scrollDrag()
}


