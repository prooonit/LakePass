import * as boatService from "../services/boat.service.js";

export const createBoat = async (req, res, next) => {
  try {
    const boat = await boatService.createBoat(
      req.marina.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: boat,
    });
  } catch (error) {
    next(error);
  }
};

export const getMarinaBoats = async (req, res, next) => {
  try {
    const boats = await boatService.getMarinaBoats(
      req.marina.id
    );

    res.json({
      success: true,
      data: boats,
    });
  } catch (error) {
    next(error);
  }
};

export const getBoatById = async (req, res, next) => {
  try {
    const boat = await boatService.getBoatById(
      req.params.boatId,
      req.marina.id
    );

    res.json({
      success: true,
      data: boat,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBoat = async (req, res, next) => {
  try {
    const boat = await boatService.updateBoat(
      req.params.boatId,
      req.marina.id,
      req.body
    );

    res.json({
      success: true,
      data: boat,
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateBoat = async (req, res, next) => {
  try {
    const boat = await boatService.deactivateBoat(
      req.params.boatId,
      req.marina.id
    );

    res.json({
      success: true,
      message: "Boat deactivated successfully",
      data: boat,
    });
  } catch (error) {
    next(error);
  }
};

export const searchBoats = async (req, res, next) => {
  try {
    const boats = await boatService.searchBoats(req.query);

    res.json({
      success: true,
      data: boats,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllBoats = async (req,res,next) => {
  try {
    const boats =
      await boatService.getAllBoats();

    res.status(200).json({
      success: true,
      data: boats,
    });
  } catch (error) {
    next(error);
  }
};

export const getBoatDetails = async (req,res,next) => {
  try {
    const boat =
      await boatService.getBoatDetails(
        req.params.boatId
      );

    res.status(200).json({
      success: true,
      data: boat,
    });
  } catch (error) {
    next(error);
  }
};