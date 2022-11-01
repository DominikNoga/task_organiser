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
    calcDateDifferance = (date1, date2) =>{
        
        return ((date1.getTime() - date2.getTime())/(1000 * 3600 * 24) + 1);

    }
    formatDate = (date) => {
        return [
            (date.getDate()).toString().padStart(2, '0'),
            (date.getMonth()+1).toString().padStart(2, '0'),
            date.getFullYear()
        ].join("-");
    }
    createDateFromString = (dateString) => {
        return new Date(
            dateString.replace("-", ",")
        );
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
        const date = new Date(dateString);
        date.setHours(date.getHours() - 2);
        return date;
    }
    cutTime = (date) =>{
        return new Date(date.getFullYear(), 
            date.getMonth(), date.getDate()
        );
    }
}   