const https = require('https')
const fs = require ('fs')                 // Working with files
const nodemailer = require('nodemailer'); // Sending emails

const myMail = 'slonsky.roman@gmail.com'
const emailFile = './listOfEmails'

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: myMail,
    pass: ''
  }
})

// module for input/output
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const jokeSource = {
  hostname: 'api.chucknorris.io',
  port: 443,
  path: '/jokes/random',
  method: 'GET'
}

function getTheJoke() {
  const req = https.request(jokeSource, (res) => {
    res.on('data', (d) => {
      fs.writeFile('/tmp/joke.json', d, (err) => {
        if(err) { console.error(err); return }
      })
    })
  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.end()
}

async function chuckSaysJoke(){
  await getTheJoke()

  const data = fs.readFileSync('/tmp/joke.json')
  const obj = JSON.parse(data)
  const joke = obj.value

  return joke
}

function sendEmail(data){

  var mailOptions = {
    from: myMail,
    to: myMail,
    subject: 'Sending Email using Node.js',
    text: data
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}

function printOutEmailList(){
  try {
    data = fs.readFileSync(emailFile)
    if (data.length == 0)
      console.log('File is empty.')
    else
      console.log(data.toString())
  } catch (err) {
      console.log('File does not exist.')
      console.error(err)
  }
}

function addEmail(){
  readline.question(`Enter an email of your friend: `, (email) => {
    fs.writeFileSync(emailFile, email + '\n', {encoding : 'utf8',
				               mode: 0o666,
                                               flag: 'a'})
  })
}

async function start(){

  console.log('Hello. This app allows you to get jokes exactly from Chuck Norris and\n' +
              'send jokes to your friends\' emails. Type \'help\' to see commands.')

  readline.on('line', async (line) => {
    switch (line.toLowerCase()){
      case 'help':
        console.log('joke - Chuck generates a joke and says it to standard output.\n'+
                    'emails - prints a list of your friends.\n' +
		    'add email - adds email to a list.\n' +
                    'exit - stops the program.')
        break
      case 'joke':
        joke = await chuckSaysJoke()
        console.log('Chuck says: ' + joke)
        break
      case 'emails':
	printOutEmailList()
        break
      case 'add email':
	addEmail()
	break
      case 'exit':
        process.exit()
      default:
        console.log('%s is an unknown command.', line)
    }
  })
}

start()
