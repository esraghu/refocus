window.onload = () => {
  const h1 = document.querySelector('h1')
  h1.innerHTML += getWeek()
  setTheDates() // set the dates of this week based on todays date
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
    let sequence = typeof(habits[i].sequence) != 'undefined'? habits[i].sequence : new Array(7).fill(0)
    const elements = `<td><input type="checkbox" ${sequence[0]? 'checked': ''}></td>
    <td><input type="checkbox" ${sequence[1]? 'checked': ''}></td>
    <td><input type="checkbox" ${sequence[2]? 'checked': ''}></td>
    <td><input type="checkbox" ${sequence[3]? 'checked': ''}></td>
    <td><input type="checkbox" ${sequence[4]? 'checked': ''}></td>
    <td><input type="checkbox" ${sequence[5]? 'checked': ''}></td>
    <td><input type="checkbox" ${sequence[6]? 'checked': ''}></td>
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
      let sequence = new Array(7).fill(0)
      const checkboxes = habit.querySelectorAll('input[type=checkbox]')
      for(idx in checkboxes) {
        if(checkboxes[idx].checked) {
          sequence[idx] = 1
          counter++
        }
      }
      habit.counter = counter

      // write changes to the local storage
      for(i in habits) {
        if(habits[i].habit == habit.id) {
          habits[i].counter = counter
          habits[i].sequence = sequence
          console.log(habits[i])
          localStorage.setItem('habits', JSON.stringify(habits))
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

getWeek = (day = new Date()) => {
  const Jan1st = new Date(day.getFullYear(), 0, 1)
  let numberOfDays = Math.floor((day - Jan1st)/(24*60*60*1000))
  return Math.ceil((day.getDay() + 1 + numberOfDays)/7)
}
