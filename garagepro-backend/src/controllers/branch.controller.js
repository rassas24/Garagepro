import { BranchModel } from '../models/BranchModel.js';
import { branchSchema } from '../validation/branch.schema.js';

export const getBranches = async (req, res, next) => {
  try {
    const data = await BranchModel.getAll();
    res.json(data);
  } catch (err) { next(err); }
};

export const createBranch = async (req, res, next) => {
  try {
    const payload = await branchSchema.validateAsync(req.body);
    const newBranch = await BranchModel.create(payload);
    res.status(201).json(newBranch);
  } catch (err) { next(err); }
};
// ...updateBranch, deleteBranch, getBranchById