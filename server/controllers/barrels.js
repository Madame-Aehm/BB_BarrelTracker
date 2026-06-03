export function createBarrelControllers({ barrelService }) {
  const getBarrel = async (req, res) => {
    const barrel = await barrelService.getBarrel({
      id: req.query.id,
      number: req.query.number,
      includeHistory: req.query.history,
    });
    res.status(200).json(barrel);
  };

  const sendBarrel = async (req, res) => {
    const result = await barrelService.sendBarrel(req.body.id, req.body.sendTo);
    res.status(200).json(result);
  };

  const returnBarrel = async (req, res) => {
    const result = await barrelService.returnBarrel(req.body.id, req.body.open);
    res.status(200).json(result);
  };

  const reviewDamageRequest = async (req, res) => {
    const { id, open, response, damaged } = req.body;
    const result = await barrelService.reviewDamageRequest(id, open, response, damaged);
    res.status(200).json(result);
  };

  const requestDamageReview = async (req, res) => {
    const { id, comments } = req.body;
    const result = await barrelService.requestDamageReview(id, comments, req.files);
    res.status(200).json(result);
  };

  const addBarrels = async (req, res) => {
    const count = Number(req.body.number);
    const result = await barrelService.addBarrels(count);
    res.status(201).json(result);
  };

  const manageAll = async (_, res) => {
    const barrels = await barrelService.manageAll();
    res.status(200).json(barrels);
  };

  const getAllBarrelIDS = async (_, res) => {
    const ids = await barrelService.getAllLabelIds();
    res.status(200).json(ids);
  };

  const getSingleID = async (req, res) => {
    const number = Number(req.params.number);
    const barrels = await barrelService.getLabelByNumber(number);
    res.status(200).json(barrels);
  };

  const updateBarrel = async (req, res) => {
    const barrel = await barrelService.updateBarrel(req.body.edits, req.files);
    res.status(200).json(barrel);
  };

  const updateHistory = async (req, res) => {
    const historyEntry = await barrelService.updateHistory(
      req.body.barrel_id,
      req.body.edits,
      req.files
    );
    res.status(200).json(historyEntry);
  };

  return {
    getBarrel,
    sendBarrel,
    returnBarrel,
    reviewDamageRequest,
    requestDamageReview,
    addBarrels,
    manageAll,
    getAllBarrelIDS,
    getSingleID,
    updateBarrel,
    updateHistory,
  };
}
