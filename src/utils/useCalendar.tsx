

const calcDaysOfMonth = (month: number, year: number):number => {
    const m31: number[] = [0, 1, 3, 5, 7, 8, 10, 12];
    if(m31.includes(month))
        return 31;
    else if(month !== 2)
        return 30;
    else if(year % 4 === 0)
        return 29;
    else
        return 28;
}

const months: string[] = ["Dezember", "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", "Januar"];
const weekdays: string[] = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

const isSameDate = (date1: Date, date2: Date): boolean => {
    if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())
        return true;
    return false
}

const formatDateDB = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export {
    calcDaysOfMonth,
    months,
    weekdays,
    isSameDate,
    formatDateDB
}