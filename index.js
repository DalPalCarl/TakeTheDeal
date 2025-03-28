
const caseBoard = document.querySelector("#caseBoard");
const valueBoard = document.querySelector("#valueBoard");
const cases = document.querySelectorAll(".case");
const values = document.querySelectorAll(".value");
const instruction = document.getElementById("instructions");
const selectedCaseContainer = document.getElementById("caseSelection");
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
const CASEPICKNUM = 6;
const CASES = 26;
const ROUNDS = 10;

let isAnimating = false;
let isOffering = false;
let firstCase = true;
let selectedCase;
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
    const activeCases = document.querySelectorAll(".case-revealed");
    if(CASES - activeCases.length > 1){
        caseBoard.style.display = "grid";
        masterCase.style.display = "none";
        isAnimating = false;
        if(casePicks == 0){
            bankerOffer();
        }
        else {
            instruction.style.visibility = "visible";
        }
    }
});

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
    const ev = valueSum/valsLeft;
    const calculation = Math.round(ev * (round/roundsLeft));
    return calculation - (calculation % (calculation > 10000 ? 1000 : 100));
}


function startGame() {
    casePicks = CASEPICKNUM;
    initButtons();
    instruction.innerText = "Choose your case"
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
    playerCase.innerText = c.innerText;
    selectedCase = c;
    selectedCaseContainer.style.backgroundColor = "white";
    c.style.opacity = 0;
    selectedCaseContainer.appendChild(playerCase);
    instruction.innerText = `Cases to select: ${casePicks}`;
}

function handleCaseClick(c) {
    if (firstCase){
        handleFirstCase(c);
    }
    else{
        revealCase(c, vals[c.innerText-1]);
        casePicks--;
        valsLeft--;
        instruction.innerText = `Cases to select: ${casePicks}`;
    }
    c.setAttribute("disabled", "true");
    
}

 
function revealCase(c, v) {
    revealedVal = v;
    c.style.opacity = 0;
    instruction.style.visibility = "hidden";
    caseBoard.style.display = "none";
    masterCase.style.display = "flex";
    mcC.innerText = c.innerText;
    mcV.innerText = v.textContent;
    c.classList.add("case-revealed");
    isAnimating = true;
    valueSum -= parseInt(v.id);
}

function revealSelectedCase(c, v) {
    revealedVal = v;
    caseBoard.style.display = "none";
    masterCase.style.display = "flex";
    mcC.innerText = c.innerText;
    mcV.innerText = v.textContent;
    c.classList.add("case-revealed");
    isAnimating = true;
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
    instruction.style.display = "none";
    isOffering = true;
    offer = calculateOffer();
    currentOffer.innerText = `$${offer.toLocaleString()}`;
    decisionButtons.style.display = "flex";
}

function takeDeal() {
    endGame();
}

function leaveDeal() {
    round++;
    isOffering = false;
    decisionButtons.style.display = "none";
    bankerOfferContainer.style.display = "none";
    instruction.style.display = "block";
    const activeCases = document.querySelectorAll(".case-revealed");
    if(CASES - activeCases.length === 1){
        caseBoard.style.display = "grid";
        instruction.style.visibility = "visible";
        endGame();
    }
    else{
        caseBoard.style.display = "grid";
        instruction.style.visibility = "visible";
        casePicks = Math.max(6 - round, 1);
        instruction.innerText = `Cases to select: ${casePicks}`;
        addToPreviousOffers();
    }
}

function endGame() {
    decisionButtons.style.display = "none";
    selectedCaseContainer.style.display = "none";
    bankerOfferContainer.style.display = "none";
    instruction.style.visibility = "visible";
    instruction.innerText = "Your case contained";
    revealSelectedCase(selectedCase, vals[selectedCase.innerText-1])
}

function addToPreviousOffers() {
    const newItem = document.createElement("li");
    newItem.innerText = `$${offer.toLocaleString()}`;
    let firstChild = previousOffers.firstChild;
    previousOffers.insertBefore(newItem, firstChild);
}

startGame();
