const $items = document.querySelector('.list_ticket');
const $body = document.querySelector('body');
const $title = document.querySelector('title');
const $choice = document.querySelector('.info-choice');
const $amount = document.getElementById('amount');
const $loader = document.querySelector('.loader-section');
const $nav = document.querySelector('nav');
const $spinner = document.querySelector('.spinner');
const $total = document.getElementById('total');
const $totalTickets = document.getElementById('total-tickets');
const $emptyTickets = document.querySelector('.error-pay-art');
let ticketInfo;
let amountTickets;
let price = 0;
let total = 0;

if(localStorage.getItem('redirect') !== null){
  fetch('/home/movie/restore_tickets',{
    method:"PATCH",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({idTicket:localStorage.getItem('ticket'),amount:localStorage.getItem('amount')})
  })
  .then((response)=>{
    if(response.status === 201){
      localStorage.removeItem('redirect');
      window.location.reload();
    }
    else if(response.status === 429){
      window.location.reload();
    }
  })
  .catch((error)=>{console.error(error);});
}

const generateTicket = function(array,$listTicket){
  array.forEach(ticket => {
    const item = document.createElement("li");
    const text = document.createElement("p");
    item.setAttribute("class","ticket option");
    text.setAttribute("class","ticket-info");
    text.setAttribute("id",ticket.id_ticket);
    const formatDate = new Date(ticket.date_ticket);
    text.textContent = `Function of ${formatDate.toLocaleString()} format ${ticket.formats.type_format}`;
    if(ticket.subtitles === 1){
      text.textContent += ' origin audio w/subtitle';
    }
    else{
      text.textContent += ' audio english';
    }
    item.appendChild(text);
    $listTicket.appendChild(item);
  });
}

fetch(`/home/movie/id:${sessionStorage.getItem('id')}`)
.then(async(response)=>{
  if(response.status === 503){
    window.location.href = '/home/error';
  }
  else if(response.status === 429){
    window.location.reload();
  }
  else{
    const movie = await response.json();
    const $movie = document.querySelector('.title-movie');
    const $time = document.querySelector('.time');
    const $description = document.querySelector('.description');
    const $poster = document.querySelector('.poster');
    const $div = document.querySelector('.frame');
    const $type = document.querySelector('.type');
    $title.textContent += movie[0].title;
    $type.textContent += movie[0].clasifications.type
    $movie.textContent = movie[0].title;
    $time.textContent += movie[0].duration_time;
    $poster.setAttribute("src",`../${movie[0].poster}`);
    $description.textContent = movie[0].description;
    $div.innerHTML = movie[0].trailer;

    if(sessionStorage.getItem('type') === 'premier'){
      fetch(`/home/movie/ticket/premier/${sessionStorage.getItem('id')}`)
      .then(async(response)=>{
        if(response.status === 503){
          // window.location.href = '/home/server_error';
        }
        else if(response.status === 429){
          window.location.reload();
        }
        else{
          const tickets = await response.json();
          ticketInfo = tickets;
          const $listTicket = document.querySelector('.list_ticket');
          generateTicket(tickets,$listTicket);
        }
      })
      .catch((error)=>{console.error(error);});
    }
    else if(sessionStorage.getItem('type') === '3D'){
      fetch(`/home/movie/ticket/2/${sessionStorage.getItem('id')}`)
      .then(async(respons)=>{
        if(respons.status === 503){
          // window.location.href = '/home/server_error';
        }
        else if(respons.status === 429){
          window.location.reload();
        }
        else{
          const tickets = await respons.json();
          ticketInfo = tickets;
          const $listTicket = document.querySelector('.list_ticket');
          generateTicket(tickets,$listTicket);
        }
      })
      .catch((error)=>{console.error(error);});
    }
    else{
      fetch(`/home/movie/ticket/1/${sessionStorage.getItem('id')}`)
      .then(async(response)=>{
        if(response.status === 503){
          // window.location.href = '/home/server_error';
        }
        else if(response.status === 429){
          window.location.reload();
        }
        else{
          const tickets = await response.json();
          ticketInfo = tickets;
          const $listTicket = document.querySelector('.list_ticket');
          generateTicket(tickets,$listTicket);
        }
      })
      .catch((error)=>{console.error(error);});
    }
  }
})
.catch((error)=>{console.error(error);});



