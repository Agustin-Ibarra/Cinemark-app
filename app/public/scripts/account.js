const $body = document.querySelector('body');
const $loader = document.querySelector('.loader-section');
const $nav = document.querySelector('nav');

const updateFullname = function(){
  const $input = document.getElementById('new-fullname');
  const $error = document.getElementById('name-error');
  if(!$input.value){
    $error.textContent = 'Empty data cannot be sent!';
    $error.classList.add('visible');
    $input.classList.add('error');
  }
  else{
    fetch('/home/account/profile/fullname',{
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({newFullname:$input.value})
    })
    .then(async(response)=>{
      if(response.status === 201 || response.status === 429){
        window.location.reload();
      }
    })
    .catch((error)=>{console.log(error);});
  }
}

const updateEmail = function(){
  const $input = document.getElementById('new-email');
  const $error = document.getElementById('email-error');
  if(!$input.value){
    $error.classList.add('visible');
    $error.textContent = 'Empty data cannot be sent!';
    $email.classList.add('error');
  }
  else{
    fetch('/home/account/profile/email',{
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({newEmail:$input.value})
    })
    .then(async(response)=>{
      if(response.status === 201 || response.status === 429){
        window.location.reload();
      }
      else{
        const data = await response.json();
        $error.classList.add('visible');
        $input.classList.add('error');
        $error.textContent = data.error;
      }
    })
    .catch((error)=>{console.log(error);});
  }
}

const updateUsername = function(){
  const $input = document.getElementById('new-username');
  const $error = document.getElementById('username-error');
  if(!$input.value){
    $error.textContent = 'Empty data cannot be sent!';
    $error.classList.add('visible');
    $input.classList.add('error');
  }
  else{
    fetch('/home/account/profile/username',{
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({newUsername:$input.value})
    })
    .then(async(response)=>{
      const data = await response.json();
      if(response.status === 201 || response.status === 429){
        window.location.reload();
      }
      else if(response.status === 503){
        window.location.href = '/home/server_error';
      }
      else{
        $error.textContent = data.error;
        $error.classList.add('visible');
        $input.classList.add('error');
      }
    })
    .catch((error)=>{console.log(error);});
  }
}

const updatePassword = function(){
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
      fetch('/home/account/profile/password',{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({newPassword:newPassword,oldPassword:oldPassword})
      })
      .then(async(response)=>{
        if(response.status === 201 || response.status === 429){
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

fetch('/home/account/profile')
.then(async(response)=>{
  if(response.status === 200){
    const profile = await response.json();
    const $fullName = document.getElementById('name');
    const $email = document.getElementById('email');
    const $username = document.getElementById('username');
    $fullName.textContent += profile[0].fullname;
    $email.textContent += profile[0].email;
    $username.textContent += profile[0].username
  }
  else if(response.status === 429){
    window.location.reload();
  }
})
.catch((error)=>{console.log(error);});

fetch('/home/account/purchases')
.then(async(response)=>{
  if(response.status === 200){
    const purchase = await response.json();
    const $title = document.getElementById('title');
    const $list = document.querySelector('.purchase-list');
    $title.textContent += purchase.length;
    purchase.forEach(data => {
      const dateFormat = new Date(data.purchasesOrders.date_purchase);
      const $item = document.createElement("li");
      const $divPoster = document.createElement("div");
      const $poster = document.createElement('img');
      const $divText = document.createElement('div');
      const $datePurchase = document.createElement('p');
      const $movieinfo = document.createElement('p');
      const $total = document.createElement('p');
      const $code = document.createElement('p');
      $item.setAttribute('class','purchase-item');
      $divPoster.setAttribute('class','poster-div');
      $poster.setAttribute('src',`../../${data.tickets.movies.poster}`);
      $divText.setAttribute('class','text-div');
      $datePurchase.setAttribute('class','purchase-text');
      $movieinfo.setAttribute('class','purchase-text');
      $total.setAttribute('class','purchase-text');
      $total.classList.add('total');
      $code.setAttribute('class','purchase-text');
      $datePurchase.textContent = `Date purchase ${dateFormat.toLocaleString()}`;
      $movieinfo.textContent = `${data.tickets.movies.title}, Format ${data.tickets.formats.type_format} tickets x ${data.amount_ticket}`;
      $total.textContent = `Total $${data.purchasesOrders.total}`;
      $code.textContent = `pusrchase code: ${data.id_purchase_order}`
      $divPoster.appendChild($poster);
      $divText.appendChild($datePurchase);
      $divText.appendChild($code);
      $divText.appendChild($movieinfo);
      $divText.appendChild($total);
      $item.appendChild($divPoster);
      $item.appendChild($divText);
      $list.appendChild($item);
    });
  }
  else if(response.status === 429){
    window.location.reload();
  }
  else{
    const $title = document.getElementById('title');
    $title.textContent += '0';
  }
})
.catch((error)=>{console.log(error);});

$body.addEventListener("click",(e)=>{
  if(e.target.matches('.logout')){
    document.cookie = 'cmjwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  }
  else if(e.target.matches('.fullname')){
    updateFullname()
  }
  else if(e.target.matches('.email')){
    updateEmail();
  }
  else if(e.target.matches('.username')){
    updateUsername();
  }
  else if(e.target.matches('.password')){
    updatePassword();
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    $nav.classList.toggle('open-nav');
  }
});

window.addEventListener("load",()=>{
  const $loader = document.querySelector('.loader-section');
  $body.removeChild($loader);
})
