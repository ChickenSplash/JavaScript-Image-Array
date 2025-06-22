// tracks the currently displayed image
let currentIndex = 0;
const previouslyLoadedImages = [
    "https://fastly.picsum.photos/id/330/1280/720.jpg?hmac=KDp5Bdt2uCJB714pteQPfv723GLJxsTH--dfFwQxxxo",
];
const imgElement = document.getElementById('randomImage');
const loader = document.querySelector(".loader");

function initiateLoading() {
    if (!loader.classList.contains("active")) {
        loader.classList.add("active")
        imgElement.classList.add("loading-blur")
        fetchImage();
    } else {
        showPopUp("Previous request still loading");
    }
}

function fetchImage() {
    const width = document.querySelector("#width").value;
    const height = document.querySelector("#height").value;
 
    fetch(`https://picsum.photos/${width}/${height}`)
        .then(response => {
            if (!response.ok || !width || !height) { // is the respons not ok or no width value or no height value?
                throw new Error('HTTP error: ' + response.status);
            }
            previouslyLoadedImages.push(response.url);
            currentIndex = previouslyLoadedImages.length - 1;
            updateCounter();
            return response.blob();
        })
        .then(data => { // loads the url to the loaded image
            const imageURL = URL.createObjectURL(data);
            imgElement.src = imageURL;
        })
        .catch(error => {
            console.warn('Failed to fetch image:', error);
            showPopUp("Failed to load image");
        })
        .finally(() => {
            loader.classList.remove("active");
            imgElement.classList.remove("loading-blur");
        });
}

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const counter = document.querySelector(".counter")


function showImage() {
    imgElement.src = previouslyLoadedImages[currentIndex];
}

function updateCounter() {
    counter.textContent = currentIndex;
}

function prevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        showImage();
        updateCounter();
    }
}

function nextImage() {
    if (currentIndex < previouslyLoadedImages.length - 1) {
        currentIndex++;
        showImage();
        updateCounter();
    }
}

const emailSelect = document.getElementById("emailSelect");
const imageArray = document.querySelector(".image-array");
const imageArrayHeader = document.querySelector(".image-array-header");

// refresh the images array display

function refreshImageArray() {
    imageArray.innerHTML = "";
    
    if (emailSelect.value) { // does an email exist?
        imageArrayHeader.innerHTML = "";
        const header = document.createElement("h2");
        header.innerHTML = `Collection for ${emailSelect.value}`;
        imageArrayHeader.appendChild(header);

        for (let pictureUrl of imageCollections[emailSelect.value]) { // for each url inside the email collection, add image as well as the delete button that then deletes itself from the collection
            const imgContainer = document.createElement("a"); // add the image container
            imgContainer.classList.add("img-container");
            imgContainer.href = pictureUrl;
            imgContainer.setAttribute("target", "_blank");
            
            const img = document.createElement("img"); // add the image
            img.src = pictureUrl;
    
            const deleteBtn = document.createElement("button"); // add the button and its functionality
            deleteBtn.textContent = "X";
            deleteBtn.addEventListener("click", (event) => {
                event.preventDefault();
                const imgSrc = event.target.parentElement.querySelector("img").src;
                const imgIndex = imageCollections[emailSelect.value].indexOf(imgSrc);
                if (imgIndex !== -1) { // did the url exist?
                    imageCollections[emailSelect.value].splice(imgIndex, 1);
                    refreshImageArray();
                    showPopUp("Image Deleted", "#007000");
                }
            });
    
            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteBtn);
            
            imageArray.appendChild(imgContainer);
        }
        
        if (imageCollections[emailSelect.value].length === 0) { // is the currently selected array empty?
            // if so, add the button allowing the user to delete the email/collection
            const deleteMessage = document.createElement('div');
            deleteMessage.className = 'delete-message';
            
            const heading1 = document.createElement('h2');
            heading1.textContent = 'Looks empty in here...';

            const deleteEmailBtn = document.createElement('button');
            deleteEmailBtn.textContent = 'Delete Collection';
            deleteEmailBtn.addEventListener("click", () => {
                delete imageCollections[emailSelect.value];
                updateSelection();
                refreshImageArray();
                showPopUp("Collection Deleted", "#007000");
            });

            const heading2 = document.createElement('h2');
            heading2.textContent = '?';

            deleteMessage.appendChild(heading1);
            deleteMessage.appendChild(deleteEmailBtn);
            deleteMessage.appendChild(heading2);

            imageArray.appendChild(deleteMessage);
        }
    } 
}

// calls the freshly declared function upon changing the email selection or adding an item to the array

emailSelect.addEventListener("change", refreshImageArray);

function addToCollection() {
    if (emailSelect.value) { // does the image url or email exist?
        if (!imageCollections[emailSelect.value].includes(previouslyLoadedImages[currentIndex])) { // if so, does the currently selected email not have this url in its array?
            imageCollections[emailSelect.value].push(previouslyLoadedImages[currentIndex]);
            refreshImageArray();
            showPopUp("Added to current collection", "#007000");
        } else {
            showPopUp("Image already in current collection");
        }
    } else {
        showPopUp("Add an email first");
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

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function addEmail() {
    const emailInput = document.querySelector("#email");
    const email = emailInput.value.trim().toLowerCase();
    if (emailRegex.test(email)) { // is it a valid email?
        if (!(email in imageCollections)) { // does it not exist? run this to add email
            imageCollections[email] = [];
            updateSelection();
            emailSelect.value = email;
            emailInput.value = "";
            refreshImageArray();
            showPopUp("Email added", "#007000");
        } else {
            showPopUp("Email already exists");
        }
    } else {
        showPopUp("Invalid email");
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

const warningBox = document.querySelector(".popup");
let popupTimer = null;

function showPopUp(message, color = "#700000") {

    // Hide both boxes and clear any running timers
    $(warningBox).stop(true, true).hide();

    if (popupTimer) {
        clearTimeout(popupTimer);
        popupTimer = null;
    }
    
    warningBox.innerHTML = `<span>${message}</span>`;
    warningBox.style.backgroundColor = color;

    // Show the correct box
    $(warningBox)
        .stop(true, true)
        .css("display", "none")
        .slideDown(350, function() {
            // After sliding down, start the timer
            popupTimer = setTimeout(() => {
                $(warningBox).slideUp(350);
                popupTimer = null;
            }, 5000);
        });
}

$(".is-hidden").hide();

updateSelection();
refreshImageArray();
showImage();