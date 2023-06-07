const form = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { email, password } = loginForm.elements;

    try {
        const dataBody = { email: email.value, password: password.value };
        const resp = await axios.post(`${URL}/login`, dataBody );
        const {token, user, msg,expireDate} = resp.data;

        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', JSON.stringify(expireDate));
        localStorage.setItem('currentUser', JSON.stringify(user));

        showAlert(msg);
        setTimeout(() => {
            window.location.href = '/'}, 2500)

    } catch (error) {
        console.log(error)
        return showAlert(error.response.data.msg, 'error');
    }

})
