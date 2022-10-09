import express from 'express';
const router = express.Router();

import { getAllJobs, getJobs, createJob, updateJob, deleteJob, } from '../controller/jobs.js';

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getJobs).patch(updateJob).delete(deleteJob);

export default router;
