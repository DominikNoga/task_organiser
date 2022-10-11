class Box{
    constructor(number, text){
        this.number = number;
        this.text = text;
    }
    createDiv = () =>{
        return `<div class="box">
    Number=${this.number} <br>
    text=${this.text}
    <br>
</div>`
    }
}
class BoxManager{
    constructor(){
        this.boxes = []
        const texts = ["og", "pozdro", "elo", "siemano","unda",
            "bela", "txt", "nome", "nomens", "lsl", "dkkfdks",
            "fdsfdfsd", "laldlasllv"
        ]
        for(let i = 0; i < 13; i++){
            this.boxes.push(new Box(i%5, texts[i]))
        }
    }
}
class LayoutManager{
    constructor(){
        this.bm =  new BoxManager();
        this.boxes = this.bm.boxes;
        this.nuberDivs = document.getElementsByClassName("number");
        this.numbers = [2, 3, 4]
        this.buttons = document.getElementsByClassName("change-number");
        this.left = 0;
        this.right = 1;
        this.rowDivs = document.getElementsByClassName("row")
        this.rows = [new Row(this.numbers[0], this.boxes),
            new Row(this.numbers[1], this.boxes),
            new Row(this.numbers[2], this.boxes),
        ]
    }
    init = () => {
        this.buttons[this.left].addEventListener("click",() =>{
            this.updateRows(-1);
        })
    
        this.buttons[this.right].addEventListener("click",() =>{
            this.updateRows(1)
        })
    }
    
    createLayout = () =>{
        this.rows.forEach((row, i) =>{
            row.fillRow(this.rowDivs[i])
        });
    }
    updateRows = (value) =>{
        this.rows.forEach((row, i) =>{
            row.number += value;
            row.setBoxes(this.boxes);
            row.clearRow(this.rowDivs[i]);
            row.fillRow(this.rowDivs[i]);
        });
    }
    
}
class Row{
    constructor(number, boxes){
        this.number = number;
        this.boxes = boxes.filter((box)=>{
            return box.number === this.number;
        });
    }
    fillRow = (div) =>{
        this.boxes.forEach((box)=>{
            div.innerHTML += box.createDiv();
        });
    }
    clearRow = (div) =>{
        div.innerHTML = '';
    }
    setBoxes = (boxes) =>{
        this.boxes = boxes.filter((box)=>{
            return box.number === this.number;
        });
    }

}

const lm = new LayoutManager();
lm.init()
lm.createLayout();