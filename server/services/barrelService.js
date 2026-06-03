import localDate from "../utils/localDate.js";
import { badRequest, notFound } from "../errors/AppError.js";

const parseEdits = (raw) => {
  if (!raw) throw badRequest("Missing edits");
  try {
    return JSON.parse(raw);
  } catch {
    throw badRequest("Invalid edits JSON");
  }
};

export default class BarrelService {
  constructor({ barrelRepository, cloudinaryService, emailService }) {
    this.barrelRepository = barrelRepository;
    this.cloudinaryService = cloudinaryService;
    this.emailService = emailService;
  }

  async getBarrel({ id, number, includeHistory }) {
    if (!id && !number) throw badRequest("Need identifier");
    const projection = includeHistory ? "" : "-history";
    if (id) {
      const barrel = await this.barrelRepository.findById(id, projection);
      if (!barrel) throw notFound(`No barrel with ID: ${id}`);
      return barrel;
    }
    const barrel = await this.barrelRepository.findByNumber(number, projection);
    if (!barrel) throw notFound(`No barrel with Number: ${number}`);
    return barrel;
  }

  async sendBarrel(id, sendTo) {
    if (!id || !sendTo) throw badRequest("Missing fields");
    const barrel = await this.barrelRepository.setOpen(id, sendTo);
    if (!barrel) throw notFound(`No barrel with ID: ${id}`);
    return { message: `Barrel successfully sent to ${sendTo.customer}` };
  }

  async returnBarrel(id, open) {
    if (!id || !open) throw badRequest("Missing fields");
    const openEntry = { ...open, returned: localDate(new Date()) };
    const barrel = await this.barrelRepository.returnBarrel(id, openEntry);
    if (!barrel) throw notFound(`No barrel with ID: ${id}`);
    return { message: "Barrel marked as returned." };
  }

  async reviewDamageRequest(id, open, response, damaged) {
    if (!id || !open || typeof damaged !== "boolean") throw badRequest("Missing fields");
    const trackDamage = {
      ...open.damage_review,
      closed: localDate(new Date()),
    };
    if (response) trackDamage.response = response;
    const openEntry = { ...open, damage_review: trackDamage };
    const barrel = await this.barrelRepository.reviewDamage(id, openEntry, damaged);
    if (!barrel) throw notFound(`No barrel with ID: ${id}`);
    return {
      message: `Barrel ${barrel.number} successfully marked as ${damaged ? "" : "not"} damaged`,
    };
  }

  async requestDamageReview(id, comments, files) {
    if (!id) throw badRequest("Need ID");
    const damage_review = {};
    if (comments) damage_review.comments = comments;

    let relevantFields;
    if (files?.length) {
      relevantFields = await this.cloudinaryService.uploadFiles(files);
      damage_review.images = relevantFields;
    }

    const barrel = await this.barrelRepository.requestDamageReview(
      id,
      damage_review,
      localDate(new Date())
    );
    if (!barrel) throw notFound(`No barrel with ID: ${id}`);

    const emailSent = await this.emailService.sendDamageReviewEmail(
      barrel,
      comments,
      relevantFields
    );
    return {
      message: `Barrel submitted for damage review. ${emailSent ? "An email has been sent to Pablo." : "Email couldn't send - please inform Pablo."}`,
    };
  }

  async addBarrels(count) {
    if (!count) throw badRequest("Need to know how many...");
    const maxNumber = await this.barrelRepository.findMaxNumber();
    const offset = maxNumber ? maxNumber + 1 : 1;
    await this.barrelRepository.createMany(count, offset);
    return {
      message: `${count} new barrel${count === 1 ? "" : "s"} successfully added`,
    };
  }

  async manageAll() {
    return this.barrelRepository.findAllSummary();
  }

  async getAllLabelIds() {
    return this.barrelRepository.findLabelIds();
  }

  async getLabelByNumber(number) {
    if (!number) throw badRequest("Need Barrel Number");
    const barrel = await this.barrelRepository.findByNumber(number, "_id number");
    if (!barrel) throw notFound(`No barrel with Number: ${number}`);
    return [barrel];
  }

  async updateBarrel(editsRaw, files) {
    const edits = typeof editsRaw === "string" ? parseEdits(editsRaw) : editsRaw;

    if (edits.open && edits.open.damage_review) {
      const control = await this.barrelRepository.findById(edits._id);
      if (edits.damaged && control && !control.damaged) {
        edits.open.damage_review.closed = localDate(new Date());
      }
      if (!edits.open.returned) {
        edits.open.damage_review = undefined;
      }
      if (control?.open?.damage_review?.images) {
        const editedImages = edits.open.damage_review?.images;
        edits.open.damage_review.images =
          await this.cloudinaryService.syncDamageReviewImages(
            control.open.damage_review.images,
            editedImages,
            files
          );
      }
    }

    const barrel = await this.barrelRepository.updateById(edits._id, edits);
    if (!barrel) throw notFound("No barrel");

    if (
      (barrel.open && barrel.open.returned && !barrel.open.damage_review) ||
      (barrel.open && barrel.open.returned && barrel.damaged)
    ) {
      const closeInvoice = await this.barrelRepository.closeOpenToHistory(
        barrel._id,
        barrel.open
      );
      if (closeInvoice) return closeInvoice;
    }
    return barrel;
  }

  async updateHistory(barrelId, editsRaw, files) {
    const edits = typeof editsRaw === "string" ? parseEdits(editsRaw) : editsRaw;

    const barrel = await this.barrelRepository.findByIdForMutation(barrelId);
    if (!barrel) throw notFound("No barrel");

    const reopenInvoice =
      !barrel.open &&
      (!edits.returned ||
        (edits.returned && edits.damage_review && !edits.damage_review.closed));

    if (!edits.damage_review) {
      edits.damage_review = undefined;
    }

    const historyIndex = barrel.history
      .map((his) => his._id.toString())
      .indexOf(edits._id);
    if (historyIndex === -1) throw notFound("History entry not found");

    const historyToUpdate = barrel.history[historyIndex];
    if (historyToUpdate.damage_review?.images) {
      const editedImages = edits.damage_review?.images;
      edits.damage_review.images = await this.cloudinaryService.syncDamageReviewImages(
        historyToUpdate.damage_review.images,
        editedImages,
        files
      );
    }

    if (reopenInvoice) {
      barrel.open = { ...edits };
      barrel.history = barrel.history.filter(
        (history) => history._id.toString() !== edits._id
      );
    } else {
      barrel.history = barrel.history.map((history) => {
        if (history._id.toString() === edits._id) {
          return { ...history, ...edits };
        }
        return history;
      });
    }

    await barrel.save();
    return barrel.history[historyIndex];
  }
}
