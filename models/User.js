const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  dni: Number,
  email: String,
  password: String,
  level: String, // super_admin, psicologo
  pacientes:[{
    paciente:{
      type: Schema.Types.ObjectId,
      ref: ' patient'
    }
  }]
})

mongoose.model('user', UserSchema)
