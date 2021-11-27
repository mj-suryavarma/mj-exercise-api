const path = require('path')
require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express()
//// security
const cors = require('cors')
app.use(cors())
app.options(cors())
/// default route
app.get('/app',(req,res) => res.json({msg: "hello world from backend"}))

/// static file
app.use(express.static(path.resolve(__dirname,'../client/build')))

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


const port = process.env.PORT || 5000


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
