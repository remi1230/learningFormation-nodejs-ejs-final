//Variables globales
let glo = {
    urls: {
        base: 'http://localhost:3000/',
        takeAppointment: 'takeAppointment',
    }
};


//Evenements
if(document.getElementById('takeAppointment')){
    document.getElementById('takeAppointment').addEventListener('click', function(e){
        window.open(glo.urls.base + glo.urls.takeAppointment, '_blank');
    });
}
