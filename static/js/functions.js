export const fetchApi = async (url) =>{
    const api = await fetch(url);
    const apiJson = await api.json();
    return apiJson;
}

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
};