function changerImage() {
    var image = document.getElementById("myImage");
    if (image.src.includes("cat.jpg")) {
        image.src = "dog.jpg";
    } 
    else {
        image.src = "cat.jpg";
    }
    
}

function changeImage(imgName) {
    document.getElementById("PetChart").src = imgName;
}