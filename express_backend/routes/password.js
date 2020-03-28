//create password

//pick a random number from 0-7
const PASSWORDS_SIZE = 8;
const MIN = 0;
const MAX = 7;

function getRandomNumber(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let result = Math.floor(step2) + min;
    return result;
}

function createArrayOfNumbers(start, end) {
    let myArray = [];
    for (let i = start; i <= end; i++) {
        myArray.push(i);
    }
    return myArray;
}

function ArrayOfRandomNumbers() {
    let arrayOfNumbers = createArrayOfNumbers(MIN, MAX)
    let myArrayofRandomNums = [];
    for (let i = 0; i <= PASSWORDS_SIZE - 1; i++) {
        let randomIndex = getRandomNumber(0, arrayOfNumbers.length - 1)
        myArrayofRandomNums[i] = arrayOfNumbers[randomIndex];
        arrayOfNumbers.splice(randomIndex, 1);
    }
    return myArrayofRandomNums;
}

console.log(ArrayOfRandomNumbers());