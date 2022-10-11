const form = document.querySelector('.form');

let opacity = 0;
let int = setInterval(() =>{
    opacity += 0.1;
    form.style.opacity = opacity.toString();
    if(form.style.opacity >= 1)
        clearInterval(int);
}, 150)   

