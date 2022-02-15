//router level middleware


const { Router } = require("express");
const router = Router();
const multer = require("multer");
const EMPLOYEE_SCHEMA=require("../Model/Employee");
const ensureAuthenticated = require("../helper/auth_helper");


//load multer middlwware
let { storage } = require("../middlewares/multer");
const upload = multer({ storage: storage });

/*@ GET METHOD
  @ ACCESS PUBLIC 
  @URL employee/home
   */

router.get("/home", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.find({}).lean();
  
  res.render("../views/home", { title: "Home Page" , payload });
});


router.get("/create-emp", (req, res) => {
  res.render("../views/employees/create-emp", { title: "Create employee" });
});

router.get("/:id", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/employeeProfile", { payload });
});


/*@ HTTP GET METHOD
  @ ACCESS PUBLIC
  @URL employee/edit-emp
   */

router.get("/edit-emp/:id", async (req, res) => {
  let editPayload =  await EMPLOYEE_SCHEMA.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/editEmp", { editPayload });
});
  


/*@ HTTP POST METHOD
  @ ACCESS PRIVATE
  @URL employee/create-emp
   */
router.post("/create-emp", upload.single("emp_photo"), async (req, res) => {
  let {
    emp_id,
    emp_name,
    emp_salary,
    emp_edu,
    emp_exp,
    emp_location,
    emp_des,
    emp_email,
    emp_phone,
    emp_skills,
    emp_gender,
  } = req.body;
  
  let payload = {
    emp_photo: req.file,
    emp_id,
    emp_name,
    emp_salary,
    emp_edu,
    emp_exp,
    emp_location,
    emp_des,
    emp_email,
    emp_phone,
    emp_skills,
    emp_gender


  };
  //save all data to database
  let body = await EMPLOYEE_SCHEMA.create(payload);
  req.flash("SUCCESS_MESSAGE", "successfully employee created");
  res.redirect("/employee/home", 302, { body });
});

//put request
  router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
    EMPLOYEE_SCHEMA.findOne({ _id: req.params.id })
      .then(editEmp => {
        
        (editEmp.emp_photo = req.file),
          (editEmp.emp_id = req.body.emp_id),
          (editEmp.emp_name = req.body.emp_name),
          (editEmp.emp_salary = req.body.emp_salary),
          (editEmp.emp_edu = req.body.emp_edu),
          (editEmp.emp_exp = req.body.emp_exp),
          (editEmp.emp_email = req.body.emp_email),
          (editEmp.emp_phone = req.body.emp_phone),
          (editEmp.emp_gender = req.body.emp_gender),
          (editEmp.emp_des = req.body.emp_des),
          (editEmp.emp_skills = req.body.emp_skills),
          (editEmp.emp_location = req.body.emp_location),

          //To update data in database
          editEmp.save().then(_ => {
            req.flash("SUCCESS_MESSAGE", "successfully employee updated");
            res.redirect("/employee/home", 302, {});
          });
        
      }).catch(err => {
        console.log(err);
        req.flash("Error_Mesage", "something went wrong");
      });
    
  });
  
//To delete request
  
router.delete("/delete-emp/:id", async (req, res) => {
  await EMPLOYEE_SCHEMA.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "successfully employee deleted");
  res.redirect("/employee/home", 302, {});
});

module.exports = router;
