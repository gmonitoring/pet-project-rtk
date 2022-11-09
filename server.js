const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const db = require('./db.json');

server.use(middlewares);
server.use(router);

// Т.к json-server не поддерживает массивы фильтров, пришлось написать самому
router.render = (req, res) => {
  const query = req.query;
  const formFilter = query?.form?.split(',');
  const darkFilter = query?.dark ? JSON.parse(query.dark) : null;
  const colorsFilter = query?.color?.split(',');

  let result = formFilter ? db.shapes.filter(item => formFilter.includes(item.form)) : [];
  if (result.length && darkFilter !== null) result = result.filter(item => item.dark === darkFilter);
  if (result.length && colorsFilter) result = result.filter(item => colorsFilter.includes(item.color));

  res.jsonp(result);
};

server.listen(5000, res => {
  console.log('JSON Server is running');
});
