const dataForm = document.getElementById("data-form");

const productName = document.getElementById("product-name");

const productPrice = document.getElementById("product-price");

const productDescription = document.getElementById("product-description");

const Btn = document.getElementById("btn");

const itemsList = document.getElementById("items-list");

Btn.addEventListener("click", (event) => {

    event.preventDefault();
    
    if (productName.value ==="" || productPrice.value ==="" || productDescription.value ===""){
        console.log("No puede estar vacío")
    } else {
        console.log("fue agregado correctamente")

        const li = document.createElement("li")

        li.textContent = `
        nombre ${productName.value}
        precio ${productPrice.value}
        descripción ${productDescription.value}
        `;

        const eliminar = document.createElement("button")
        eliminar.textContent ="eliminar"

        eliminar.addEventListener("click", () => {
            li.removeChild()
        });
        li.appendChild(eliminar);

        itemsList.appendChild(li);

        productName.value = "";
        productPrice.value = "";
        productDescription.value = "";
    }

});