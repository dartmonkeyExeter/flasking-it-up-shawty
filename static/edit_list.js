let clickSound;

document.addEventListener('DOMContentLoaded', function () {
    clickSound = document.getElementById('click-sound');
    clickSound.volume = 0.2;
});

function activateButton(button) {
    // Remove the 'active' class from any currently active button
    var current = document.querySelector('.active');
    if (current) {
        clickSound.currentTime = 0;
        clickSound.play();
        current.classList.remove('active');
    }

    // Add the 'active' class to the clicked button
    button.classList.add('active');
    fixBottomButtons();
}

function joinSelected() {
    var selected = document.querySelector('.active');
    if (selected) {
        var serverName = selected.querySelector('#player-count').textContent;
        var serverName = serverName.split('/')[0];
        window.location.href = '/candidates/' + serverName;
    }
}

function editSelected() {
    var selected = document.querySelector('.active');
    if (selected) {
        var serverName = selected.querySelector('#player-count').textContent;
        var serverName = serverName.split('/')[0];
        window.location.href = '/edit/' + serverName;
    }
}

function deleteSelected() {
    var selected = document.querySelector('.active');
    if (selected) {
        var serverName = selected.querySelector('#player-count').textContent;
        var serverName = serverName.split('/')[0];
        window.location.href = '/delete/' + serverName;
    }
}

function addServer() {
    window.location.href = '/add_server';
}

function refresh() {
    window.location.href = '/edit_list';
}

function cancel() {
    window.location.href = '/';
}

function makeBottomButtonsGrey() {
    // Check if there is no element with the class 'active'
    if (!document.querySelector('.active')) {
        var disabled_button_image = 'url("/static/site images/MCbuttonBGdisabled.png")';
        document.getElementById('join-button').style.backgroundImage = disabled_button_image;
        document.getElementById('edit-button').style.backgroundImage = disabled_button_image;
        document.getElementById('delete-button').style.backgroundImage = disabled_button_image;

        document.getElementById('join-button').style.cursor = 'default';
        document.getElementById('edit-button').style.cursor = 'default';
        document.getElementById('delete-button').style.cursor = 'default';

        document.getElementById('join-button').onclick = function() {};
        document.getElementById('edit-button').onclick = function() {};
        document.getElementById('delete-button').onclick = function() {};

        document.getElementById('join-button').style.color = "#A0A0A0";
        document.getElementById('edit-button').style.color = "#A0A0A0";
        document.getElementById('delete-button').style.color = "#A0A0A0";
    }
}

function fixBottomButtons() {
    if (document.querySelector('.active')) {
        var enabled_button_image = 'url("/static/site images/MCbuttonBG.png")';
        document.getElementById('join-button').style.backgroundImage = enabled_button_image;
        document.getElementById('edit-button').style.backgroundImage = enabled_button_image;
        document.getElementById('delete-button').style.backgroundImage = enabled_button_image;

        document.getElementById('join-button').style.cursor = 'pointer';
        document.getElementById('edit-button').style.cursor = 'pointer';
        document.getElementById('delete-button').style.cursor = 'pointer';

        document.getElementById('join-button').onclick = joinSelected;
        document.getElementById('edit-button').onclick = editSelected;
        document.getElementById('delete-button').onclick = deleteSelected;

        document.getElementById('join-button').style.color = "#FFFFFF";
        document.getElementById('edit-button').style.color = "#FFFFFF";
        document.getElementById('delete-button').style.color = "#FFFFFF";
    }
}

// Assign the function reference correctly
window.onload = makeBottomButtonsGrey;