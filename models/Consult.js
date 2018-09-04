const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConsultSchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'patient'
    },
    doctor:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    motivoConsulta: String,
    observYExamClinico:{
        aspectoGeneral : String,
        actitudHaciaExaminador : String,
        examProceCognit:{
            concYOrientac: String,
            percepcion : String,
            atencion: String,
            memoria: String,
            pensamiento: String,
            lenguaje: String,
            inteligEmocional: String,
        }
    },
    exploEsferAfect: String,
    observaciones: String,
    dinamicaFamiliar: String,
    Pruebas:[{
        tipo: String,
        resultado:String,
    }],
    resumen: String,
    pronostico : String,
    tratamientoPsico: String,
    laborRealiz: String,
    logrosAlcan: String,
    fecha:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('consulta', ConsultSchema)