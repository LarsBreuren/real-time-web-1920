const conditional = document.querySelector('.conditional');
const testElem = document.createElement('div');
if (testElem.style.flex !== undefined && testElem.style.flexFlow !== undefined) {
  conditional.setAttribute('href', 'flex-layout.css');
} else {
  conditional.setAttribute('href', 'float-layout.css');
}