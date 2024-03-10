const express = require('express');
const multer = require('multer');
const csvController = require('../controllers/csvController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Directorio donde se guardarán los archivos CSV temporalmente

// Ruta para cargar el archivo CSV y procesarlo
router.post('/upload', upload.single('csvFile'), csvController.uploadCSV);
router.get('/lastEntry', csvController.getLastEntry);

module.exports = router;
