const express = require('express');
const dev = express.Router();
const {
    ensureGuest,
    ensureAuthenticated
} = require('../helpers/dev_auth');
const devController = require('../controllers/dev');
// ====================================================
// Rutas de logeo,signup y logout
// ===============================================
dev.get('/', ensureGuest, function(req, res) {
    res.redirect('/login');
  });
dev.get('/signup', ensureGuest, devController.signup);
dev.get('/login', ensureGuest, devController.login);
dev.post('/signup', devController.register);
dev.post('/login', devController.publogin);
dev.get('/logout',devController.logout);

// ====================================================
// Manejo de Pacientes Visualizacion y creacion
// ====================================================
dev.get('/patients', ensureAuthenticated, devController.patients);
dev.get('/patient/:patientID', ensureAuthenticated, devController.getPatient);
dev.delete('/patients/:patientID', ensureAuthenticated, devController.deletePatient);
dev.get('/newPatients', ensureAuthenticated, devController.newPatients);
dev.post('/newPatients', ensureAuthenticated, devController.createPatients);
dev.get('/patients/:doctorID', ensureAuthenticated, devController.patientsByDoctor);
// ====================================================
// Manejo de Consultas Visualizacion y creacion
// ====================================================
dev.get('/newConsults', ensureAuthenticated, devController.newConsults);
dev.post('/newConsults', ensureAuthenticated, devController.createConsults);
dev.get('/consult/:patientID', ensureAuthenticated, devController.getConsultsPatient)
dev.get('/consultDetail/:consultID', ensureAuthenticated, devController.getConsultDetail)
// ====================================================
// Ubigeo de Perú
// ====================================================
dev.get('/departments', devController.getDepartments);
dev.get('/provinces/:department', devController.getProvinces);
dev.get('/districts/:province', devController.getDistricts);


module.exports = dev