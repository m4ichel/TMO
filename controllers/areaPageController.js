const areaModel = require('../models/areaModel');

const showAreaPage = async (req, res) => {
  const areaId = req.params.id;
  try {
    const area = await areaModel.getAreaById(areaId);
    if (!area) {
      return res.status(404).send('Area not found');
    }
    res.render('area', { area });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving area');
  }
};

module.exports = {
  showAreaPage
};