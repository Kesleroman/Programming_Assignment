const http = require('http');
const https = require('https')
const fs = require ('fs')

const options = {
  hostname: 'api.chucknorris.io',
  port: 443,
  path: '/jokes/random',
  method: 'GET'
}

//Streams
const Stream = require('stream')
const readStream = new Stream.Readable()
const writeStream = new Stream.Writable()

readStream._read = () => {} // _read() must be implemented

writeStream._write = (chunk, encoding, next) => {
    console.log(chunk.toString())
    next()
}

// module for input/output
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

//const Chuck = 'https://api.chucknorris.io/jokes/random'
const getTheJoke = () => {
  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      fs.writeFile('/tmp/joke.json', d, (err) => {
        if(err) { console.error(err); return; };
      })
      //process.stdout.write(d)
    })
  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.end()
}
const chuckSaysJoke = async () => {
  getTheJoke()

  

  return joke
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);

  //readline.question(`What's your name?`, asynch (name) => {
    //console.log(name)

    //readline.close(name)
  //})

  joke = chuckSaysJoke()

  //console.log('The joke is ' + joke)
});
