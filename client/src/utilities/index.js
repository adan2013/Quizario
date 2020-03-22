export const returnLetter = (number) => {
    switch(parseInt(number)) {
        case 0: return 'A';
        case 1: return 'B';
        case 2: return 'C';
        case 3: return 'D';
        default: return '';
    }
};

export const calculateTime = (seconds, hideMinutes) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds - min * 60;
    if(hideMinutes && min === 0) {
        return addLeadingZero(sec);
    }else{
        return min + ":" + addLeadingZero(sec);
    }
};

export const addLeadingZero = (number) => {
    if(number < 10) return "0" + number; else return number;
};