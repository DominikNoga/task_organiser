const inputs = document.getElementsByTagName("input");
const placholders = ["enter username", "Pass Your email address", "Enter password",
    "Retype your password"
]
let i = 1;
for(i; i < inputs.length; i++) {
    inputs[i].classList.add("input-reg");
    inputs[i].placeholder = placholders[i-1];
}