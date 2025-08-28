const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.bodyParser);


server.get('/users/:id', (req, res) => {
  const user = router.db.get('users').find({ id: req.params.id }).value();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});


server.patch('/users/:id', (req, res) => {
  if (Math.random() < 0.30) {
    return res.status(500).json({ message: 'Simulated server error (for testing retries).' });
  }

  const updated = router.db.get('users')
    .find({ id: req.params.id })
    .assign(req.body)
    .write();

  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
});


server.use(router);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
