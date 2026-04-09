const accountLogin = document.getElementById("accountLogin")
const accountLogout = document.getElementById("accountLogout")
const vehiclePrice = document.getElementById("vehiclePrice")
console.log(parseInt(vehiclePrice.textContent))
async function checkLoginStatus() {

    const res = await fetch('/refresh',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    console.log("Checking login status...")
    if (res.ok) {
        accountLogin.style.display = 'none';
        accountLogout.style.display = 'inline';
    }
}

(async () => {
    await checkLoginStatus()
})()

accountLogout.addEventListener('click', async () => {
    const res = await fetch('/account/logout')
    window.location.href = "/"
    if (res.ok) {
        accountLogin.style.display = 'inline';
        accountLogout.style.display = 'none';
    }
    else {
        console.error('Logout failed')
    }
})
