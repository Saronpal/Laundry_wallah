
const btns = document.querySelectorAll(".btn");
const tablebody = document.getElementById("TableBody");
const totalprice = document.getElementById("tprice");
const form=document.getElementById("booking-form");
const bookbtn = document.getElementById("book-now");
const msg=document.getElementById("successmsg");
let total=0;
Additems();
bookbtnactive();
//ARRAY OF OBJECT FOR PRODUCT INFORMATION
const product=[
    {
        id: 1,
        title: 'Dry Cleaing',
        price: 200,
    },
    {
        id: 2,
        title: 'Wash & Fold',
        price: 100,
    },
    {
        id: 3,
        title: 'Ironing',
        price: 30,
    },
    {
        id: 4,
        title: 'Stain Removal',
        price: 500,
    },
    {
        id: 5,
        title: 'Leather & Suede Cleaning',
        price: 999,
    },
    {
        id: 6,
        title: 'Wedding Dress Cleaning',
        price: 2800,
    }
]
btns.forEach(btn=>{
    btn.addEventListener("click",(e)=>{
        const button= e.currentTarget;
        const id=Number(button.dataset.id);
        const item = product.find(p=>p.id===id);
        if(!item) return;

        button.classList.toggle("active");
        if(button.classList.contains("active")){
            button.innerHTML=`Remove item <ion-icon name="remove-circle-outline" class="icon"></ion-icon>`;
            const row =document.createElement("tr");
            row.dataset.id=id;
            row.innerHTML=`
                <td></td>
                <td>${item.title}</td>
                <td><span>₹</span>${item.price}</td>    
            `;
            tablebody.appendChild(row);
            bookbtnactive();

            total+=item.price;
        }else{
            button.innerHTML=`Add item <ion-icon name="add-circle-outline" class="icon"></ion-icon>`;
            const row = tablebody.querySelector(`tr[data-id="${id}"]`);
            if(row) row.remove();
            total-=item.price
        }
        updateSerialNumbers();
        bookbtnactive();
        Additems();
        totalprice.innerHTML=`<span>₹</span>${total}`;

    });

});
function updateSerialNumbers(){
    let count =1;
    [...tablebody.rows].forEach((row)=>{
        if(row.id !== "empty-cart"){
            row.cells[0].textContent=count++;
        }
    });
}
bookbtn.addEventListener("click",function(e){
    e.preventDefault();

    if(bookbtn.disabled){
        e.preventDefault();
        return;
    }
    prepareEmail();
    emailjs.sendForm('service_zngn3a4','template_9sx6oba',form)
    .then(function(){
        msg.innerText="Thank you For Booking the Service We will get back to you soon!";
        msg.style.color='#2E8B57';
        form.reset();
        resetCartCompletely();
        setTimeout(() => {
            msg.innerText="";
        }, 2500);
    },function(error){
        msg.innerText="Oops! Something went wrong...";
        msg.style.color='red';
        setTimeout(() => {
            msg.innerText="";
        }, 2500);
        form.reset();
        resetCartCompletely();
    });
});
// function bookbtnactive(){
//     const realitem=[...tablebody.rows]
//     .filter(row=>row.id!=="empty-cart");
//     if(realitem.length===0){
//         bookbtn.disabled=true;
//         msg.innerText="Add the items to the cart to book";
//         msg.style.color='#E53935';
//     }
//     else{
//         bookbtn.disabled=false;
//         msg.innerText="";
//     }
// }
function bookbtnactive(){
    const realitem = [...tablebody.rows]
        .filter(row=>row.id !== "empty-cart");
    if(realitem.length === 0){
        bookbtn.disabled = true;
        if(msg.innerText === ""){
            msg.innerText = "Add the items to the cart to book";
            msg.style.color = "#E53935";
        }
    }else{
        bookbtn.disabled = false;
        msg.innerText = "";
    }
}
function Additems(){
    
    const existmsg = document.getElementById("empty-cart");
    if(existmsg){
        existmsg.remove();
    }
    if(tablebody.rows.length===0){
        const additem =document.createElement("tr");
        additem.id="empty-cart";
        additem.innerHTML=`
        <td colspan="3"><ion-icon name="alert-circle-outline" class="carticon"></ion-icon> <p>No added items</p></td>
        `
        tablebody.appendChild(additem);
    }
}
function resetCartCompletely(){
    tablebody.innerHTML="";
    total =0;
    totalprice.innerHTML=`<span>₹</span>0`;
    btns.forEach(btn=>{
        btn.classList.remove("active");
        btn.innerHTML=`Add item <ion-icon name="add-circle-outline" class="icon"></ion-icon>`;
    });
    bookbtnactive();
    Additems();
}
function prepareEmail(){
    const rows =[...tablebody.rows].filter(r=>r.id !== "empty-cart")
    let itemText =rows.map(row=>{
        const name = row.cells[1].innerText;
        const price =row.cells[2].innerText;
        return `${name}-${price}`;
    }).join("\n");
    document.getElementById("order_items").value=itemText;
    document.getElementById("order_total").value=`₹${total}`;
}





