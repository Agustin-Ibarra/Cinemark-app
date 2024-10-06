const $body = document.querySelector('body');
const $waring = document.querySelector('.warning-text');
const $nav = document.querySelector('nav');

$body.addEventListener("click",(e)=>{
  if(e.target.matches('.submit')){
    e.preventDefault();
    const fullname = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    console.log(!fullname,email,username,password,confirmPassword)
    if(!fullname || !email || !username || !password || !confirmPassword){
      $waring.classList.replace('hidden','visible');
      $waring.textContent = 'All fields must be complete!'
    }
    else{
      if(password !== confirmPassword){
        $waring.classList.replace('hidden','visible');
        $waring.textContent = 'Passwords do not match!'
      }
      else if(password.length < 8){
        $waring.textContent = 'Password must be no less than 8 characters!'
        $waring.classList.replace('hidden','visible');
      }
      else{
        fetch('/singup',{
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body:JSON.stringify({
            fullname:fullname,
            email:email,
            username:username,
            password:password
          })
        })
        .then(async(response)=>{
          if(response.status == 503){
            window.location.href = '/home/server_error';
          }
          if(response.status === 400){
            const result = await response.json();
            $waring.textContent = result.error;
            $waring.classList.replace('hidden','visible');
          }
          else if(response.status === 200){
            window.location.href = '/login';
          }
        })
        .catch((error)=>{
          console.error(error);
        });
      }
    }
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    $nav.classList.toggle('open-nav');
  }
});