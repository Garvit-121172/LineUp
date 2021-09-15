//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://gk_admin:test123@cluster0.8ro8q.mongodb.net/taskdb",{ useNewUrlParser: true,useUnifiedTopology: true });

const taskSchema= mongoose.Schema({
  name:{
    required:true,
    type:String
  }
});
const listSchema={
  name:String,
  list:[taskSchema]
};

const List =mongoose.model("List",listSchema);
const Task =mongoose.model("Task",taskSchema);

app.get("/", function(req, res) {
  var alltasks=[];
  const day = date.getDate();
  Task.find({},function(err,foundtasks){
    if(err)
    console.log(err);
    else
    res.render("list", {listTitle: "Today", newListItems:foundtasks});
  })

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const ListName=req.body.list;
  
  const item =new Task({
    name:itemName
  });
  if(ListName==="Today")
  {
  item.save();
  res.redirect("/");
  } 
  else
  {   List.findOne({name:ListName},function(err,res1){
      if(err)
       console.log(err);
      else
      { res1.list.push(item);
        //console.log(res1);
        res1.save();
        res.redirect("/"+ListName);   
      }
    })
  }
});
app.post("/delete",function(req,res){
  var todelid=req.body.checkbox;
  Task.deleteOne({_id:todelid},function(err){
    if(err)
    console.log(err);
  });
  res.redirect("/");
})
app.post("/delete/:some",function(req,res){
   var todelpage=req.params.some;
   var todelid=req.body.checkbox;
  
   
   List.findOne({name:todelpage},function(err,wapis){
     console.log(wapis);
     var pos=1;
    for(i=0;i<wapis.list.length;i++)
    {
      if(wapis.list[i]._id==todelid)
      { pos=i;
        break;
      }
    }
    wapis.list.splice(pos,1);  
    wapis.save();
    
    });
    res.redirect("/"+todelpage);
  });
var arr=[];
app.get("/:variable",function(req,res){
  var page=req.params.variable;
  List.findOne({name:page},function(err,res1){
    if(err)
    console.log(err);
    else
    {
      if(res1)
      { res.render("list",{listTitle:page,newListItems:res1.list});
         
      }
      else
      { var l= new List({
         name:page,
         list:arr
        });
        l.save();
        res.render("list",{listTitle:l.name,newListItems:l.list})
      }
    }
    
  });
});
// app.post("/:something",function(req,res){
//  console.log(req.params.something);
//   console.log()
// })
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
