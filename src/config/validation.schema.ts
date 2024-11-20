import * as Joi from 'joi';

export default Joi.object({
    KAFKA_URL: Joi.string().required()
})