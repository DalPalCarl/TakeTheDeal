
const caseBoard = document.querySelector("#caseBoard");
const valueBoard = document.querySelector("#valueBoard");
const cases = document.querySelectorAll(".case");
const values = document.querySelectorAll(".value");
const instructionDisplay = document.getElementById("instructions");
const selectedCase = document.getElementById("caseSelection");
const SHUFFLEPASSES = 3;

let firstCase = true;
let casePicks = 4;

let vals = [...values];

async function loadJson() {
    const response = await fetch("./instructions.json");
    const instructions = await response.json();
    instructionDisplay.innerText = instructions.newGame;
}

function shuffle() {
    let pass = SHUFFLEPASSES;
    while(pass > 0){
        for(let i = vals.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i+1));
            const temp = vals[i];
            vals[i] = vals[j];
            vals[j] = temp;
        }
        pass--;
    }
}

function initButtons() {
    shuffle();
    cases.forEach((c) => {
        c.addEventListener("click", () => {
            handleCaseClick(c);
            // values.forEach((v) => {
            //     if(v.id == vals[c.dataset.casenum - 1].id){
            //         v.style.backgroundColor = "gray";
            //     }
            // })
            // c.setAttribute("disabled", "true");
        });
    })
}

function startGame() {
    loadJson();
    initButtons();
}

function handleFirstCase(c) {
    firstCase = false;
    const playerCase = document.createElement("h3");
    playerCase.innerText = c.dataset.casenum;
    selectedCase.style.backgroundColor = "white";
    selectedCase.appendChild(playerCase);
}

function handleCaseClick(c) {
    if (firstCase){
        handleFirstCase(c);
    }
    else{
        values.forEach((v) => {
            if(v.id == vals[c.dataset.casenum - 1].id){
                v.style.backgroundColor = "gray";
            }
        });
    }
    c.setAttribute("disabled", "true");
}

startGame();
