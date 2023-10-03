class Time {
    static getDateTime() {
        const currentDate = new Date();
        const year = this.formatTimeAddZeros(currentDate.getFullYear(), 4);
        const month = this.formatTimeAddZeros(currentDate.getMonth() + 1, 2);
        const day = this.formatTimeAddZeros(currentDate.getDate(), 2);
        const hours = this.formatTimeAddZeros(currentDate.getHours(), 2);
        const minutes = this.formatTimeAddZeros(currentDate.getMinutes(), 2);
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    static formatTimeAddZeros(number, correctLength) {
        let string = number.toString();
        if (string.length === correctLength) {
        return string;
        } else {
        while (string.length < correctLength) {
            string = "0" + string;
        }
        return string;
        }
    }

    static getTime() {
        const currentDate = new Date();
        const hours = this.formatTimeAddZeros(currentDate.getHours(), 2);
        const minutes = this.formatTimeAddZeros(currentDate.getMinutes(), 2);
        return `${hours}:${minutes}`;
    }
}

export default Time;