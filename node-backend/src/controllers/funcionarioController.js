const funcionariosService = require('../services/funcionariosService');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');
const Funcionario = require('../models/funcionario');


exports.addFuncionario = async (req, res) => {
  try { 
    let fotoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fotoUrl = result.secure_url;
      fs.unlinkSync(req.file.path); 

    }
    const data = new Funcionario({...req.body, fotoUrl});
    const result = await funcionariosService.addFuncionario({...data});
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getFuncionarios = async (req, res) => {
  try {
    const funcionarios = await funcionariosService.getFuncionarios();
    res.status(200).json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFuncionario = async (req, res) => {
  try { 
    const { id } = req.params;
     let fotoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fotoUrl = result.secure_url;
      fs.unlinkSync(req.file.path); 

    }
    const data = new Funcionario({...req.body, fotoUrl});
    const plainData = data.toPlainObject();
    const updatedFuncionario = await funcionariosService.updateFuncionario(id, plainData);
    res.status(200).json(updatedFuncionario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteFuncionario = async (req, res) => {
  try { 
    const deletedFuncionario = await funcionariosService.deleteFuncionario(req.params.id);
    res.status(200).json(deletedFuncionario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


