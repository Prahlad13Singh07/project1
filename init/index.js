const mongoose= require('mongoose');
const initData=require("./data.js");
const listing=require("../Models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
};

main()
.then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log(err);
});
 
const initDb=async()=>{
    await listing.deleteMany({});
    console.log("deleted all listings");
    initData.data=initData.data.map((obj)=>({...obj,owner:'687ee0d735bb9c3e28832379'}));
    await listing.insertMany(initData.data);
    console.log("inserted data into db");
    console.log("initialized data all done");
};
initDb();