class HtmlHelper {
    constructor() {
    }

    updateHealth(enemy) {
        console.log(enemy)
        var healthElementId = "newElement-" + enemy.id + " health";
        var healthElement = document.getElementById(healthElementId);
        healthElement.innerHTML = enemy.health;
        if (enemy.health <= 0) {
            var elementId = "newElement-" + enemy.id;
            var healthElement = document.getElementById(elementId);
            battleInfoDiv.removeChild(healthElement)
        }
    }

    moveFirstElementToEnd(id) {
        const firstElementId = "newElement-" + id;
        const firstElement = document.getElementById(firstElementId);

        if (firstElement) {
            // Remove the first element from battleInfoDiv
            battleInfoDiv.removeChild(firstElement);

            // Append the first element to the end of battleInfoDiv
            battleInfoDiv.appendChild(firstElement);
        }
    }

    createInfoElements(i, picture, color, health) {
        var newElement = document.createElement("div");
        newElement.id = "newElement-" + i;

        var newImgElement = document.createElement("img");
        newImgElement.src = picture;

        newImgElement.style.border = color;
        newImgElement.style.borderStyle = "solid";

        var newHealthElement = document.createElement("health");
        newHealthElement.id = "newElement-" + i + " health";
        newHealthElement.innerHTML = health;


        // Append the new image element to the new element
        newElement.appendChild(newImgElement);
        newElement.appendChild(newHealthElement);

        // Append the new element to the battleInfo div
        battleInfoDiv.appendChild(newElement);
    }
}