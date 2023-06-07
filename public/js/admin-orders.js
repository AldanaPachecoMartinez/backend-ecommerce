const d = document
const token = window.localStorage.getItem('token')
let userRole = JSON.parse(window.localStorage.getItem('currentUser')).role
let query=''
let orders=[]


function renderizarOrdenes(orders) {

    let filas = orders?.map((el,i)=>{
        
        return(
        `
        <tr>
        <td class="td-id-orders">${el._id}</td>
        <td>${el.User.fullName}</td>
        <td>${el.orderProducts.length}</td>
        <td>$${el.totalPrice}</td>
        <td>${new Date(el.createdAt).toLocaleDateString()}</td>
        <td>${el.status}</td>
        <td>
            <button class="user__action-btn" onclick='handleView(${JSON.stringify(el)})'><i class="fa-regular fa-eye"></i></i></button>
    
            <button class="user__action-btn" onclick='handleDelete(${JSON.stringify(el._id)})'>
                <i class="fa-solid fa-trash-can"></i>
            </button> 
        </td>
        
        </tr>
        `
    
        )
    }).join('')

    d.getElementById('orders-rows').innerHTML=filas

}

function handleDelete(id){
    showConfirm("¿Desea eliminar la orden?","Si la elimina, no podrá recuperarla",()=>deleteOrder(id))
}

async function deleteOrder(id){
    try {
        let resp= await axios.delete(`${URL}/order/${id}`,{
            headers:{Authorization:token}
        })
    
        const msg = resp.data.msg;
        showAlert(msg, 'success', 2500)
        printOrders()
    } catch (error) {
        showAlert(error.response.data.msg, 'error', 3000);
        console.log(error);
        return
    }
}

async function handleView(order){
let products= await axios.post(`${URL}/products/order`,{products: order.orderProducts}).then((res)=> {return res.data.foundedProducts})


    let orderContainer=d.getElementById('order-info')
    orderContainer.style.display ='inline'
    orderContainer.innerHTML=`
    <div class="header-order">
    <button class="header-order__button" onclick="closeHandleView()"> X </button>
    <p class="header-order__id">${order._id}</p>
    <p class="header-order__name">${order.User.fullName}</p>
    <p class="header-order__status">${order.status}</p>
    <p>${new Date(order.createdAt).toLocaleDateString()}</p>
</div>
<div class="body-order-info">
    <div class="products-order-info">

        ${
            products.map(prod=>{
                let quantity=order.orderProducts.filter(el=>el.product===prod._id)[0].quantity 
                return ( `
                <div class="product-row-order-info">
                    <p class="product-name">${prod.name}</p>
                    <p>${quantity}</p>
                    <p class="product-price">$${prod.price}</p>
                </div>                        
                `)
            }).join('')
        }
        <p class="product-price-total">TOTAL: $${order.totalPrice}</p>
    </div>

</div>

    `

}

function closeHandleView() {
    let orderContainer=d.getElementById('order-info')
    orderContainer.style.display ='none'
}

async function filterByUser(evt){
const userId=evt.target.value;

let ordersByUser=await axios.get(`${URL}/order?userId=${userId}`,{
    headers:{Authorization:token}
}).then(res=>res.data.findOrders)
if(ordersByUser.length===0){
    d.getElementById('search-orders-results').innerHTML=`No se encontraron resultados`
    printOrders()
    return 
}else{
    d.getElementById('search-orders-results').innerHTML=``
    renderizarOrdenes(ordersByUser)
}

}

async function renderSearchByUser(){

    let users=await axios.get(`${URL}/users`,{
        headers:{Authorization:token}
    }).then(res=>res.data.findUsers)

    let options =users.map(user=>{ return `<option value=${user._id}>${user.fullName}</option>`}
        )

    let selector = `<select class="user-selector-order" onchange="filterByUser(event)">
    <option value=''>Seleccione para filtrar por usuario</option>
    ${options}
    </select>
    <button class="close-search-user" onclick="cleanSearch()"> x </button>`
    d.getElementById('search-orders').innerHTML=selector
        
}


async function cleanSearch(){
    document.querySelector('.user-selector-order').selectedIndex = 0;
    d.getElementById('search-orders-results').innerHTML=``;
    printOrders()
}

async function getOrders(){
    const token = window.localStorage.getItem('token')

    if(userRole==="ADMIN_ROLE" || userRole==="SUPERADMIN_ROLE"){
    try {
            let resp= await axios.get(`${URL}/order`,{
                headers:{Authorization:token}
            })
            
            const msg = resp.data.msg;
            orders=resp.data.findOrders
        } catch (error) {
            showAlert(error.response.data.msg, 'error', 3000);
            console.log(error);
            return
        }
    }else{
        try {
            let resp= await axios.get(`${URL}/myorders`,{
                headers:{Authorization:token}
            })
            
            const msg = resp.data.msg;
            orders=resp.data.findOrders
        } catch (error) {
            showAlert(error.response.data.msg, 'error', 3000);
            console.log(error);
            return
        }

    }

}

async function printOrders(){
    await getOrders()
    renderizarOrdenes(orders)
}

printOrders()
renderSearchByUser()