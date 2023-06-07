
function showAlert(text, type = 'sucess',time=3000) {
    
        
    const alertDialog = document.createElement('div');

    alertDialog.classList.add('alert-dialog');
    
    alertDialog.innerHTML = "<i class='fa-solid fa-user-check'></i>" + '<p class= "alert-text">' + text + '</p>';
    
    document.body.appendChild(alertDialog);
    if(type === 'error') {
        alertDialog.innerHTML = '<i class="fa-regular fa-circle-xmark fa-shake"></i>' + '<p class= "alert-text">' + text + '</p>';
    }
    if(type === 'warning') {
        alertDialog.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-beat-fade"></i>' + '<p class= "alert-text">' + text + '</p>';
    }
    if(type === 'ok') {
        alertDialog.innerHTML = '<i class="fa-regular fa-circle-check fa-xl"></i>' + '<p class= "alert-text">' + text + '</p>';
    }

    setTimeout(() => alertDialog.classList.add('show'), 10)

    setTimeout(() => {
        alertDialog.classList.remove('show');

        setTimeout(() => {
            alertDialog.remove();
        }, 1000)

    }, time);

}  


function showConfirm(title, text, functionAcept) {
    
    const alertConfirm = document.createElement('div');
    alertConfirm.classList.add('alert-confirm');
    alertConfirm.classList.add('visible');

    const buttonCancelar = document.createElement('button');
    buttonCancelar.innerText = `Cancelar`;
    buttonCancelar.classList.add('btn-cancelar');
    buttonCancelar.onclick = () => {
        alertConfirm.classList.remove('visible');
        alertConfirm.remove()

    }

    const buttonAceptar = document.createElement('button');
    buttonAceptar.innerText = `Aceptar`
    buttonAceptar.classList.add('btn-aceptar');
    buttonAceptar.onclick =  ()=>{functionAcept();
        alertConfirm.classList.remove('visible');
        alertConfirm.remove()

    }


    alertConfirm.innerHTML = '<i class="fa-solid fa-triangle-exclamation fa-beat"></i>' +'<h1>' + title + '</h1>'+ '<p class= "alert-text">' + text + '</p>' 
    alertConfirm.appendChild(buttonCancelar) 
    alertConfirm.appendChild(buttonAceptar);
    
    document.body.appendChild(alertConfirm);

    }
