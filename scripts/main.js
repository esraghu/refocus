window.onload = () => {
  const h1 = document.querySelector('h1')
  h1.innerHTML += getWeek() + ` <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-calendar-week" viewBox="0 0 20 20">
  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
</svg>`
  setTheDates() // set the dates of this week based on todays date
  if(localStorage.getItem('habits') == null) {
    let habitls = {
      1: {
        "name" : "Engaged at Work",
        "goal" : 5,
        "sequence" : {}
      },
      2: {
        "name" : "Run or Walk or Workout",
        "goal" : 4,
        "sequence" : {}
      },
      3: { 
        "name" : "Crosswords",
        "goal" : 4,
        "sequence" : {}
      }
    }
    localStorage.setItem('habits', JSON.stringify(habitls))
  }
  readLocalData(JSON.parse(localStorage.getItem('habits')))
}

readLocalData = habits => {
  const table = document.querySelector('table')
  console.log(habits)
  let week = getWeek()
  for(let i in habits) {
    const row = table.insertRow()
    row.className = "habit"
    row.id = habits[i].name
    row.insertAdjacentHTML('beforeend', `<th scope="row">${habits[i].name}</th>`)
    row.insertAdjacentHTML('beforeend', `<td><input type="number" min="1" max="7" id="goal" value=${habits[i].goal}></td>`)
    
    // let's add checkboxes for all days of the week
    let sequence = habits[i]?.sequence?.[week] || new Array(7).fill(0)
    for(idx in sequence) {
      row.insertAdjacentHTML('beforeend', 
        `<td><input type="checkbox" ${sequence[idx]? 'checked': ''}></td>`)
    }
    row.insertAdjacentHTML('beforeend',
      `<td><output>${Math.ceil((reducer(sequence)/habits[i].goal)*100) || 0}%</output></td>`)
  }
  
  let habitName = document.querySelectorAll(".habit")
  habitName.forEach(habit => {
    habit.addEventListener('change', () => {
      // we are listening on all the checkboxes and updating the sequence for that week 
      // and updating the counter
      let target = habit.querySelector('#goal').value || 7
      const checkboxes = Array.from(habit.querySelectorAll('input[type=checkbox]'))
      const sequence = checkboxes.map(checkbox => checkbox.checked? 1 : 0)

      // write changes to the local storage
      for(i in habits) {
        if(habits[i].name == habit.id) {
          habits[i].sequence[week] = sequence
          habits[i].goal = target
          console.log(habits[i])
          localStorage.setItem('habits', JSON.stringify(habits))
        }
      }
      habit.querySelector('output').innerHTML = `${Math.ceil((reducer(sequence)/target)*100)}%`
    })
  });
}

setTheDates = () => {
  let today = new Date()
  let dd = today.getDay(), mm = eval(today.getMonth() + 1)
  let days = document.querySelector('.heading')
  days.querySelectorAll('.days').forEach(day => {
    const dateOfDay = new Date()
    dd = today.getDay()
    switch(day.id) {
      default : break
      case 'Sun' : 
        dateOfDay.setDate(today.getDate() - today.getDay())
        break;
      case 'Mon' :
        dateOfDay.setDate(today.getDate() - today.getDay() + 1)
        break;
      case 'Tue' :
        dateOfDay.setDate(today.getDate() - today.getDay() + 2)
        break;
      case 'Wed' :
        dateOfDay.setDate(today.getDate() - today.getDay() + 3)
        break;
      case 'Thu' :
        dateOfDay.setDate(today.getDate() - today.getDay() + 4)
        break;
      case 'Fri' :
        dateOfDay.setDate(today.getDate() - today.getDay() + 5)
        break;
      case 'Sat' :
        dateOfDay.setDate(today.getDate() - today.getDay() + 6)
        break;
    }
    day.innerHTML = `${dateOfDay.getDate()}/${dateOfDay.getMonth() + 1}`
  })
}

getWeek = (day = new Date()) => {
  const Jan1st = new Date(day.getFullYear(), 0, 1)
  let numberOfDays = Math.floor((day - Jan1st)/(24*60*60*1000))
  return Math.ceil((day.getDay() + 1 + numberOfDays)/7)
}

clearLocalStorage = () => {
  if (confirm(`Are you sure to clear your data?`)) {
    console.log(`Local storage cleared!`)
    localStorage.removeItem('habits')
    location.reload()
  } else {
    console.log(`Local storage not cleared`)
  }
}

reducer = (arr) => {
  return arr.reduce((e, counter = 0) => e + counter)
}

addHabit = () => {
  let name = prompt(`Enter the habit name:`)
  if(name) {
    habits = JSON.parse(localStorage.getItem('habits'))
    const key = Object.keys(habits).length + 1
    habits[key] = {}
    habits[key].name = name
    habits[key].goal = 4 // let's keep this at 4 times a week to start with
    habits[key].sequence = {}
    habits[key].sequence[getWeek()] = new Array(7).fill(0)
    localStorage.setItem('habits', JSON.stringify(habits))
    location.reload()
  } else {
    alert(`Couldn’t add the new habit!`)
  }
}