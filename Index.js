function myMenuFuntion(){
    var i = document.getElementById ("navMenu");
    if (i.className === "nav-menu"){
        i.className += "responsive";
    } else {
        i.className = "nav-menu" 
    }
}

var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

function login(){
    x.style.left ="5px";
    y.style.right ="-510px";
    a.className += "white-btn";
    b.className ="btn";
    x.style.opacity = 1 ;
    y.style.opacity = 0 ;
}

function register(){
    x.style.left ="-500px";
    y.style.right= "6px";
    a.className = "btn";
    b.className += "white-btn";
    x.style.opacity = 0;
    y.style.opacity = 1;
}