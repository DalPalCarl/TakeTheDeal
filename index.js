
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

let isAnimating = false;
let firstCase = true;
let casePicks = CASEPICKNUM;
let round = 1;
let offer;

let vals = [...values];

async function loadJson() {
    const response = await fetch("./instructions.json");
    const instructions = await response.json();
    instructionDisplay.innerText = instructions.newGame;
}

function initButtons() {
    shuffle();
    firstCase = true;
    cases.forEach((c) => {
        c.addEventListener("click", () => {
            if(!isAnimating){
                handleCaseClick(c);

            }
        });
        c.addEventListener("animationend", () => {
            c.style.opacity = 0;
            c.classList.remove("case-revealed");
            isAnimating = false;
            if(casePicks == 0){
                bankerOffer();
            }
        });
    });
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

// Banker's formula: EV * (1+k) * (1-f*r)
//  EV  - Avg of values left
//  k   - psychological factor on player's behavior
//  f   - round number
//  r   - remaining rounds
function calculateOffer() {
    let totalVal = 0;
    const valsLeft = document.querySelectorAll(".value")
    valsLeft.forEach(v => totalVal += parseInt(v.id));
    const ev = Math.round(totalVal/valsLeft.length);
    return ev;
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
    c.style.opacity = 0;
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
                v.classList.replace("value", "value-revealed");
                c.innerText = v.id.toLocaleString();
                c.classList.add("case-revealed");
                isAnimating = true;
            }
        });
        casePicks--;
        instructionDisplay.innerText = `Cases to select: ${casePicks}`;
    }
    c.setAttribute("disabled", "true");
}

function bankerOffer() {
    offer = calculateOffer();
    instructionDisplay.innerText = `Banker offers $${offer.toLocaleString()}`;
    caseBoard.style.opacity = 0;
    decisionButtons.style.display = "inherit";
}

function takeDeal() {
    const profit = offer;
    decisionButtons.style.display = "none";
    instructionDisplay.innerText = `Congrats! You won $${profit.toLocaleString()}!`;
}

function leaveDeal() {
    round++;
    const activeCases = document.querySelectorAll(".case[disabled=true]");
    if(activeCases.length == 1){
        revealCase();
    }
    else{
        caseBoard.style.opacity = 100;
        decisionButtons.style.display = "none";
        casePicks = Math.max(Math.floor((26 - activeCases.length) / 5), 1);
        instructionDisplay.innerText = `Cases to select: ${casePicks}`;
    }

}

function revealCase() {
    instructionDisplay.innerText = `Your case contained $${selectedCase.id}`

}


startGame();
