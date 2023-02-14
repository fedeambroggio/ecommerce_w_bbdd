const loginForm = document.getElementById("login_form");

loginForm.onsubmit = (e) => {
    e.preventDefault();

    let data = {};

    [...loginForm.elements].forEach((item) => {
        if (item.value && item.value !== "") data[item.name] = item.value;
    });

    fetch("http://localhost:8080/session-save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then(() => {
            window.location.href = "/dashboard";
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};
