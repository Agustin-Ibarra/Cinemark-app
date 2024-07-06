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
      .then(async(data)=>{
        const result = await data.json();
        if(data.status === 400){
          $warning.textContent = result.error;
          $warning.classList.replace('hidden','visible');
          $spinner.classList.toggle('spinner');
        }
        else{
          window.location.href = localStorage.getItem('path') || result.redirect;
        }
      })
      .catch((error)=>{console.log(error);});
    }
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    $nav.classList.toggle('open-nav');
  }
})