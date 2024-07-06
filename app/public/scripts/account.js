const $body = document.querySelector('body');
const $loader = document.querySelector('.loader-section');
const $nav = document.querySelector('nav');

$body.addEventListener("click",(e)=>{
  // console.log(e.target);
  if(e.target.matches('.logout')){
    document.cookie = 'cmjwt=; Expires=Thu, 01 Jan 1970 00:00:01';
    window.location.reload();
  }
  else if(e.target.matches('.username')){
    const $username = document.getElementById('new-username');
    const newUsername = document.getElementById('new-username').value;
    const $error = document.getElementById('username-error');
    if(!newUsername){
      $error.textContent = 'Empty data cannot be sent!';
      $error.classList.add('visible');
      $username.classList.add('error');
    }
    else{
      fetch('/profile/update_username',{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:newUsername})
      })
      .then(async(response)=>{
        const data = await response.json();
        if(response.status === 200){
          window.location.reload();
        }
        else{
          $error.textContent = data.error;
          $error.classList.add('visible');
          $username.classList.add('error');
        }
      })
      .catch((error)=>{console.log(error);});
    }
  }
  else if(e.target.matches('.fullname')){
    const fullname = document.getElementById('new-fullname').value;
    const $fullName = document.getElementById('new-fullname');
    const $error = document.getElementById('name-error');
    if(!fullname){
      $error.textContent = 'Empty data cannot be sent!';
      $error.classList.add('visible');
      $fullName.classList.add('error');
    }
    else{
      fetch('/profile/update_fullname',{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({fullname:fullname})
      })
      .then(async(response)=>{
        if(response.status === 200){
          window.location.reload();
        }
      })
      .catch((error)=>{console.log(error);});
    }
  }
  else if(e.target.matches('.email')){
    const newEmail = document.getElementById('new-email').value;
    const $email = document.getElementById('new-email');
    const $error = document.getElementById('email-error');
    if(!newEmail){
      $error.classList.add('visible');
      $error.textContent = 'Empty data cannot be sent!';
      $email.classList.add('error');
    }
    else{
      fetch('/profile/update_email',{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:newEmail})
      })
      .then(async(response)=>{
        if(response.status === 200){
          window.location.reload();
        }
        else{
          const data = await response.json();
          $error.classList.add('visible');
          $email = document.getElementById('new-email');
          $email.classList.add('error');
          $error.textContent = data.error;
        }
      })
      .catch((error)=>{console.log(error);});
    }
  }
  else if(e.target.matches('.password')){
    const newPassword = document.getElementById('new-password').value;
    const oldPassword = document.getElementById('old-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const $error = document.getElementById('password-error');
    if(!oldPassword || !newPassword || !confirmPassword){
      $error.textContent = 'All fields must be completed!'
      $error.classList.add('visible');
    }
    else{
      if(newPassword !== confirmPassword){
        $error.textContent = 'las contraseñas no coinciden!'
        $error.classList.add('visible');
      }
      else{
        fetch('/profile/update_password',{
          method:"PUT",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({newPassword:newPassword,oldPassword:oldPassword})
        })
        .then(async(response)=>{
          if(response.status === 200){
            window.location.reload();
          }
          else{
            const data = await response.json();
            $error.textContent = data.error;
            $error.classList.add('visible');
          }
        })
        .catch((error)=>{console.log(error);});
      }
    }
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    $nav.classList.toggle('open-nav');
  }
});


fetch('/profile')
.then(async(data)=>{
  const profile = await data.json();
  const $fullName = document.getElementById('name');
  const $email = document.getElementById('email');
  const $username = document.getElementById('username');
  $fullName.textContent += profile.user[0].fullname;
  $email.textContent += profile.user[0].email;
  $username.textContent += profile.user[0].username
})
.catch((error)=>{console.log(error);});

fetch('/account/user_purchase')
.then(async(response)=>{
  const data = await response.json();
  const $title = document.getElementById('title');
  const $list = document.querySelector('.purchase-list');
  $title.textContent += data.length;
  data.forEach(element => {
    const dateFormat = new Date(element.date_purchase);
    const $item = document.createElement("li");
    const $divPoster = document.createElement("div");
    const $poster = document.createElement('img');
    const $divText = document.createElement('div');
    const $datePurchase = document.createElement('p');
    const $movieinfo = document.createElement('p');
    const $total = document.createElement('p');
    $item.setAttribute('class','purchase-item');
    $divPoster.setAttribute('class','poster-div');
    $poster.setAttribute('src',element.poster);
    $divText.setAttribute('class','text-div');
    $datePurchase.setAttribute('class','purchase-text');
    $movieinfo.setAttribute('class','purchase-text');
    $total.setAttribute('class','purchase-text');
    $datePurchase.textContent = `Date purchase ${dateFormat.toLocaleString()}`;
    $movieinfo.textContent = `${element.title}, Format ${element.type_format} tickets x ${element.amount_ticket}`;
    $total.textContent = `Total $${element.total}`;
    $divPoster.appendChild($poster);
    $divText.appendChild($datePurchase);
    $divText.appendChild($movieinfo);
    $divText.appendChild($total);
    $item.appendChild($divPoster);
    $item.appendChild($divText);
    $list.appendChild($item);
  });
})
.catch((error)=>{console.log(error);});

window.addEventListener("load",()=>{
  const $loader = document.querySelector('.loader-section');
  $body.removeChild($loader);
})
