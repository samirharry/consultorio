const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistorySchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'patient'
    },
    consutas: [{
        consulta:{
            type: Schema.Types.ObjectId,
            ref: 'consulta'
        }
    }]
})
mongoose.model('historia', HistorySchema)