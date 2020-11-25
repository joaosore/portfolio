import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async index(req, res) {
    const UserId = req.userId;
    const user = await User.findOne({ where: { id: UserId } });
    return res.json(user);
  }

  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        mensagem: 'Usuário não encontrado',
        status: 'error',
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.json({
        mensagem: 'Senha não corresponde',
        status: 'error',
      });
    }

    const { id, name } = user;

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
