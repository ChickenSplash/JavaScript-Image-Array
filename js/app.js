
function fetchImage() {
    const width = document.querySelector("#width").value;
    const height = document.querySelector("#height").value;

    fetch(`https://picsum.photos/${width}/${height}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error: ' + response.status);
            }
            addToArray(response.url)
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

function addToArray(response) {
}

function addEmail() {
    const email = document.querySelector("#email").value
    if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        emails[email] = [];
    } else {
        console.log("Invalid Email")
    }
}

const emails = {
    "email@example.com": [],
};
