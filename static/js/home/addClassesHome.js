const taskFormInputFields = document.querySelectorAll("form input, form select");
const labels = document.querySelectorAll("form label");
taskFormInputFields.forEach((field) =>{
    if(field.name === "deadline")
        field.type = "datetime-local";
    
    else if(field.name === "importancy"){
        field.type = "range";
        field.min = 1;
        field.max = 9;
    }
    field.classList.add("taskInputField");
})

labels.forEach((label) => {
    label.classList.add("field-label");
})

const range = document.querySelectorAll("input[type='range']")[0];
range.classList.replace("taskInputField", "rangeInputField");
const rangeDiv = document.getElementsByClassName("rangeValue")[0];
range.addEventListener("input", () => {
    rangeDiv.innerText = range.value; 
})