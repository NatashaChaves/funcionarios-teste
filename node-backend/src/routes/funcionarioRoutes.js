const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');

const upload = multer({dest: 'temp/'});

router.use(verifyToken); 
router.get('/', verifyToken, funcionarioController.getFuncionarios);
router.post('/', verifyToken, upload.single('foto'), funcionarioController.addFuncionario);
router.put('/:id', verifyToken, upload.single('foto'), funcionarioController.updateFuncionario);
router.delete('/:id', verifyToken, funcionarioController.deleteFuncionario);

module.exports = router;
