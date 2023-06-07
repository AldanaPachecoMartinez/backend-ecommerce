
const currentDate = new Date();
const year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1; 
month = month < 10 ? '0' + month : month; 
let day = currentDate.getDate();
day = day < 10 ? '0' + day : day;  

const maxDate = `${year}-${month}-${day}`;

document.getElementById('profile-container').innerHTML = `
<form class="profile-form" onsubmit="setChangesUser(event)">
    <div class="profile__encabezado">
    <div class="profile__item">
        <img src="${userImage()}" alt="Imagen de Usuario" class="profile__img">
        <input type="file" onchange="handleChangeImage(event)"> 
    </div>

    <div class="form-content__item profile__item--name">
        <input type="text" name="fullName" id="idInputName"
        value='${currentUser.fullName}' minlength="6" maxlength="150"  autofocus autocomplete="on" required class="form-content__input profile__input input-name">
    </div>

    <div class="form-content__item profile__item--email">
        <input type="email" name="email" id="emailInput"
        value='${currentUser.email}' pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" required class="form-content__input profile__input input-email">
    </div>
    </div>

    <div class="form-content__item profile__item">
        <label for="passwordInput">Contraseña</label><br>
        <input type="password" placeholder="Nueva Contraseña"
        minlength="8" maxlength="20" name="password" pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" class="form-content__input profile__input">
    </div>

    <div class="form-content__item profile__item">
        <label for="passwordInput">Repetir contraseña</label><br>
        <input type="password" placeholder="Repita aquí su contraseña"
        minlength="8" maxlength="20" name="password2" pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"  class="form-content__input profile__input">
    </div>

    <div class="form-content__item profile__item">
        <label for="bornDateInput">Fecha de nacimiento</label><br>
        <input type="date" id="bornDateInput" name="bornDate"
        value='${formatearFecha(currentUser.bornDate)}'
        min="1920-01-01" max="${maxDate}" class="form-content__input profile__input">
    </div>

    <div class="form-content__item profile__item">
    <label>Sexo</label><br>

    <div class="form-content__item--sex profile__gender">
        <input type="radio" name="gender" value="female"> Femenino
        <input type="radio" name="gender" value="male"> Masculino
        <input type="radio" name="gender" value="other"> Otro
    </div>
</div>
    <div class="submit-btn-container">
        <button type="submit" class="submit-btn-profile"><i class="fa-solid fa-check"></i> Guardar los cambios</button>
    </div>
    </form>
`

function formatearFecha(fechaIn) {
    let fechaFormateada;
    let fecha = new Date(fechaIn)
    let dia = fecha.getDate()+1;
    let mes = fecha.getMonth() + 1; 
    let mesFormateado = mes < 10 ? '0' + mes : mes;
    let diaFormateado = dia < 10 ? '0' + dia : dia;
    let año = fecha.getFullYear();
    return fechaFormateada = año + '-' + mesFormateado + '-' + diaFormateado;
    
    }

function userImage() {
    if(currentUser.image) {
        return `${URL}/upload/users/${currentUser.image}` 
    } else {
        return `/assets/images/user-defaultjpg.jpg`
    }
}

const token = window.localStorage.getItem('token');

async function handleChangeImage(evt){

    try {
        const image = evt.target.files[0];

        let formData = new FormData();
        formData.append('file', image);
        
        await axios.post(`${URL}/users/image`,formData,{
            headers:{
                Authorization: token
            }
        })
        getCurrentUser()

    } catch (error) {
        console.log(error)
    }
}

async function getCurrentUser(){
    await axios.get(`${URL}/user`,{
        headers:{
            Authorization: token
        }
    }).then(res=>{
        let newUser=res.data.userToSearch
        document.querySelector(".profile__img").src=`${URL}/upload/users/${newUser.image}?${new Date().getTime()}`
        window.localStorage.setItem('currentUser',JSON.stringify(newUser))}
        )
    .catch(err=>console.log(err))
}

async function setChangesUser(evt) {
    evt.preventDefault()
    const element = evt.target.elements

    if(element.password.value !== element.password2.value) {
        showAlert(`Las contraseñas no coinciden`, 'error', 3000)
        return
    }

    let changesOfUser = {
        fullName : element.fullName.value ,
        email : element.email.value,
        bornDate : element.bornDate.value,
        }

if(element.password.value){
    changesOfUser={...changesOfUser,password:element.password.value}
}

    try {
        const token = window.localStorage.getItem('token');
        const resp = await axios.put(`${URL}/users`, changesOfUser, {headers: {
            Authorization: token}})
        const msg = resp.data.msg;
        showAlert(msg, 'success', 2500)
    } catch (error) {
        console.log(error);
        showAlert(error.response.data.msg, 'error',3000);
    }

    getCurrentUser()
}
