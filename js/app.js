
let employees = [];
const employeesUrl = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&nat=US&noinfo`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modal = overlay.querySelector(".modal");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const searchbar = document.getElementById("searchbar");
let modalIndex;

fetch(employeesUrl)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err))

function displayEmployees(employeeData) {
    employees = employeeData;
    let employeeHTML = '';

    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        employeeHTML += `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}" />
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div>
        `
    });
    gridContainer.innerHTML = employeeHTML;
}

function displayModal(index) {
    let { name, dob, phone, email, location: { city, street, state, postcode}, picture } = employees[index];

    let date = new Date(dob.date);

    const modalHTML = `
        <img class="avatar" src="${picture.large}">
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr/>
            <p class="phone">${phone}</p>
            <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
            <p class="birthday">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    `;

    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
}

gridContainer.addEventListener('click', (e) => {
    if (e.target !== gridContainer) {
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');

        displayModal(index);
        modalIndex = parseInt(index);
    }
});

modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
});


// =================================
// Employee Filter
// =================================

searchbar.addEventListener('keyup', () => {
    const input = searchbar.value.toLowerCase();
    const employeeCards = document.querySelectorAll(".card");
    employeeCards.forEach(card => {
        const name = card.querySelector("h2").textContent.toLowerCase();
        if (name.includes(input) == false) {
            card.style.display = "none";
        } else {
            card.style.display = '';
        }
    })
});


// =================================
// Next/Previous Modal
// =================================

modal.addEventListener('click', (e) => {
    const button = e.target;
    if (button.tagName === "BUTTON") {
        if (button.textContent === "<") {
            if (modalIndex === 0) {
                modalIndex = (employees.length - 1);
            } else {
                modalIndex -= 1;
            }
            displayModal(modalIndex.toString(10));
        } else if (button.textContent === ">") {
            if (modalIndex === (employees.length - 1)) {
                modalIndex = 0;
            } else {
                modalIndex += 1;
            }
            displayModal(modalIndex.toString(10));
        }
        
    }
})
