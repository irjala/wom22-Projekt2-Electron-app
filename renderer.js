/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

getCabins = async() => {
    console.log('getCabins')
    const cabins = await window.electron.getCabins()
    console.log(cabins)

    if (!cabins) {
        document.querySelector('#login').style.display = 'block'
        return
    }
    const services = await window.electron.getServices()
    document.querySelector('#choose-service').innerHTML = "";
    document.querySelector('#notes').innerHTML = "";
    let notesHTML = "";
    for (const cabin of cabins) {
        let counter = 1;
        notesHTML += `
            <div class='container-sm mt-2 p-3 bg-info rounded'><h4>
                ${"Address: " + cabin.address}</h4>`

        for (var i = 0; i < services.length; i++) {

            notesHTML += `
                <div class="serviceClick" id="service${counter}">
                    ${"Service: " + counter + " " + services[i].name}
                </div>`
            counter++;
        }
        notesHTML += `</div>`;

    }

    document.querySelector('#notes').innerHTML = notesHTML;

    document.querySelector('.serviceClick').addEventListener('click', async(event, data) => {
        console.log(this.id)
    })
}
getCabins()

document.querySelector('#btn-login').addEventListener('click', async() => {
    document.querySelector('#msg').innerText = ''
    const login_failed = await window.electron.notesLogin({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
    if (login_failed) {
        document.querySelector('#msg').innerText = login_failed.msg
        return
    }

    document.querySelector('#login').style.display = 'none'
    document.querySelector('#content').style.display = 'inline'
    document.querySelector('#logDiv').style.display = 'inline'
    getCabins()
})

document.querySelector('#services').addEventListener('click', async() => {
    console.log('get-services')
    document.querySelector('#choose-service').innerText = 'Choose cabin'
    const services = await window.electron.getServices
        // Kör eb get request och hämta services från databasen
})

document.querySelector('#orders').addEventListener('click', async() => {
    document.querySelector('#choose-service').innerText = ''
        // Kör en POST request och hämta orders från databasen
})

document.querySelector('#logout').addEventListener('click', async() => {
    console.log("Logout clicked")
    const logout = await window.electron.logoutReset()
})


document.querySelector('#notes').addEventListener('click', async(event, data) => {
    document.querySelector('#choose-service').innerText = 'Choose service'
    console.log(event.target)
    console.log(event.target.getAttribute('_id'))
})