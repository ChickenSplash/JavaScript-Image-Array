let currentImageUrl = "";

function fetchImage() {
    const width = document.querySelector("#width").value;
    const height = document.querySelector("#height").value;
    const imgElement = document.getElementById('randomImage');
    const loader = document.querySelector(".loader");

    function toggleLoading() {
        if (loader.classList.contains("active")) {
            loader.classList.remove("active");
            imgElement.classList.remove("loading-blur");
        } else {
            loader.classList.add("active")
            imgElement.classList.add("loading-blur")
        }
    }

    toggleLoading();
 
    fetch(`https://picsum.photos/${width}/${height}`)
        .then(response => {
            if (!response.ok || !width || !height) { // is the respons not ok or no width value or no height value?
                throw new Error('HTTP error: ' + response.status);
            }
            currentImageUrl = response.url; // useful for if user wants to add current displayed image to collection, we have its value here for each new image
            return response.blob();
        })
        .then(data => {
            const imageURL = URL.createObjectURL(data);
            imgElement.src = imageURL;
        })
        .catch(error => {
            console.warn('Failed to fetch image:', error);
            showPopUp("Failed to load image", success = false);
        })
        .finally(toggleLoading);
}

const emailSelect = document.getElementById("emailSelect");
const imageArray = document.querySelector(".image-array");
const imageArrayHeader = document.querySelector(".image-array-header");

// refresh the images array display

function refreshImageArray() {
    // update the section header
    imageArrayHeader.textContent = `Collection for ${emailSelect.value}`
    // update the images displayed
    imageArray.innerHTML = "";
    
    for (let pictureUrl of imageCollections[emailSelect.value]) {
        const img = document.createElement("img");
        img.src = pictureUrl;   
        imageArray.appendChild(img);
    }
}

// calls the freshly declared function upon changing the email selection or adding an item to the array

emailSelect.addEventListener("change", refreshImageArray);

function addToCollection() {
    if (currentImageUrl) { // does the image url exist?
        if (!imageCollections[emailSelect.value].includes(currentImageUrl)) { // if so, does the currently selected email not have this url in its array?
            imageCollections[emailSelect.value].push(currentImageUrl)
            refreshImageArray();
            showPopUp("Added to current collection", success = true);
        } else {
            showPopUp("Image already in current collection", success = false);
        }
    } else {
        showPopUp("There was a problem adding this image", success = false);
    }
}

// the object that actually contains the list of images that is assigned to the email

const imageCollections = {
    "email@example.com": [
        "https://fastly.picsum.photos/id/330/1280/720.jpg?hmac=KDp5Bdt2uCJB714pteQPfv723GLJxsTH--dfFwQxxxo",
        "https://fastly.picsum.photos/id/365/1280/720.jpg?hmac=UZFdP-gnW-Jge1X1kpN6m2R_ePTo1C8r_XK80XBBQPU",
        "https://fastly.picsum.photos/id/1066/1280/720.jpg?hmac=ccSBWaWM3h_3guS9T5hxEUd8Ni9rIcY9EUZ6FqOfO94",
        "https://fastly.picsum.photos/id/550/1280/720.jpg?hmac=8qb-fEWEhgTPHak-vcdpnML5gwwMlLGMzTgcLnoOtbQ",
        "https://fastly.picsum.photos/id/570/1280/720.jpg?hmac=ypTJWG9MdelciTtvJYf30s2t5sjQmXeLpPfyovO7dao",
        "https://fastly.picsum.photos/id/834/1280/720.jpg?hmac=Qk7p_1EXRscPFUuOQU9rODLbpL1QWg0vq8AL5W1vJWI",
    ],
    "newemail@example.com": [
        "https://fastly.picsum.photos/id/71/1280/720.jpg?hmac=BTk-Z1ogc_yRAGH3UoPRuQPkhS5m1AGHHI_asivUpGQ",
    ],
};

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function addEmail() {
    const emailInput = document.querySelector("#email");
    const email = emailInput.value.trim().toLowerCase();
    if (emailPattern.test(email)) { // is it a valid email?
        if (!(email in imageCollections)) { // does it not exist? run this to add email
            imageCollections[email] = [];
            updateSelection();
            emailSelect.value = email;
            emailInput.value = "";
            refreshImageArray();
            showPopUp("Email added", success = true);
        } else {
            showPopUp("Email already exists", success = false);
        }
    } else {
        showPopUp("Invalid email", success = false);
    }
}

function updateSelection() {
    // resets it
    emailSelect.innerHTML = ""
    // to then set it with the updated object
    for (let email in imageCollections) {
        const option = document.createElement("option");
        option.value = email;
        option.textContent = email;
        emailSelect.appendChild(option);
    }
}

const warningBox = document.querySelector(".warning");
const successBox = document.querySelector(".success");
const warningMsg = document.querySelector(".warning div");
const successMsg = document.querySelector(".success div");

let popupTimer = null;

function showPopUp(message, success) {
    const box = success ? successBox : warningBox;
    const msg = success ? successMsg : warningMsg;

    // Hide both boxes and clear any running timers
    [warningBox, successBox].forEach(el => {
        $(el).stop(true, true).hide();
    });
    if (popupTimer) {
        clearTimeout(popupTimer);
        popupTimer = null;
    }
    
    msg.innerHTML = `<p>${message}</p>`;

    // Show the correct box
    $(box)
        .stop(true, true)
        .css('display', 'none')
        .slideDown(350, function() {
            // After sliding down, start the timer
            popupTimer = setTimeout(() => {
                $(box).slideUp(350);
                popupTimer = null;
            }, 5000);
        });
}

$(".is-hidden").hide();

updateSelection();
refreshImageArray();