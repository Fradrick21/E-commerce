const header=document.querySelector("header");
let cardlist=document.getElementById("cardlist");
let cartview=document.querySelector(".fa-shopping-basket");
let searchproduct=document.getElementById("search")
let searchinput=document.querySelector(".searchinput");
let closesearchinput=document.querySelector(".fa-xmark");
let category=document.getElementById("category");
let limit=document.getElementById("limit");
let cartlistview=document.querySelector(".cartlistview");
let carttabledata=document.querySelector(".carttabledata tbody");
let cartqtycount=document.getElementById("cartqtycount");
let totalqty=document.getElementById("totalquantity");
let totalnetprice=document.getElementById("Totalnetprice");

let cartdata=[];

window.addEventListener("scroll",()=>{
    if(window.scrollY>50){
        header.classList.add("stickyMenu")
    }
    else{
        header.classList.remove("stickyMenu")
    }
    
})

searchproduct.addEventListener("click",()=>{
    searchinput.classList.toggle("active");
})
closesearchinput.addEventListener("click",()=>{
    searchinput.classList.remove("active");
})

const apiurl="https://fakestoreapi.com/products/";  

window.addEventListener("load",()=>{
    fetch(apiurl+"/categories")
    .then((response)=>response.json())
    .then((data)=>{
        data.forEach((item)=>{
            let categories=document.createElement("option");
            categories.value=item;
            categories.text=item;
            category.append(categories);
        });
    });
    loadproducts("");
});
   
function loadproducts(filterquery) {
    fetch(apiurl+filterquery)
    .then((response)=>response.json())
    .then((data)=>{

        limit.innerHTML="";
        for(let i=0;i<Math.ceil(data.length/5)+1;i++){ 
        let limitpage=document.createElement("option");
        if(i!=0){   
            limitpage.value=i*5;
            limitpage.text=i*5;
        }
            limit.append(limitpage);
        }


    
    data.forEach((product) => {
        console.log(product); 

        let carditems=`
        <div class="singleproduct">
        <div class="images"><img src="${product.image}"></div>
        <div class="productdetails">
        <h5>${product.title}</h5>
        <div class="productprice">
        <span class="price">${product.price}</span>
        <div>
        <i class="fa-regular fa-heart"></i>
        <i class="fa-solid fa-plus" onclick="addtocart(${product.id},1)"></i>
        </div>
        </div>
        </div>
        `
        cardlist.innerHTML+=carditems;
});
    });
}

function addtocart(ID,Quantity) {

    let arr={ID:ID,Quantity:Quantity}
    let isproductexits=true;

    cartdata.forEach((el)=>{
        if(el.ID==ID){
            el.Quantity++;
            isproductexits=false;
        }
    });
   if(isproductexits){
    cartdata.push(arr);
   }

    let totalqty=0;
    cartdata.forEach((el)=>{
        totalqty +=el.Quantity;
    });

    cartqtycount.innerText=totalqty;
}

function viewcartdetails(){
    if(cartdata.length>0){
        carttabledata.innerHTML="";
        cartlistview.classList.add("active");


        let totalcartprice=0;
        let totalcartquantity=0;

        // const tbody = document.querySelector('.carttabledata tbody');
        // tbody.innerHTML = "";
        // document.querySelector('.cartlistview').classList.add("active");

        // let totalcartprice = 0;
        // let totalcartquantity = 0;

      cartdata.forEach((arr)=>{
        fetch(apiurl+"/"+arr.ID)
        .then((response)=>response.json())
        .then((data)=>{
          
            totalcartprice+=data.price*arr.Quantity;
            totalcartquantity+=arr.Quantity;

            let tablelist=
            `
            <td>
            <div class="productname">
            <img src="${data.image}"/>
            <h5>${data.title}</h5>
            </div>
            </td>

            <td>
            <td>${data.price}</td>
            <td>${arr.Quantity}</td>
            <td>${data.price*arr.Quantity}</td>
            </td>
            `
            
            let tr=document.createElement("tr");
            tr.innerHTML=tablelist;
            carttabledata.append(tr);

            totalqty.innerText=totalcartprice;
            totalnetprice.innerText=parseFloat(totalcartquantity).toFixed(2);

            });
        });
    }
}

// function viewcartdetails() {
//     if(cartdata.length > 0) {
//         const tbody = document.querySelector('.carttabledata tbody');
//         tbody.innerHTML = "";
//         document.querySelector('.cartlistview').classList.add("active");

//         let totalcartprice = 0;
//         let totalcartquantity = 0;

//         cartdata.forEach((arr) => {
//             fetch(apiurl + "/" + arr.ID)
//             .then((response) => response.json())
//             .then((data) => {
//                 totalcartprice += data.price * arr.Quantity;
//                 totalcartquantity += arr.Quantity;

//                 let tablelist = `
//                 <tr>
//                     <td>
//                         <div class="productname">
//                             <img src="${data.image}" alt="${data.title}" />
//                             <h5>${data.title}</h5>
//                         </div>
//                     </td>
//                     <td>$${data.price.toFixed(2)}</td>
//                     <td>${arr.Quantity}</td>
//                     <td>$${(data.price * arr.Quantity).toFixed(2)}</td>
//                 </tr>
//                 `;
                
//                 tbody.insertAdjacentHTML('beforeend', tablelist);

//                 document.getElementById('totalquantity').textContent = totalcartquantity;
//                 document.getElementById('Totalnetprice').textContent = '$' + totalcartprice.toFixed(2);
//             });
//         });
//     }
// }

function closecartdetails(){
    cartlistview.classList.remove("active");
}

function filtersearch(){
    cardlist.innerHTML="";
    let querystring="";
    if(category.value!=""){
        querystring+="/category/"+category.value;
    }
    if(limit.value !=""){
        querystring+="?limit="+limit.value;
    }

    loadproducts(querystring);
}