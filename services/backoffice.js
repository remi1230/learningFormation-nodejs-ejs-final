//Importation des modèles représentant la structure des données en BDD
const { Service, Schedules, News, Appointment, User } = require('../model/index');

async function getAllServices(req) {
    return await Service.findAll({
        where: { obsolete: 0 },
        order: [['name', 'ASC']]
    })
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

async function getAllNews(req) {
    return await News.findAll({
        order: [['title', 'ASC']]
    })
}

async function getAllPatients(req) {
    return await User.findAll({
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

function dateToStrFr(date){
    let day   = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year  = date.getFullYear();

    return `${day}/${month}/${year}`; 
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

module.exports = { getAllServices, getAllSchedules, getAllNews, getAllSchedulesNotInBase, getAllAppointments, getDayOrder, getAllPatients };