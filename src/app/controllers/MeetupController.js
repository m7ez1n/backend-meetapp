import * as Yup from 'yup';
import { isBefore, parseISO, startOfHour } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const validation = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
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
}

export default new MeetupController();
