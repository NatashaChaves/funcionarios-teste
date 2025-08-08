const { db } = require('../services/firebaseService');
const Funcionario = require('../models/funcionario');
const collection = db.collection('funcionarios');

async function addFuncionario(data) {
    try {
        const querySnapshot = await collection.where('cpf', '==', data.cpf).get();

        if (!querySnapshot.empty) {
            throw new Error('Já existe um funcionário cadastrado com este CPF.');
        }
        const docRef = await collection.add(data);
        return { id: docRef.id, ...data };
    } catch (error) {
        throw new Error('Erro ao adicionar funcionário: ' + error.message);
    }
};

async function getFuncionarios() {
    try {
        const list = await collection.get();
        return list.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new Error('Erro ao obter funcionários: ' + error.message);
    }
};


async function updateFuncionario(id, data) {
    try {
        await collection.doc(id).update(data);
        return { id, ...data };
    } catch (error) {
        throw new Error('Erro ao atualizar funcionário: ' + error.message);
    }
};

async function deleteFuncionario(id) {
    try {
        await collection.doc(id).delete();
        return { id };
    } catch (error) {
        throw new Error('Erro ao deletar funcionário: ' + error.message);
    }
};

module.exports = {
    addFuncionario,
    getFuncionarios,
    updateFuncionario,
    deleteFuncionario
};
