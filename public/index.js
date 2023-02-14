import {
    denormalize,
    schema,
} from "https://cdn.jsdelivr.net/npm/normalizr@3.6.2/+esm";
var socket = io();

let userGreeting = null;

const grettingDiv = document.querySelector("#greeting_div");
let logOutBtn;

const getSessionInfo = () => {
    return fetch("/session-info", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                userGreeting = `Bienvenido ${data.data}`
            })
            .catch((error) => {
                console.error("Error:", error);
            });
}
getSessionInfo().then(() => {
    if (userGreeting !== null) {
        grettingDiv.innerHTML = `
            <div style="display: flex; justify-content: space-around; align-items: center">
                <h1 style="color: #4a6d34; margin-right: 16px">${userGreeting}</h1>
                <button id="logout_btn">Desloguear</button>
            </div>
        `
        logOutBtn = document.querySelector("#logout_btn");
        logOutBtn.onclick = () => {
            fetch("/session-delete", { method: "POST" })
                .then((response) => response.json())
                .then((data) => {
                    const documentBody = document.querySelector("body");
                    documentBody.innerHTML = `
                    <div style="
                            width: 500px;
                            height: auto;
                            background-color: #8fab7d;
                            display: flex; 
                            justify-content: center; 
                            align-items: center"
                    >
                        <h1 style="color: #4a6d34">${data.data}</h1>
                    </div>
                    `
                    setTimeout(() => {
                        window.location.href = "/login"
                    }, 2000)
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        };
    } else {
        grettingDiv.innerHTML = `<div style="display: flex; justify-content: space-around; align-items: center">
                <h1 style="color: #f9f585">Usuario no logueado</h1>
            </div>`
    }
})

// PRODUCTOS

socket.on("productos", (data) => {
    const tableContainer = document.querySelector("#table_container");

    if (data.length > 0) {
        let tableHTML = `
        <table style="border: 1px solid black;">
            <tr>
                <th  style="border: 1px solid black; padding: 8px">Nombre</th>
                <th  style="border: 1px solid black; padding: 8px">Precio</th>
                <th style="border: 1px solid black; padding: 8px">URL Imagen</th>
            </tr>
        `;
        data.forEach((el) => {
            tableHTML += `
            <tr>
                <td style="border: 1px solid black; padding: 8px">${el.nombre}</td>
                <td style="border: 1px solid black; padding: 8px">${el.precio}</td>
                <td style="border: 1px solid black; padding: 8px"><img style="width: 64px; height: auto" src=${el.foto} alt="prod_img"/></td>
            </tr>
            `;
        });

        tableContainer.innerHTML = tableHTML + "</table>";
    } else {
        tableContainer.innerHTML = `<p style="color: red; font-size: 20px">Sin productos para mostrar</p>`;
    }
});

const newProductForm = document.getElementById("new_product_form");
const btnGetTestProducts = document.getElementById("btn-get-test-products");

btnGetTestProducts.onclick = () => {
    fetch("/api/productos-test", { method: "GET" })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const tableContainer = document.querySelector("#table_container");

            let tableHTML = `
        <table style="border: 1px solid black;">
            <tr>
                <th  style="border: 1px solid black; padding: 8px">Nombre</th>
                <th  style="border: 1px solid black; padding: 8px">Precio</th>
                <th style="border: 1px solid black; padding: 8px">URL Imagen</th>
            </tr>
        `;
            data.products.forEach((el) => {
                tableHTML += `
            <tr>
                <td style="border: 1px solid black; padding: 8px">${el.nombre}</td>
                <td style="border: 1px solid black; padding: 8px">${el.precio}</td>
                <td style="border: 1px solid black; padding: 8px"><img style="width: 64px; height: auto" src=${el.foto} alt="prod_img"/></td>
            </tr>
            `;
            });

            tableContainer.innerHTML = tableHTML + "</table>";
        })
        .catch((err) => {
            console.log(err);
        });
};

new_product_form.onsubmit = (e) => {
    e.preventDefault();

    let data = {};

    [...newProductForm.elements].forEach((item) => {
        if (item.value && item.value !== "") data[item.name] = item.value;
    });

    socket.emit("nuevoProducto", data);
};

// MENSAJES

socket.on("mensajes", (data) => {
    const mensajesContainer = document.querySelector("#mensajes_container");

    if (data) {
        const author = new schema.Entity("authors");
        const messages = new schema.Entity("messages", {
            author: author,
        });
        const denormalizedData = denormalize(
            data.result,
            [messages],
            data.entities
        );
        const denormalizedRatio = ((JSON.stringify(denormalizedData).length /JSON.stringify(data).length) *100).toFixed(2);
    
        if (denormalizedData.length > 0) {
            //Si existe algún mensaje
            let chatHTML = `<h3>Porcentaje denormalizado en relacion al original ${denormalizedRatio}%</h3>`;
    
            denormalizedData.forEach((el) => {
                chatHTML += `
                <p>
                <span style="color: blue; font-weight: 900">${el._doc.author.id}</span>
                <span style="color: brown;">[${el._doc.hora}]: </span>
                <span style="color: green; font-style: italic;">${el._doc.text}</span>            
                <span><img style="width: 16px; height: auto" src=${el._doc.author.avatar} alt="user"/></span>            
                </p>
                `;
            });
    
            mensajesContainer.innerHTML = chatHTML;
        } else {
            mensajesContainer.innerHTML = `<p style="color: red; font-size: 20px">Sin mensajes para mostrar</p>`;
        }
    }
   
});

const newMensajeForm = document.getElementById("mensajes_form");

newMensajeForm.onsubmit = (e) => {
    e.preventDefault();

    let data = {};

    [...newMensajeForm.elements].forEach((item) => {
        if (item.value && item.value !== "") data[item.name] = item.value;
    });

    const finalData = {
        author: {
            id: data.email,
            nombre: data.nombre,
            apellido: data.apellido,
            edad: data.edad,
            avatar: data.avatar,
            alias: data.alias,
        },
        text: data.mensaje,
    };

    socket.emit("nuevoMensaje", finalData);
};
