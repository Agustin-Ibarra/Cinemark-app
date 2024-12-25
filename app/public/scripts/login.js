const $body = document.querySelector('body');
const $warning = document.querySelector('.warning-text');
const $nav = document.querySelector('nav');
const $spinner = document.querySelector('.spinner');

const errorMEssage = function(message){
  $warning.textContent = message;
  $warning.classList.replace('hidden','visible');
  $spinner.classList.remove('visible');
}

const login = function(){
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if(!username || !password){
    $warning.classList.replace('hidden','visible');
    $warning.textContent = 'All fields must be complete!';
  }  
  else{
    $spinner.classList.add('visible');
    fetch('/login/api',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:username,password:password})
    })
    .then(async(response)=>{
      if(response.status === 503){
        window.location.href = '/home/error';
      }
      else if(response.status === 429){
        errorMEssage('Try again in 10 minutes!')
      }
      else if(response.status === 401){
        const errorText = await response.json();
        setTimeout(() => {
          errorMEssage(errorText.error);
        }, 500);
      }
      else if(response.status === 400){
        errorMEssage('the username or the passwor are incorrect!');
      }
      else if(response.status === 200){
        window.location.href = localStorage.getItem('path');
      }
    })
    .catch((error)=>{console.error(error);});
  }
}

$body.addEventListener("click",(e)=>{
  // e.preventDefault();
  if(e.target.matches('.submit')){
    login();
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    $nav.classList.toggle('open-nav');
  }
})

$body.addEventListener("submit",(e)=>{
  e.preventDefault();
})