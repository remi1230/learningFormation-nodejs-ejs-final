const getById = id => document.getElementById(id);

//Variables globales
let glo = {
    urls: {
        base: 'http://localhost:3000/',
        takeAppointment: 'takeAppointment',
        connexion: 'connexion',
        service: 'service/',
        servicesInJSON: 'services/json',
        newsInJSON: 'news/json',
        schedulesInJSON: 'schedules/json',
        appointmentInJSON: 'appointments',
        news: 'news/',
        schedules: 'schedules/',
        appointment: 'appointment/',
        patient: 'patient/',
    },
    idsToUpd: {
        serviceId: 0,
    }
};

let servicesHTMLSelect    = getById('serviceId');
let appointmentHTMLSelect = getById('appointmentId');
let patientHTMLSelect     = getById('patientId');
let newsHTMLSelect        = getById('newsId');
let schedulesHTMLSelect   = getById('updSchedulesForm') ? getById('updSchedulesForm').querySelector('[name="schedulesId"]') : undefined;

const getSelectMaxValue   = (select = servicesHTMLSelect) => Math.max(...[...select.children].map(option => parseInt(option.value)));
const getSelectFirstValue = (HTMLSelect)  => [...HTMLSelect.children][0].value;
const deleteService       = (serviceId)   => { getInFetch(glo.urls.base + glo.urls.service + 'delete/' + serviceId, reloadServicesSelectAndInit); }
const deleteNews          = (newsId)      => { getInFetch(glo.urls.base + glo.urls.news + 'delete/' + newsId, reloadNewsSelectAndInit); }
const deleteSchedules     = (schedulesId) => { getInFetch(glo.urls.base + glo.urls.schedules + 'delete/' + schedulesId, reloadSchedulesSelectAndInit); }

//ÉVÈNEMENTS
document.addEventListener('DOMContentLoaded', function() {
    let appointmentDone = getById('appointmentDone');
    if(appointmentDone && appointmentDone.style.display === 'block'){ fadeOut(appointmentDone); }
});

if(getById('takeAppointment')){
    getById('takeAppointment').addEventListener('click', function(e){
        window.open(glo.urls.base + glo.urls.takeAppointment, '_blank');
    });
    getById('connexion').addEventListener('click', function(e){
        window.open(glo.urls.base + glo.urls.connexion, '_blank');
    });
}

if(location.pathname === '/login' && servicesHTMLSelect){
    servicesHTMLSelect.addEventListener('change', function(e){ getServiceInfos(e.target.value); });
    newsHTMLSelect.addEventListener('change', function(e){ getNewsInfos(e.target.value); });
    schedulesHTMLSelect.addEventListener('change', function(e){ getSchedulesInfos(e.target.value); });
    appointmentHTMLSelect.addEventListener('change', function(e){ getAppointmentInfos(e.target.value); });
    patientHTMLSelect.addEventListener('change', function(e){ getPatientInfos(e.target.value); });
    initServicesSelect();
    initNewsSelect();
    initSchedulesSelect();
    initAppointmentSelect();
    initPatientSelect();

    //Services
    addListenerOnForm('addServiceForm', 'service/add', 'POST', false, reloadServicesSelectAndInit, function(){ return 'last'; });
    addListenerOnForm('updServiceForm', 'service/upd/', 'PUT', 'serviceId', reloadServicesSelectAndInit, function(){ return servicesHTMLSelect.value; }, ['obsolete']);

    //News
    addListenerOnForm('addNewsForm', 'news/add', 'POST', false, reloadNewsSelectAndInit, function(){ return 'last'; });
    addListenerOnForm('updNewsForm', 'news/upd/', 'PUT', 'newsId', reloadNewsSelectAndInit, function(){ return newsHTMLSelect.value; }, ['obsolete']);

    //Schedules
    addListenerOnForm('addSchedulesForm', 'schedules/addOrUpd', 'POST', false, reloadSchedulesSelectAndInit, function(){ return 'last'; });
    addListenerOnForm('updSchedulesForm', 'schedules/addOrUpd', 'POST', false, reloadSchedulesSelectAndInit, function(){ return schedulesHTMLSelect.value; });

    //Appointment
    addListenerOnForm('updAppointmentForm', 'appointment/upd/', 'PUT', 'appointmentId', appointmentUpdated, function(){ return undefined; });

    //Suppression Service, News et Schedules
    getById('deleteServiceButton').addEventListener('click', function(e){ deleteService(servicesHTMLSelect.value); });
    getById('deleteNewsButton').addEventListener('click', function(e){ deleteNews(newsHTMLSelect.value); });
    getById('deleteSchedulesButton').addEventListener('click', function(e){ deleteSchedules(schedulesHTMLSelect.value); });
}
else if(location.pathname === '/service'){
    const serviceHTMLItem = {
        select    : getById('serviceId'),
        cardTitle : getById('serviceDescription'),
        cardText  : getById('serviceDetail'),
    };

    document.addEventListener('DOMContentLoaded', function() {
        const serviceSelectFirstId   = getSelectFirstValue(serviceHTMLItem.select);
        serviceHTMLItem.select.value = serviceSelectFirstId;
        
        showServiceById(serviceSelectFirstId);
    });

    getById('serviceId').addEventListener('change', function(e){ showServiceById(e.target.value); });

    function showServiceById(serviceId){
        const service = services.find(service => service.id == serviceId);

        serviceHTMLItem.cardTitle.textContent = service.description;
        serviceHTMLItem.cardText.textContent  = service.detail;
    }
}

