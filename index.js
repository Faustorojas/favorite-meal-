const randomLink = "https://www.themealdb.com/api/json/v1/1/random.php"
const idMealLink = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="
const termMealLink = "https://www.themealdb.com/api/json/v1/1/search.php?s=" 
const meals = document.getElementById("meals")
const favMeals = document.getElementById("fav-meals")
const inputBox = document.getElementById("search-term")
const termBtn = document.getElementById("search")
const mealPopUp = document.getElementById("meal-popup")
const closePopUpBtn = document.getElementById("close-popup")
const mealInfo = document.getElementById("meal-info")

// fetch random meal

const randomMeal = async () => {
   try{
      const data = await fetch(randomLink)
      const response = await data.json()
      addMeal(response.meals[0], true)
   } catch{
      console.log("randon error");
   }
   

}

randomMeal()

// fetch meal by id

const idMeal = async (id) => {
   try{
      const data = await fetch(`${idMealLink}${id}`)
      const response = await data.json()
      return response
   }  catch{
      console.log("idMeal error");
   }
}


//fetch by term

const searchTerm =  async (term) => {
   try{
      const data = await fetch(`${termMealLink}${term}`)
      const response = await data.json()
      return response
   }  catch{
      console.log("term error");
   }
}



const inputValueSender =  async (value) => {
   let meal = await searchTerm(value)
   meals.innerHTML = ""
   for(let i = 0; i < meal.meals.length; i++){
      addMeal(meal.meals[i], false)
      
   }
   inputBox.value = ""
}


//search on click
termBtn.onclick = () => inputValueSender(inputBox.value)

//search when key Enter is press
inputBox.addEventListener("keydown", (event) => {
   if(event.key === "Enter"){
      inputValueSender(inputBox.value)
   }
})

//ad meal to dom
const addMeal = (mealData, random = false) => {
   let meal = document.createElement("div")
   
   meal.innerHTML = `
   <div class="meal-header">
       ${
           random
               ? `
       <span class="random"> Random Recipe </span>`
               : ""
       }
       <img
           src="${mealData.strMealThumb}"
           alt="${mealData.strMeal}"
       />
   </div>
   <div class="meal-body">
       <h4>${mealData.strMeal}</h4>
       <button class="fav-btn">
           <i class="fas fa-heart"></i>
       </button>
   </div>
` 
meals.appendChild(meal)

let btn = meal.querySelector(".meal-body .fav-btn")
btn.addEventListener("click", () => {
 if(btn.classList.contains("active")){
   btn.classList.remove("active")
   removeFromLs(mealData.idMeal)
   // favMeals.innerHTML = ""
   favMealSender()
 
 } else{
   btn.classList.add("active")
   addToLs(mealData.idMeal)
   // favMeals.innerHTML = ""
   favMealSender()
 }
})

meal.addEventListener("click", (e) => {
   mealInfo.innerHTML = ""
   
   if(e.target.classList[0] !== "fav-btn"){
      showMealInfo(mealData)
   }
      
   
   
})

}



//add to local storage
const addToLs = (ids) => {
   let idList = JSON.parse(localStorage.getItem("mealIds")) === null ? [] : JSON.parse(localStorage.getItem("mealIds"))
   localStorage.setItem("mealIds", JSON.stringify([...idList, ids]))
}



//remove from local storage

const removeFromLs = (ids) => {
   let storageItems =  JSON.parse(localStorage.getItem("mealIds"))
   localStorage.setItem("mealIds", JSON.stringify(storageItems.filter(id => id !== ids)))
}


// send favorite meals to be fetch

const favMealSender =  async () => {
   favMeals.innerHTML = ""
   let mealIds = JSON.parse(localStorage.getItem("mealIds"))
   for(let i = 0; i < mealIds.length; i++){
      let mealData = await idMeal(mealIds[i])
      showDomfavmeal(mealData.meals[0])
   }
}

favMealSender()


// update the dom with the favorite meals
const showDomfavmeal = (mealData) => {
 
   const meal = document.createElement("li")
   meal.innerHTML = `<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/> <span>${mealData.strMeal}</span> 
   <button class="clear"><i class="fas fa-window-close"></i></button>`
   favMeals.appendChild(meal)

   let btn = meal.querySelector(".clear")

   btn.addEventListener("click", (e) => {
    

      
      removeFromLs(mealData.idMeal)
      
      favMealSender()
   })

   meal.addEventListener("click", (e) => {
      mealInfo.innerHTML = ""
      if(e.target.classList[0] !== "clear"){
         showMealInfo(mealData)
      }
   })
}


const showMealInfo = (mealData) => {
   let mealEl = document.createElement("div")
   mealPopUp.classList.remove("hidden")
   mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}"
    alt="${mealData.strMeal}" />
    <p> ${mealData.strInstructions}
   `
  mealInfo.appendChild(mealEl)
}


closePopUpBtn.addEventListener("click", (e) => {

   mealPopUp.classList.add("hidden")
})