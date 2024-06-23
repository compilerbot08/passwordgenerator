const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const symbolCheck = document.querySelector("#symbols");
const numbersCheck = document.querySelector("#numbers");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|\:;"<,>.?/';
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
}
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copMsg.innerText = "Copied";
    }
    catch(e){
        copMsg.innerText = "Failed";
    }
    copMsg.classList.remove("active");
    setTimeout( () => {
        copMsg.classList.add("active");
    },2000);
}
function shufflePassword(array){
    for (let i = array.length -1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach( (el) => (str += el));
    return str;
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    if (passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

inputSlider.addEventListener('input' , (e) =>{
    passwordLength = e.target.value;
    handleSlider();
});
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});
copyBtn.addEventListener('click', (e) => {
    if (passwordDisplay.value)
        copyContent();
});
generateBtn.addEventListener('click', () => {
    if (checkCount <=0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";
    let funcArr = [];
    if (uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if (lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if (symbolCheck.checked){
        funcArr.push(generateSymbol);
    }
    for (let i=0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }
    for (let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});