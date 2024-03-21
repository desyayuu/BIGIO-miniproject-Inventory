const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'capek' && password === 'capek26') {
    res.status(200).json({ accessToken: 'mockAccessToken' });
  } else if (username === 'nonExistentUsername') {
    res.status(404).json({ message: 'User not found' });
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
});


module.exports = router;
