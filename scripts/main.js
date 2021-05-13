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

addRows = (habit, tbody) => {
  // Clone a row from the template's content
  const template = document.querySelector('template')
  const row = template.content.cloneNode(true)

  // Set row's id and the value in the row header
  const tr = row.querySelector('tr')
  tr.id = habit.name
  const th = row.querySelector('th')
  th.innerHTML = `${habit.name}${th.innerHTML}`

  // Set the goal from what is in localstorage
  const goal = row.querySelector('#goal')
  goal.value = habit.goal
  
  // Set the checkbox values
  let week = getWeek()
  let sequence = habit.sequence?.[week] || new Array(7).fill(0)
  const weekdays = row.querySelectorAll('input[type=checkbox]')
  for(idx in sequence) {
    weekdays[idx].checked = sequence[idx]
  }

  // Update the progress bar
  let progress = Math.ceil((reducer(sequence)/habit.goal)*100) || 0
  const progressBar = row.querySelector('progress')
  progressBar.value = progress
  progressBar.innerHTML = `${progress}%`

  // Append the row to the body
  tbody.appendChild(row)
}

readLocalData = habits => {
  const tbody = document.querySelector('tbody')
  console.log(habits)
  for(let i in habits) addRows(habits[i], tbody)
}

updateRecord = habit => {
  // we are listening for any changes here
  let target = habit.querySelector('#goal').value || 7
  const checkboxes = Array.from(habit.querySelectorAll('input[type=checkbox]'))
  const sequence = checkboxes.map(checkbox => checkbox.checked? 1 : 0)
  let week = getWeek()

  // write changes to the local storage
  const habits = JSON.parse(localStorage.getItem('habits'))
  for(i in habits) {
    if(habits[i].name == habit.id) {
      habits[i].sequence[week] = sequence
      habits[i].goal = target
      console.log(habits[i])
      localStorage.setItem('habits', JSON.stringify(habits))
    }
  }
  let progress = Math.ceil((reducer(sequence)/target)*100)
  habit.querySelector('progress').innerHTML = `${progress}%`
  habit.querySelector('progress').value = progress
}

deleteRecord = element => {
  let name = element.parentNode.parentNode.id
  if(confirm(`Are you sure to delete the habit: ${name}?`)) {
    let habits = JSON.parse(localStorage.getItem('habits'))
    for(i in habits) {
      if(habits[i].name == name) {
        console.log(`Deleting: ${habits[i]}`)
        delete habits[i]
      } 
    }

    // we need to realign the entries in our json object
    let counter = 1, habitMap = new Array()
    for(entry of Object.entries(habits)) {
      entry[0] = counter++
      habitMap.push(entry)
    }
    habits = Object.fromEntries(habitMap)
    localStorage.setItem('habits', JSON.stringify(habits))
    location.reload()
  } else {
    console.log(`Record not deleted`)
  }
}

setTheDates = () => {
  let today = new Date()
  // let days = document.querySelector('.heading')
  const dayMap = {
    'Sun' : 0,
    'Mon' : 1,
    'Tue' : 2,
    'Wed' : 3,
    'Thu' : 4,
    'Fri' : 5,
    'Sat' : 6
  }
  document.querySelectorAll('.days').forEach(day => {
    const dateOfDay = new Date()
    dateOfDay.setDate(today.getDate() - today.getDay() + dayMap[day.id])
    if(today.getDay() == dayMap[day.id]) {
      day.className += ` dayofweek`
    }
    day.innerHTML = `${dateOfDay.getDate()}/${dateOfDay.getMonth() + 1}`
  })
}

getWeek = (day = new Date()) => {
  const Jan1st = new Date(day.getFullYear(), 0, 1)
  let julian = Math.floor((day - Jan1st)/(24*60*60*1000))
  let weekNum = Math.ceil((julian + 6)/7)
  // if(day.getDay() < Jan1st.getDay()) weekNum++
  return weekNum
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
  // let name = prompt(`Enter the habit name:`)
  let name = document.querySelector('#habitName').value
  console.log(name)
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

editHabit = (element) => {
  let name = element.parentNode.parentNode.id
  element.parentNode.innerHTML = `<th scope="row"><input type="text" value="${name}" id="editingHabit" onfocusout="updateHabit(this, '${name}')"</th>`
  document.querySelector('#editingHabit').focus()
}

updateHabit = (element, prevName) => {
  let name = element.value
  console.log(name, prevName)
  if(typeof(prevName) != 'string') {
    alert(`Couldn't update the element`)
    location.reload()
  }
  if(name != prevName) {
    habits = JSON.parse(localStorage.getItem('habits'))
    for(idx in habits) {
      if(habits[idx].name == prevName) {
        habits[idx].name = name
      }
    }
    console.log(habits)
    localStorage.setItem('habits', JSON.stringify(habits))
  }
  location.reload()
}