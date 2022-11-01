export const displayMessage = (text) => {
    const main = document.querySelector("body");
    const div  = document.createElement("div");
    div.classList.add("popupMessage");
    div.innerHTML = text;
    div.style.display = "block";
    main.appendChild(div);
    setTimeout(()=>{
        main.removeChild(div);
    }, 4000);
}
export const getSelectValues = (select) => {
    const result = [];
    const options = select && select.options;
    let opt;
  
    for (let i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
}