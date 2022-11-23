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
export const displayAcceptMessage = (text, btnAcceptText, btnCancelText) => {
  const body = document.querySelector("body");
  const div  = document.createElement("div");
  let timeLeft = 10;
  div.classList.add("popupMessage");
  div.innerHTML = `<h4>${text}</h4>`;
  div.innerHTML += `<button class="btn-submit" id="popupSubmit">${btnAcceptText}</button> &emsp; 
<button class="btn-cancel" id="popupCancel">${btnCancelText}</button>
<div class="timer">${timeLeft}</div>`;
  div.style.display = "block";
  body.appendChild(div);
  const interval = setInterval(() => {
      const timerDiv = document.querySelector(".timer")
      if(timerDiv === null){
          clearTimeout(timeout);
          clearInterval(interval);
      }
      else{
          timeLeft -=1;
          timerDiv.innerText = timeLeft;
      }
  }, 1000);
  const timeout = setTimeout(()=>{
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
export const waitForPopup = (subBtn, cancelBtn) =>{
  const body = document.querySelector("body");
  const popup = document.querySelector(".popupMessage");
  return new Promise((resolve, reject) =>{        
      subBtn.addEventListener('click', () =>{
          popup.classList.add("popupMessage-hide")
          setTimeout(() =>{
              body.removeChild(popup);
              resolve();
          }, 600)
          
      })
      cancelBtn.addEventListener('click', () =>{
          popup.classList.add("popupMessage-hide")
          setTimeout(() =>{
              body.removeChild(popup);
              reject();
          }, 600)
      })
  })
}