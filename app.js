const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");

const btn = document.getElementById("btn");
const syncBtn = document.getElementById("sync-btn");

const lista = document.getElementById("lista-api");

const API_URL = "http://localhost:3000/productos";

// evento agregar producto
btn.addEventListener("click", agregarProducto);

// evento sincronizar API
syncBtn.addEventListener("click", obtenerProductos);

// delegación de eventos
lista.addEventListener("click", (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("eliminar")) {
    eliminarProducto(id);
  }

  if (e.target.classList.contains("editar")) {
    editarProducto(id);
  }
});

// obtener productos
async function obtenerProductos() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error("Error GET");

    const data = await res.json();

    // guardar en localStorage (RESPALDO)
    localStorage.setItem("productos", JSON.stringify(data));

    renderizar(data);

  } catch (error) {
    console.error(error);

    // fallback localStorage si falla API
    const cache = JSON.parse(localStorage.getItem("productos")) || [];
    renderizar(cache);
  }
}

// mostrar productos
function renderizar(data) {
  lista.innerHTML = "";

  data.forEach((p) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${p.precio}</p>
      <p>${p.descripcion || ""}</p>

      <button class="eliminar" data-id="${p.id}">Eliminar</button>
      <button class="editar" data-id="${p.id}">Editar</button>
    `;

    lista.appendChild(div);
  });
}

// agregar producto
async function agregarProducto() {
  try {

    if (
      productName.value === "" ||
      productPrice.value === "" ||
      productDescription.value === ""
    ) {
      console.log("Campos vacíos");
      return;
    }

    if (Number(productPrice.value) <= 0) {
      console.log("Error: solo números positivos");
      return;
    }

    const nuevoProducto = {
      nombre: productName.value,
      precio: Number(productPrice.value),
      descripcion: productDescription.value
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoProducto)
    });

    if (!res.ok) throw new Error("Error POST");

    const data = await res.json();

    // guardar en localStorage también
    const cache = JSON.parse(localStorage.getItem("productos")) || [];
    cache.push(data);
    localStorage.setItem("productos", JSON.stringify(cache));

    console.log("Producto agregado correctamente");

    productName.value = "";
    productPrice.value = "";
    productDescription.value = "";

    obtenerProductos();

  } catch (error) {
    console.error(error);
  }
}

// eliminar producto
async function eliminarProducto(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    console.log("Producto eliminado correctamente");

    // actualizar localStorage
    const cache = JSON.parse(localStorage.getItem("productos")) || [];
    const nuevoCache = cache.filter(p => p.id != id);
    localStorage.setItem("productos", JSON.stringify(nuevoCache));

    obtenerProductos();

  } catch (error) {
    console.error(error);
  }
}

// editar producto
async function editarProducto(id) {
  try {

    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevoPrecio = prompt("Nuevo precio:");
    const nuevaDescripcion = prompt("Nueva descripción:");

    if (!nuevoNombre || !nuevoPrecio) return;

    if (Number(nuevoPrecio) <= 0) {
      console.log("Error: solo números positivos");
      return;
    }

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre: nuevoNombre,
        precio: Number(nuevoPrecio),
        descripcion: nuevaDescripcion
      })
    });

    console.log("Producto editado correctamente");

    // actualizar localStorage
    const cache = JSON.parse(localStorage.getItem("productos")) || [];

    const actualizado = cache.map(p =>
      p.id == id
        ? { ...p, nombre: nuevoNombre, precio: nuevoPrecio, descripcion: nuevaDescripcion }
        : p
    );

    localStorage.setItem("productos", JSON.stringify(actualizado));

    obtenerProductos();

  } catch (error) {
    console.error(error);
  }
}

// cargar al iniciar
obtenerProductos();