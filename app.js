
let inputSlider = document.querySelector("[data-lengthSlider]");
let lengthDisplay = document.querySelector("[data-lengthNumber");
let passwordDisplay = document.querySelector("[data-passwordDisplay");
let copyBtn = document.querySelector("[data-copy");
let copyMsg = document.querySelector("[data-copyMsg");
let uppercaseCheck = document.querySelector("#uppercase");
let lowercaseCheck = document.querySelector("#lowercase");
let numbersCheck = document.querySelector("#numbers");
let symbolsCheck = document.querySelector("#symbols");
let indicator = document.querySelector("[data-indicator]");
let generateBtn = document.querySelector(".generateButton");
let allCheckBox = document.querySelectorAll("input[type=checkbox]");
let symbols = "~`!@#$%^&*()_-+={}[];:<,.>/?";

// default at initial stage
let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
// set strength circle color to gray at start
setIndicator("#ccc")

// sets password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min =  inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}


// set indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// generate random number
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(1,10);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
    let index = getRndInteger(0,symbols.length);
    return symbols.charAt(index);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower =true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    } 
    else if((hasLower || hasUpper)
    && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("0ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(err){
        copyMsg.innerText = "Failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}


inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    });

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener("change",handleCheckBoxChange);
})


function shufflePassword(pass){
    //  Fisher Yates Method
    for(let i= pass.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = pass[i];
        pass[i] = pass[j];
        pass[j] = temp;
    }
    let str = "";
    pass.forEach((ele)=>{
        str += ele;
    });
    return str;
}

generateBtn.addEventListener("click",()=>{
    // none of the checkbox are selected
    if(checkCount <= 0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // create the new password

    // remove the old password
    password = "";

    // lets put the stuff mentioned by checkbox
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbols();
    //}

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }

    // compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+= funcArr[i]();
    }

    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;
    calcStrength();
});
