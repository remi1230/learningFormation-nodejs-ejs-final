/**
 * Récupère un élément du DOM par son identifiant.
 * @param {string} id - L'identifiant de l'élément à récupérer.
 * @returns {Element} L'élément du DOM correspondant à l'identifiant fourni.
 */
const getById = id => document.getElementById(id);

// Déclaration d'un objet pour les variables globales
let glo = {
    urls: {
        base: 'http://ctrobien.com/learningFormation2/',
        takeAppointment: 'takeAppointment',
        connexion: 'connexion',
        service: 'service/',
        servicesInJSON: 'services/json',
        newsInJSON: 'news/json',
        schedulesInJSON: 'schedules/json',
        appointmentInJSON: 'appointments',
        professionalInJSON: 'professionals',
        news: 'news/',
        schedules: 'schedules/',
        appointment: 'appointment/',
        patient: 'patient/',
        professional: 'professional/',
    },
    idsToUpd: {
        serviceId: 0,
    }
};

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

let servicesHTMLSelect     = getById('serviceId');
let appointmentHTMLSelect  = getById('appointmentId');
let patientHTMLSelect      = getById('patientId');
let professionalHTMLSelect = getById('professionalId');
let newsHTMLSelect         = getById('newsId');
let schedulesHTMLSelect    = getById('updSchedulesForm') ? getById('updSchedulesForm').querySelector('[name="schedulesId"]') : undefined;
let schedulesHTMLSelectAdd = getById('addSchedulesForm') ? getById('addSchedulesForm').querySelector('[name="dayOfWeek"]') : undefined;

/**
 * Obtient la valeur maximale des options d'un élément select HTML.
 * @param {HTMLSelectElement} select - L'élément select dont on veut obtenir la valeur maximale.
 * @returns {number} La valeur maximale trouvée parmi les options du select.
 */
const getSelectMaxValue = (select = servicesHTMLSelect) => Math.max(...[...select.children].map(option => parseInt(option.value)));

/**
 * Obtient la première valeur des options d'un élément select HTML.
 * @param {HTMLSelectElement} HTMLSelect - L'élément select dont on veut obtenir la première valeur.
 * @returns {string|boolean} La première valeur trouvée parmi les options du select, ou false si aucune option n'est disponible.
 */
const getSelectFirstValue = (HTMLSelect)  => [...HTMLSelect.children][0] ? [...HTMLSelect.children][0].value : false;

/**
 * Supprime un service via une requête fetch et recharge la liste des services.
 * @param {number} serviceId - L'identifiant du service à supprimer.
 */
const deleteService = (serviceId)   => { getInFetch(glo.urls.base + glo.urls.service + 'delete/' + serviceId, reloadServicesSelectAndInit); }

/**
 * Supprime une nouvelle via une requête fetch et recharge la liste des nouvelles.
 * @param {number} newsId - L'identifiant de la nouvelle à supprimer.
 */
const deleteNews = (newsId)      => { getInFetch(glo.urls.base + glo.urls.news + 'delete/' + newsId, reloadNewsSelectAndInit); }

/**
 * Supprime un horaire via une requête fetch et recharge la liste des horaires.
 * @param {number} schedulesId - L'identifiant de l'horaire à supprimer.
 */
const deleteSchedules = async (schedulesId) => {
  await getInFetch(glo.urls.base + glo.urls.schedules + 'delete/' + schedulesId, function(){});
  await reloadSchedulesSelectAndInit(); updSchedulesHTMLSelectAdd(true);
}

//ÉVÈNEMENT CHARGEMENT DE LA PAGE
document.addEventListener('DOMContentLoaded', function() {
    let appointmentDone = getById('appointmentDone');
    if(appointmentDone && appointmentDone.style.display === 'block'){ fadeOut(appointmentDone); }
});

window.addEventListener("keydown", function (e) {
  var key = e.key;
    if(e.altKey){
      switch (key) {
        case 'k':
          window.open(glo.urls.base + 'public/img/uml/useCase.png', '_blank');
        break;
        case 'l':
          window.open(glo.urls.base + 'public/img/uml/classDiagram.png', '_blank');
        break;
      }
    }
});

if(getById('takeAppointment')){
    getById('takeAppointment').addEventListener('click', function(e){
        window.open(glo.urls.base + glo.urls.takeAppointment, '_blank');
    });
    getById('connexion').addEventListener('click', function(e){
        window.open(glo.urls.base + glo.urls.connexion, '_blank');
    });
}

