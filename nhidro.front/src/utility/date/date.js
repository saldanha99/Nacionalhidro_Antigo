import moment from "moment"

moment.locale("pt-br")


export const customFormatDate = (firstFormat, secondFormat, value, isFormatUTC = false) => {
    if (value === null) {
        return null
    }

    if (isFormatUTC) {

        const toDateUtc = moment.utc(value).toDate()
        return moment(toDateUtc, firstFormat, true).local().format(secondFormat)
    }

    return moment(value, firstFormat, true).local().format(secondFormat)

}

export const HoraParaMinuto = (hora) => {
    if (hora && hora.toString().length > 0) {
        const tipo = hora.indexOf(':')
        let minuto = 0
        if (tipo > 0) {
            const itens = hora.split(':')
            minuto = (parseInt(itens[0]) * 60) + parseInt(itens[1])
        } else {
            minuto = hora
        }
        return parseInt(minuto)
    } else {
        return 0
    }
}

export const MinutoParaHora = (minuto) => {
    if (minuto && minuto.toString().length > 0) {

        const totalTempo = parseInt((parseInt(minuto)) / 60)
        let resto = parseInt(minuto) % 60

        if (resto.toString().length === 1) {
            resto = `0${resto}`
        }

        const hora = `${totalTempo}:${resto}`
        return hora
    } else {
        return '0:00'
    }
}

export const DiffDatesInDays = (date1, date2) => {
    if (date1 && date2) {
        date1.set({hour: 0, minute: 0, second: 0, millisecond: 0})
        date2.set({hour: 0, minute: 0, second: 0, millisecond: 0})
        const diferenca = date1.valueOf() - date2.valueOf()
        return Math.floor(diferenca / (1000 * 60 * 60 * 24))
    }
    return null
}

export const FormatarHoraParaTime = (hora) => {
    let hours = Number(hora)
    let minutes = 0
    let seconds = 0

    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    if (seconds < 10) seconds = `0${seconds}`
    return `${hours}:${minutes}:${seconds}`
}

export const TimeStringToFloat = (time) => {
    if (!time || !time.length) return 0
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
}

export const dateSort = (a, b) => {
    
    const dateA = moment(a).toDate();
    const dateB = moment(b).toDate();

    if (dateA < dateB) {
        return -1;
    }
    if (dateA > dateB) {
        return 1;
    }
    return 0;
};

export const convertDateFormat = (dateString) => {
  const originalFormat = 'DD/MM/YYYY';
  const targetFormat = 'MM-DD-YYYY';

  const date = moment(dateString, originalFormat);
  const convertedDate = date.format(targetFormat);

  return convertedDate;
};

export const compareDates = (d1, d2) => {
    try {
        const date1 = new Date(d1).toISOString().split('T')[0];
        const date2 = new Date(d2).toISOString().split('T')[0];

        return date1 === date2;
    } catch (error) {
        console.log(error);
        return false
    }
}