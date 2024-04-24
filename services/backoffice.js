//Importation des modèles représentant la structure des données en BDD
const { Service, Schedules, News, Appointment, User } = require('../model/index');

async function getAllServices(req, withObsoletes = true) {
    let options = { order: [['name', 'ASC']] };
    if(!withObsoletes){ options.where = { obsolete: 0 }; }

    return await Service.findAll(options);
}

async function getAllSchedules(req) {
    return await Schedules.findAll({order: [['order', 'ASC']]})
}

async function getAllSchedulesNotInBase() {
    const days = await Schedules.findAll();

    let daysToReturn = [];
    ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].forEach(dayNotInBDD => {
        if(!days.some(dayInBDD => dayInBDD.dayOfWeek === dayNotInBDD)){ daysToReturn.push(dayNotInBDD); }
    });

    return daysToReturn;
}

async function getAllNews(req, withObsoletes = true) {
    let options = {
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
        ],
        order: [['createdAt', 'DESC']]
    };
    if(!withObsoletes){ options.where = { obsolete: 0 }; }

    let news = await News.findAll(options);

    //console.log((news[0].createdAt).getDate());

    news.forEach(theNews => {
        const fullDate     = dateToStrFr(theNews.createdAt, true);
        const [date, time] = fullDate.split(' ');

        theNews.author = theNews.User.firstName + ' ' + theNews.User.lastName;

        theNews.fullTitle = fullDate + ' - ' + theNews.title + ' - ' + theNews.User.firstName + ' ' + theNews.User.lastName;
        theNews.date = date;
        theNews.time = time;
    });

    return news;
}

async function getAllPatients(req) {
    return await User.findAll({
        where: {role: 'Patient'},
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    })
}

async function getAllProfessionals(req) {
    return await User.findAll({
        where: {role: 'Professional'},
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    })
}

async function getAllAppointments(req) {
    let appointments = await Appointment.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
            },
            {
                model: Service,
                attributes: ['id', 'name']
            },
        ],
        order: [['date', 'DESC'], ['time', 'DESC']]
    });

    appointments.forEach(appointment => {
        appointment.frenchDate  = dateToStrFr(appointment.date);
        appointment.frenchTime  = appointment.time.slice(0, appointment.time.length-3);
        appointment.dateInStrUS = dateToStrUS(appointment.date);
        appointment.title       = appointment.User.firstName + ' ' + appointment.User.lastName + ' - ' + 
                                 appointment.Service.name + ' - ' + appointment.frenchDate + ' - ' + appointment.frenchTime;                        
    });

    return appointments;
}

function dateToStrFr(date, withTime = false){
    const day   = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year  = date.getFullYear();

    let dateToReturn = `${day}/${month}/${year}`;
    if(withTime){
        const hours   = date.getHours();
        const minutes = date.getMinutes();
        dateToReturn += ` ${hours}:${minutes}`;
    }

    return dateToReturn; 
}

function dateToStrUS(date){
    let day   = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year  = date.getFullYear();

    return `${year}-${month}-${day}`; 
}

function getDayOrder(dayName){
    const days = {'Lundi': 1, 'Mardi': 2, 'Mercredi': 3, 'Jeudi': 4, 'Vendredi': 5, 'Samedi': 6, 'Dimanche': 7};

    return days[dayName];
}

module.exports = {
    getAllServices, getAllSchedules, getAllNews, getAllSchedulesNotInBase,
    getAllAppointments, getDayOrder, getAllPatients, getAllProfessionals,
    dateToStrFr, dateToStrUS
};