if(location.pathname === '/learningFormation2/login' && servicesHTMLSelect){
    servicesHTMLSelect.addEventListener('change', function(e){ getServiceInfos(e.target.value); });
    newsHTMLSelect.addEventListener('change', function(e){ getNewsInfos(e.target.value); });
    schedulesHTMLSelect.addEventListener('change', function(e){ getSchedulesInfos(e.target.value); });
    appointmentHTMLSelect.addEventListener('change', function(e){ getAppointmentInfos(e.target.value); });
    patientHTMLSelect.addEventListener('change', function(e){ getPatientInfos(e.target.value); });
    professionalHTMLSelect.addEventListener('change', function(e){ getProfessionalInfos(e.target.value); });
    initServicesSelect();
    initNewsSelect();
    initSchedulesSelect();
    initAppointmentSelect();
    initPatientSelect();
    initProfessionalSelect();

    const addNewsForm = getById('addNewsForm');
    const updNewsForm = getById('updNewsForm');

    addNewsForm.querySelector('[name="content"]').id = "contentToAdd";
    updNewsForm.querySelector('[name="content"]').id = "contentToUpd";
    updNewsForm.querySelector('[name="image"]').id   = "newsImageToUpd";
    
    getById('newsImageToUpd').required = false;

    designImagePreview();
    tinymce.init({ selector: 'textarea#contentToAdd, textarea#contentToUpd' });

    //Services
    addListenerOnForm('addServiceForm', 'service/add', 'POST', false, reloadServicesSelectAndInit, function(){ return 'last'; });
    addListenerOnForm('updServiceForm', 'service/upd/', 'PUT', 'serviceId', reloadServicesSelectAndInit, function(){ return servicesHTMLSelect.value; }, ['obsolete']);

    //News
    addListenerOnForm('addNewsForm', 'news/add', 'POST', false, reloadNewsSelectAndInit, function(){ return 'last'; }, [], true);
    addListenerOnForm('updNewsForm', 'news/upd/', 'PUT', 'newsId', reloadNewsSelectAndInit, function(){ return newsHTMLSelect.value; }, ['obsolete'], true);

    //Schedules
    addListenerOnForm('addSchedulesForm', 'schedules/addOrUpd', 'POST', false, reloadSchedulesSelectAndInit, function(){ return 'last'; });
    addListenerOnForm('updSchedulesForm', 'schedules/addOrUpd', 'POST', false, reloadSchedulesSelectAndInit, function(){ return schedulesHTMLSelect.value; });

    //Professionals
    addListenerOnForm('addProfessionalForm', 'professional/add', 'POST', false, reloadProfessionalSelectAndInit, function(){ return 'last'; });
    addListenerOnForm('updProfessionalForm', 'professional/upd/', 'PUT', 'professionalId', reloadProfessionalSelectAndInit, function(){ return professionalHTMLSelect.value; });

    //Appointment
    addListenerOnForm('updAppointmentForm', 'appointment/upd/', 'PUT', 'appointmentId', appointmentUpdated, function(){ return undefined; });

    //Suppression Service, News et Schedules
    getById('deleteServiceButton').addEventListener('click', function(e){ deleteService(servicesHTMLSelect.value); });
    getById('deleteNewsButton').addEventListener('click', function(e){ deleteNews(newsHTMLSelect.value); });
    getById('deleteSchedulesButton').addEventListener('click', function(e){ deleteSchedules(schedulesHTMLSelect.value); });
}
else if(location.pathname === '/learningFormation2/service'){
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

/**
 * Ajoute un écouteur d'événements à un formulaire pour gérer l'envoi de données, la validation et la mise à jour de l'interface utilisateur.
 * @param {string} formId - Identifiant du formulaire.
 * @param {string} endPoint - Point de terminaison API pour l'envoi du formulaire.
 * @param {string} [method='POST'] - Méthode HTTP à utiliser pour l'envoi du formulaire.
 * @param {string|boolean} [idVarName=false] - Nom de la variable d'identifiant si nécessaire pour l'URL.
 * @param {Function|false} [successFunction=false] - Fonction à exécuter après un envoi réussi.
 * @param {Function} [successFunctionParams] - Fonction générant les paramètres pour la fonction de succès.
 * @param {Array<string>} [checkboxesNames=[]] - Noms des cases à cocher à traiter spécialement.
 * @param {boolean} [withFile=false] - Indique si le formulaire inclut l'envoi de fichiers.
 */
function addListenerOnForm(formId, enPoint, method = 'POST', idVarName = false, successFunction = false, successFunctionParams = undefined, checkboxesNames = [], withFile = false){
    let form = getById(formId);
  
    if(form){
        getById(formId).addEventListener('submit', function(e) {
        e.preventDefault();

        if (form.classList.contains('needs-validation') && !form.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
          form.classList.add('was-validated');

          return false;
        }
  
        const token = getCookie('token');
        if((formId === 'signupForm' || formId === 'loginForm') || token){
          var formData = new FormData(this);
        
          var object = {};
          formData.forEach((value, key) => { object[key] = value });
          checkboxesNames.forEach(checkboxName => {
            object[checkboxName] = form.querySelector(`[name="${ checkboxName }"]`).checked;
            if(withFile){ formData.set(checkboxName, form.querySelector(`[name="${ checkboxName }"]`).checked) }
          });
          var jsonData = !withFile ? JSON.stringify(object) : undefined;
  
          let param = !idVarName ? '' : glo.idsToUpd[idVarName];

          let fetchOptions = {};
          if(!withFile){
            fetchOptions = {
              method: method,
              headers: {'Content-Type' : 'application/json', },
              body: (formId !== 'getVegicleDetailForm' ? jsonData : undefined)
            };
          }
          else{
            fetchOptions = {
              method: method,
              body: (formId !== 'getVegicleDetailForm' ? formData : undefined),
            }
          }
  
          fetch(glo.urls.base + enPoint + param, fetchOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Succès:', data);
            if(successFunction){
              successFunction(successFunctionParams());
              if(formId.includes('upd')){ alert('Modifications effectuées'); }
            }
          })
          .catch((error) => console.error('Erreur:', error));
        }
      });
    }
}

