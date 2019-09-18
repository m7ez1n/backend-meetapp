import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import Banner from '../models/Banner';
import User from '../models/User';
import Subscribe from '../models/Subscription';

import SubscribeMail from '../jobs/SubscribeMail';
import Queue from '../../lib/Queue';

class SubscribeController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Subscribe.findAll({
      where: { user_id: req.userId },
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'meetup_id', 'user_id'],
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          attributes: ['title', 'description', 'location', 'date'],
          include: [
            {
              model: User,
              attributes: ['name', 'email'],
            },
            {
              model: Banner,
              as: 'banner',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });

    if (meetup.creator_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'Você não pode se inscrever nos seus meetups' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Não pode se inscrever em meetups que ja passaram' });
    }

    const checkDate = await Subscribe.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res.status(400).json({
        error: 'Você não pode se inscrever em dois meetups no mesmo horário',
      });
    }

    const subscription = await Subscribe.create({
      user_id: user.id,
      meetup_id: req.params.meetupId,
    });

    await Queue.add(SubscribeMail.key, {
      meetup,
    });

    return res.json(subscription);
  }
}

export default new SubscribeController();
