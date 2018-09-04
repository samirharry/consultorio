const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PatientSchema = new Schema({
  psicologoEncarga: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  nombres: String,
  apellidos: String,
  edad: Number,
  genero: String,
  fechaDeNacimiento: Date,
  lugarDeNacimiento: String,
  dni: Number,
  gradoDeInstrucion: String,
  ocupacion: String,
  campoLaboral: String,
  estadoCivil: String,
  cantHijos: Number,
  cantHermanos: Number,
  telefono: String,
  pareja:{
    nombre: String,
    edad: Number,
    ocupacion: String,
    lugarDeNacimiento: String,
    fechaDeNacimiento: Date,
    dni: Number
  },
  hijos:[{
      nombres: String,
      edad: Number,
      ocupacion: String
  }],
  domicilio: String,
  religion: String,
  informante: String,
  dxPresuntivo: String,
  dxDefinitivo: String,
  padre:{
    nombre: String,
    edad: String,
    ocupacion: String,
  },
  madre:{
    nombre: String,
    edad: String,
    ocupacion: String,
  },
  hermanos:[{
      nombre: String
  }],
  historiaPersonal: {
    desarrPreYPostNatal: {
        descPreNat: String,
        descPostnatal: String
    },
    escolaridad: String,
    habitosEIntereses: String,
    desarrPsicosexual: String,
    historiaMedica: String
  },
  consultas:[{
    consulta:{
      type: Schema.Types.ObjectId,
      ref: 'consulta'
    }}]
})
mongoose.model('patient', PatientSchema)