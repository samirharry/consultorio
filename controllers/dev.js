const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = mongoose.model('user')
const Patient = mongoose.model('patient')
const Consult = mongoose.model('consulta')

const departments = require('../config/ubigeo').departments


function index(req, res) {
    res.render('main/index')
}
// ====================================================
// Controlador de logeo y signup
// ===============================================
function signup(req, res) {
  res.render('pages/signup', {bg_white: true})
}
function login(req, res) {
  res.render('pages/login', {bg_white: true})
}
// ====================================================
// Registrar Nuevo Usuario
// ===============================================
function register(req, res) {
  let errors = false
  let error = {
    field: "",
    text: ""
  }
  if (!req.body.first_name) {
    error.field = "first_name"
    error.text = 'Este campo es obligatorio'
    errors = true
  } else if (!req.body.last_name) {
    error.field = "last_name"
    error.text = 'Este campo es obligatorio'
    errors = true
  } else if (!req.body.email) {
    error.field = "email"
    error.text = 'Este campo es obligatorio'
    errors = true
  } else if (req.body.password != req.body.password2) {
    error.field = "password2"
    error.text = 'Las contraseñas no coinciden'
    errors = true
  } else if (req.body.password.length < 6) {
    error.field = "password"
    error.text = 'La contraseña debe tener al menos 6 caracteres'
    errors = true
  }
  if (errors) {
    res.render('pages/signup', {
      index: true,
      error: error,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (user) {
          error.field = "email"
          error.text = {
            text: 'Usuario ya registrado'
          }
          res.render('pages/signup', {
            index: true,
            error: error,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
          })
        } else {
          const newU = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            level: 'super_admin',
          }
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newU.password, salt, (err, hash) => {
              if (err) throw err
              newU.password = hash
              User.create(newU)
                .then(user => {
                  const attU = {
                    user: user._id
                  }
                  res.redirect('/login')
                })
                .catch(err => {
                  console.log(err)
                  res.redirect('/signup')
                })
            })
          })
        }
      })
      .catch(err => {
        console.log(err)
        res.redirect('')
      })
  }
}
function publogin(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/newPatients',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
}

function logout(req, res) {
  req.logout()
  req.flash('success_msg', 'Has cerrado sesion')
  res.redirect('/login')
}

