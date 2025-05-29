document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const moveCounter = document.getElementById("move-counter");
    const pairCounter = document.getElementById("pair-counter");
    const restartButton = document.getElementById("restart-game");

    let moves = 0;
    let pairsFound = 0;

    const imageCount = 16; // Example number of images
    const images = [];

    // Dynamically generate image file paths
    for (let i = 1; i <= imageCount; i++) {
        images.push(`match-a-roo-${i}.png`);
    }

    let cards = [...images, ...images];
    cards = shuffle(cards); // Shuffle images

    // Create card elements
    cards.forEach((image, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Front image before card is flipped
        const img = document.createElement("img");
        img.src = "Match-a-roo-cardfronts.jpg"; // Default placeholder
        img.setAttribute("data-id", index);
        card.appendChild(img);
        gameBoard.appendChild(card);

        card.addEventListener("click", () => flipCard(card, img, image));
    });

    function flipCard(card, img, image) {
        if (card.classList.contains("flipped") || moves > 2) return;

        img.src = `match-a-roo-${image}`; // Show actual image
        card.classList.add("flipped");
        moves++;

        const flippedCards = document.querySelectorAll(".card.flipped");
        if (flippedCards.length === 2) {
            checkForMatch(flippedCards);
        }
        updateGameStats();
    }

    function checkForMatch(flippedCards) {
        const [firstCard, secondCard] = flippedCards;
        const firstImage = firstCard.querySelector("img").src;
        const secondImage = secondCard.querySelector("img").src;

        if (firstImage === secondImage) {
            pairsFound++;
            pairCounter.innerText = `${pairsFound}/8`;
            if (pairsFound === 8) {
                showWinMessage();
            }
        } else {
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
            }, 1000);
        }
    }

    function updateGameStats() {
        moveCounter.innerText = moves;
    }

    restartButton.addEventListener("click", restartGame);

    function restartGame() {
        moves = 0;
        pairsFound = 0;
        moveCounter.innerText = moves;
        pairCounter.innerText = `${pairsFound}/8`;
        gameBoard.innerHTML = "";
        cards = shuffle([...images, ...images]);
        cards.forEach((image, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            const img = document.createElement("img");
            img.src = "Match-a-roo-cardfronts.jpg"; // Reset to placeholder
            img.setAttribute("data-id", index);
            card.appendChild(img);
            gameBoard.appendChild(card);
            card.addEventListener("click", () => flipCard(card, img, image));
        });
    }

    function showWinMessage() {
        const winMessage = document.createElement("div");
        winMessage.classList.add("win-message");

        const promoCodes = [
            { code: "MATCHROO-10", discount: "10% off" },
            { code: "MATCHROO-15", discount: "15% off" },
            { code: "MATCHROO-20", discount: "20% off" },
            { code: "MATCHROO-SHIP", discount: "Free Shipping" }
        ];

        const randomPromo = promoCodes[Math.floor(Math.random() * promoCodes.length)];

        winMessage.innerHTML = `
            <h2>Congratulations!</h2>
            <p>You matched all the pairs!</p>
            <p>Your promo code: <strong>${randomPromo.code}</strong> for ${randomPromo.discount}!</p>
            <button id="copy-btn" class="copy-btn">Copy Code</button>
            <a id="shop-now-btn" class="shop-now-btn" href="/cart?discount=${randomPromo.code}" target="_blank">Shop Now</a>
            <button id="restart-btn" class="restart-btn">Play Again</button>
        `;
        document.body.appendChild(winMessage);

        document.querySelector("#copy-btn").addEventListener("click", () => {
            const promoText = randomPromo.code;
            navigator.clipboard.writeText(promoText);
            alert("Promo code copied to clipboard!");
        });

        document.querySelector("#restart-btn").addEventListener("click", restartGame);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
