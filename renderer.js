/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
 getCabins = async () => {
    console.log('getCabins')
    const cabins = await window.electron.getCabins()
    console.log(cabins)

    if (!cabins) {
        document.querySelector('#login').style.display = 'block'
        return
    }

    let notesHTML = "";
    for (const cabin of cabins) {
        notesHTML += `
            <div class="note">
                ${"Address: " + cabin.address} 
            </div>
        `;
    }

    document.querySelector('#notes').innerHTML = notesHTML;

}
getCabins()


document.querySelector('#btn-login').addEventListener('click', async () => {
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
    getCabins()
})
document.querySelector('#btn-save').addEventListener('click', async () => {
    
    const noteId = 0
    const noteText = document.querySelector('#note-text').value
    const noteSaved = await window.electron.saveNote({
        id: noteId, 
        text: noteText
    })
    console.log(noteSaved)
    getNotes()

})

document.querySelector('#notes').addEventListener('click', async (event) => {
    console.log(event.target)
    if (event.target.classList.contains('btn-del')) {
        console.log(event.target.getAttribute('data-id'))
        await window.electron.delNote(event.target.getAttribute('data-id'))

    }
})
