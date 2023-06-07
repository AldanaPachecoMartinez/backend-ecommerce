const user = JSON.parse(localStorage.getItem('currentUser'));

if(!user || user.role !== 'ADMIN_ROLE') {
    window.location.href = '/';
}