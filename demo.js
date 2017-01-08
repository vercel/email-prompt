require('./build')()
.then(email => {
  console.log('\n> Thanks ' + email)
})
.catch(() => {
  console.log('\n> Aborted! Bye')
})
