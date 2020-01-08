const cp = require('child_process')

module.exports = Exec

function Exec (command, options = { log: false, cwd: process.cwd() }) {
  if (options.log) console.log(command)

  return new Promise((done, failed) => {
    cp.exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout
        err.stderr = stderr
        failed(err)
        return
      }

      done({ stdout, stderr })
    })
  })
}
