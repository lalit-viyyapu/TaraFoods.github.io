// List of pickles with placeholders and type
const pickles = [
  { name: 'Chicken Pickle', price: 1500, desc: 'A spicy and flavorful chicken pickle.', available: true, type: 'nonveg' },
  { name: 'Mutton Pickle', price: 2000, desc: 'Tender mutton pieces in aromatic spices.', available: true, type: 'nonveg' },
  { name: 'Fish Pickle', price: 1200, desc: 'Tangy and spicy fish pickle.', available: true, type: 'nonveg' },
  { name: 'Prawns Pickle', price: 2000, desc: 'Juicy prawns in a spicy mix.', available: true, type: 'nonveg' },
  { name: 'Gongura Chicken Pickle', price: 1500, desc: 'Chicken with tangy gongura leaves.', available: true, type: 'nonveg' },
  { name: 'Tomato Pickle', price: 600, desc: 'Classic tangy tomato pickle.', available: true, type: 'veg' },
  { name: 'Ginger Pickle', price: 800, desc: 'Zesty ginger pickle.', available: true, type: 'veg' },
  { name: 'Coriander Pickle', price: 800, desc: 'Fresh coriander pickle.', available: true, type: 'veg' },
  { name: 'Amla Pickle', price: 800, desc: 'Healthy amla pickle.', available: true, type: 'veg' },
  { name: 'Pandu Mirapakaya Pickle', price: 600, desc: 'Spicy red chili pickle.', available: true, type: 'veg' },
  { name: 'Drumstick Pickle', price: 600, desc: 'Unique drumstick pickle.', available: true, type: 'veg' },
  { name: 'Munagaaku Pickle', price: 600, desc: 'Drumstick leaves pickle.', available: true, type: 'veg' },
  { name: 'Curry Leaf Pickle', price: 600, desc: 'Aromatic curry leaf pickle.', available: true, type: 'veg' },
  { name: 'Avakaya Pickle', price: 600, desc: 'Classic mango avakaya.', available: true, type: 'veg' },
  { name: 'Maagaya Pickle', price: 800, desc: 'Traditional maagaya pickle.', available: true, type: 'veg' },
  { name: 'Pudina Pickle', price: 800, desc: 'Refreshing mint pickle.', available: true, type: 'veg' },
  { name: 'Kakarkay Pickle', price: 600, desc: 'Bitter gourd pickle.', available: true, type: 'veg' },
];

// Cart logic
let cart = [];

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(idx, qty = 0.25) {
  const existing = cart.find(item => item.idx === idx);
  if (existing) {
    existing.qty = Math.round((existing.qty + qty) * 100) / 100;
  } else {
    cart.push({ idx, qty });
  }
  updateCartCount();
  animateCartBtn();
  showCartToast();
}

function animateCartBtn() {
  const btn = document.getElementById('cartBtn');
  btn.classList.add('cart-animate');
  setTimeout(() => btn.classList.remove('cart-animate'), 400);
}

function showCartToast() {
  const toastEl = document.getElementById('cartToast');
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl, { delay: 1200 });
    toast.show();
  }
}

function renderCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
    document.getElementById('cartTotal').textContent = '₹0';
    return;
  }
  let total = 0;
  cartItemsDiv.innerHTML = cart.map((item, i) => {
    const pickle = pickles[item.idx];
    const itemTotal = Math.round(pickle.price * item.qty);
    total += itemTotal;
    return `
      <div class="cart-item-row">
        <div>
          <strong>${pickle.name}</strong> <span class="badge ${pickle.type === 'veg' ? 'bg-success' : 'bg-danger'}">${pickle.type === 'veg' ? 'Veg' : 'Non-Veg'}</span><br>
          <small>₹${pickle.price}/kg</small>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${i}, -0.25)">-</button>
          <input type="number" min="0.25" step="0.25" class="cart-item-qty" value="${item.qty}" onchange="setQty(${i}, this.value)">
          <span class="cart-qty-unit">kg</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${i}, 0.25)">+</button>
          <span class="ms-3">₹${itemTotal}</span>
          <span class="remove-cart-item" onclick="removeCartItem(${i})">&times;</span>
        </div>
      </div>
    `;
  }).join('');
  document.getElementById('cartTotal').textContent = `₹${total}`;
}

function changeQty(i, delta) {
  cart[i].qty = Math.max(0.25, Math.round((cart[i].qty + delta) * 100) / 100);
  renderCart();
  updateCartCount();
}
function setQty(i, val) {
  let v = parseFloat(val);
  if (isNaN(v) || v < 0.25) v = 0.25;
  v = Math.round(v * 100) / 100;
  cart[i].qty = v;
  renderCart();
  updateCartCount();
}
function removeCartItem(i) {
  cart.splice(i, 1);
  renderCart();
  updateCartCount();
}

