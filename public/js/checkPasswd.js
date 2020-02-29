var userPassword  = document.getElementById('password-check');
userPassword.addEventListener("keyup", function(event) {
    checkPassword(userPassword.value);
});

function checkPassword(passwd){
    console.log(passwd);
    var strength = 0;
    if (passwd.match(/[0-9]/)){
        strength+=1;
        document.querySelector(".check_1").style.color = "red";
    }

    if (passwd.match(/[a-z]/)){
        strength+=1;
        document.querySelector(".check_2").style.color = "red";
    }

    if (passwd.match(/[A-Z]/)){
        strength+=1;
        document.querySelector(".check_3").style.color = "red";
    }

    if (passwd.match(/[!@#$%^&*+_()]/)){
        strength+=1;
        document.querySelector(".check_4").style.color = "red";
    }

    if (passwd.length >= 8){
        strength+=1;
        document.querySelector(".check_5").style.color = "red";
    }
    if (strength === 5){
        document.getElementsByTagName('button')[0].removeAttribute("disabled");
    }
};