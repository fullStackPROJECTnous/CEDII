// materielBureauController.js
exports.getAllMateriels = async (req, res) => {
    try {
        const materiels = await MaterielBureau.findAll();
        res.json(materiels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMateriel = async (req, res) => {
    try {
        const materiel = await MaterielBureau.create(req.body);
        res.status(201).json(materiel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};