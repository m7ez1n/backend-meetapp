import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const validation = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    const { email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (!(await userExists.checkPassword(password))) {
      return res.status(401).json({ error: 'Sua senha está incorreta' });
    }

    const { id, name } = userExists;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