// Show cart modal
function showCartModal() {
  renderCart();
  const modal = new bootstrap.Modal(document.getElementById('cartModal'));
  modal.show();
}

// WhatsApp message preview and copy
function getOrderMessage() {
  if (cart.length === 0) return '';
  let msg = 'Hi, I would like to order the following pickles:\n';
  let total = 0;
  cart.forEach(item => {
    const pickle = pickles[item.idx];
    const itemTotal = pickle.price * item.qty;
    total += itemTotal;
    msg += `- ${pickle.name} (${item.qty} kg) = ₹${itemTotal}\n`;
  });
  msg += `\nTotal: ₹${total}`;
  // Add note if present
  const note = document.getElementById('orderNotes')?.value?.trim();
  if (note) {
    msg += `\n\nNote: ${note}`;
  }
  return msg;
}

function showOrderPreview() {
  const msg = getOrderMessage();
  document.getElementById('orderPreviewText').value = msg;
  document.getElementById('orderPreviewSection').style.display = 'block';
}

function copyOrderMessage() {
  const textarea = document.getElementById('orderPreviewText');
  textarea.select();
  document.execCommand('copy');
}

document.getElementById('cartBtn').addEventListener('click', showCartModal);
document.getElementById('proceedWhatsapp').addEventListener('click', function() {
  if (cart.length === 0) return;
  let msg = getOrderMessage().replace(/\n/g, '%0A');
  window.open(`https://wa.me/919849002243?text=${msg}`, '_blank');
});
document.getElementById('previewOrderBtn').addEventListener('click', showOrderPreview);
document.getElementById('copyOrderBtn').addEventListener('click', copyOrderMessage);

// Add to Cart buttons
function renderPickleCards() {
  const nonvegList = document.getElementById('nonveg-pickle-list');
  const vegList = document.getElementById('veg-pickle-list');
  nonvegList.innerHTML = pickles.filter(p => p.type === 'nonveg').map((pickle, idx) => pickleCard(pickle, idx)).join('');
  vegList.innerHTML = pickles.filter(p => p.type === 'veg').map((pickle, idx) => pickleCard(pickle, idx, true)).join('');

  // Attach event listeners to Add to Cart buttons (fix for event delegation)
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const idx = parseInt(this.getAttribute('data-idx'));
      // Get quantity from input next to button
      const qtyInput = this.parentElement.querySelector('.add-cart-qty');
      let qty = 0.25;
      if (qtyInput) {
        qty = parseFloat(qtyInput.value) || 0.25;
        if (qty < 0.25) qty = 0.25;
      }
      addToCart(idx, qty);
    });
  });

  // Add interactive card effects
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('card-flip'));
    card.addEventListener('mouseleave', () => card.classList.remove('card-flip'));
    card.addEventListener('mousedown', () => card.classList.add('card-active'));
    card.addEventListener('mouseup', () => card.classList.remove('card-active'));
    card.addEventListener('mouseout', () => card.classList.remove('card-active'));
  });
}

function pickleCard(pickle, idx, isVeg = false) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card h-100 ${isVeg ? 'veg-card' : 'nonveg-card'}">
        ${pickle.img ? `<img src="${pickle.img}" class="card-img-top" alt="${pickle.name}">` : ''}
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${pickle.name}</h5>
          <p class="card-text">${pickle.desc}</p>
          <p class="fw-bold">₹${pickle.price}/kg</p>
          <div class="input-group mb-2">
            <input type="number" min="0.25" step="0.25" value="0.25" class="form-control add-cart-qty" style="max-width:90px;">
            <span class="input-group-text">kg</span>
            <button class="btn btn-success add-cart-btn" data-idx="${idx}" ${!pickle.available ? 'disabled' : ''}>
              ${pickle.available ? '<i class="bi bi-cart-plus"></i> Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Contact section interactivity
function enableContactCopy() {
  // Enable Bootstrap tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Copy to clipboard
  document.querySelectorAll('.copy-contact-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const val = this.getAttribute('data-contact');
      navigator.clipboard.writeText(val);
      const msg = document.getElementById('contactCopyMsg');
      msg.style.display = 'block';
      msg.style.opacity = 1;
      setTimeout(() => { msg.style.opacity = 0; }, 1200);
      setTimeout(() => { msg.style.display = 'none'; }, 1500);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPickleCards();
  updateCartCount();
  enableContactCopy();
}); 
