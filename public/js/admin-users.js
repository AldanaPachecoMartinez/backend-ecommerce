const d = document;
const formChargeUser = d.getElementById('form-users');
let usersList = [];


if(!window.localStorage.getItem('currentUser')){
    window.location.href ='/';
}


const currentDate = new Date();
const year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1;
month = month < 10 ? '0' + month : month; 
let day = currentDate.getDate();
day = day < 10 ? '0' + day : day;  

const maxDate = `${year}-${month}-${day}`;

const roleOptions=[
    {value:'CLIENT_ROLE',name:'CLIENTE'},
    {value:'USER_ROLE',name:'USER'},
    {value:'ADMIN_ROLE',name:'ADMIN'},
    {value:'SUPERADMIN_ROLE',name:'SUPERADMIN'}
]

formChargeUser.innerHTML = `
<button class = "close-modal" onclick="removeFormUser(event)">X</button>
<h3 id='form-title'>Agregar Usuario</h3>
<form class="product-form" id="product-form" onsubmit="handleSubmit(event)" data-mode='add'>

<div class="input-box">
    <label for="nameInput">Nombre Completo</label><br>
    <input type="text" name="fullName" id="nameInput" class= "input-form-products" max-length="100" min-length="4"  />
    <input type="hidden" name="_id" id="id" />
</div>

<div class="input-box">
<label for="emailInput">E-mail</label> <br>
<input type="text" name="email" id="emailInput" class= "input-form-products" max-length="100" min-length="4" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" />
</div>

<div class="input-box">
    <label for="bornInput">Fecha de Nacimiento</label><br>
    <input type="date" name="bornDate" id="bornInput" class= "input-form-products" max=${maxDate} min="1920-01-01"  />
</div>

<div class="input-box">
<label for="roleSelector">Rol</label>
<select name="role" id="roleSelector" class ="role-selector">
<optgroup>
    ${roleOptions.map(rol=>
    {return `<option value=${rol.value}>${rol.name}</option>`}
)}
</optgroup>
</select>
</div>

<div class = "container-btns-fp">
<button type="submit" class="submit-btn" id="submit-btn">Agregar</button>

<button class="clean-btn" id="clean-btn" onclick='handleCleanUser()'>Limpiar</button>
</div>
`;
function showFormUser() {
    formChargeUser.classList.add('visible');
}

function removeFormUser(e) {
    e.preventDefault()
    handleCleanUser()
    formChargeUser.classList.remove('visible');
}

const handleCleanUser =()=>{
    formChargeUser.dataset.mode='add'
    formChargeUser['submit-btn'].innerHTML='Agregar'
    d.getElementById('form-title').innerHTML='Agregar Usuario'
    formChargeUser.reset()
}


async function handleSubmitUser(evt) {
    evt.preventDefault();
    const element = evt.target.elements;
    if(evt.target.dataset.mode==='add'){
        const newUser = {
            fullName : element.fullName.value ,
            email : element.email.value,
            bornDate : element.bornDate.value ,
            password:element.email.value,
            role: element.role.value,
            createdAt:Date.now()
        };
        try {
            await axios.post(`${URL}/users`, newUser)
            const msg = 'El usuario se agregó correctamente. La contraseña por defecto es el e-mail.';
            showAlert(msg, 'success', 3500)
            printUsers();
        } catch (error) {
            console.log(error);
            showAlert(error.response.data.msg, 'error',3000);
        }

        handleCleanUser()
        formChargeUser.classList.remove('visible')

        return;
    }
    if(evt.target.dataset.mode==='edit'){

        const newUser = {
            fullName : element.fullName.value ,
            email : element.email.value,
            bornDate : element.bornDate.value,
            role: element.role.value,
        };

        try {
            const token = window.localStorage.getItem('token');
            const id= element.id.value;
            const resp = await axios.put(`${URL}/users/${id}`, newUser, {headers: {
                Authorization: token}})
            const msg = resp.data.msg;
            showAlert(msg, 'success', 2500)
            printUsers();
        } catch (error) {
            console.log(error);
            showAlert(error.response.data.msg, 'error', 3000);
        }


        handleCleanUser()
        formChargeUser.classList.remove('visible')

        return;
    }
}
const handleEdit =(el)=>{
    formChargeUser.dataset.mode='edit'
    formChargeUser['submit-btn'].innerHTML='Editar'
    d.getElementById('form-title').innerHTML='Editar Usuario'
    formChargeUser.classList.add('visible')
    Object.entries(el).forEach(([key,value])=>{
        if(formChargeUser[key]){
            if(key==='bornDate' || key==='createdAt'){
                formChargeUser[key].value=new Date(value).toISOString().slice(0,10)
            }else{
                formChargeUser[key].value=value
            }
        }
    })
    
}

