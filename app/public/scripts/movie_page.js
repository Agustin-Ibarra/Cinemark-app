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
  localStorage.removeItem('redirect');
  fetch('/movie/restore_tickets',{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({idTicket:localStorage.getItem('ticket'),amount:localStorage.getItem('amount')})
  })
  .then((response)=>{
    if(response.status === 200){
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
    text.textContent = `Function of ${formatDate.toLocaleString()} format ${ticket.type_format}`;
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

fetch(`/movie/id:${sessionStorage.getItem('id')}`)
.then(async(data)=>{
  const movie = await data.json();
  const $movie = document.querySelector('.title-movie');
  const $time = document.querySelector('.time');
  const $description = document.querySelector('.description');
  const $poster = document.querySelector('.poster');
  const $div = document.querySelector('.frame');
  const $type = document.querySelector('.type');
  $title.textContent += movie[0].title;
  $type.textContent += movie[0].type
  $movie.textContent = movie[0].title;
  $time.textContent += movie[0].duration_time;
  $poster.setAttribute("src",movie[0].poster);
  $description.textContent = movie[0].description;
  // $div.innerHTML = movie[0].trailer;
})
.catch((error)=>{console.error(error);});

if(sessionStorage.getItem('type') === 'premier'){
  fetch(`/movie/ticket/id:${sessionStorage.getItem('id')}`)
  .then(async(data)=>{
    const tickets = await data.json();
    ticketInfo = tickets;
    const $listTicket = document.querySelector('.list_ticket');
    generateTicket(tickets,$listTicket);
  })
  .catch((error)=>{console.error(error);});
}
else if(sessionStorage.getItem('type') === '3D'){
  fetch(`/movie/ticet3D/id:${sessionStorage.getItem('id')}`)
  .then(async(data)=>{
    const tickets = await data.json();
    ticketInfo = tickets;
    const $listTicket = document.querySelector('.list_ticket');
    generateTicket(tickets,$listTicket);
  })
  .catch((error)=>{console.error(error);});
}
else{
  fetch(`/movie/ticket2D/id:${sessionStorage.getItem('id')}`)
  .then(async(data)=>{
    const tickets = await data.json();
    ticketInfo = tickets;
    const $listTicket = document.querySelector('.list_ticket');
    generateTicket(tickets,$listTicket);
  })
  .catch((error)=>{console.error(error);});
}

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
        const $title = document.getElementById('movie-title');
        const $date = document.getElementById('date');
        const $format = document.getElementById('format-audio');
        const $stock = document.getElementById('stock');
        const $price = document.getElementById('price');
        $title.textContent =`Movie selected | ${element.title}` ;
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
          $format.textContent = `Fromat ${element.type_format} audio english`;
        }
        else{
          $format.textContent = `Fromat ${element.type_format} audio orginal w/ subtitles`;
        }
        $items.classList.toggle('hidden');
      }
    });
  }
  else if(e.target.matches('.pay')){
    $spinner.classList.add('visible');
    localStorage.setItem('amount',amountTickets);
    localStorage.setItem('total',total);
    fetch('/movie/reserve_tickets',{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        idTicket:localStorage.getItem('ticket'),
        amount:amountTickets,
      })
    })
    .then(async(response)=>{
      if(response.status === 401){
        $spinner.classList.toggle('visible');
        localStorage.setItem('path','/movie_page');
        window.location.href = '/login';
      }
      else if(response.status === 200){
        const data = await response.json();
        localStorage.setItem('code',data.code);
        localStorage.setItem('redirect','true');
        ticketInfo.forEach(element => {
          if((element.id_ticket) === Number(localStorage.getItem('ticket'))){
            fetch('/payments',{
              method:"post",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({movie:element.title,amount:amountTickets,total:element.ticket_price})
            })
            .then(async(response)=>{
              const data = await response.json();
              window.location.href = data.url;
            })
            .catch((error)=>{console.error(error);});
          }
        });
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