function patients(req, res) {
  Patient.find({})
    .then(patients => {
      res.render('users/patients', {
        menu: true,
        service: 'users',
        page: 'patients',
        name: req.user.first_name,
        type: req.user.level,
        patients
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}
function patientsByDoctor(req,res){
  let id = req.params.doctorID;
  Patient.find({psicologoEncarga: id})
    .then(patients => {
      res.render('users/patients', {
        menu: true,
        service: 'users',
        page: 'patients',
        name: req.user.first_name,
        type: req.user.level,
        patients
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })

}

function newPatients(req, res){
  res.render('users/newPatient', {
    menu: true,
    service: 'users',
    page: 'newPatient',
    name: req.user.first_name,
    type: req.user.level,
    departments: getDepartments()
  })
}
function createPatients(req, res){
  let body = req.body;
  let herma = body.hermanos;
  let hermanos=[];
  for(let i=0;i<body.cantHermanos;i++){
    hermanos.push({nombre: herma[i]});
  };
  let nombreHijos = body.nombreHijos;
  let ocupacionHijos = body.ocupacionHijos;
  let edadHijos = body.edadHijos;
  let hijos=[];
  for(let i=0;i<body.cantHijos;i++){
    hijos.push({nombres : nombreHijos[i], edad:edadHijos[i],ocupacion:ocupacionHijos[i]});
  };
  patient = new Patient({
    psicologoEncarga: req.user._id,
    nombres: body.nombres,
    apellidos: body.apellidos,
    edad: body.edad,
    genero: body.genero, //0: Masculino,1: Femenino,2: Otros
    fechaDeNacimiento: body.fechaDeNacimiento,
    lugarDeNacimiento: body.ubi,
    dni: body.dni,
    gradoDeInstrucion: body.gradoDeInstrucion,
    ocupacion: body.ocupacion,
    campoLaboral: body.campoLaboral,
    estadoCivil: body.estadoCivil, //0: soltero,1: casado, 2:divorciado, ...
    cantHijos: body.cantHijos,
    cantHermanos: body.cantHermanos,
    telefono: body.telefono,
    pareja:{
      nombre: body.nombrePareja,
      edad: body.edadPareja,
      ocupacion: body.ocupacionPareja,
      lugarDeNacimiento: body.ubiSpouse,
      fechaDeNacimiento: body.fechaDeNacimientoPareja,
      dni: body.dniPareja
    },
    hijos:hijos,
    domicilio: body.domicilio,
    religion: body.religion, // 0 : cristiano, 1: catolico, 2: protestante, ....
    informante: body.informante,
    dxPresuntivo: body.dxPresuntivo,
    dxDefinitivo: body.dxDefinitivo,
    padre:{
      nombre: body.nombrePadre,
      edad: body.edadPadre,
      ocupacion: body.ocupacionPadre,
    },
    madre:{
      nombre: body.nombreMadre,
      edad: body.edadMadre,
      ocupacion: body.ocupacionMadre,
    },
    hermanos:hermanos,
    historiaPersonal: {
      desarrPreYPostNatal: {
          descPreNat: body.descPreNat,
          descPostnatal: body.descPostnatal
      },
      escolaridad: body.escolaridad,
      habitosEIntereses: body.habitosEIntereses,
      desarrPsicosexual: body.desarrPsicosexual,
      historiaMedica: body.historiaMedica
    }
    });
    patient.save((err,patientDB)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      else if(!patientDB){
        return res.status(400).json({
          ok: true,
          message: 'No se creo el paciente'
        })
      }
      else{
        User.findByIdAndUpdate(req.user._id,{"$push": {pacientes: {paciente: patientDB._id}}},(error,userDB)=>{
          if(error){
            return res.status(500).json({
              ok: false,
              error
            })
          }
          else{
            return res.status(200).json({
              ok: true,
              userDB
            })
          }
        })
      }
    })
}

function newConsults(req,res){
  User.findById(req.user._id)
    .populate({
      path: "pacientes.paciente",
      model: "patient"
    })
    .exec((err,usuarioDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    else if(!usuarioDB){
      return res.status(400).json({
        ok: false,
        err
      })
    }
    else{
      res.render('users/newConsult', {
        menu: true,
        service: 'consulta',
        page: 'newConsult',
        name: req.user.first_name,
        type: req.user.level,
        pacientes: usuarioDB.pacientes
      })
    }
  })
}
function getConsultsPatient(req, res){
  let patientID=req.params.patientID;
  Patient.findById(patientID)
    .populate({
      path: 'consultas.consulta',
      model: 'consulta'
    })
    .exec((err,patientDB)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      else if(! patientDB){
        return res.status(400).json({
          ok: false,
          message: 'no hay paciente'
        })
      }
      else {
        res.render('patient/consulta', {
          menu: true,
          service: 'patient',
          page: 'consulta',
          name: req.user.first_name,
          type: req.user.level,
          consultas: patientDB.consultas
        })
        /* res.json({
          ok: true,
          patientDB
        }) */
      }
    })

}

function createConsults(req,res){
  let body = req.body;
  let tipoPrueba = body.tipoPrueba;
  let resultadoPrueba = body.resultadoPrueba;
  let pruebas=[];
  for(let i=0;i<tipoPrueba.length;i++){
    pruebas.push({tipo : tipoPrueba[i], resultado:resultadoPrueba[i] });
  };
  consulta = new Consult({
  paciente: body.paciente,
  doctor: req.user._id,
  motivoConsulta: body.motivoConsulta,
  observYExamClinico:{
      aspectoGeneral : body.aspectoGeneral,
      actitudHaciaExaminador : body.actitudHaciaExaminador,
      examProceCognit:{
          concYOrientac: body.concYOrientac,
          percepcion : body.percepcion,
          atencion: body.atencion,
          memoria: body.memoria,
          pensamiento: body.pensamiento,
          lenguaje: body.lenguaje,
          inteligEmocional: body.inteligEmocional,
      }
  },
  exploEsferAfect: body.exploEsferAfect,
  observaciones: body.observaciones,
  dinamicaFamiliar: body.dinamicaFamiliar,
  Pruebas: pruebas,
  resumen: body.resumen,
  pronostico : body.pronostico, //0: Favorable,1: Desfavorable, 2: Reservado
  tratamientoPsico: body.tratamientoPsico,
  laborRealiz: body.laborRealiz,
  logrosAlcan: body.logrosAlcan
  });
  consulta.save((err,consultDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    else if(!consultDB){
      return res.status(400).json({
        ok: true,
        message: 'No se creo la consulta'
      })
    }
    else{
      Patient.findByIdAndUpdate(consultDB.paciente,{"$push": {consultas: {consulta: consultDB._id}}},(error,patientDB)=>{
        if(error){
          return res.status(500).json({
            ok: false,
            error
          })
        }
        else{
          return res.status(200).json({
            ok: true,
            patientDB
          })
        }
      })
    }
  })
}

function getPatient(req,res){
  let id = req.params.patientID;
  Patient.findById(id)
    .exec((err,pacienteDB)=>{
      if(err){
        res.status(500).json({
          ok: false,
          err
        })
      }
      else if(!pacienteDB){
        res.status(500).json({
            ok: false,
            err
          })
      }
      else {
        res.render('patient/patient', {
          menu:true,
          name: req.user.first_name,
          type: req.user.level,
          pacienteDB
        })
      }
      }
    )
}
function getConsultDetail (req,res){
  let consID = req.params.consultID;
  Consult.findById(consID)
  .populate({
    path: 'paciente',
    model: 'patient'
  })
  .populate({
    path: 'doctor',
    model: 'user'
  })
  .exec((err,consultDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    else if(!consultDB){
      return res.status(400).json({
        ok: false,
        err
      })
    }
    else {
      res.render('patient/consultaDetalle', {
        menu:true,
        name: req.user.first_name,
        type: req.user.level,
        consultDB
      })
    }
    }
  )
}

function deletePatient(req,res){
  let pacientID = req.params.patientID;
  Patient.findByIdAndRemove(pacientID,((err,patientDB)=>{
      if(err) return res.status(500).json({
        ok: false,
        message: 'No se pudo borrar'
      })
      else if(!patientDB){
        return res.status(400).json({
          ok: false,
          message: 'No se pudo borrar'
        })
      }
      else {
        User.findByIdAndUpdate(req.user._id,{"$pull": {pacientes: {paciente: patientDB._id}}},(error,userDB)=>{
          if(error) return res.status(500).json({
            ok: false,
            message: 'No se pudo borrar'
          })
          else if(!userDB){
            return res.status(400).json({
              ok: false,
              message: 'No se pudo borrar'
            })
          }
          else{
            res.json({
              ok: true
            })
          }
        })
      }
    })
  )
}
function getDepartments() {
  let data = []
  departments.forEach(department => {
    if (!data.includes(department.department)) {
      data.push(department.department)
    }
  })
  return data
}

function getProvinces(req, res) {
  let data = []
  departments.forEach(department => {
    if (department.department == req.params.department) {
      if (!data.includes(department.province)) {
        data.push(department.province)
      }
    }
  })
  res.send(data)
}

function getDistricts(req, res) {
  let data = []
  departments.forEach(department => {
    if (department.province == req.params.province) {
      if (!data.includes(department.district)) {
        data.push(department.district)
      }
    }
  })
  res.send(data)
}

module.exports = {
  index,
  signup,
  login,
  logout,
  register,
  publogin,
  patients,
  patientsByDoctor,
  newPatients,
  createPatients,
  deletePatient,
  newConsults,
  createConsults,
  getConsultsPatient,
  getConsultDetail,
  getDepartments,
  getProvinces,
  getDistricts,
  getPatient
}