/**
 * Initialise les valeurs sélectionnées pour différents éléments select du DOM à partir d'une source de données.
 * @param {HTMLSelectElement} [servicesSelect] - Élément select à initialiser.
 * @param {string|number} [initValue] - Valeur initiale à définir pour l'élément select.
 */
function initServicesSelect(servicesSelect = servicesHTMLSelect, initValue = getSelectFirstValue(servicesSelect)){
    if(initValue){
      servicesSelect.value = initValue;
      getServiceInfos(initValue);
    }
}
/**
 * Initialise les valeurs sélectionnées pour différents éléments select du DOM à partir d'une source de données.
 * @param {HTMLSelectElement} [newsSelect] - Élément select à initialiser.
 * @param {string|number} [initValue] - Valeur initiale à définir pour l'élément select.
 */
function initNewsSelect(newsSelect = newsHTMLSelect, initValue = getSelectFirstValue(newsHTMLSelect)){
  if(initValue){
    newsSelect.value = initValue;
    getNewsInfos(initValue);
  }
}
/**
 * Initialise les valeurs sélectionnées pour différents éléments select du DOM à partir d'une source de données.
 * @param {HTMLSelectElement} [schedulesSelect] - Élément select à initialiser.
 * @param {string|number} [initValue] - Valeur initiale à définir pour l'élément select.
 */
async function initSchedulesSelect(schedulesSelect = schedulesHTMLSelect, initValue = getSelectFirstValue(schedulesHTMLSelect)){
  if(initValue){
    schedulesSelect.value = initValue;
    await getSchedulesInfos(initValue);
  }
}
/**
 * Initialise les valeurs sélectionnées pour différents éléments select du DOM à partir d'une source de données.
 * @param {HTMLSelectElement} [appointmentSelect] - Élément select à initialiser.
 * @param {string|number} [initValue] - Valeur initiale à définir pour l'élément select.
 */
function initAppointmentSelect(appointmentSelect = appointmentHTMLSelect, initValue = getSelectFirstValue(appointmentHTMLSelect)){
  if(initValue){
    appointmentSelect.value = initValue;
    getAppointmentInfos(initValue);
  }
}
/**
 * Initialise les valeurs sélectionnées pour différents éléments select du DOM à partir d'une source de données.
 * @param {HTMLSelectElement} [patientSelect] - Élément select à initialiser.
 * @param {string|number} [initValue] - Valeur initiale à définir pour l'élément select.
 */
function initPatientSelect(patientSelect = patientHTMLSelect, initValue = getSelectFirstValue(patientHTMLSelect)){
  if(initValue){
    patientSelect.value = initValue;
    getPatientInfos(initValue);
  }
}
/**
 * Initialise les valeurs sélectionnées pour différents éléments select du DOM à partir d'une source de données.
 * @param {HTMLSelectElement} [professionalSelect] - Élément select à initialiser.
 * @param {string|number} [initValue] - Valeur initiale à définir pour l'élément select.
 */
function initProfessionalSelect(professionalSelect = professionalHTMLSelect, initValue = getSelectFirstValue(professionalHTMLSelect)){
  if(initValue){
    professionalSelect.value = initValue;
    getProfessionalInfos(initValue);
  }
}

