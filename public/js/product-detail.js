const params = window.location.search
const paramsUrl = new URLSearchParams(params);
const id = paramsUrl.get('id');
const productDetail = document.getElementById('product-detail')


async function getProductData(id){
    return await axios.get(`${URL}/products/${id}`)
    .then(res=>{
        return res.data.product
    })
    .catch(err=>console.log(err))
}

async function renderProduct(id){
    let product =await getProductData(id)

productDetail.innerHTML= 
`
<div class="container-dtl__carrousel">
<img src="${URL}/upload/products/${product?.images[0]||'/assets/images/logo-marca.png'}" alt="" class="container-dtl__imgs" id='image-product-detail'>
<img src="${URL}/upload/products/${product?.images[1]||'/assets/images/logo-marca.png'}" alt="" class="second-image-detail">
</div>

<div class="container-description">
<h3 class="subtitle-dtl">${product?.category}</h3>
<h1 class="title-dtl">${product?.name}</h1>
<p class="detalle-dtl">${product?.description}</p>
    <div class="container-description__footer">
        <div class="price-dtl">$${product?.price}</div>
        <div class="stock-dtl">
        <div class="order-dtl">
            <button class="quitar-product" onclick='changeQuantity("-",${JSON.stringify(product)})'>-</button>
            <input id="suma-products-detail" value=1 disabled/>
            <button class="agregar-product" onclick='changeQuantity("+",${JSON.stringify(product)})'>+</button>
            </div>
            <p class="stock-text-dtl">${product?.stock} disponibles</p>
            </div>
    </div>
    <div class="container-btn-comprar">
<button class="container-description__btn-comprar" onclick='addToCart(${JSON.stringify(product)})'>
    Lo quiero!
</button>
</div>

</div>

`
}


function addToCart(product){
    let cantidad= Number(document.getElementById('suma-products-detail').value)

    if(!currentUser){
        showAlert('Para poder agregar productos a su carro de compras, debe ingresar a su cuenta. Si aún no posee una, puede hacerlo en la sección REGISTRARSE del menú superior.',null,8000)
        setTimeout(() => {
            window.location.href='/login'
        }, 8000); 
            
        return
    }




    let index = (userCart.order.findIndex(el=>el.product==product._id))
    
    if(index !== -1){
        userCart.order[index].quantity+=cantidad 
    }else{
        userCart.order.push({
            product:product._id,
            quantity:Number(cantidad)
        })
    }
    
    window.localStorage.setItem('cart',JSON.stringify(userCart))
    renderOrder(userCart)
    actualizarBadge(userCart)
    showAlert('Producto agregado al carro de compras correctamente.','ok')
}


function changeQuantity(operator,product){
if(document.getElementById('suma-products-detail').value==='1' && operator==='-'){return}
let productsStock = product.stock
cantidad= Number(document.getElementById('suma-products-detail').value)
if(productsStock<=cantidad  && operator === '+') {return}
    document.getElementById('suma-products-detail').value= cantidad += (operator==='+') ? 1 :-1
}

renderProduct(id)