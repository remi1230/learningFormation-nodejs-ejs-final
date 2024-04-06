//Variables globales
let glo = {
    urls: {
        base: 'http://localhost:3000/',
        takeAppointment: 'takeAppointment',
        connexion: 'connexion',
        service: 'service/',
    }
};

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

if(location.pathname === '/login' && document.getElementById('serviceId')){
    document.getElementById('serviceId').addEventListener('change', function(e){
        getServiceInfos(e.target.value);
    });
    document.getElementById('serviceId').value = "1";
    getServiceInfos(1);
}



//FUNCTIONS
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
        console.log('Succès:', data);
        
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
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
