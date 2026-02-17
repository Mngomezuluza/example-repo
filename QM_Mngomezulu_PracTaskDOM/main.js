const products = [
  { id: 1, name: 'Milk', quantity: 2, price: 3.99, bought: true },
  { id: 2, name: 'Bread', quantity: 1, price: 2.49, bought: false },
  { id: 3, name: 'Eggs', quantity: 12, price: 4.29, bought: true },
  { id: 4, name: 'Apples', quantity: 6, price: 5.75, bought: false }
];

let nextId = 5;
let editingId = null;

const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productQtyInput = document.getElementById('productQty');
const productPriceInput = document.getElementById('productPrice');
const saveBtn = document.getElementById('saveBtn');
const viewAllBtn = document.getElementById('viewAllBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const productTableBody = document.getElementById('productTableBody');
const statusMessage = document.getElementById('statusMessage');

function setStatus(message) {
  statusMessage.textContent = message;
}

function currency(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts() {
  productTableBody.innerHTML = '';

  products.forEach((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${currency(product.price)}</td>
      <td>
        <button class="badge ${product.bought ? 'checked' : 'unchecked'}" data-action="toggle" data-id="${product.id}">
          ${product.bought ? 'Bought' : 'Pending'}
        </button>
      </td>
      <td class="actions">
        <button class="btn btn-small btn-edit" data-action="edit" data-id="${product.id}">Update</button>
        <button class="btn btn-small btn-danger" data-action="delete" data-id="${product.id}">Delete</button>
      </td>
    `;
    productTableBody.appendChild(row);
  });
}

function clearForm() {
  productForm.reset();
  editingId = null;
  saveBtn.textContent = 'Create Product';
  cancelEditBtn.classList.add('hidden');
}

function createProduct(name, quantity, price) {
  products.push({
    id: nextId,
    name,
    quantity,
    price,
    bought: false
  });
  nextId += 1;
  setStatus(`Created product: ${name}`);
}

function updateProduct(id, name, quantity, price) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  product.name = name;
  product.quantity = quantity;
  product.price = price;
  setStatus(`Updated product #${id}`);
}

function deleteProduct(id) {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) return;

  const removed = products.splice(index, 1)[0];
  setStatus(`Deleted product: ${removed.name}`);

  if (editingId === id) {
    clearForm();
  }
}

function startEdit(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  editingId = id;
  productNameInput.value = product.name;
  productQtyInput.value = product.quantity;
  productPriceInput.value = product.price;
  saveBtn.textContent = 'Save Update';
  cancelEditBtn.classList.remove('hidden');
  setStatus(`Editing product #${id}`);
}

function toggleBought(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  product.bought = !product.bought;
  setStatus(`Product #${id} marked as ${product.bought ? 'Bought' : 'Pending'}`);
}

productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = productNameInput.value.trim();
  const quantity = Number(productQtyInput.value);
  const price = Number(productPriceInput.value);

  if (!name || quantity <= 0 || price < 0) {
    setStatus('Please enter valid product details.');
    return;
  }

  if (editingId === null) {
    createProduct(name, quantity, price);
  } else {
    updateProduct(editingId, name, quantity, price);
  }

  clearForm();
  renderProducts();
});

viewAllBtn.addEventListener('click', () => {
  renderProducts();
  setStatus(`Viewing all products (${products.length} total).`);
});

cancelEditBtn.addEventListener('click', () => {
  clearForm();
  setStatus('Edit canceled.');
});

productTableBody.addEventListener('click', (event) => {
  const target = event.target;
  const action = target.dataset.action;
  const id = Number(target.dataset.id);

  if (!action || !id) return;

  if (action === 'edit') {
    startEdit(id);
  }

  if (action === 'delete') {
    deleteProduct(id);
    renderProducts();
  }

  if (action === 'toggle') {
    toggleBought(id);
    renderProducts();
  }
});

renderProducts();
setStatus(`Ready. Loaded ${products.length} starter products.`);
