import loopAnimation from './animationTest';

const jsDiv = document.getElementsByClassName('js-test')[0];
const h2 = document.createElement('h2');
h2.innerText = 'JS is working';
jsDiv.appendChild(document.createElement('h2'));
jsDiv.appendChild(h2);

loopAnimation();

async function testApi() {
    return fetch('./api/')
    .then(response => response.json())
    .then(data => {
        const phpDiv = document.getElementsByClassName('php-test');
        const h2 = document.createElement('h2');
        h2.innerText = data;
        phpDiv[0].appendChild(h2); 
    });
}

testApi();

