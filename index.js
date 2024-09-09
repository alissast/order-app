import { menuArray } from './data.js'
const orderItems = []

function getPageHtml(){
    
    const menuHtml = menuArray.map(item => {
        
        const { name, ingredients, id, price } = item
        
        return `
            <div class="menu-item-container">
                <img class="menu-item-img" src="./images/${name.toLowerCase()}.png" width="70px" height="89px" alt="" />
                <div class="menu-item-details">
                    <h2 class="menu-item-name">${name}</h2>
                    <p class="menu-item-ingredients">${ingredients.join(', ')}</p>
                    <p class="menu-item-price">$${price}</p>
                </div>
                <button class="btn-add-to-cart" id="${id}" data-add-btn="${id}" aria-label="Add ${name} to cart"><span class="icon-add-to-cart">+</span></button>
            </div>
        `
    }).join('')
    
    
    
    document.getElementById('menu-container').innerHTML = menuHtml
}

document.addEventListener('click', function(e) {
    
    if (e.target.id === 'btn-pay') {
        handlePayClick()
    } 

    if(e.target.classList.contains('btn-add-to-cart') || e.target.classList.contains('icon-add-to-cart')) {
        const btn = e.target.classList.contains('btn-add-to-cart') 
            ? e.target 
            : e.target.parentElement
        if(btn.dataset.addBtn) {
            addItemToCart(btn.dataset.addBtn)
        }
    }
    
    if(e.target.dataset.btnRemove) {
        handleRemoveClick(e.target.dataset.btnRemove)
    }
})

document.getElementById('btn-complete').addEventListener('click', () => handleCompleteClick())

function handleCompleteClick() {
    const paymentModal = document.getElementById('payment-modal')
    paymentModal.classList.remove('hidden')
    paymentModal.setAttribute('aria-hidden', 'false')
}

function handlePayClick() {
    
    const paymentModal = document.getElementById('payment-modal')
    paymentModal.classList.add('hidden')
    paymentModal.setAttribute('aria-hidden', 'true')
    
    const orderDetailsEl = document.getElementById('order-details')
    if (orderDetailsEl) {
        orderDetailsEl.classList.add('hidden')
        orderDetailsEl.classList.remove('flex')
    }
    
    orderItems.length = 0
    
    const confirmationContainer = document.getElementById('order-confirmed-container')
    confirmationContainer.classList.remove('hidden')
    
    const completeOrderBtn = document.getElementById('btn-complete')
    if (completeOrderBtn) {
        completeOrderBtn.classList.add('hidden')
    }

}

function addItemToCart(menuItemId) {
    
    const targetMenuItem = menuArray.filter(function(menuItem) {
        return Number(menuItem.id) === Number(menuItemId)
    })[0]
    
    if(targetMenuItem) {
        showOrderDetails()
        updateOrderDetails(targetMenuItem)
    }
}

function showOrderDetails() {
    const orderDetailsEl = document.getElementById('order-details')
    if (orderDetailsEl) {
        
        const confirmationContainer = document.getElementById('order-confirmed-container')
        
        if (confirmationContainer) {
            confirmationContainer.classList.add('hidden')
        }
        
        if (orderDetailsEl.classList.contains('hidden')) {
            orderDetailsEl.classList.remove('hidden')
            orderDetailsEl.classList.add('flex')
        }
    } else {
        console.error('order-details element not found')
  }
}

function updateOrderDetails(menuItem) {    
    const existingOrderItem = orderItems.filter(function(item) {
        return Number(item.id) === Number(menuItem.id)
    })[0]
    
    if (!existingOrderItem) {
        orderItems.push({ ...menuItem, quantity: 1 })
    } else {
        existingOrderItem.quantity++
    }
    
    renderOrderItems()
    
}

function renderOrderItems() {
    
    const orderItemsContainer = document.getElementById('order-items-container')
    const orderItemsTotal = document.getElementById('order-items-total')
    
    const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    
    orderItemsTotal.innerHTML = `
        <div class="order-details-item"<
            <span>Total price: </span>
            <span class="order-item-price">$${total}</span>
        </div>
    `
    
    orderItemsContainer.innerHTML = orderItems.map(item => `
        <div class="order-details-item" data-item-id="${item.id}">
            <div class="order-item-remove-btn">
                <span>${item.name} x${item.quantity}</span>
                <button class="btn-remove" id="btn-remove-${item.id}" data-btn-remove="${item.id}">remove</button>
            </div>
            <span class="order-item-price">$${item.price * item.quantity}</span>
        </div>
    `).join('')
}

function handleRemoveClick(itemId) {
    
    let isConfirmed = confirm("Are you sure you want to remove this item?")
    
    if(isConfirmed){
    
        const orderItemsIndex = orderItems.findIndex(item => Number(item.id) === Number(itemId))
    
        if (orderItemsIndex !== -1) {
            if (orderItems[orderItemsIndex].quantity > 1) {
                orderItems[orderItemsIndex].quantity--
            } else {
                orderItems.splice(orderItemsIndex, 1)
            }
        }
    }
    
    renderOrderItems()

}

getPageHtml()