$body.addEventListener("click",(e)=>{
  if(e.target.matches('.choice')){
    $items.classList.toggle('hidden');
  }
  else if(e.target.matches('.ticket-info')){
    localStorage.setItem('ticket',e.target.id);
    $choice.classList.add('show');
    ticketInfo.forEach(element => {
      if(element.id_ticket === Number(e.target.id)){
        const formatDate = new Date(element.date_ticket);
        const $date = document.getElementById('date');
        const $format = document.getElementById('format-audio');
        const $stock = document.getElementById('stock');
        const $price = document.getElementById('price');
        $date.textContent = `Movie date | ${formatDate.toLocaleString()}`;
        $price.textContent = `Ticket price | $${element.ticket_price}`;
        price = Number(element.ticket_price);
        $stock.textContent = `tickets available | ${element.stock}`;
        localStorage.setItem('stock',element.stock);
        $amount.textContent = 'Ticktes: 1';
        amountTickets = 1;
        total = Number(element.ticket_price)
        $totalTickets.textContent = `Amount Tickets: ${amountTickets} x $${total.toFixed(2)}`;
        $total.textContent = `Total: $${total.toFixed(2)}`;
        if(element.subtitles === 0){
          $format.textContent = `Format ${element.formats.type_format} audio english`;
        }
        else{
          $format.textContent = `Format ${element.formats.type_format} audio orginal w/ subtitles`;
        }
        $items.classList.toggle('hidden');
      }
    });
  }
  else if(e.target.matches('.pay')){
    $spinner.classList.add('visible');
    localStorage.setItem('amount',amountTickets);
    localStorage.setItem('total',total);
    localStorage.setItem('path','/home/movies');
    fetch('/home/movie/reserve_tickets',{
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        idTicket:localStorage.getItem('ticket'),
        amount:amountTickets,
      })
    })
    .then(async(response)=>{
      if(response.status === 401){
        window.location.href = '/login';
      }
      else if(response.status === 201){
        const data = await response.json();
        localStorage.setItem('code',data.code);
        localStorage.setItem('redirect','true');
        console.log(ticketInfo[0]);
        ticketInfo.forEach(ticketData => {
          console.log(ticketData);
          if((ticketData.id_ticket) === Number(localStorage.getItem('ticket'))){
            fetch('/home/movie/payments',{
              method:"post",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({movie:ticketData.movies.title,amount:amountTickets,total:ticketData.ticket_price})
            })
            .then(async(response)=>{
              if(response.status >= 200 && response.status < 400){
                const data = await response.json();
                window.location.href = data.url;
              }
              else{
                window.location.reload();
              }
            })
            .catch((error)=>{console.error(error);});
          }
        });
      }
      else if(response.status === 429){
        window.location.reload();
      }
      else{
        if(response.status === 400){
          $spinner.classList.toggle('visible');
          $emptyTickets.classList.add('show');
        }
      }
    })
    .catch((error)=>{console.error(error);});
  }
  else if(e.target.matches('.open') || e.target.matches('.close') || e.target.matches('nav-link')){
    if(e.target.matches('.account')){
      localStorage.setItem('path','/home/account');
    }
    $nav.classList.toggle('open-nav');
  }
  else if(e.target.matches('.add')){
    if(amountTickets < 5 && amountTickets < localStorage.getItem('stock')){
      amountTickets ++;
      total = total + price;
      $amount.textContent = `Tickets: ${amountTickets}`;
      $totalTickets.textContent = `Amount Tickets: ${amountTickets} x $${total.toFixed(2)}`;
      $total.textContent = `Total: $${total.toFixed(2)}`;
    }
  }
  else if(e.target.matches('.less')){
    if(amountTickets > 1){
      total = total - price;
      amountTickets --;
      $amount.textContent = `Tickets: ${amountTickets}`;
      $totalTickets.textContent = `Amount Tickets: ${amountTickets} x $${total.toFixed(2)}`;
      $total.textContent = `Total: $${total.toFixed(2)}`;
    }
  }
  else if(e.target.matches('.accept')){
    $emptyTickets.classList.add('empty');
    window.location.reload();
  }
  else if(e.target.matches('.account')){
    localStorage.setItem('path','/home/account');
  }
});

window.addEventListener("load",()=>{
  setTimeout(() => {
    $body.removeChild($loader);
    if(sessionStorage.getItem('stock') > 0){
      amountTickets = 1;
    }
    if(ticketInfo.length < 1){
      const $empty = document.querySelector('.empty');
      $empty.classList.replace('hidden','visible');
    }
  }, 550);
});
