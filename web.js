addEventListener("load", (event) => {
    hideAllDivs();
    document.getElementById("resumeDiv").style.display = "block";
})

// Modal Expansion
document.querySelectorAll('.modal-image').forEach(image => {
    image.addEventListener('click', function() {
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');

        modalImage.src = this.src;
        modalCaption.textContent = this.getAttribute('data-caption');
        
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    });
});

document.getElementById('right-page-button').addEventListener("mouseover", function(){
    this.style.background='#383838';
})
document.getElementById('right-page-button').addEventListener("mouseout", function(){
    this.style.background='black';
})
document.getElementById('right-page-button').addEventListener('click', function(){
    hideAllDivs();
    document.getElementById("projectsDiv").style.display = "block";
})

document.getElementById('left-page-button').addEventListener("mouseover", function(){
    this.style.background='#383838';
})
document.getElementById('left-page-button').addEventListener("mouseout", function(){
    this.style.background='black';
})
document.getElementById('left-page-button').addEventListener('click', function(){
    hideAllDivs();
    document.getElementById("resumeDiv").style.display = "block";
})


document.getElementById('project-1').addEventListener('click', function(){
    scroll_to_top();
    hideAllDivs();
    document.getElementById('iot-project-div').style.display = "block";
})
document.getElementById('project-2').addEventListener('click', function(){
    scroll_to_top();
    hideAllDivs();
    document.getElementById('stage-light-project-div').style.display = "block";
})
document.getElementById('project-6').addEventListener('click', function(){
    scroll_to_top();
    hideAllDivs();
    document.getElementById('algo-trading-project-div').style.display = "block";
})
document.getElementById('project-8').addEventListener('click', function(){
    scroll_to_top();
    hideAllDivs();
    document.getElementById('market-indicators-project-div').style.display = "block";
})
document.getElementById('project-9').addEventListener('click', function(){
    scroll_to_top();
    hideAllDivs();
    document.getElementById('sales-forecasting-project-div').style.display = "block";
})
document.getElementById('project-4').addEventListener('click', function(){
    scroll_to_top();
    hideAllDivs();
    document.getElementById('tetris-project-div').style.display = "block";
})
document.getElementById('project-10').addEventListener('click', function(){
    scroll_to_top();
    hideAllDivs();
    document.getElementById('cv-project-div').style.display = "block";
})

function scroll_to_top(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function hideAllDivs(){
    document.getElementById("resumeDiv").style.display = "none";
    document.getElementById("projectsDiv").style.display = "none";
    document.getElementById("iot-project-div").style.display = "none";
    document.getElementById("stage-light-project-div").style.display = "none";
    document.getElementById("algo-trading-project-div").style.display = "none";
    document.getElementById("market-indicators-project-div").style.display = "none";
    document.getElementById("sales-forecasting-project-div").style.display = "none";
    document.getElementById("tetris-project-div").style.display = "none";
    document.getElementById("cv-project-div").style.display = "none";
}
