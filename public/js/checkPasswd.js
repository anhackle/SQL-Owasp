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
    }else
        document.querySelector(".check_1").style.color = "black";


    if (passwd.match(/[a-z]/)){
        strength+=1;
        document.querySelector(".check_2").style.color = "red";
    }else
        document.querySelector(".check_2").style.color = "black";


    if (passwd.match(/[A-Z]/)){
        strength+=1;
        document.querySelector(".check_3").style.color = "red";
    }else
        document.querySelector(".check_3").style.color = "black";


    if (passwd.match(/[!@#$%^&*+_()]/)){
        strength+=1;
        document.querySelector(".check_4").style.color = "red";
    }else
        document.querySelector(".check_4").style.color = "black";


    if (passwd.length >= 10){
        strength+=1;
        document.querySelector(".check_5").style.color = "red";
    }else
        document.querySelector(".check_5").style.color = "black";

    if (strength === 5){
        document.getElementsByTagName('button')[0].removeAttribute("disabled");
    }else{
        document.getElementsByTagName('button')[0].setAttribute("disabled","disabled");

    }
    document.getElementsByTagName('meter')[0].setAttribute('value', `${strength/5}`)
};