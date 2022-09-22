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
                $("#userName").html('<span class="material-icons mr-3">account_circle</span>'+user_name);
                getMessages();
                $("#chat-popup").hide();
                $(".chat-section").removeClass('d-none');
            });

    }
});
$(document).on("click", "#sendMessageBtn", function () {
    sendMessage();
});
$(document).on("keydown", '#message', function (event) {
    if (event.which == 13) {
        sendMessage();
    }
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
                return ref.id;
            });
    
        $("#message").val("");
    }
}

function timeAgo(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    date = new Date(date);
    interval = seconds / 60;

    if (interval > 1) {
        return formatDate(date);
    }
    return "Just Now";
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + strTime;
}

