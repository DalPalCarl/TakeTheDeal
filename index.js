
const caseBoard = document.querySelector("#caseBoard");
const valueBoard = document.querySelector("#valueBoard");
const cases = document.querySelectorAll(".case");
const values = document.querySelectorAll(".value");
const instructionDisplay = document.getElementById("instructions");
const selectedCase = document.getElementById("caseSelection");
const decisionButtons = document.getElementById("decisionButtons");
const takeDealBtn = document.getElementById("takeBtn");
const leaveDealBtn = document.getElementById("leaveBtn");
const SHUFFLEPASSES = 3;
const CASEPICKNUM = 4


let firstCase = true;
let casePicks = CASEPICKNUM;

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

function calculateOffer() {
    let totalVal = 0;
    const valsLeft = document.querySelectorAll(".value-revealed")
    valsLeft.forEach(v => totalVal += parseInt(v.id));
    console.log(totalVal);
}

function initButtons() {
    shuffle();
    firstCase = true;
    cases.forEach((c) => {
        c.addEventListener("click", () => {
            handleCaseClick(c);
        });
    });
}

function startGame() {
    casePicks = CASEPICKNUM;
    loadJson();
    initButtons();
    takeDealBtn.addEventListener("click", takeDeal);
    leaveDealBtn.addEventListener("click", leaveDeal);
    decisionButtons.style.display = "none";
}

function handleFirstCase(c) {
    firstCase = false;
    const playerCase = document.createElement("h3");
    playerCase.innerText = c.dataset.casenum;
    selectedCase.style.backgroundColor = "white";
    selectedCase.appendChild(playerCase);
    instructionDisplay.innerText = `Cases to select: ${casePicks}`;
}

function handleCaseClick(c) {
    if (firstCase){
        handleFirstCase(c);
    }
    else{
        values.forEach((v) => {
            if(v.id == vals[c.dataset.casenum - 1].id){
                v.classList.add("value-revealed");
            }
        });
        if(casePicks == 1){
            bankerOffer();
        }
        else{
            casePicks--;
            instructionDisplay.innerText = `Cases to select: ${casePicks}`;
        }
    }
    c.setAttribute("disabled", "true");
}

function bankerOffer() {
    const offer = 0;
    calculateOffer();
    instructionDisplay.innerText = `Banker offers ${offer}`;
    caseBoard.style.display = "none";
    decisionButtons.style.display = "inherit";
}

function takeDeal() {
    const profit = 0;
    instructionDisplay.innerText = `Congrats! You won $${profit}!`;
}

function leaveDeal() {
    const activeCases = document.querySelectorAll(".case[disabled=true]");
    if(activeCases.length == 0){
        revealCase();
    }
    else{
        caseBoard.style.display = "grid";
        decisionButtons.style.display = "none";
        casePicks = Math.max(Math.floor((26 - activeCases.length) / 5), 1);
        instructionDisplay.innerText = `Cases to select: ${casePicks}`;
    }

}

function revealCase() {
    instructionDisplay.innerText = `Your case contained $${selectedCase.id}`
}


startGame();
