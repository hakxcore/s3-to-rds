const express = require('express');
const cors = require('cors');
const app = express();
const { main, prisma } = require('./utils/pg');
app.use(cors());
app.use(express.json());
app.get('/', async (req, res) => {
  res.json({
    status: 'running',
  });
});
app.post('/', async (req, res) => {
  try {
    const body = req.body;
    await main(body)
      .then(async (user) => {
        res.json(user);
        await prisma.$disconnect();
      })
      .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`running on ${port}`));
