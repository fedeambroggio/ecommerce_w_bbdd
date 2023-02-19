// REGISTER
const signupForm = document.getElementById("signup_form");

if (signupForm) {
    signupForm.onsubmit = (e) => {
        e.preventDefault();
    
        let data = {};
    
        [...signupForm.elements].forEach((item) => {
            if (item.value && item.value !== "") data[item.name] = item.value;
        });
    
        fetch("http://localhost:8080/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    // en caso de éxito, redireccionar al usuario a la página de inicio de sesión
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
}


// LOGIN
const loginForm = document.getElementById("login_form");

if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
    
        let data = {};
    
        [...loginForm.elements].forEach((item) => {
            if (item.value && item.value !== "") data[item.name] = item.value;
        });
    
        fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
}

