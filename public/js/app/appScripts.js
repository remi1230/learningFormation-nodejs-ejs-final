//Variables globales
let glo = {
    urls: {
        base: 'http://localhost:3000/',
        takeAppointment: 'takeAppointment',
        connexion: 'connexion',
        service: 'service/',
        servicesInJSON: 'getAllServicesInJSON',
    },
    idsToUpd: {
        serviceId: 0,
    }
};

let servicesHTMLSelect = document.getElementById('serviceId');

const getSelectMaxValue = (select = servicesHTMLSelect) => Math.max(...[...select.children].map(option => parseInt(option.value)));

//ÉVÈNEMENTS
document.addEventListener('DOMContentLoaded', function() {
    let appointmentDone = document.getElementById('appointmentDone');
    if(appointmentDone && appointmentDone.style.display === 'block'){ fadeOut(appointmentDone); }
});

if(document.getElementById('takeAppointment')){
    document.getElementById('takeAppointment').addEventListener('click', function(e){
        window.open(glo.urls.base + glo.urls.takeAppointment, '_blank');
    });
    document.getElementById('connexion').addEventListener('click', function(e){
        window.open(glo.urls.base + glo.urls.connexion, '_blank');
    });
}

if(location.pathname === '/login' && servicesHTMLSelect){
    servicesHTMLSelect.addEventListener('change', function(e){
        getServiceInfos(e.target.value);
    });
    initServicesSelect();

    //Services
    addListenerOnForm('addServiceForm', 'service/add', 'POST', false, reloadServicesSelectAndInit, function(){ return 'last'; });
    addListenerOnForm('updServiceForm', 'service/upd/', 'PUT', 'serviceId', reloadServicesSelectAndInit, function(){ return servicesHTMLSelect.value; }, ['obsolete']);

    //News
    addListenerOnForm('addNewsForm', 'news/add', 'POST', false, reloadServicesSelectAndInit, function(){ return 'last'; });

    document.getElementById('deleteServiceButton').addEventListener('click', function(e){
        deleteService(servicesHTMLSelect.value);
    });
}

//FUNCTIONS
function addListenerOnForm(formId, enPoint, method = 'POST', idVarName = false, successFunction = false, successFunctionParams = undefined, checkboxesId = []){
    let form = document.getElementById(formId);
  
    if(form){
        document.getElementById(formId).addEventListener('submit', function(e) {
        e.preventDefault();
        
        const token = getCookie('token');
        if((formId === 'signupForm' || formId === 'loginForm') || token){
          var formData = new FormData(this);
        
          var object = {};
          formData.forEach((value, key) => { object[key] = value });
          checkboxesId.forEach(checkboxId => {
            object[checkboxId] = document.getElementById(checkboxId).checked;
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

function initServicesSelect(servicesSelect = servicesHTMLSelect, initValue = "1"){
    servicesSelect.value = initValue;
    getServiceInfos(initValue);
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
        const updForm = document.getElementById('updServiceForm');
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

function deleteService(serviceId){
    fetch(glo.urls.base + glo.urls.service + 'delete/' + serviceId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        reloadServicesSelectAndInit();
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

async function reloadSelect(HTMLSelect, fetchURL, propForTxt){
    await fetch(fetchURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        removeAllChildren(HTMLSelect);

        const dataKey = Object.keys(data)[0];
        datas         = data[dataKey];
        datas.sort((a, b) => { return a[propForTxt].localeCompare(b[propForTxt]); });

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

async function reloadServicesSelectAndInit(serviceId = '1'){
    await reloadSelect(servicesHTMLSelect, glo.urls.base + glo.urls.servicesInJSON, 'name');
    if(serviceId === 'last'){ serviceId = getSelectMaxValue(); }
    initServicesSelect(servicesHTMLSelect, serviceId);
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
