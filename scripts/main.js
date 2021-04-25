window.onload = () => {
  setDate() // set the dates of this week based on todays date
  readHabits() // read the saved habits from the file
}

readHabits = () => {
  fetch('data/data.json')
    .then(rsp => {
      return rsp.json()
    })
    .then(habits => {
      const table = document.querySelector('table')
      for(const habit of habits) {
        console.log(habit)
        const row = table.insertRow()
        row.className = "habit"
        row.id = habit.habit
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
        hName.innerHTML = habit.habit
        goal.innerHTML = `<input type="number" min="1" max="7" id="goal" value=${habit.goal}>`
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
          habit.querySelector('output').innerHTML = `${Math.ceil((counter/target)*100)}%`
        })
      });
    })
    .catch(err => {
      console.log(err)
    })
}

setDate = () => {
  let today = new Date()
  let dd = today.getDay(), mm = eval(today.getMonth() + 1)
  let days = document.querySelector('.heading')
  days.querySelectorAll('.days').forEach(day => {
    dd = today.getDay()
    switch(day.id) {
      default : break
      case 'Sun' : 
        dd = eval(today.getDate() - dd)
        break;
      case 'Mon' :
        dd = eval(today.getDate() - dd + 1)
        break;
      case 'Tue' :
        dd = eval(today.getDate() - dd + 2)
        break;
      case 'Wed' :
        dd = eval(today.getDate() - dd + 3)
        break;
      case 'Thu' :
        dd = eval(today.getDate() - dd + 4)
        break;
      case 'Fri' :
        dd = eval(today.getDate() - dd + 5)
        break;
      case 'Sat' :
        dd = eval(today.getDate() - dd + 6)
        break;
    }
    day.innerHTML = `${dd}/${mm}`
  })
}
