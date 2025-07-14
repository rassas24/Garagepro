import Joi from 'joi';
export const branchSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  time_zone: Joi.string().required(),
  contact_phone_country_code: Joi.string().pattern(/^[+][0-9]+$/).allow(''),
  contact_phone_number: Joi.string().required(),
  logo_url: Joi.string().uri().optional()
});