/**** arrow function as a methods ****/
// #1
const user = {
  name: 'Frank',
  getName: function () {
    console.log(this.name, this)
  },
  getNameFromArrowFunction: () => {
    console.log(this.name, this)
  }
};
user.getName(); // Frank Object { name: "Frank", getName: getName(), getNameFromArrowFunction: getNameFromArrowFunction() }
user.getNameFromArrowFunction(); // <empty string> Window about:newtab // at Firefox
user.getNameFromArrowFunction(); // undefined {} // at node

// #2
class Person {
  age = 30;
  constructor () {
    this.getAgeWithBind = this.getAgeWithBind.bind(this);
  }
  getAge() {
    console.log(this);
  }
  getAgeWithBind() {
    console.log(this.age);
  }
  getAgeFromArrow = () => {
    console.log(this.age);
  };
}
const Ann = new Person();
const { getAge, getAgeFromArrow, getAgeWithBind } = Ann;

getAge(); // undefined. todo - WHY undefined, not Window or Global???
global.getAge = getAge;
global.getAge(); // Object Global
getAgeFromArrow(); // 30
getAgeWithBind(); // 30

// #3
const basket = { price: 200, quantity: 2 }
Object.defineProperty(basket, 'totalArrow', {
  get: () => {
    return this.price * this.quantity;
  }
})
Object.defineProperty(basket, 'total', {
  get() {
    return this.price * this.quantity;
  }
})
console.log(basket.totalArrow); // NaN
console.log(basket.total); // 400

/**** No binding of arguments ****/
// #1
const arguments = [1,2,3];
const getArgumentsFromArrowFunction = () => arguments[0];
console.log(getArgumentsFromArrowFunction()); // 1

// #2
function wrapperFunction(){
  const doubledValue = () => arguments[0] * 2;
  return doubledValue();
}
console.log(wrapperFunction(50)) // 100

// #3
function outerFunction(value) {
  const multiply = (...args) => args[0] * value;
  return multiply(1);
}
console.log(outerFunction(2)); // 2

/**** cannot be used as constructors and doesn't have prototype ****/
const Foo = () => 1;
// const foo = new Foo(); // TypeError: Foo is not a constructor
console.log('prototype' in Foo); // false

/**** cannot be used as generators ****/
const counter = (value) => {
  while (value < 10) {
    // yield value; // SyntaxError: Unexpected identifier
    value++;
  }
}

/**** precedence of arrow ****/
let callback;
// callback = callback || () => {} // SyntaxError: Malformed arrow function parameter list
// parsed `callback || ()` as arguments, because `=>` has a lower precedence than most operators
callback = callback || (() => {}) // OK

/**** using call, bind, apply ****/
// important: running at the browser!

// normal function
const animals = { cat: 1 }
// important: uncommented out next line during the run
// window.cat = 10;
function calculate(...args) {
  console.log(this.cat + args[0] + args[1] + args[2]);
}

calculate.call(animals, 1,2,3); // 7
calculate.apply(animals, [1,2,3]); // 7
const bindCalculate = calculate.bind(animals, 1,2,3);
bindCalculate(); // 7

// arrow function
const calculateArrow = (...args) => {
  console.log(this.cat + args[0] + args[1] + args[2]);
}

calculateArrow.call(animals, 1,2,3); // 16
calculateArrow.apply(animals, [1,2,3]); // 16
const bindCalculateArrow = calculateArrow.bind(animals, 1,2,3);
bindCalculateArrow(); // 16

/**** nested functions ****/
const obj = {
  count: 0,
  doSomethingLater() {
    setTimeout(function () {
      this.count++;
      console.log(this.count) // NaN, because calling at the global context
    },0);
  },
  doSomethingLaterArrow() {
    setTimeout(() => {
      this.count++;
      console.log(this.count); // 1, because arrow function doesn't have its own binding
    })
  }
}
obj.doSomethingLater();
obj.doSomethingLaterArrow();
