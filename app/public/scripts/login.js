const $body = document.querySelector('body');
const $warning = document.querySelector('.warning-text');
const $nav = document.querySelector('nav');
const $spinner = document.querySelector('.spinner');

$body.addEventListener("click",(e)=>{
  // console.log(e.target);
  if(e.target.matches('.submit')){
    e.preventDefault();
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
            const result = await response.json();
            $warning.textContent = result.error;
            $warning.classList.replace('hidden','visible');
            $spinner.classList.toggle('spinner');
          }
          else{
            window.location.href = localStorage.getItem('path');
          }
        }
      })
      .catch((error)=>{console.error(error);});
    }
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    $nav.classList.toggle('open-nav');
  }
})