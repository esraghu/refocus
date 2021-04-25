window.onload = () => {
  let today = new Date()
  let dd = today.getDay(), mm = today.getMonth()
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
