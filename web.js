addEventListener("load", (event) => {
    hideAllDivs();
    document.getElementById("resumeDiv").style.display = "block";
})

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
    hideAllDivs();
    document.getElementById('iot-project-div').style.display = "block";
})
document.getElementById('project-2').addEventListener('click', function(){
    hideAllDivs();
    document.getElementById('stage-light-project-div').style.display = "block";
})
document.getElementById('project-6').addEventListener('click', function(){
    hideAllDivs();
    document.getElementById('algo-trading-project-div').style.display = "block";
})
document.getElementById('project-8').addEventListener('click', function(){
    hideAllDivs();
    document.getElementById('market-indicators-project-div').style.display = "block";
})

function hideAllDivs(){
    document.getElementById("resumeDiv").style.display = "none";
    document.getElementById("projectsDiv").style.display = "none";
    document.getElementById("iot-project-div").style.display = "none";
    document.getElementById("stage-light-project-div").style.display = "none";
    document.getElementById("algo-trading-project-div").style.display = "none";
    document.getElementById("market-indicators-project-div").style.display = "none";
}
