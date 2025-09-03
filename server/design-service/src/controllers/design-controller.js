const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUserDesigns = async (req, res) => {
  try {
    const userId = req.user.userId;

    const designs = await prisma.design.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: designs,
    });
  } catch (e) {
    console.error("Error fetching designs", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch designs",
    });
  }
};

exports.getUserDesignsByID = async (req, res) => {
  try {
    const userId = req.user.userId;
    const designId = req.params.id;

    const design = await prisma.design.findFirst({ where: { id: designId, userId } });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found! or you don't have permission to view it.",
      });
    }

    res.status(200).json({
      success: true,
      data: design,
    });
  } catch (e) {
    console.error("Error fetching design by ID", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch design by ID",
    });
  }
};

exports.saveDesign = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { designId, name, canvasData, width, height, category } = req.body;
    if (designId) {
      const design = await prisma.design.findFirst({ where: { id: designId, userId } });
      if (!design) {
        return res.status(404).json({
          success: false,
          message: "Design not found! or you don't have permission to view it.",
        });
      }

      const updatedDesign = await prisma.design.update({
        where: { id: designId },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(canvasData !== undefined ? { canvasData } : {}),
          ...(width !== undefined ? { width } : {}),
          ...(height !== undefined ? { height } : {}),
          ...(category !== undefined ? { category } : {}),
        },
      });

      return res.status(200).json({
        success: true,
        data: updatedDesign,
      });
    } else {
      const saveDesign = await prisma.design.create({
        data: {
          userId,
          name: name || "Untitled Design",
          width,
          height,
          canvasData,
          category: category || null,
        },
      });
      return res.status(200).json({
        success: true,
        data: saveDesign,
      });
    }
  } catch (e) {
    console.error("Error while saving design", e);
    res.status(500).json({
      success: false,
      message: "Failed to save design",
    });
  }
};

exports.deleteDesign = async (req, res) => {
  try {
    const userId = req.user.userId;
    const designId = req.params.id;
    const design = await prisma.design.findFirst({ where: { id: designId, userId } });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found! or you don't have permission to delete it.",
      });
    }

    await prisma.design.delete({ where: { id: designId } });

    res.status(200).json({
      success: true,
      message: "Design deleted successfully",
    });
  } catch (e) {
    console.error("Error while deleting design", e);
    res.status(500).json({
      success: false,
      message: "Failed to delete design",
    });
  }
};
