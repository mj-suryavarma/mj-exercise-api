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


app.use(helmet())
app.use(xss())
app.use(ratelimit())

app.use(cors())
app.options(cors())
/// default route
app.get('/',(req,res) => res.json({msg: "hello world from backend"}))

const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended:false}))



//// middleware   import
const NotFound = require('./middleware/notfound')
const errorHandlerMiddleware = require('./middleware/errorhandler')
const authenticationMiddleware = require('./middleware/authentication')

///// routes import 
const userRoute = require('./routes/auth')
const exerciseRoute = require('./routes/exercise')  


//// db
const connectDB = require('./db/connect');


//// routes
app.use('/api/v1/auth',userRoute);

app.use('/api/v1/exercise',authenticationMiddleware,exerciseRoute);  






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
