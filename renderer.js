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
        console.log(cabin)
        notesHTML += `
            <div class='container-sm mt-2 p-3 bg-info rounded'>
                ${"Address: " + cabin.address}`
        for (var i = 0; i < services.length; i++) {
            notesHTML += `
                <div class="row clickable-row">
                    <div class="selectService" service-id=${services[i].name} cabin-name=${cabin._id}>
                        ${"Service " + services[i].id + " : " + services[i].name}
                    </div>
                </div>`
        }
        notesHTML += `</div>`;
    }

    document.querySelector('#notes').innerHTML = notesHTML;

}

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
    document.querySelector('#service-content').style.display = 'inline'
    document.querySelector('#logDiv').style.display = 'inline'
    document.querySelector('#selection').style.display = 'inline'
    getCabins()

})

document.querySelector('#services').addEventListener('click', async() => {
    console.log('get-services')
    document.querySelector('#service-content').style.display = 'inline'
    document.querySelector('#order-content').style.display = 'none'
    const services = await window.electron.getServices
        // Kör eb get request och hämta services från databasen
})

document.querySelector('#orders').addEventListener('click', async() => {
    //document.querySelector('#service-content').innerText = ''
    document.querySelector('#order-content').innerText = ''
    document.querySelector('#service-content').style.display = 'none'
    document.querySelector('#order-content').style.display = 'inline'
        // Kör en POST request och hämta orders från databasen
})

document.querySelector('#logout').addEventListener('click', async() => {
    console.log("Logout clicked")
    const logout = await window.electron.logoutReset()
})


document.querySelector('#notes').addEventListener('click', async(event, data) => {

    let pick = confirm("Would you like to get this service?")
    if (pick) {
        const sID = event.target.getAttribute('service-id')
        const cName = event.target.getAttribute('cabin-name')
            //console.log(sId + " " + cName)
        const sendOrder = await window.electron.sendOrder(sID, cName)

        if (sendOrder) {
            console.log("yay") //event.target.style = "color:gold"
        } else {
            console.log("RESPONSE" + sendOrder)
        }
    }
})