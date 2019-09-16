import * as Yup from 'yup';
import { isBefore, parseISO, startOfHour } from 'date-fns';
import Meetup from '../models/Meetup';
import Banner from '../models/Banner';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetapp = await Meetup.findAll({
      where: { creator_id: req.userId },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: [
        'id',
        'title',
        'description',
        'location',
        'date',
        'creator_id',
      ],
      include: [
        {
          model: Banner,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
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

    const { title, description, location, date } = req.body;

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
      creator_id: req.userId,
      title,
      description,
      location,
      date,
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
    if (req.userId !== meetup.creator_id) {
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
      creator_id,
      title,
      description,
      location,
      date,
      banner_id,
    } = await meetup.update(req.body);

    return res.json({
      id,
      creator_id,
      title,
      description,
      location,
      date,
      banner_id,
    });
  }
}

export default new MeetupController();
