const $body = document.querySelector('body');
const $warning = document.querySelector('.warning-text');
const $nav = document.querySelector('nav');
const $spinner = document.querySelector('.spinner');
let retry = 0;

$body.addEventListener("click",(e)=>{
  if(e.target.matches('.submit')){
    e.preventDefault();
    if(localStorage.getItem('try') !== null && localStorage.getItem('try') >= 9){
      $warning.classList.replace('hidden','visible');
      $warning.textContent = 'Please try again in 5 minutes!';
      const time = new Date().toLocaleTimeString();
      console.log(time);
      
      setTimeout(() => {
        retry = 0;
        localStorage.setItem('try',0);
        console.log(time);
      }, 1000*60*5);
    }
    else{
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      if(!username || !password){
        $warning.classList.replace('hidden','visible');
        $warning.textContent = 'All fields must be complete!';
      }  
      else{
      $spinner.classList.toggle('visible');
        fetch('/login/user',{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({username:username,password:password})
        })
        .then(async(response)=>{
          if(response.status === 503){
            window.location.href = '/home/server_error';
          }
          else{
            if(response.status === 400){
              retry ++;
              const result = await response.json();
              $warning.textContent = result.error;
              $warning.classList.replace('hidden','visible');
              $spinner.classList.toggle('spinner');
              localStorage.setItem('try',retry)
            }
            else{
              localStorage.setItem('try',0);
              window.location.href = localStorage.getItem('path');
            }
          }
        })
        .catch((error)=>{console.error(error);});
      }
    }
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    $nav.classList.toggle('open-nav');
  }
})