const path = require('path')
require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express()
//// security
const cors = require('cors')
const ratelimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')

//// security
app.use(helmet())
app.use(xss())
app.use(ratelimit())

app.use(cors())
app.options(cors())

///// routes import 
const userRoute = require('./routes/auth')
const exerciseRoute = require('./routes/exercise')  

/// swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')



const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended:false}))

/// default route
app.get('/',(req,res) =>
 res.send('<h2>Hi, this is my Exercise API. If want to test and know more info here :</h2><a href="/api-docs">Eercise API Documentation</a>'))

app.use('/api-api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocument))

//// middleware   import
const NotFound = require('./middleware/notfound')
const errorHandlerMiddleware = require('./middleware/errorhandler')
const authenticationMiddleware = require('./middleware/authentication')



//// db
const connectDB = require('./db/connect');


//// routes
app.use('/api/v1/auth',userRoute);

app.use('/api/v1/exercise',authenticationMiddleware,exerciseRoute);  



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));    
  })


// use middleware
app.use(NotFound)
app.use(errorHandlerMiddleware)

const start = async () =>{
    try{
      await connectDB(process.env.MONGO_URI)
      app.listen(port, ()=>{
          console.log(`server listening the port no : ${port}`)
      
      })
  }catch(err){
      console.log(err)
  }
}
 
start();
//// npm run start
