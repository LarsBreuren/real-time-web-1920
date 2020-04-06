const input = document.getElementById('text');
const log = document.getElementById('shirtText');

input.addEventListener('input', updateValue);

function updateValue(e) {
  log.textContent = e.target.value;
}

const laag = document.getElementById('XMLID_55_');
const laag2 = document.getElementById('XMLID_57_');
let radios = document.forms["shirt"].elements["user[color]"];
for (var i = 0, max = radios.length; i < max; i++) {
  radios[i].onclick = function () {
    laag.style.fill = this.value;
    laag2.style.fill = this.value;
  }
}

const text = document.getElementById('shirtText');
let radios2 = document.forms["shirt"].elements["text[color]"];
for (var i = 0, max = radios2.length; i < max; i++) {
  radios2[i].onclick = function () {
    text.style.color = this.value;
  }
}