function handleDelete(id){
    showConfirm('Desea borrar el usuario?', 'Si presiona el botón Aceptar el usuario se habrá borrado definitivamente', ()=>deleteUser(id))
}

async function deleteUser(id){
    try {
        const token = window.localStorage.getItem('token');
        const resp = await axios.delete(`${URL}/users/${id}`, {headers: {
            Authorization: token}})
        const msg = resp.data.msg;
        showAlert(msg, 'success', 2500)
        printUsers();
    } catch (error) {
        console.log(error);
        showAlert(error.response.data.msg, 'error', 3000);
    }    
}

function handleRole(event,i){

    showConfirm(`¿Desea cambiar el rol del usuario ${usersList[i].fullName}?`, `Si presiona aceptar cambiará su rol de ${usersList[i].role} a ${event.target.value}`, () => changeRole(event,i))
    
}

async function changeRole(event, i) {

    try {
        const token = window.localStorage.getItem('token');
        const id= usersList[i]._id
        const selectedRole = event.target.value
        const resp = await axios.put(`${URL}/users/${id}`, {role: selectedRole}, {headers: {
            Authorization: token}})
        const msg = resp.data.msg;
        showAlert(msg, 'success', 2500)
        printUsers();
    } catch (error) {
        console.log(error);
        showAlert(error.response.data.msg, 'error',3000);
    }
}

function renderizarUsuarios(users) {

let usersRows = users?.map((el,i)=>{
    
    return(
    `
    <tr>
    <td>${el.fullName}</td>
    <td>${el.email}</td>
    <td>${formatearFecha1(el.bornDate)}</td>
    <td>
        <select name="role" id="role-selector" onchange="handleRole(event,${i})">
        <optgroup>
            ${
                roleOptions.map(e=>{
                    return(
                    `<option value=${e.value} ${(e.value===el.role) ? 'selected' : ''} >${e.name}</option>`
                    )
                })
            }
        </optgroup>
        </select>
    </td>
    <td>${formatearFecha(el.createdAt)}</td>
    <td>
        <button class="user__action-btn" onclick='handleEdit(${JSON.stringify(el)})'><i class="fa-regular fa-pen-to-square"></i></button>

        <button class="user__action-btn" onclick='handleDelete(${JSON.stringify(el._id)})'>
            <i class="fa-solid fa-trash-can"></i>
        </button> 
    </td>
    
    </tr>
    `

    )
})


d.getElementById('users-rows').innerHTML = usersRows.join('')

}

d.getElementById('search-users').innerHTML=`
<input type="text" placeholder="Buscar usuarios" onkeyup="handleBuscarUser(event)" id='users-search-input'>
<button onclick='handleBuscarUser(event)' id='btn-search-users'>Buscar</button>
<button onclick='cleanSearch()' class="limpiar-busqueda">X</button>`

const gralContainer = d.getElementById('users-list');

function handleBuscarUser(evt){
    const result = d.getElementById('search-users-result');

    if(evt.keyCode !==13 && evt.target.id !== 'btn-search-users'){
        return
    }
    const searchValue=d.getElementById('users-search-input').value.toLowerCase()
    let searchResults = usersList.filter((el)=>{
        return el.fullName.toLowerCase().includes(searchValue) ||
        el.email.toLowerCase().includes(searchValue) ||
        el.bornDate.includes(searchValue) ||
        el.role.toLowerCase().includes(searchValue) ||
        el.createdAt.includes(searchValue) 
    })

    if(!searchResults.length > 0) {
        gralContainer.style.display = "none";
        result.innerHTML = `No se encontraron resultados`
    }else{
        gralContainer.style.display = "flex";
    }

    renderizarUsuarios(searchResults)
}

function cleanSearch(){
    gralContainer.style.display = "flex";
    printUsers()
    d.getElementById('users-search-input').value=null
}

function formatearFecha1(fechaIn) {
    let fechaFormateada;
    let fecha = new Date(fechaIn);
    let dia;
    if(dia === 31) {
        dia = fecha.getDate();
    }else {
        dia = fecha.getDate()+1;
    }
    let mes = fecha.getMonth() + 1; 
    let mesFormateado = mes < 10 ? '0' + mes : mes;
    let diaFormateado = dia < 10 ? '0' + dia : dia;
    let año = fecha.getFullYear();
    return fechaFormateada = diaFormateado + '/' + mesFormateado + '/' + año;
    
    }
function formatearFecha(fechaIn) {
    let fechaFormateada;
    let fecha = new Date(fechaIn)
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1; 
    let mesFormateado = mes < 10 ? '0' + mes : mes;
    let diaFormateado = dia < 10 ? '0' + dia : dia;
    let año = fecha.getFullYear();
    return fechaFormateada = diaFormateado + '/' + mesFormateado + '/' + año;
    
    }


async function printUsers() {
    usersList = await obtenerUsuarios();
    renderizarUsuarios(usersList)
}

printUsers();






