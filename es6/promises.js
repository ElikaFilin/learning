/**** chained promises ****/
// #1
function onFulfilledA(value) {
  console.log(`onFulfilledA: ${value}`);
  return generateCommonPromise('generated promise #2 was fulfilled');
}
function onRejectedA(error) {
  console.log(`onRejectedA: ${error}`);
}
function onFulfilledB(value) {
  console.log(`onFulfilledB: ${value}`);
  return generateCommonPromise('generated promise #3 was fulfilled');
}
function onRejectedB(error) {
  console.log(`onRejectedB: ${error}`);
}
function onFulfilledC(value) {
  console.log(`onFulfilledC: ${value}`);
}
function onRejectedC(error) {
  console.log(`onRejectedC: ${error}`);
}

function generateCommonPromise(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    },0);
  })
}

generateCommonPromise('generated promise #1 was fulfilled')
  .then(onFulfilledA, onRejectedA) // onFulfilledA: generated promise #1 was fulfilled
  .then(onFulfilledB, onRejectedB) // onFulfilledB: generated promise #2 was fulfilled
  .then(onFulfilledC, onRejectedC) // onFulfilledC: generated promise #3 was fulfilled

// #2
function onRejected(error) {
  console.log(`onRejected: ${error}`);
}
generateCommonPromise('generated promise #1 was fulfilled')
  .then(onFulfilledA)
  .then(onFulfilledB)
  .then(onFulfilledC)
  .catch(onRejected)

// #3
function generateRejectedPromise(value) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(value)
    },0);
  })
}
function onFulfilledA2(value) {
  console.log(`onFulfilledA2: ${value}`);
  return generateRejectedPromise('generated promise #2 was REJECTED. Previous promises were skipped');
}
function onRejectedA2(error) {
  console.log(`onRejectedA2: ${error}`);
}
function onFulfilledB2(value) {
  console.log(`onFulfilledB2: ${value}`);
  return generateCommonPromise('generated promise #4 was fulfilled');
}
function onRejectedB2(error) {
  console.log(`onRejectedB2: ${error}`);
}
function onFulfilledC2(value) {
  console.log(`onFulfilledC2: ${value}`);
}
function onRejectedC2(error) {
  console.log(`onRejectedC2: ${error}`);
}

generateCommonPromise('generated promise #1 was fulfilled')
.then(onFulfilledA2, onRejectedA2) // onFulfilledA: generated promise #1 was fulfilled
.then(onFulfilledB2, onRejectedB2) // onFulfilledB: generated promise #2 was REJECTED
.then(onFulfilledC2, onRejectedC2) // onFulfilledC: undefined

// #4
function onRejectedAll(error) {
  console.log(`onRejectedAll: ${error}`);
}
generateCommonPromise('generated promise #1 was fulfilled')
.then(onFulfilledA2) // onFulfilledA: generated promise #1 was fulfilled
.then(onFulfilledB2) // skip
.then(onFulfilledC2) // skip
.catch(onRejectedAll) // onRejected: generated promise #2 was REJECTED. Previous promises were skipped
.then(onFulfilledB2) // onFulfilledB: undefined // note: than after catch works as a finally
.then(onFulfilledB2) // onFulfilledB: generated promise #4 was fulfilled // note: next then also works as a finally

// #5
generateCommonPromise('Hi!')
.then((value) => `${value} I'm Elika.`)
.then((value) => `${value} I'm really into coding.`)
.then((value) => `${value} How about you?`)
.then((value) => console.log(value))
.catch((error) => console.error(error))

// #6
const promise = new Promise(resolve => resolve(100));
promise.then(value => console.log(value)).catch((error) => console.error(error)) // 100
promise.then(value => console.log(value)).catch((error) => console.error(error)) // 100

// #7
// Important: An action for an already "settled" promise will occur only after the stack has cleared and a clock-tick has passed
promise.then(value => console.log('Asynchronous log', value)).catch((error) => console.error(error))
console.log('Synchronous log')

// Logs:
// Synchronous log
// Asynchronous log 100

/**** Thenable interface ****/
  const thenableObject = {
    then(onFulfilled, onRejected) {
      onFulfilled({
        then(innerOnFulfilled, innerOnRejected) {
          innerOnFulfilled(2);
        }
      })
    }
  }
Promise.resolve(thenableObject).then(value => { console.log(value) }) // 2

/**** Promise concurrency ****/
Promise.all([])
Promise.allSettled([])
Promise.any([Promise.resolve(3)])
Promise.race([])

/**** Example with diverse situations ****/
// todo - grasping into this example
// To experiment with error handling, "threshold" values cause errors randomly
const THRESHOLD_A = 0; // can use zero 0 to guarantee error

function tetheredGetNumber(resolve, reject) {
  setTimeout(() => {
    const randomInt = Date.now();
    const value = randomInt % 10;
    if (value < THRESHOLD_A) {
      resolve(value);
    } else {
      reject(`Too large: ${value}`);
    }
  }, 500);
}

function determineParity(value) {
  const isOdd = value % 2 === 1;
  return { value, isOdd };
}

function troubleWithGetNumber(reason) {
  const err = new Error("Trouble getting number", { cause: reason });
  console.error(err);
  throw err;
}

function promiseGetWord(parityInfo) {
  return new Promise((resolve, reject) => {
    const { value, isOdd } = parityInfo;
    if (value >= THRESHOLD_A - 1) {
      reject(`Still too large: ${value}`);
    } else {
      parityInfo.wordEvenOdd = isOdd ? "odd" : "even";
      resolve(parityInfo);
    }
  });
}

new Promise(tetheredGetNumber)
.then(determineParity, troubleWithGetNumber)
.then(promiseGetWord)
.then((info) => {
  console.log(`Got: ${info.value}, ${info.wordEvenOdd}`);
  return info;
})
.catch((reason) => {
  if (reason.cause) {
    console.error("Had previously handled error");
  } else {
    console.error(`Trouble with promiseGetWord(): ${reason}`);
  }
})
.finally((info) => console.log("All done"));
