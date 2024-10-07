const $body = document.querySelector('body');
const $nav = document.querySelector('nav');
const $loader = document.querySelector('.loader-section');

localStorage.removeItem('redirect');
fetch('/home/movie/payments/purchase',{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
    idPurchase:localStorage.getItem('code'),
    idTicket:localStorage.getItem('ticket'),
    total:localStorage.getItem('total')
  })
})
.then(async(response)=>{
  if(response.status === 200){
    fetch('/home/movie/payments/purchase_details',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        idTicket:localStorage.getItem('ticket'),
        idPurchase:localStorage.getItem('code'),
        amount:localStorage.getItem('amount'),
        subtotal:localStorage.getItem('total')
      })
    })
    .catch((error)=>{console.error(error);});
  }
})
.catch((error)=>{console.error(error);});

$body.addEventListener("click",(e)=>{
  if(e.target.matches('.open') || e.target.matches('.close') || e.target.matches('nav-link')){
    $nav.classList.toggle('open-nav');
  }
});
window.addEventListener("load",(e)=>{
  const code = localStorage.getItem('code');
  fetch(`/home/movie/payments/purchase/code:${code}`)
  .then(async(response)=>{
    const data = await response.json();
    let audio = ''
    if(data.tickets.subtitles === 0){audio = 'audio english';}
    else{audio = 'audio original w/subtitles';}
    const purchaseDate = new Date(data.purchasesOrders.date_purchase);
    const ticketDate = new Date(data.tickets.date_ticket);
    const $datePurchase = document.getElementById('date-purchase');
    const $code = document.getElementById('code');
    const $customer = document.getElementById('customer');
    const $dateTicket = document.getElementById('date-ticket');
    const $format = document.getElementById('format');
    const $amount = document.getElementById('amount');
    const $subtotal = document.getElementById('subtotal');
    const $total = document.getElementById('total');
    const $poster = document.getElementById('poster');
    const $title = document.querySelector('.title-movie');
    $datePurchase.textContent = `Date Purchase | ${purchaseDate.toLocaleString()}`;
    $code.textContent = `Code purchase | ${data.purchasesOrders.id_purchase}`;
    $customer.textContent = `Customer | ${data.purchasesOrders.users.fullname}`;
    $dateTicket.textContent = `Date Ticket | ${ticketDate.toLocaleString()}`;
    $format.textContent = `Format | ${data.tickets.formats.type_format} ${audio}`;
    $amount.textContent = `Tickets ${data.amount_ticket} x $${data.tickets.ticket_price}`
    $subtotal.textContent = `Subtotal: $${data.sub_total}`;
    $total.textContent = `Total paid: $${data.purchasesOrders.total}`;
    $title.textContent = data.tickets.movies.title;
    $poster.setAttribute("src",`../../${data.tickets.movies.poster}`)
  })
  .catch((error)=>{console.error(error);});
  $body.removeChild($loader);
});