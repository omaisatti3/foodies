import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
 import {  getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword , signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
 import { getFirestore,collection, addDoc, getDocs,doc, deleteDoc,updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  const firebaseConfig = {
    





    apiKey: "AIzaSyBonp0ma9Jaga7qPZUIctOo37bdOlnKygg",
    authDomain: "foodpanda-1ec8a.firebaseapp.com",
    projectId: "foodpanda-1ec8a",
    storageBucket: "foodpanda-1ec8a.firebasestorage.app",
    messagingSenderId: "377391534481",
    appId: "1:377391534481:web:07394e771929f7833e0a30",
    measurementId: "G-4N1M0P6FYD"

  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // If user is logged in and on login/signup page, redirect to admin
      if (
        location.pathname.endsWith("index.html") ||
        location.pathname.endsWith("login.html")
      ) {
        location.href = "./admin.html";
      }
    } else {
      // If user is NOT logged in and tries to access admin page, redirect to login
      if (location.pathname.endsWith("admin.html")) {
        location.href = "./login.html";
      }
    }
  });
  
  
  function handleSignup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          title: "User Signed Up Successfully",
          text: `${user.email}`,
          icon: "success",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: "Oops ...",
          text: "Invalid Credentials",
        });
      });
  }
  
  window.handleSignup = handleSignup;
  
  function handleLogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          title: "User Signed In Successfully",
          text: `${user.email}`,
          icon: "success",
        }).then(() => {
          location.href = "./admin.html";
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops ...",
          text: "Invalid Credentials",
        });
      });
  }
  window.handleLogin = handleLogin;
  
  function logoutUser() {
    signOut(auth)
      .then(() => {
        Swal.fire({
          title: "User Signed Out Successfully",
          text: `Byee Byee <3`,
          icon: "success",
        }).then(() => {
          window.location.href = "login.html";
        });
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        Swal.fire({
          icon: "error",
          title: "Oops ...",
          text: "Abhi na jaao Chor kr",
        });
      });
  }
  window.logoutUser = logoutUser;
  
  async function addProducts() {
    getProductListDiv.innerHTML = "";
  
    const product_id = document.getElementById("productId").value;
    const product_name = document.getElementById("productName").value;
    const product_price = document.getElementById("productPrice").value;
    const product_des = document.getElementById("productDesc").value;
    const product_url = document.getElementById("productImage").value;
    try {
      const docRef = await addDoc(collection(db, "items"), {
        product_id: product_id,
        product_name: product_name,
        product_price: product_price,
        product_des: product_des,
        product_url: product_url,
      });
      Swal.fire({
        title: "Product Added Successfully",
        text: `your order id is ${docRef.id}`,
        icon: "success",
      });
      getProductList();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  window.addProducts = addProducts;
  
  let getProductListDiv = document.getElementById("product-list");
  
  async function getProductList() {
    const querySnapshot = await getDocs(collection(db, "items"));
    querySnapshot.forEach((doc) => {
      getProductListDiv.innerHTML += `<div class="card" style="width: 22rem;">
      <img src=${doc.data().product_url} class="card-img-top" alt="Image">
      <div class="card-body">
        <h5 class="card-title">${doc.data().product_name}</h5>
        <p class="card-text">${doc.data().product_des}</p>
        <h5 class="card-title">${doc.data().product_price}</h5>
        <button onclick='openEditModal("${doc.id}", "${
        doc.data().product_name
      }", "${doc.data().product_price}", "${doc.data().product_des}", "${
        doc.data().product_url
      }")' class='btn btn-info'> Edit </button>
        <button onclick='delItem("${
          doc.id
        }")' class='btn btn-danger'> Delete </button>
        </div>
    </div>`;
    });
  }
  if (getProductListDiv) {
    getProductList();
  }
  
  async function delItem(params) {
    getProductListDiv.innerHTML = "";
    const cityRef = doc(db, "items", params);
    await deleteDoc(cityRef, {
      capital: deleteField(),
    });
    getProductList();
  }
  window.delItem = delItem; 
  
  window.openEditModal = function (id, name, price, desc, url) {
    document.getElementById("editProductId").value = id;
    document.getElementById("editProductName").value = name;
    document.getElementById("editProductPrice").value = price;
    document.getElementById("editProductDesc").value = desc;
    document.getElementById("editProductImage").value = url;
  
    let editModal = new bootstrap.Modal(
      document.getElementById("editProductModal")
    );
    editModal.show();
  };
  
  window.saveProductChanges = async function () {
    const id = document.getElementById("editProductId").value;
    const name = document.getElementById("editProductName").value;
    const price = document.getElementById("editProductPrice").value;
    const desc = document.getElementById("editProductDesc").value;
    const url = document.getElementById("editProductImage").value;
  
    const productRef = doc(db, "items", id);
  
    try {
      await updateDoc(productRef, {
        product_id: id,
        product_name: name,
        product_price: price,
        product_des: desc,
        product_url: url,
      });
      Swal.fire({
        title: "Updated!",
        text: "Product updated successfully.",
        icon: "success",
      });
      getProductListDiv.innerHTML = "";
      getProductList();
      bootstrap.Modal.getInstance(
        document.getElementById("editProductModal")
      ).hide();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
      });
    }
  };
  let card = document.getElementById("card"); // Assuming there's an element with id="card"


  async function fetchData() {
    document.getElementById("abc").style.display = "block"; // Show the loader

    const q = collection(db, "Items");
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      card.innerHTML += `<div class="card m-5 p-3" style="width: 18rem;">
      <img src=${doc.data().img} class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">ID: ${doc.data().id}</h5>
        <h3 class="card-text">NAME: ${doc.data().name}</h3>
        <h3 class="card-text">PRICE: ${doc.data().price}</h3>
        <button onclick='addtoCart("${
          doc.data().price
        }")' class='btn btn-info'> Add to Cart </button>
      </div>
    </div>`;
    });

    document.getElementById("abc").style.display = "none"; // Hide the loader
  }

  fetchData();

  function addtoCart(price) {
    let getvalue = document.getElementById("getvalue");
    getvalue.innerHTML += `<p>${price}</p>`;
    Swal.fire("Product has been added to cart");
  
  }

  window.addtoCart = addtoCart;
  

 window.fetchData = fetchData;