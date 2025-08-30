// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/auth/register
 * body: { username, email, password }
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Boş alan kontrolü
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email ve password zorunludur.' });
    }

    // Daha önce var mı?
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ message: 'E-posta veya kullanıcı adı zaten kayıtlı.' });
    }

    // Şifre hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kaydet
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Bir hata oluştu.', error: err.message });
  }
});

module.exports = router;