/**
 * Initialise les informations de service pour un identifiant de service donné et met à jour l'interface utilisateur.
 * @param {number|string} serviceId - L'identifiant du service dont les informations sont à afficher.
 */
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

        let deleteButton = updForm.querySelector('[id="deleteServiceButton"]');

        deleteButton.disabled = data.isUsed;
        deleteButton.title    = data.isUsed ? "Le service ne peut être supprimé car il est actuellement utilisé, vous pouvez le rendre obsolète" : "Supprimer ce service";

        glo.idsToUpd.serviceId = serviceId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

/**
 * Récupère et affiche les détails d'une nouvelle spécifique à partir de son identifiant.
 * @param {number|string} newsId - L'identifiant de la nouvelle dont les informations sont à récupérer.
 */
function getNewsInfos(newsId){
    fetch(glo.urls.base + glo.urls.news + newsId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        let editor = tinymce.get('contentToUpd');
        editor.setContent(data.content);

        const updForm = getById('updNewsForm');
        updForm.querySelector('[name="title"]').value       = data.title;
        updForm.querySelector('[name="content"]').value     = data.content;
        updForm.querySelector('[id="imagePreview"]').src    = data.imageUrl ? data.imageUrl : '';
        updForm.querySelector('[name="obsolete"]').checked  = data.obsolete;

        glo.idsToUpd.newsId = newsId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

/**
 * Récupère et met à jour les détails d'un horaire spécifique en fonction de son identifiant.
 * @param {number|string} schedulesId - L'identifiant de l'horaire à afficher et mettre à jour.
 */
async function getSchedulesInfos(schedulesId){
    await fetch(glo.urls.base + glo.urls.schedules + schedulesId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const updForm = getById('updSchedulesForm');
        updForm.querySelector('[name="openTime"]').value  = data.openTime.slice(0,5);
        updForm.querySelector('[name="closeTime"]').value = data.closeTime.slice(0,5);

        glo.idsToUpd.schedulesId = schedulesId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

/**
 * Récupère et met à jour les informations d'un rendez-vous spécifique.
 * @param {number|string} appointmentId - L'identifiant du rendez-vous dont les informations sont à récupérer.
 */
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

/**
 * Récupère et met à jour les informations d'un patient donné, utilisé pour initialiser les champs dans un formulaire.
 * @param {number|string} patientId - L'identifiant du patient dont les informations sont à récupérer.
 */
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

/**
 * Récupère et met à jour les informations sur un professionnel, utilisé pour initialiser les champs dans un formulaire.
 * @param {number|string} professionalId - L'identifiant du professionnel dont les informations sont à récupérer.
 */
function getProfessionalInfos(professionalId){
    fetch(glo.urls.base + glo.urls.professional + professionalId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const updForm = getById('updProfessionalForm');
        updForm.querySelector('[name="email"]').value       = data.user.email;
        updForm.querySelector('[name="firstName"]').value   = data.user.firstName;
        updForm.querySelector('[name="lastName"]').value    = data.user.lastName;
        updForm.querySelector('[name="phoneNumber"]').value = data.user.phoneNumber;
        updForm.querySelector('[name="serviceId"]').value   = data.user.Service ? data.user.Service.id : '';

        glo.idsToUpd.professionalId = professionalId;
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
}

/**
 * Effectue une requête GET et exécute une fonction de succès après avoir reçu la réponse.
 * @param {string} url - URL à laquelle effectuer la requête.
 * @param {Function} successFunction - Fonction à exécuter après une réponse réussie.
 * @param {any} [successFunctionParams] - Paramètres optionnels à passer à la fonction de succès.
 */
async function getInFetch(url, successFunction, successFunctionParams){
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(async data => {
    await successFunction(successFunctionParams ? successFunctionParams() : undefined);
  })
  .catch((error) => {
    console.error('Erreur:', error);
  });
}

/**
 * Recharge les options d'un élément select HTML en fonction des données obtenues via une URL fetch.
 * @param {HTMLSelectElement} HTMLSelect - L'élément select à recharger.
 * @param {string} fetchURL - L'URL à utiliser pour la requête fetch.
 * @param {string} propForTxt - La propriété des données JSON à utiliser pour le texte des options.
 * @param {boolean} sortByPropForTxt - Indique si les options doivent être triées par le texte.
 */
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

/**
 * Recharge et initialise la liste des services, en sélectionnant un service spécifique ou le dernier ajouté.
 * @param {number|string} [serviceId='last'] - L'identifiant du service à sélectionner après le rechargement.
 */
async function reloadServicesSelectAndInit(serviceId){
    await reloadSelect(servicesHTMLSelect, glo.urls.base + glo.urls.servicesInJSON, 'name');
    if(serviceId === 'last'){ serviceId = getSelectMaxValue(); }
    else if(!serviceId){ getSelectFirstValue(servicesHTMLSelect); }
    initServicesSelect(servicesHTMLSelect, serviceId);
}

/**
 * Recharge et initialise la liste des nouvelles, en sélectionnant une nouvelle spécifique ou la dernière ajoutée.
 * @param {number|string} [newsId='last'] - L'identifiant de la nouvelle à sélectionner après le rechargement.
 */
async function reloadNewsSelectAndInit(newsId){
    await reloadSelect(newsHTMLSelect, glo.urls.base + glo.urls.newsInJSON, 'title');
    if(newsId === 'last'){ newsId = getSelectMaxValue(newsHTMLSelect); }
    else if(!newsId){ getSelectFirstValue(newsHTMLSelect); }
    initNewsSelect(newsHTMLSelect, newsId);
}

/**
 * Recharge et initialise la liste des horaires, en sélectionnant un horaire spécifique ou le dernier ajouté.
 * @param {number|string} [schedulesId='last'] - L'identifiant de l'horaire à sélectionner après le rechargement.
 */
async function reloadSchedulesSelectAndInit(schedulesId){
    await reloadSelect(schedulesHTMLSelect, glo.urls.base + glo.urls.schedulesInJSON, 'dayOfWeek', false);
    if(schedulesId === 'last'){ schedulesId = getSelectMaxValue(schedulesHTMLSelect); }
    else if(!schedulesId){ getSelectFirstValue(schedulesHTMLSelect); }
    initSchedulesSelect(schedulesHTMLSelect, schedulesId);
    updSchedulesHTMLSelectAdd();
}

/**
 * Recharge et initialise la liste des professionnels, en sélectionnant un professionnel spécifique ou le dernier ajouté.
 * @param {number|string} [professionalId='last'] - L'identifiant du professionnel à sélectionner après le rechargement.
 */
async function reloadProfessionalSelectAndInit(professionalId){
    await reloadSelect(professionalHTMLSelect, glo.urls.base + glo.urls.professionalInJSON, 'fullName');
    if(professionalId === 'last'){ professionalId = getSelectMaxValue(professionalHTMLSelect); }
    else if(!professionalId){ getSelectFirstValue(professionalHTMLSelect); }
    initProfessionalSelect(professionalHTMLSelect, professionalId);
}
async function appointmentUpdated(){
    //alert('RDV modifié !');
}

/**
 * Met à jour les options du select pour les horaires après une opération de suppression.
 * @param {boolean} [afterDelete=false] - Indique si la mise à jour est déclenchée après une suppression.
 */
function updSchedulesHTMLSelectAdd(afterDelete = false){
  let addDays  = [...schedulesHTMLSelectAdd.children].map(option => option.value);
  let currDays = [...schedulesHTMLSelect.children].map(option => option.innerText);

  if(afterDelete){
    addDays = daysOfWeek;
  }

  let newAddDays = [];
  addDays.forEach(addDay =>  {
    if(!currDays.some(currDay => currDay === addDay)){ newAddDays.push(addDay); }
  });

  removeAllChildren(schedulesHTMLSelectAdd);
  newAddDays.forEach(newAddDay => {
    let option = document.createElement('option');
    let txt    = document.createTextNode(newAddDay);

    option.appendChild(txt);
    option.value = newAddDay;

    schedulesHTMLSelectAdd.appendChild(option);
  });
}

/**
 * Supprime tous les enfants d'un élément DOM.
 * @param {Element} parent - L'élément DOM dont les enfants doivent être supprimés.
 */
function removeAllChildren(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/**
 * Applique un style de prévisualisation d'image à un élément du DOM.
 */
function designImagePreview(){
  const imgPrev = getById('updNewsForm').querySelector('[id="imagePreview"]').parentElement;

  const optionsDesign = {
    border       : "1px #ccc solid",
    borderRadius : "5px",
    padding      : "5px"
  };

  for(let prop in optionsDesign){ imgPrev.style[prop] = optionsDesign[prop]; }
}

/**
 * Récupère la valeur d'un cookie spécifique.
 * @param {string} name - Le nom du cookie à récupérer.
 * @returns {string} La valeur du cookie, ou une chaîne vide si le cookie n'est pas trouvé.
 */
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

/**
 * Effectue un effet de fondu (fadeOut) sur un élément DOM jusqu'à ce qu'il devienne invisible.
 * @param {Element} element - L'élément DOM sur lequel appliquer l'effet de fondu.
 */
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