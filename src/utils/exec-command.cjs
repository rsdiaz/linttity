const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec)

const execCommand = async (command) => {
  const { stdout } = await exec(command)
  console.log(stdout)
}

module.exports = execCommand
