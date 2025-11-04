// Data menu sesuai permintaan Anda
let menu = {
    food: [
        { name: "Ketan Durian", price: 5000, stock: 10 }
    ],
    drink: [
        { name: "Sinom", price: 6000, stock: 30 },
        { name: "Beras kencur", price: 8000, stock: 20 },
        { name: "Teh Botol", price: 4000, stock: 10 },
        { name: "Aqua", price: 5000, stock: 10 }
    ]
};

// Keranjang belanja
let cart = [];

// Load data dari localStorage jika ada
if (localStorage.getItem('menu')) {
    menu = JSON.parse(localStorage.getItem('menu'));
}


// Fungsi render menu
function renderMenu() {
    const foodMenu = document.getElementById('foodMenu');
    const drinkMenu = document.getElementById('drinkMenu');
    foodMenu.innerHTML = '';
    drinkMenu.innerHTML = '';

    menu.food.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `item ${item.stock === 0 ? 'out-of-stock' : ''}`;
        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Harga: Rp${item.price}</p>
            <p>Stok: ${item.stock === 0 ? 'Habis' : item.stock}</p>
            <button onclick="addToCart('food', ${index})" ${item.stock === 0 ? 'disabled' : ''}>Tambah ke Keranjang</button>
        `;
        foodMenu.appendChild(div);
    });

    menu.drink.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `item ${item.stock === 0 ? 'out-of-stock' : ''}`;
        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Harga: Rp${item.price}</p>
            <p>Stok: ${item.stock === 0 ? 'Habis' : item.stock}</p>
            <button onclick="addToCart('drink', ${index})" ${item.stock === 0 ? 'disabled' : ''}>Tambah ke Keranjang</button>
        `;
        drinkMenu.appendChild(div);
    });
}

// Fungsi tambah ke keranjang
function addToCart(type, index) {
    const item = menu[type][index];
    const existing = cart.find(c => c.type === type && c.index === index);
    if (existing) {
        if (existing.qty < item.stock) {
            existing.qty++;
        } else {
            alert('Stok tidak cukup!');
            return;
        }
    } else {
        cart.push({ type, index, qty: 1 });
    }
    renderCart();
}

// Fungsi render keranjang
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((c, i) => {
        const item = menu[c.type][c.index];
        const subtotal = item.price * c.qty;
        total += subtotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            ${item.name} - ${c.qty} x Rp${item.price} = Rp${subtotal}
            <button onclick="removeFromCart(${i})">Hapus</button>
        `;
        cartItems.appendChild(div);
    });
    document.getElementById('cartTotal').textContent = total;
    document.getElementById('checkoutBtn').disabled = cart.length === 0;
}

// Fungsi hapus dari keranjang
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// Fungsi checkout
document.getElementById('checkoutBtn').onclick = () => {
    document.getElementById('checkoutModal').style.display = 'block';
};

document.getElementById('confirmCheckout').onclick = () => {
    const name = document.getElementById('customerName').value.trim();
    if (!name) {
        alert('Masukkan nama Anda!');
        return;
    }
    // Kurangi stok
    cart.forEach(c => {
        menu[c.type][c.index].stock -= c.qty;
    });
    localStorage.setItem('menu', JSON.stringify(menu));
    
    // Tampilkan receipt
    showReceipt(name);
    cart = [];
    renderCart();
    renderMenu();
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('customerName').value = '';
};

// Fungsi tampilkan receipt
function showReceipt(name) {
    const receiptContent = document.getElementById('receiptContent');
    let total = 0;
    let content = `<p><strong>Nama:</strong> ${name}</p><ul>`;
    cart.forEach(c => {
        const item = menu[c.type][c.index];
        const subtotal = item.price * c.qty;
        total += subtotal;
        content += `<li>${item.name} - ${c.qty} x Rp${item.price} = Rp${subtotal}</li>`;
    });
    content += `</ul><p><strong>Total: Rp${total}</strong></p>`;
    receiptContent.innerHTML = content;
    document.getElementById('receiptModal').style.display = 'block';
}

// Tutup modal
document.querySelectorAll('.close').forEach(close => {
    close.onclick = () => {
        document.getElementById('checkoutModal').style.display = 'none';
        document.getElementById('receiptModal').style.display = 'none';
    };
});

// Mode Admin
document.getElementById('adminBtn').onclick = () => {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    const select = document.getElementById('itemSelect');
    select.innerHTML = '';
    menu.food.forEach((item, index) => {
        select.innerHTML += `<option value="food-${index}">${item.name} (Makanan)</option>`;
    });
    menu.drink.forEach((item, index) => {
        select.innerHTML += `<option value="drink-${index}">${item.name} (Minuman)</option>`;
    });
};

document.getElementById('stockForm').onsubmit = (e) => {
    e.preventDefault();
    const [type, index] = document.getElementById('itemSelect').value.split('-');
    const newStock = parseInt(document.getElementById('newStock').value);
    menu[type][index].stock = newStock;
    localStorage.setItem('menu', JSON.stringify(menu));
    alert('Stok berhasil diupdate!');
    renderMenu();
};

// Render awal
renderMenu();
renderCart();
