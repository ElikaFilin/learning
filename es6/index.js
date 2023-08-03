// arrow function
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
    console.log(this.age);
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
// getAge(); // TypeError: Cannot read properties of undefined (reading 'age')
getAgeFromArrow(); // 30
getAgeWithBind(); // 30
// calling the getAgeFromArrow and getAgeWithBind have no difference, but in the following link in third example has the
// comment that it is (If it were a normal method, it should be undefined in this case)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#cannot_be_used_as_methods

