// Data menu awal (bisa disimpan di localStorage untuk persistensi)
let menu = {
    food: [
        { name: "Ketan Durian", price: 5000, stock: 10 },
    ]
    drink: [
        { name: "Sinom", price: 6000, stock: 30 },
        { name: "Beras kencur", price: 8000, stock: 20 }, 
        { name: "Teh Botol", price: 4000, stock: 10 }
        { name: "Aqua", price: 5000, stock: 10 }
    ]
};

// Load data dari localStorage jika ada
if (localStorage.getItem('menu')) {
    menu = JSON.parse(localStorage.getItem('menu'));
}

// Fungsi untuk render menu
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
            <button onclick="orderItem('food', ${index})" ${item.stock === 0 ? 'disabled' : ''}>Beli</button>
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
            <button onclick="orderItem('drink', ${index})" ${item.stock === 0 ? 'disabled' : ''}>Beli</button>
        `;
        drinkMenu.appendChild(div);
    });
}

// Fungsi untuk pesan item
function orderItem(type, index) {
    const item = menu[type][index];
    document.getElementById('orderItem').textContent = `Pesan: ${item.name} - Rp${item.price}`;
    document.getElementById('orderForm').style.display = 'block';
    document.getElementById('confirmOrder').onclick = () => {
        const qty = parseInt(document.getElementById('quantity').value);
        if (qty > 0 && qty <= item.stock) {
            item.stock -= qty;
            localStorage.setItem('menu', JSON.stringify(menu));
            alert(`Pesanan berhasil: ${qty} x ${item.name}. Total: Rp${qty * item.price}`);
            renderMenu();
            document.getElementById('orderForm').style.display = 'none';
        } else {
            alert('Jumlah tidak valid atau stok tidak cukup!');
        }
    };
}

// Mode Admin untuk update stok
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

// Render menu saat load
renderMenu();