//FUNCTIONS
function addListenerOnForm(formId, enPoint, method = 'POST', idVarName = false, successFunction = false, successFunctionParams = undefined, checkboxesNames = []){
    let form = getById(formId);
  
    if(form){
        getById(formId).addEventListener('submit', function(e) {
        e.preventDefault();
        
        const token = getCookie('token');
        if((formId === 'signupForm' || formId === 'loginForm') || token){
          var formData = new FormData(this);
        
          var object = {};
          formData.forEach((value, key) => { object[key] = value });
          checkboxesNames.forEach(checkboxName => {
            object[checkboxName] = form.querySelector(`[name="${ checkboxName }"]`).checked;
          });
          var jsonData = JSON.stringify(object);
  
          let param = !idVarName ? '' : glo.idsToUpd[idVarName];
  
          fetch('http://localhost:3000/' + enPoint + param, {
            method: method,
            headers: {
              'Content-Type' : 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: (formId !== 'getVegicleDetailForm' ? jsonData : undefined),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Succès:', data);
            if(successFunction){ successFunction(successFunctionParams()); }
          })
          .catch((error) => console.error('Erreur:', error));
        }
      });
    }
}

function initServicesSelect(servicesSelect = servicesHTMLSelect, initValue = getSelectFirstValue(servicesSelect)){
    servicesSelect.value = initValue;
    getServiceInfos(initValue);
}
function initNewsSelect(newsSelect = newsHTMLSelect, initValue = getSelectFirstValue(newsHTMLSelect)){
    newsSelect.value = initValue;
    getNewsInfos(initValue);
}
function initSchedulesSelect(schedulesSelect = schedulesHTMLSelect, initValue = getSelectFirstValue(schedulesHTMLSelect)){
    schedulesSelect.value = initValue;
    getSchedulesInfos(initValue);
}
function initAppointmentSelect(appointmentSelect = appointmentHTMLSelect, initValue = getSelectFirstValue(appointmentHTMLSelect)){
    appointmentSelect.value = initValue;
    getAppointmentInfos(initValue);
}
function initPatientSelect(patientSelect = patientHTMLSelect, initValue = getSelectFirstValue(patientHTMLSelect)){
    patientSelect.value = initValue;
    getPatientInfos(initValue);
}

function getServiceInfos(serviceId){
    fetch(glo.urls.base + glo.urls.service + serviceId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const updForm = getById('updServiceForm');
        updForm.querySelector('[name="name"]').value        = data.service.name;
        updForm.querySelector('[name="description"]').value = data.service.description;
        updForm.querySelector('[name="detail"]').value      = data.service.detail;
        updForm.querySelector('[name="obsolete"]').checked  = data.service.obsolete;

        glo.idsToUpd.serviceId = serviceId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

function getNewsInfos(newsId){
    fetch(glo.urls.base + glo.urls.news + newsId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const updForm = getById('updNewsForm');
        updForm.querySelector('[name="title"]').value      = data.title;
        updForm.querySelector('[name="content"]').value    = data.content;
        updForm.querySelector('[name="obsolete"]').checked = data.obsolete;

        glo.idsToUpd.newsId = newsId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

function getSchedulesInfos(schedulesId){
    fetch(glo.urls.base + glo.urls.schedules + schedulesId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const updForm = getById('updSchedulesForm');
        updForm.querySelector('[name="openTime"]').value  = data.openTime;
        updForm.querySelector('[name="closeTime"]').value = data.closeTime;

        glo.idsToUpd.schedulesId = schedulesId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

function getAppointmentInfos(appointmentId){
    fetch(glo.urls.base + glo.urls.appointment + appointmentId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const updForm = getById('updAppointmentForm');
        updForm.querySelector('[name="userEmail"]').value       = data.User.email;
        updForm.querySelector('[name="userFirstName"]').value   = data.User.firstName;
        updForm.querySelector('[name="userLastName"]').value    = data.User.lastName;
        updForm.querySelector('[name="userPhoneNumber"]').value = data.User.phoneNumber;
        updForm.querySelector('[name="serviceId"]').value       = data.Service.id;
        updForm.querySelector('[name="date"]').value            = data.date.slice(0, 10);
        updForm.querySelector('[name="time"]').value            = data.time;
        updForm.querySelector('[name="status"]').value          = data.status;

        glo.idsToUpd.appointmentId = appointmentId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

function getPatientInfos(patientId){
    fetch(glo.urls.base + glo.urls.patient + patientId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const updForm = getById('patientForm');
        updForm.querySelector('[name="userEmail"]').value       = data.user.email;
        updForm.querySelector('[name="userFirstName"]').value   = data.user.firstName;
        updForm.querySelector('[name="userLastName"]').value    = data.user.lastName;
        updForm.querySelector('[name="userPhoneNumber"]').value = data.user.phoneNumber;

        glo.idsToUpd.patientId = patientId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

function getInFetch(url, successFunction, successFunctionParams){
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    successFunction(successFunctionParams ? successFunctionParams() : undefined);
  })
  .catch((error) => {
    console.error('Erreur:', error);
  });
}

async function reloadSelect(HTMLSelect, fetchURL, propForTxt, sortByPropForTxt = true){
    await fetch(fetchURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        removeAllChildren(HTMLSelect);

        let datas;
        if(Array.isArray(data)){ datas = data; }
        else{
          const dataKey = Object.keys(data)[0];
          datas         = data[dataKey];
        }
        if(sortByPropForTxt){ datas.sort((a, b) => { return a[propForTxt].localeCompare(b[propForTxt]); }); }

        datas.forEach(data => {
            let option = document.createElement('option');
            let txt    = document.createTextNode(data[propForTxt]);

            option.appendChild(txt);
            option.value = data.id;

            HTMLSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

async function reloadServicesSelectAndInit(serviceId){
    await reloadSelect(servicesHTMLSelect, glo.urls.base + glo.urls.servicesInJSON, 'name');
    if(serviceId === 'last'){ serviceId = getSelectMaxValue(); }
    else if(!serviceId){ getSelectFirstValue(servicesHTMLSelect); }
    initServicesSelect(servicesHTMLSelect, serviceId);
}

async function reloadNewsSelectAndInit(newsId){
    await reloadSelect(newsHTMLSelect, glo.urls.base + glo.urls.newsInJSON, 'title');
    if(newsId === 'last'){ newsId = getSelectMaxValue(newsHTMLSelect); }
    else if(!newsId){ getSelectFirstValue(newsHTMLSelect); }
    initNewsSelect(newsHTMLSelect, newsId);
}

async function reloadSchedulesSelectAndInit(schedulesId){
    await reloadSelect(schedulesHTMLSelect, glo.urls.base + glo.urls.schedulesInJSON, 'dayOfWeek', false);
    if(schedulesId === 'last'){ schedulesId = getSelectMaxValue(schedulesHTMLSelect); }
    else if(!schedulesId){ getSelectFirstValue(schedulesHTMLSelect); }
    initSchedulesSelect(schedulesHTMLSelect, schedulesId);
}
async function appointmentUpdated(){
    alert('RDV modifié !');
}

function removeAllChildren(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getCookie(name) {
    let cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return "";
}


function fadeOut(element) {
    let opacite = 1;

    function step() {
        opacite = opacite - 0.01;
        element.style.opacity = opacite;

        if (opacite > 0) {
            requestAnimationFrame(step);
        } else {
            element.style.display = 'none';
        }
    }
    requestAnimationFrame(step);
}




// TESTS FUNCTIONS
const fillRDV = () => {
  [
    {id: 'email', value: 'forTest@test.fr'},
    {id: 'firstName', value: 'Jean'},
    {id: 'lastName', value: 'Dubidon'},
    {id: 'phoneNumber', value: '0512123434'},
    {id: 'date', value: '2024-05-17'},
    {id: 'time', value: '10:30:00'},
  ].map(infosRDV => {
    getById(infosRDV.id).value = infosRDV.value;
  });
};
