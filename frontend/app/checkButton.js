(function() {

    var username;
    var confirm_username;
    var checker;

    document.addEventListener('DOMContentLoaded', init, false);

    function init() {
        username = document.querySelector('#username');
        confirm_username = document.querySelector('#confirm_username');
        checker = document.querySelector('#checker');
        confirm_username.addEventListener('click', box_checked, false);
    }

    function checkTextField(){
        const username_value = username.value;
        if ( username_value !== null && username_value.trim() !== ''){
            return false;
        }
        else if (username_value === null || username_value.trim() === ''){
            return true;
        }
        else{
            return true;
        }
    }

    function box_checked(){
        if(confirm_username.checked){
            if(!checkTextField()){
                username.disabled = true;
                confirm_username.disabled = true;
                document.getElementById("roll_die").disabled = false;
                checker.innerHTML = 'Username is confirmed';
            }
            else {
                checker.innerHTML = 'Username hasn\'t been entered';
            }
        }
    }

})();

