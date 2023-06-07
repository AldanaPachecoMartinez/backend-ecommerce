const cardsContainer = document.getElementById('card-container');
const paginacion = document.getElementById('paginacion-products');
const tituloProductos = document.getElementById('title-products')

let totalResults=0
let currentPage = 1
let currentCategory = ''
let currentSearch = ''

let categorias = ['Velas','Cuadros','Esculturas']


function renderCategorySelector(categorias){

    let marcado = `${categorias.map(el=> 
        `<button class="label-index" onclick="handleCategoryClick('${el}')">${el}</button>`
        ).join('')}
    `
document.getElementById('category-selector').innerHTML=marcado
}

async function handleCategoryClick(category){
    cleanSelection()
    currentCategory=category
    currentSearch=''
    currentPage=1
    renderProductsByCategory(category)


}

async function renderProductsByCategory(category,page=0){
    const response  = await axios.get(`${URL}/products?page=${page}&category=${category}`)
    .then(res=>{
    tituloProductos.innerText=`Categoría: ${category}`
    return res.data
    })
    .catch(err=>console.log(err))
    totalResults=response.totalFound
    renderizarProductos(response.findProducts)
    renderPaginacion()

}

function renderPaginacion() {

    const limit=15
    let maxPages=Math.ceil((totalResults/limit))
if(maxPages>1){
    paginacion.innerHTML = `
    <button onclick=handlePage('-',${maxPages}) class="pag-btn"><i class="fa-solid fa-chevron-left"></i></button> 
    <input type="text" max=${maxPages} min=1 value=${currentPage} class="pag-input" readonly><button onclick=handlePage('+',${maxPages}) class="pag-btn"><i class="fa-solid fa-chevron-right"></i></button>
    `
}else{
    paginacion.innerHTML = ``
}
}
const handlePage=async(signo,maxPages)=>{
    if(signo === '-' && currentPage ===1 ){
        return
    }
    if(currentPage===maxPages && signo==='+'){return}
    currentPage += (signo==='+') ? 1 : -1
    if(currentCategory !== ''){
        await renderProductsByCategory(currentCategory,currentPage-1)
        return
    }
    if(currentSearch !== ''){
        await renderProductsBySearch(currentPage-1,currentSearch)
        return
    }
}

async function renderizarProductos(products) {
renderCategorySelector(categorias)
    cardsContainer.innerHTML = '';
    products.forEach((product, index)=> {
        const card = document.createElement('article');
        card.classList.add('card');

        card.innerHTML += `
        <div class="card__cart">
            <i class="fa-solid fa-cart-plus" onclick='addToCart(${JSON.stringify(product)})'>
                <a href=""></a>
            </i>
        </div>

        <div class="card__header">
            <img src="${URL}/upload/products/${product.thumbnail}" alt="${product.name}" class="card__img">
        </div>

        <div class="card__body">
            <div class="card__title">
                ${product.name.toUpperCase()}
            </div>
            <p class="card__description"> 
                ${product.resume}
            </p>
            <div class="card__price">
                $${product.price}
            </div>

        <div class="card__footer">
            <div class="card__date">
                31/01/2023
            </div>
            <div class="card__btn-container">
                <a href="/product-detail?id=${product._id}" class="card__btn">Detalle</a>
            </div>
        </div>
        </div>
        `
        cardsContainer.appendChild(card);
    });
}

function addToCart(product){
    if(!currentUser){
        showAlert('Para poder agregar productos a su carro de compras, debe ingresar a su cuenta. Si aún no posee una, puede hacerlo en la sección REGISTRARSE del menú superior.',null,8000)
        setTimeout(() => {
            window.location.href='/login'
        }, 8000); 
            
        return
    }


    let index = (userCart.order.findIndex(el=>el.product===product._id))
    
    if(index !== -1){
        userCart.order[index].quantity++ 
    }else{
        userCart.order.push({
            product:product._id,
            quantity:1
        })
    }
    
    window.localStorage.setItem('cart',JSON.stringify(userCart))
    renderOrder(userCart)
    actualizarBadge(userCart)
    showAlert('Producto agregado al carro de compras correctamente.','ok')
}


async function handleBuscarIndex(evt){
    evt.preventDefault()
    if(evt.keyCode !==13 && evt.target.id !== 'search-index'){
        return
    }
    const searchValue=document.getElementById('search-product-index').value.toLowerCase()
    currentSearch=searchValue
    currentCategory=''

    let searchResults = await axios.get(`${URL}/products?search=${searchValue}`)
    .then(res=>{
    tituloProductos.innerText=`Resultados para: "${searchValue}"`

        totalResults=res.data.totalFound
        return res.data.findProducts
    })
    .catch(err=>console.log(err))

    renderizarProductos(searchResults)
    renderPaginacion()
    if(totalResults > 1) {document.querySelector('.section-cards__products-count').innerHTML = `Se encontraron ${totalResults} productos`}
    else{ document.querySelector('.section-cards__products-count').innerHTML = `Se encontró 1 producto`}
    if(totalResults === 0) {document.querySelector('.section-cards__products-count').innerHTML = `No se encontraron productos. Puede buscar con palabras similares.`}

}

async function cleanSearchIndex(){
    await printIndexProducts()
    document.getElementById('search-product-index').value=null
    document.querySelector('.section-cards__products-count').innerHTML = ''
    currentCategory=''
    currentSearch=''
    currentPage=1
}

async function cleanSelection(){
    document.getElementById('search-product-index').value=null
    document.querySelector('.section-cards__products-count').innerHTML = ''
    currentCategory=''
    currentSearch=''
    currentPage=1
}



async function printIndexProducts() {
    productsList = await obtenerProductos();
    renderizarProductos(productsList)
}

async function renderProductsBySearch(page=0,search=''){
    const response  = await axios.get(`${URL}/products?page=${page}&search=${search}`)
    .then(res=>{

        return res.data
    })
    .catch(err=>console.log(err))
totalResults=response.totalFound
renderizarProductos(response.findProducts)
renderPaginacion()
}

async function obtenerProductos(){
    const response  = await axios.get(`${URL}/products?favorites=true`)
    .then(res=>{
        tituloProductos.innerText=`Nuestros Destacados`

        return res.data
    })
    .catch(err=>console.log(err))
totalResults=response.totalFound
return response.findProducts
}

printIndexProducts()