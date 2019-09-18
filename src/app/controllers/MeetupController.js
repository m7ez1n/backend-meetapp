import * as Yup from 'yup';
import {
  isBefore,
  parseISO,
  startOfHour,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import Banner from '../models/Banner';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const { page = 1, data } = req.query;

    if (!data) {
      return res.status(400).json({ error: 'Essa data é inválida' });
    }

    const searchDate = parseISO(data);

    const meetapp = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'title', 'description', 'location', 'date', 'user_id'],
      include: [
        {
          model: Banner,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: User,
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(meetapp);
  }

  async store(req, res) {
    const validation = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    const { title, description, location, date, banner_id } = req.body;

    /**
     * Fazendo a validação da data
     */
    const meetupDate = startOfHour(parseISO(date));

    if (isBefore(meetupDate, new Date())) {
      return res.status(400).json({
        error:
          'Só é possível cadastrar meetups em datas que ainda não passaram',
      });
    }

    const meetup = await Meetup.create({
      user_id: req.userId,
      title,
      description,
      location,
      date,
      banner_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const validation = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    /**
     * Conferindo se o meetup para editar é do usuário logado
     */
    if (req.userId !== meetup.user_id) {
      return res.status(400).json({
        error: 'Só criadores podem editar seus meetups',
      });
    }

    /**
     * Conferindo se a data do meetup já passou
     */
    const meetupDate = startOfHour(meetup.date);
    if (isBefore(meetupDate, new Date())) {
      return res.status(400).json({
        error: 'Só é possível editar meetups em datas que ainda não passaram',
      });
    }

    const {
      id,
      user_id,
      title,
      description,
      location,
      date,
      banner_id,
    } = await meetup.update(req.body);

    return res.json({
      id,
      user_id,
      title,
      description,
      location,
      date,
      banner_id,
    });
  }

  async destroy(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    /**
     * Conferindo se o meetup para editar é do usuário logado
     */
    if (req.userId !== meetup.user_id) {
      return res.status(400).json({
        error: 'Só criadores podem excluir seus meetups',
      });
    }

    /**
     * Conferindo se a data já passou
     */
    if (isBefore(startOfHour(meetup.date), new Date())) {
      return res.status(400).json({
        error: 'Só é possível excluir meetups em datas que ainda não passaram',
      });
    }

    await meetup.destroy();

    return res.json({ message: `Seu meetup, (${meetup.title}) foi deletado` });
  }
}

export default new MeetupController();
