
const caseBoard = document.querySelector("#caseBoard");
const valueBoard = document.querySelector("#valueBoard");
const cases = document.querySelectorAll(".case");
const values = document.querySelectorAll(".value");
const instructionDisplay = document.getElementById("instructions");
const selectedCase = document.getElementById("caseSelection");
const decisionButtons = document.getElementById("decisionButtons");
const takeDealBtn = document.getElementById("takeBtn");
const leaveDealBtn = document.getElementById("leaveBtn");
const masterCase = document.getElementById("masterCase");
const masterCaseEdge = document.getElementById("masterCaseEdge");
const masterCaseNum = document.getElementById("revealCase");
const masterCaseValue = document.getElementById("revealValue");
const bankerOfferContainer = document.getElementById("bankerOffer");
const currentOffer = document.getElementById("currentOffer");
const previousOffers = document.getElementById("previousOffers");
const mcC = document.getElementById("mcC");
const mcV = document.getElementById("mcV");
const SHUFFLEPASSES = 3;
const CASEPICKNUM = 4;
const ROUNDS = 10;

let isAnimating = false;
let isOffering = false;
let firstCase = true;
let selectedCaseNum;
let casePicks = CASEPICKNUM;
let valueSum = 0;
let round = 1;
let roundsLeft = ROUNDS;
let offer;

let vals = [...values];
let valsLeft = vals.length;
let revealedVal;

masterCase.addEventListener("animationend", () => {
    flipValue(revealedVal);
    caseBoard.style.display = "grid";
    masterCase.style.display = "none";
    isAnimating = false;
    if(casePicks == 0){
        bankerOffer();
    }
    else {
        instructions.style.visibility = "visible";
    }
});


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
            if(!isAnimating && !isOffering){
                handleCaseClick(c);
                
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

// Banker's formula:
// factor in:
// -Volatility: the difference between the largest value and the smallest value
// -Avg:
function calculateOffer() {
    const ev = Math.round(valueSum/valsLeft);
    const calculation = ev * (round/roundsLeft);
    return calculation;
}


function startGame() {
    casePicks = CASEPICKNUM;
    loadJson();
    initButtons();
    masterCase.style.display = "none";
    bankerOfferContainer.style.display = "none";
    takeDealBtn.addEventListener("click", takeDeal);
    leaveDealBtn.addEventListener("click", leaveDeal);
    decisionButtons.style.display = "none";
    values.forEach((v) => {
        valueSum += parseInt(v.id);
    });
}

function handleFirstCase(c) {
    firstCase = false;
    const playerCase = document.createElement("h3");
    playerCase.innerText = c.dataset.casenum;
    selectedCaseNum = c.dataset.casenum;
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
        revealCase(c, vals[c.dataset.casenum-1]);
        casePicks--;
        valsLeft--;
        instructionDisplay.innerText = `Cases to select: ${casePicks}`;
    }
    c.setAttribute("disabled", "true");
    
}

 
function revealCase(c, v) {
    revealedVal = v;
    c.style.opacity = 0;
    instructions.style.visibility = "hidden";
    caseBoard.style.display = "none";
    masterCase.style.display = "flex";
    mcC.innerText = c.dataset.casenum;
    mcV.innerText = v.textContent;
    c.classList.add("case-revealed");
    isAnimating = true;
    valueSum -= parseInt(v.id);

}

function flipValue(val) {
    val.classList.add("valueFlip");
    val.addEventListener("transitionend", () => {
        val.classList.remove("valueFlip");
        val.classList.add("value-revealed");
    })
}

function bankerOffer() {
    caseBoard.style.display = "none";
    bankerOfferContainer.style.display = "block";
    isOffering = true;
    offer = calculateOffer();
    currentOffer.innerText = `$${offer.toLocaleString()}`;
    decisionButtons.style.display = "flex";
}

function takeDeal() {
    const profit = offer;
    decisionButtons.style.display = "none";
    instructionDisplay.innerText = "Your case contained:";
    endGame();
}

function leaveDeal() {
    round++;
    isOffering = false;
    decisionButtons.style.display = "none";
    bankerOfferContainer.style.display = "none";
    const activeCases = document.querySelectorAll(".case-revealed");
    console.log(activeCases);
    if(activeCases.length == 1){
        endGame();
    }
    else{
        caseBoard.style.display = "grid";
        instructions.style.visibility = "visible";
        casePicks = Math.max(Math.floor((26 - activeCases.length) / 5), 1);
        instructionDisplay.innerText = `Cases to select: ${casePicks}`;
        addToPreviousOffers();
    }
}

function endGame() {
    console.log("Game End");

}

function addToPreviousOffers() {
    const newItem = document.createElement("li");
    newItem.innerText = `${offer.toLocaleString()}`;
    let firstChild = previousOffers.firstChild;
    previousOffers.insertBefore(newItem, firstChild);
}

startGame();
