export default class DateManager{
    constructor() {
        this.dateArr = [new Date(), new Date(), new Date()];
        for(let i=-1; i<2; i++){
            this.dateArr[i+1].setDate(this.dateArr[i+1].getDate() + i)
        }
        this.dateDivs = document.getElementsByClassName('date-link')
    }
    updateDateSlider = () =>{
        this.dateArr.forEach((date, index) =>{
            this.dateDivs[index].innerHTML = this.formatDate(date)    
        })
    }
    updateDates = (value) => {
        this.dateArr.forEach(date => {
            date.setDate(date.getDate() + value)
        });
    }
    formatDate = (date) => {
        return [
            (date.getDate()).toString().padStart(2, '0'),
            (date.getMonth()+1).toString().padStart(2, '0'),
            date.getFullYear()
        ].join("-");
    }

    formatDatetime = (date) => {
        return [
            (date.getDate()).toString().padStart(2, '0'),
            (date.getMonth()+1).toString().padStart(2, '0'),
            date.getFullYear()
        ].join("-") + " " + date.getHours().toString().padStart(2, "0") 
        + ":" + date.getMinutes().toString().padStart(2, "0");
    }
    stringToDate = (dateString) => {
        return(new Date(
            (Number(dateString) - 7200)*1000
        ))
    }
    cutTime = (date) =>{
        return new Date(date.getFullYear(), 
            date.getMonth(), date.getDate()
        );
    }
}   