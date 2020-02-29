import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipients';
import User from '../models/User';

class RecipientController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.string(),
            complement: Yup.string(),
            state: Yup.string().required(),
            city: Yup.string()
                .required()
                .min(2),
            zip_code: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const user = User.findByPk(req.userId);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const {
            name,
            street,
            number,
            complement,
            state,
            city,
            zip_code,
        } = await Recipient.create(req.body);

        const recipientExists = await Recipient.findOne({
            where: {
                [Op.and]: [
                    { name },
                    { street },
                    { number },
                    { complement },
                    { state },
                    { city },
                    { zip_code },
                ],
            },
        });

        if (recipientExists) {
            return res.status(400).json({ error: 'Recipient already exists.' });
        }

        return res.json({
            name,
            street,
            number,
            complement,
            state,
            city,
            zip_code,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            street: Yup.string(),
            number: Yup.string(),
            complement: Yup.string(),
            state: Yup.string(),
            city: Yup.string()
                .min(2)
                .when('state', (state, field) =>
                    state ? field.required() : field
                ),
            zip_code: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const recipient = await Recipient.findByPk(req.params.id);

        if (!recipient) {
            return res
                .status(400)
                .json({ error: 'Recipient does not exists.' });
        }

        const {
            id,
            name,
            street,
            number,
            complement,
            state,
            city,
            zip_code,
        } = await recipient.update(req.body);

        return res.json({
            id,
            name,
            street,
            number,
            complement,
            state,
            city,
            zip_code,
        });
    }
}

export default new RecipientController();
