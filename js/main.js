$(document).on("click", "#registerBtn", function () {
    var first_name = $("#first_name").val();
    var last_name = $("#last_name").val();

    $(this).prop("disabled", true);
    var is_valid = 1;
    if (first_name == "" && last_name == "") {
        is_valid = 0;
    }else{
        if (first_name==""){
            is_valid = 0;
        }
        if (last_name == "") {
            is_valid = 0;
        }
    }

    if (is_valid == 0){
        alert("Please enter first name & last name."); 
        $(this).prop("disabled", false);
    }else{
        firebase.firestore().collection("users")
            .add({
                Firstname: first_name,
                Lastname: last_name,
            })
            .then((ref) => {
                user_id = ref.id;
                user_name = first_name + " " + last_name
                $("#chat-popup").hide();
                $(".chat-section").removeClass('d-none');
                getMessages();
            });

    }
});

$(document).on("click", "#sendMessageBtn", function () {
    sendMessage();
});

function getMessages(){
    firebase
        .firestore()
        .collection("chat")
        .orderBy('time', 'asc')
        .onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            

            var html = '';
            
            for (var i = 0; i < data.length; i++) {

                if (data[i].id == user_id) {

                    html += '<div class="media ml-auto mb-3">\
                                <div class="media-body mr-3">\
                                    <div class="bg-primary rounded py-2 px-3 mb-2">\
                                        <p class="text-small m-0 text-white">'+ data[i].message + '</p>\
                                        <p class="small text-white mb-0">'+ timeAgo(data[i].time) + '</p>\
                                    </div>\
                                </div>\
                                <span class="material-icons" style="font-size: 50px;">account_circle</span>\
                            </div>';
                } else {
                    html += '<div class="media mb-3">\
                                <span class="material-icons" style="font-size: 50px;">account_circle</span>\
                                <div class="media-body ml-3">\
                                    <div class="bg-light rounded py-2 px-3 mb-2">\
                                        <span class="text-muted text-bold">'+ data[i].userName + '</span>\
                                        <p class="text-small text-muted">'+ data[i].message + '</p>\
                                        <p class="small text-muted mb-0">'+ timeAgo(data[i].time) + '</p>\
                                    </div>\
                                </div>\
                            </div>';
                }
                
            }
            $("#chat-box").html(html);
            $("#chat-box").animate({ scrollTop: $('#chat-box')[0].scrollHeight }, 1000);
        });
}
function sendMessage() {
    
    var message = $("#message").val();
    
    if (message != "") {
        firebase.firestore().collection("chat")
            .add({
                message: message,
                userName: user_name,
                id: user_id,
                time: Date.now()
            })
            .then((ref) => {
                var chat_id = ref.id;
    
                // var html = '<div class="message-box textright">\
                //                 '+ message + '</div > ';
                                
                // $("#chat-box").append(html);
            });
    
    
        $("#message").val("");
    }
}

$(document).on("keydown", '#message', function (event) {
    if (event.which == 13){
        sendMessage();
    }
});


function timeAgo(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return "Just Now";
}
