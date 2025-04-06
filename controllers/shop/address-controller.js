const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }
    const newCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    await newCreatedAddress.save();
    res.status(200).json({
      success: true,
      data: newCreatedAddress,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      message: "Error Occured",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User is required",
      });
    }

    const addressList = await Address.find({ userId });
    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      message: "Error Occured",
    });
  }
};

const editAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  const { formData } = req.body;
  if (!userId || !addressId) {
    return res.status(400).json({
      success: false,
      message: "User Id & Address Id are required",
    });
  }

  const address = await Address.findOneAndUpdate(
    {
      _id: addressId,
      userId,
    },
    { formData },
    { new: true }
  );

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not Found!",
    });
  }

  res.status(200).json({
    success: true,
    data: address,
  });
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      message: "Error Occured",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User Id & Address Id are required",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not Found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Address Deleted Successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      message: "Error Occured",
    });
  }
};

module.exports = {
  addAddress,
  editAddress,
  fetchAllAddress,
  deleteAddress,
};
