const caseBoard = document.querySelector("#caseBoard");
const valueBoard = document.querySelector("#valueBoard");
const cases = document.querySelectorAll(".case");
const values = document.querySelectorAll(".value");
const instruction = document.getElementById("instructions");

let vals = [...values];

const SHUFFLEPASSES = 3;
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
            values.forEach((v) => {
                if(v.id == vals[c.dataset.casenum - 1].id){
                    v.style.backgroundColor = "gray";
                }
            })
            c.setAttribute("disabled", "true");
        });
    })
}

initButtons();
