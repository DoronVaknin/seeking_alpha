/**
 * Created by Doron on 02/06/2017.
 */

var SeekingAlpha = {
    users: [],
    groups: []
};

// Application entry point
$(function () {
    setupEvents();
    getDataAndRender();
});

function getDataAndRender() {
    $.when.apply(null, [
        $.get('http://localhost:8000/users/'),
        $.get('http://localhost:8000/groups/')
    ]).done(function (users, groups) {
        SeekingAlpha.users = users[0];
        SeekingAlpha.groups = groups[0];
        render();
    }).fail(function (xhr) {
        alert('Oops, something went wrong. Please try again later.');
        console.log(xhr);
    });
}

// Setup future DOM events
function setupEvents() {
    $(document).on('click', '#login_btn', loginUser);
    $(document).on('click', '#logout_btn', logoutUser);
    $(document).on('click', '.follow_user_btn', followUser);
    $(document).on('mouseover mouseout', '.follow_user_btn', changeButtonText);
}

function loginUser(event) {
    var user_id = $.trim($('#user_id_input').val()),
        user = getUser(user_id);

    if (user) {
        setCookie('user_id', user.id, 365);
        render();
    } else
        $('#error_label').text('No user was found for this user id');
}

function logoutUser(event) {
    event.preventDefault();

    deleteCookie();
    render();
}

function render() {
    var user_id = getCookie("user_id");
    if (user_id)
        renderLoggedIn();
    else
        renderNotLoggedIn();
}

function renderLoggedIn() {
    var html = '';
    html += '<div>Welcome, ' + getUser().name + '&nbsp;<a href="#" id="logout_btn">Logout</a></div><br/>';
    html += '<div>Choose users to follow:</div>';
    html += '<ul>';
    $.each(SeekingAlpha.users, function (index, user) {
        var isUserFollowed = window.isUserFollowed(user.id);
        html +=
            '<li>' +
            user.name + ', ' + user.group_name + ' (' + user.followers + ') ' +
            '<a href="#" class="follow_user_btn ' + (isUserFollowed ? 'green' : 'orange') + '" data-id="' + user.id + '">' +
            (isUserFollowed ? 'Following' : 'Follow') +
            '</a>' +
            '</li>';
    });
    html += '</ul>';

    $('#app').html(html);
}

function renderNotLoggedIn() {
    var html = '<div>Must be signed in, Please enter your user ID:</div><br/>';
    html += '<div><input id="user_id_input" type="text" value="" /></div><br/>';
    html += '<div><button id="login_btn">Login</button></div>';
    html += '<div id="error_label"></div>';
    $('#app').html(html);
}

function getUser(user_id) {
    user_id = parseInt(user_id || getCookie("user_id"));
    return $.grep(SeekingAlpha.users, function (item) {
        return item.id === user_id;
    })[0];
}

function isUserFollowed(user_id) {
    var user = getUser();
    return user.users_followed.indexOf("http://localhost:8000/users/" + user_id + "/") > -1;
}

function changeButtonText(event) {
    var text = $(event.target).text();
    if (event.type === 'mouseover' && text === 'Following')
        $(event.target).text('Unfollow');
    else if (event.type === 'mouseout' && text === 'Unfollow')
        $(event.target).text('Following');
}

function followUser(event) {
    event.preventDefault();
    var user_id = $(event.target).data('id'),
        user = getUser();

    toggleArrayItem(user.users_followed, "http://localhost:8000/users/" + user_id + "/");

    var data = {
        users_followed: user.users_followed
    };

    $.ajax({
        url: 'http://localhost:8000/users/' + user.id + '/',
        data: JSON.stringify(data),
        type: 'PATCH',
        contentType: 'application/json',
        processData: false,
        dataType: 'json'
    }).then(function (user) {
        // Once update is completed, fetch again all data from server and render to screen
        // Yes I know - it's a bad method to do it but I'll forgive myself this time
        getDataAndRender();
    }).fail(function (xhr) {
        alert('Oops, something went wrong. Please try again later.');
        console.log(xhr);
    });
}

// Utils
function toggleArrayItem(a, v) {
    var i = a.indexOf(v);
    if (i === -1)
        a.push(v);
    else
        a.splice(i, 1);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie() {
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}