const $body = document.querySelector('body');
const $warning = document.querySelector('.warning-text');
const $nav = document.querySelector('nav');
const $spinner = document.querySelector('.spinner');

const login = function(){
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if(!username || !password){
    $warning.classList.replace('hidden','visible');
    $warning.textContent = 'All fields must be complete!';
  }  
  else{
    $spinner.classList.add('visible');
    fetch('/login/user',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:username,password:password})
    })
    .then(async(response)=>{
      if(response.status === 503){
        window.location.href = '/home/error';
      }
      else if(response.status === 429){
        $warning.textContent = 'Try again in 10 minutes!';
        $warning.classList.replace('hidden','visible');
        $spinner.classList.remove('visible');
      }
      else if(response.status === 401 || response.status === 400){
        const errorText = await response.json();
        setTimeout(() => {
          $warning.textContent = errorText.error;
          $warning.classList.replace('hidden','visible');
          $spinner.classList.remove('visible');
        }, 500);
      }
      else{
        window.location.href = localStorage.getItem('path');
      }
    })
    .catch((error)=>{console.error(error);});
  }
}

$body.addEventListener("click",(e)=>{
  if(e.target.matches('.submit')){
    e.preventDefault();
    login();
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    $nav.classList.toggle('open-nav');
  }
})