let currentImageUrl = "";

function fetchImage() {
    const width = document.querySelector("#width").value;
    const height = document.querySelector("#height").value;

    fetch(`https://picsum.photos/${width}/${height}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error: ' + response.status);
            }
            currentImageUrl = response.url; // useful for if user wants to add current displayed image to collection, we have its value here for each new image
            return response.blob();
        })
        .then(data => {
            const imageURL = URL.createObjectURL(data);
            const imgElement = document.getElementById('randomImage');
            imgElement.src = imageURL;
        })
        .catch(error => {
            console.error('Failed to fetch image:', error);
        });
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
    if (!imageCollections[emailSelect.value].includes(currentImageUrl)) {
        imageCollections[emailSelect.value].push(currentImageUrl)
        refreshImageArray();
    } else {
        console.log("Current image is already in collection") // will update to give user feedback
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
    const email = emailInput.value.trim();
    if (emailPattern.test(email)) {
        imageCollections[email] = [];
        updateSelection();
        emailSelect.value = email;
        emailInput.value = "";
        refreshImageArray();
    } else {
        console.log("Invalid Email") // will update to give user feedback
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

updateSelection()
refreshImageArray();