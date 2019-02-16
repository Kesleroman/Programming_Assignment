const https = require('https')
const fs = require ('fs')
const nodemailer = require('nodemailer');

const myMail = 'slonsky.roman@gmail.com'

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

function chuckSaysJoke(){
  getTheJoke()

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

function start(){

  console.log('Hello. This app allows you to get jokes exactly from Chuck Norris and' +
              'send jokes to your friends\' emails. Type \'help\' to see commands.')

  readline.on('line', (line) => {
    switch(line){
      case 'help':
        console.log('joke - Chuck generates a joke and says it to standard output.'+
                    'exit - stops the program.')
        break
      case 'joke':
         joke = chuckSaysJoke()
         console.log(joke)
         break
      case 'exit':
        exit()
      default:
        console.log('%s is an unknown command.', line)
    }
  });

  //sendEmail(joke)
  //process.exit()
}

start()
