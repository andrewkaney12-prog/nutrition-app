// ===== Data =====
let meals = JSON.parse(localStorage.getItem('meals')) || [];
let planner = JSON.parse(localStorage.getItem('planner')) || [];

// ===== UI Functions =====
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(s => s.style.display = 'none');
  document.getElementById(sectionId).style.display = 'block';
  if (sectionId === 'meal-list') renderMeals();
  if (sectionId === 'planner') renderPlanner();
  if (sectionId === 'grocery') renderGrocery();
  if (sectionId === 'summary') renderSummary();
}

// ===== Meal Library =====
const mealForm = document.getElementById('meal-form');
mealForm.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('meal-name').value.trim();
  if(name){
    meals.push({name, ingredients: []});
    saveMeals();
    document.getElementById('meal-name').value = '';
    renderMeals();
  }
});

function renderMeals(){
  const mealList = document.getElementById('meal-list');
  mealList.innerHTML = '';
  meals.forEach((meal, i)=>{
    const li = document.createElement('li');
    li.textContent = meal.name;
    const selectBtn = document.createElement('button');
    selectBtn.textContent = 'Add to Planner';
    selectBtn.onclick = ()=>{ addToPlanner(i); };
    li.appendChild(selectBtn);
    mealList.appendChild(li);
  });
}

// ===== Planner =====
function addToPlanner(mealIndex){
  planner.push(meals[mealIndex]);
  savePlanner();
  renderPlanner();
}

function renderPlanner(){
  const plannerList = document.getElementById('planner-list');
  plannerList.innerHTML = '';
  planner.forEach(meal=>{
    const li = document.createElement('li');
    li.textContent = meal.name;
    plannerList.appendChild(li);
  });
  renderGrocery();
  renderSummary();
}

// ===== Grocery List =====
function renderGrocery(){
  const groceryList = document.getElementById('grocery-list');
  groceryList.innerHTML = '';
  let combinedIngredients = {};
  planner.forEach(meal=>{
    meal.ingredients.forEach(ing=>{
      if(combinedIngredients[ing.name]){
        combinedIngredients[ing.name].amount += ing.amount;
      } else {
        combinedIngredients[ing.name] = {...ing};
      }
    });
  });
  for(let key in combinedIngredients){
    const li = document.createElement('li');
    li.textContent = `${combinedIngredients[key].name} - ${combinedIngredients[key].amount} ${combinedIngredients[key].unit}`;
    groceryList.appendChild(li);
  }
}

// ===== Nutrition Summary =====
function renderSummary(){
  let totalCalories=0, totalProtein=0, totalCarbs=0, totalFat=0;
  planner.forEach(meal=>{
    meal.ingredients.forEach(ing=>{
      totalCalories += ing.calories;
      totalProtein += ing.protein;
      totalCarbs += ing.carbs;
      totalFat += ing.fat;
    });
  });
  document.getElementById('nutrition-summary').textContent = 
    `Calories: ${totalCalories}, Protein: ${totalProtein}g, Carbs: ${totalCarbs}g, Fat: ${totalFat}g`;
}

// ===== Storage =====
function saveMeals(){ localStorage.setItem('meals', JSON.stringify(meals)); }
function savePlanner(){ localStorage.setItem('planner', JSON.stringify(planner)); }

// ===== Initial Render =====
showSection('library');
