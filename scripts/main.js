window.onload = () => {
  setTheDates() // set the dates of this week based on todays date
  // readHabits() // read the saved habits from the file
  // listenForChange()
  // let habits = localStorage.getItem('habits')
  if(localStorage.getItem('habits') == null) {
    let habitls = {
      1: {
        "habit" : "Engaged at Work",
        "goal" : 5
      },
      2: {
        "habit" : "Run or Walk or Workout",
        "goal" : 4
      },
      3: { 
        "habit" : "Crosswords",
        "goal" : 4
      }
    }
    localStorage.setItem('habits', JSON.stringify(habitls))
  }
  readLocalData(JSON.parse(localStorage.getItem('habits')))
}

readLocalData = habits => {
  const table = document.querySelector('table')
  console.log(habits)
  for(let i in habits) {
    const row = table.insertRow()
    row.className = "habit"
    row.id = habits[i].habit
    const hName = row.insertCell(0)
    const goal = row.insertCell(1)
    const elements = `<td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><output>0%</output></td>`
    row.insertAdjacentHTML('beforeend', elements)        
    hName.innerHTML = habits[i].habit
    goal.innerHTML = `<input type="number" min="1" max="7" id="goal" value=${habits[i].goal}>`
  }
  let habitName = document.querySelectorAll(".habit")
  habitName.forEach(habit => {
    habit.addEventListener('click', () => {
      console.log(habit)
      let target = habit.querySelector('#goal').value || 7
      let counter = 0
      habit.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
        if(checkbox.checked) counter++
      })
      habit.counter = counter
      // writeChanges(habits)
      for(i in habits) {
        if(habits[i].habit == habit.habit) {
          habits[i].counter = counter
          console.log(habits[i])
          localStorage.setItem('habits', JSON.stringify(habitls))
        }
      }
      habit.querySelector('output').innerHTML = `${Math.ceil((counter/target)*100)}%`
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

writeChanges = data => {
  const fs = require('fs')
  fs.writeFile('data/data.json', data, err => {
    err? alert(`There was an error writing due to ${err}`): console.log(`No error writing to file`)
  })
}