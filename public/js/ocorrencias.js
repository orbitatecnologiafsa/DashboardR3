const itemsPerPage = 3;
let feedbackItems = Array.from(document.querySelectorAll('.feedback'));
let filteredItems = feedbackItems;
let currentPage = 1;

const prevButton = document.querySelector('.prev-page');
const nextButton = document.querySelector('.next-page');

document.querySelectorAll('.feedback-item').forEach(item => {
    const statusText = item.querySelector('.feedback-status p span').textContent.trim();
    if (statusText === 'Resolvido') {
        item.classList.add('resolved');
    }
});

function displayPage(pageNumber, items) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    feedbackItems.forEach((item) => item.style.display = 'none'); // Hide all items first

    items.slice(startIndex, endIndex).forEach(item => {
        item.style.display = 'flex';
    });

    document.querySelector('.page-number').textContent = pageNumber;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages(items);
}

function totalPages(items) {
    return Math.ceil(items.length / itemsPerPage);
}

function filterItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const showResolved = document.getElementById('check-resolved').checked;
    const showUnresolved = document.getElementById('check-unresolved').checked;

    filteredItems = feedbackItems.filter(item => {
        const message = item.querySelector('.message').textContent.toLowerCase();
        const statusText = item.querySelector('.feedback-status p').textContent.toLowerCase();

        const isResolved = statusText.includes('resolvido');
        const isUnresolved = statusText.includes('pendente');

        const matchesSearch = message.includes(searchTerm);
        const matchesStatus = (showResolved && isResolved) || (showUnresolved && isUnresolved) || (!showResolved && !showUnresolved);

        return matchesSearch && matchesStatus;
    });

    currentPage = 1; // Reset to the first page when filtering
    updatePagination();
}

function updatePagination() {
    if (filteredItems.length === 0) {
        feedbackItems.forEach(item => item.style.display = 'none'); // Hide all items if no matches
    } else {
        displayPage(currentPage, filteredItems);
    }
}

// Event listeners for filters
document.getElementById('searchInput').addEventListener('input', filterItems);
document.getElementById('check-resolved').addEventListener('change', filterItems);
document.getElementById('check-unresolved').addEventListener('change', filterItems);

// Initial display
updatePagination();

// Event listeners for pagination buttons
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < totalPages(filteredItems)) {
        currentPage++;
        updatePagination();
    }
});

// Close popup when clicking the close icon
document.getElementById("close-icon").addEventListener("click", () => {
    const popups = document.getElementsByClassName("popup");
    for (let i = 0; i < popups.length; i++) {
        popups[i].style.display = "none";
    }
});

// Close popup when clicking the cancel button
document.getElementById("close-button").addEventListener("click", () => {
    const popups = document.getElementsByClassName("popup");
    for (let i = 0; i < popups.length; i++) {
        popups[i].style.display = "none";
    }
});

// Show popup when clicking on reply (make sure this is implemented correctly elsewhere)
document.querySelectorAll(".reply-button").forEach(button => {
    button.addEventListener("click", function () {
        const popups = document.getElementsByClassName("popup");

        // Exibe o popup
        for (let i = 0; i < popups.length; i++) {
            popups[i].style.display = "flex";
        }

        // Obtém as informações do feedback item mais próximo
        const feedbackItem = this.closest('.feedback-item');
        const userName = feedbackItem.querySelector('.user-name').textContent;
        const message = feedbackItem.querySelector('.message').textContent;
        const date = feedbackItem.querySelector('.date').textContent;
        const status = feedbackItem.querySelector('.feedback-status p span').textContent;

        // Atualiza o conteúdo do popup
        const popupInfo = document.querySelector('.popup-info');
        popupInfo.innerHTML = `
            <div class="user-info">
                <span class="avatar"></span>
                <span class="user-name">${userName}</span>
            </div>
            <p class="message">${message}</p>
            <p class="date">Data de abertura: ${date}</p>
            <p>Status: <span style="font-weight: bold;">${status}</span></p>
        `;
    });
});

// Close the popup when clicking outside of it
window.addEventListener("click", (event) => {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        popup.style.display = "none";
    }
});

document.getElementById("send-button").addEventListener("click", () => {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();
    if (messageText === "") return;

    const chatBox = document.querySelector(".chat-box");

    const newMessage = document.createElement("div");
    newMessage.className = "message sent";
    newMessage.innerHTML = `<div class="message-content">${messageText}</div>`;

    chatBox.appendChild(newMessage);
    messageInput.value = "";

    // Scroll to the bottom of the chat
    chatBox.scrollTop = chatBox.scrollHeight;
});
