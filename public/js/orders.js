const badgeHTML = document.getElementById('cart-count');
let products =[]
function actualizarBadge() {
    let userCart=JSON.parse(window.localStorage.getItem('cart'))
    
    badgeHTML.innerText = userCart.order.reduce((acc, producto) => acc += producto.quantity , 0);

    if(!currentUser){
        badgeHTML.setAttribute('hidden',true)
    }

    }

    async function getProductsInOrder(productsArray){
        if(productsArray<1) return
        products= await axios.post(`${URL}/products/order`,{products:productsArray})
        .then(res=>{
            return res.data.foundedProducts
        })
        .catch(err=>console.log(err))
    }


function handleOrders(){
    let mainOrders = document.getElementById('main-orders')
    if(!mainOrders){
            mainOrders=document.createElement('div')
            mainOrders.id='main-orders'
            mainOrders.classList='main-orders-container visible'
            
        document.body.appendChild(mainOrders)
    
    }else{
        mainOrders.classList.toggle('visible')
    }
    renderOrder(userCart)
}

async function handleCheckout(){
    if(userCart.order.length===0){
        return showAlert('Debe agregar productos al carrito para continuar','error')
    }
    await openCheckOut()
}

async function renderOrder(userCart){
    await getProductsInOrder(userCart.order)

    let totalAmount=0
    let mainOrders = document.getElementById('main-orders')
    if(!mainOrders){
        mainOrders=document.createElement('div')
        mainOrders.id='main-orders'
        mainOrders.classList='main-orders-container'
        document.body.appendChild(mainOrders)
}

    let productsInOrder = userCart.order.map((el,i)=>{
        let product = products.filter((prod,idx)=>prod._id==el?.product)[0]
        totalAmount += product?.price * el.quantity
        return(
            `
            <div class="order-item">
            <img src="${URL}/upload/products/${product?.thumbnail}" class="thumb-order">
            <div class='order-column-1'>
            <p class="order-item-name">${product?.name.toUpperCase()}</p>
            <div class='order-quantity-container'>
            <button class="order-quantity-less" onclick='modifyQuantity("-",${i})'>-</button>
            <p class="order-item-quantity">${el.quantity}</p>
            <button class="order-quantity-more" onclick='modifyQuantity("+",${i})'>+</button>
            </div>
            </div>
            <p class="order-item-price">$${product?.price * el.quantity}</p>
            <button class="order-item-delete" onclick='removeItem(${i})'>x</button>
            </div>
            `
        )
    })

    let orderFooter = `
    <div class="order-footer">
    <p class="total-amount-order">$${totalAmount}</p>
    <button class="check-out-btn" onclick= "handleCheckout()">Finalicemos la compra</button>
</div>
    `

    let orderHeader = `
    <div class='order-header-container'>
    <i class="fa-solid fa-xmark fa-xl" onclick='closeOrder()'></i>
    <p class= "text-order">Hola <strong>${currentUser.fullName}</strong>! Este es el detalle de tu compra: </p>
    </div>
    `


    mainOrders.innerHTML= orderHeader + '<div class="order-products-container">'+ productsInOrder.join('') + '</div>' + orderFooter 
}

function modifyQuantity(operator,i){
    if(userCart.order[i].quantity === 1 && operator=== '-') { return}
    let productsStock = products.filter(prod=> prod._id=== userCart.order[i].product)[0].stock
    if(productsStock <= userCart.order[i].quantity && operator === '+') {return}
    userCart.order[i].quantity+= (operator==='+') ? 1 : -1
    window.localStorage.setItem('cart',JSON.stringify(userCart))
    renderOrder(userCart)
    actualizarBadge()
}

function removeItem(i){
    userCart.order=userCart.order.filter((el,idx)=>idx!==i)
    window.localStorage.setItem('cart',JSON.stringify(userCart))
    renderOrder(userCart)
    actualizarBadge()

}

function closeOrder(){
    document.getElementById('main-orders').classList.remove('visible')

}

function closeCheckout(){
    let mainCheckOut = document.getElementById('main-checkout')
    mainCheckOut.classList.remove('visible')

}    

async function renderCheckoutProducts(userCart){
    await getProductsInOrder(userCart.order)

    let totalAmount=0

    let productsInOrder = userCart.order.map((el,i)=>{
        let product = products.filter((prod,idx)=>prod._id==el?.product)[0]
        totalAmount += product?.price * el.quantity
        return(
            `

            <div class="order-item-checkout">
            <div class="order-img-container">
            <img src="${URL}/upload/products/${product?.thumbnail}" class="thumb-order-checkout">
            </div>
            <div class='order-column-1-checkout'>
            <p class="order-item-name-checkout">${product?.name.toUpperCase()}</p>
            <div class='order-quantity-container-checkout'>
            <p class="order-item-quantity-checkout">${el.quantity}</p>
            </div>
            </div>
            <p class="order-item-price-checkout">$${product?.price * el.quantity}</p>
            </div>
            `
        )
    }).join('')

    return productsInOrder + `<p class="total-order-checkout">$${totalAmount}</p>`
}

async function sendOrder(evt){
evt.preventDefault()
let form = document.getElementById('new-order-form')
await getProductsInOrder(userCart.order)

console.log(form,products)

let productsOrder= products.map(prod=> {
    let quantity = userCart.order.filter(el=>el.product===prod._id)[0]['quantity'] || 0
    return(
        {
        product:prod._id,
        quantity
        })

})
let orderData ={
    products:productsOrder,
    shippingAddress:form.elements.shippingAddress.value,
    phoneNumber:form.elements.phoneNumber.value
    }

    const token = window.localStorage.getItem('token')

    try {
        let resp= await axios.post(`${URL}/order`,orderData,{
            headers:{Authorization:token}
        })
    
        const msg = resp.data.msg;
        showAlert(msg, 'success', 3000)
        window.localStorage.setItem('cart', JSON.stringify({order: []}))
        setTimeout(() => {
            window.location.href = '/';
            
        }, 3500);
    } catch (error) {
        showAlert(error.response.data.msg, 'error', 3000);
        console.log(error);
        return
    }

}

async function openCheckOut(){
    let renderProducts =await renderCheckoutProducts(userCart)
    let mainCheckOut = document.getElementById('main-checkout')
    if(!mainCheckOut){
            mainCheckOut=document.createElement('div')
            mainCheckOut.id='main-checkout'
            mainCheckOut.classList='main-checkout visible'
            
            productsContainer=document.createElement('div')
            productsContainer.id='products-checkout'
            productsContainer.classList='products-checkout'
            productsContainer.innerHTML= renderProducts
            
        document.body.appendChild(mainCheckOut)

    
    }else{
        productsContainer.innerHTML= renderProducts
        mainCheckOut.classList.add('visible')
    }



    mainCheckOut.innerHTML=`
    ${productsContainer.outerHTML}
    <div id="order-form-container" class="order-form-container">
    <button class="btn-close-checkout" onclick="closeCheckout()">
    <i class="fa-solid fa-xmark"></i></button>
    <form id="new-order-form" class="order-form">
        <input type="text" name="shippingAddress" min="5" max="250" placeholder="Dirección de envío" class="adress-send">
        <input type="number" placeholder="Teléfono" name="phoneNumber" class="adress-send">
    <button class="btn-send-checkout" onclick="sendOrder(event)">Enviar Orden</button>
    </form>
    </div>`
}



actualizarBadge()