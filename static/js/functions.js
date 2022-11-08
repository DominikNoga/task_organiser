export const displayMessage = (text) => {
    const body = document.querySelector("body");
    const div  = document.createElement("div");
    div.classList.add("popupMessage");
    div.innerHTML = text;
    div.style.display = "block";
    body.appendChild(div);
    setTimeout(()=>{
        body.removeChild(div);
    }, 4000);
}
export const displayAcceptMessage = (text) => {
  const body = document.querySelector("body");
  const div  = document.createElement("div");
  let timeLeft = 10;
  div.classList.add("popupMessage");
  div.innerHTML = `<h4>${text}</h4>`;
  div.innerHTML += `<button class="btn-submit" id="popupSubmit">Delete</button> &emsp; 
<button class="btn-cancel" id="popupCancel">Cancel</button>
<div class="timer">${timeLeft}</div>`;
  div.style.display = "block";
  body.appendChild(div);
  const interval = setInterval(() => {
      const timerDiv = document.querySelector(".timer")
      timeLeft -=1;
      timerDiv.innerText = timeLeft;
  }, 1000);
  setTimeout(()=>{
      body.removeChild(div);
      clearInterval(interval);
  }, timeLeft*1000);
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