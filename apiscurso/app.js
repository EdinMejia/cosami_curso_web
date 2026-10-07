// Referencias principales
const categorySelect = document.getElementById('categorySelect');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const cardContainer = document.getElementById('cardContainer');
const cartCounter = document.getElementById('cartCounter');

// Referencias del Modal
const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtns = [document.getElementById('closeModal'), document.getElementById('closeModalDesktop')];

// Variables globales
let currentProducts = [];
let cartItems = 0;

// Generar Skeletons (Pantalla de carga animada)
function generarSkeletons() {
    loading.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        loading.innerHTML += `
            <div class="glass-panel rounded-2xl p-4 h-80 flex flex-col animate-pulse border-slate-700/50">
                <div class="bg-slate-800/50 rounded-xl h-40 w-full mb-4"></div>
                <div class="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-slate-700 rounded w-1/2 mb-auto"></div>
                <div class="flex justify-between items-center mt-4">
                    <div class="h-6 bg-slate-700 rounded w-1/3"></div>
                    <div class="h-8 bg-slate-700 rounded w-8 rounded-full"></div>
                </div>
            </div>
        `;
    }
}

// Evento de búsqueda por categoría
categorySelect.addEventListener('change', () => {
    obtenerDatos(categorySelect.value);
});

// Función Asíncrona (Fetch API)
async function obtenerDatos(categoria) {
    errorMessage.classList.add('hidden');
    cardContainer.classList.add('hidden');
    generarSkeletons();
    loading.classList.remove('hidden');

    const API_URL = categoria === 'all' 
        ? 'https://fakestoreapi.com/products' 
        : `https://fakestoreapi.com/products/category/${categoria}`;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        
        if (data.length === 0) throw new Error("No hay productos en esta categoría.");

        currentProducts = data; // Guardamos en memoria para usar en el Modal
        renderizarTarjetas(data);

    } catch (error) {
        console.error(error);
        errorText.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

// Renderizar la cuadrícula de productos
function renderizarTarjetas(productos) {
    cardContainer.innerHTML = ''; 

    productos.forEach(producto => {
        const cardHTML = `
            <div class="glass-panel rounded-2xl p-5 flex flex-col h-full neon-shadow transition-all duration-300 group relative">
                
                <!-- Badge de rating -->
                <div class="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 z-10 border border-slate-700">
                    <i class="ph-fill ph-star text-yellow-400 text-xs"></i>
                    <span class="text-xs font-bold">${producto.rating.rate}</span>
                </div>

                <!-- Imagen con fondo blanco (FakeStore requiere esto para verse bien) -->
                <div class="bg-white rounded-xl p-4 mb-4 h-48 flex items-center justify-center overflow-hidden cursor-pointer" onclick="abrirModal(${producto.id})">
                    <img src="${producto.image}" alt="${producto.title}" class="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500">
                </div>
                
                <h2 class="text-sm font-bold text-white mb-1 line-clamp-2 cursor-pointer hover:text-indigo-400 transition-colors" onclick="abrirModal(${producto.id})">
                    ${producto.title}
                </h2>
                <p class="text-xs text-slate-400 mb-4 capitalize">${producto.category}</p>
                
                <div class="mt-auto flex justify-between items-center">
                    <span class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                        $${producto.price.toFixed(2)}
                    </span>
                    <button class="bg-slate-800 hover:bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-90" onclick="sumarCarrito()" title="Añadir al carrito">
                        <i class="ph-bold ph-plus"></i>
                    </button>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHTML;
    });

    cardContainer.classList.remove('hidden');
}

// =========================================
// PUNTOS EXTRA: LÓGICA DEL MODAL Y CARRITO
// =========================================

function abrirModal(id) {
    const producto = currentProducts.find(p => p.id === id);
    if (!producto) return;

    // Inyectar datos al modal
    document.getElementById('modalImage').src = producto.image;
    document.getElementById('modalCategory').textContent = producto.category;
    document.getElementById('modalTitle').textContent = producto.title;
    document.getElementById('modalDescription').textContent = producto.description;
    document.getElementById('modalPrice').textContent = `$${producto.price.toFixed(2)}`;

    // Mostrar con animación
    modal.classList.remove('hidden');
    // Pequeño delay para que la transición de CSS funcione
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);
}

function cerrarModal() {
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Eventos para cerrar modal
closeModalBtns.forEach(btn => btn.addEventListener('click', cerrarModal));
modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal(); // Cierra si haces clic fuera del cuadro
});

// Simulador de Carrito interactivo
function sumarCarrito() {
    cartItems++;
    cartCounter.textContent = cartItems;
    
    // Animación de "pop" en el contador
    cartCounter.classList.add('scale-150', 'bg-cyan-400');
    setTimeout(() => {
        cartCounter.classList.remove('scale-150', 'bg-cyan-400');
    }, 200);
}

// Iniciar app
window.addEventListener('DOMContentLoaded', () => {
    obtenerDatos('all');
});