const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerSubmit');
    
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const el = event.target.elements;
        const { fullName,email, password,age,bornDate } = registerForm.elements;
        const role='USER_ROLE'
    if(el.password.value !== el.password2.value) {
        showAlert(`Las contraseñas no coinciden`, 'warning')
        return
    }
    
    try {
        const dataBody = { fullName:fullName.value, email: email.value, password: password.value,age:age.value,bornDate:bornDate.value,role};

        const resp = await axios.post(`${URL}/users`, dataBody );
        const {msg,status} = resp.data;

        if(resp.status===201){
            showAlert(msg, 'succes');
            setTimeout(() => {
                window.location.href = '/'}, 2500)
        }
    } catch (error) {
            showAlert(error.response.data.msg, 'error');
            return
    }
    })

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; 
    month = month < 10 ? '0' + month : month; 
    let day = currentDate.getDate();
    day = day < 10 ? '0' + day : day;  
    
    const maxDate = `${year}-${month}-${day}`;
    document.getElementById('bornDateInput').max = maxDate;



