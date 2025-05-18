const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.userd.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = await prisma.userd.create({
      data: { name, email, password },
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.userd.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('LOGIN ERROR:', error); 
    res.status(500).json({ error: 'Server error during login' });
  }
};



