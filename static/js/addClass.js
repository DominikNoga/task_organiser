import {displayMessage} from './functions.js'
const form = document.querySelector(".form")
const inputs = document.getElementsByTagName("input");
const placholders = ["enter username", "Pass your email address", "Enter password",
    "Retype your password"
]
let i = 1;
for(i; i < inputs.length; i++) {
    inputs[i].classList.add("input-reg");
    inputs[i].minLength = 6;
    inputs[i].placeholder = placholders[i-1];
    inputs[i].autocomplete = "off";
}
const username = document.querySelector("#id_username");
const password = document.querySelector("#id_password1");
const password2 = document.querySelector("#id_password2");
const errorMessages  = document.querySelector(".errorMessages");
let okFlag = false;
password2.addEventListener("input", () => {
    if(username.value.length < 1)
        return
    if (password.value === password2.value){
        errorMessages.innerHTML = "Passwords are the same";
        errorMessages.classList.remove("errorMessages-wrong");
        errorMessages.classList.add("errorMessages-ok");
        okFlag = true;
    }
    else{
        if(okFlag){
            errorMessages.innerHTML = "Passwords are not the same";
            errorMessages.classList.remove("errorMessages-ok");
            errorMessages.classList.add("errorMessages-wrong");
            okFlag = false;
        }
    }
})
form.addEventListener("submit",(f) =>{
    if(!okFlag){
        f.preventDefault();
        displayMessage("Your passwords dosen't match")
    }
})