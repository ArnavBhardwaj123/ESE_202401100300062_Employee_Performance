const router = require('express').Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployee,
  searchEmployees,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const auth = require('../middleware/auth');

router.get('/search', auth, searchEmployees);
router.get('/', auth, getAllEmployees);
router.post('/', auth, addEmployee);
router.get('/:id', auth, getEmployee);
router.put('/:id', auth, updateEmployee);
router.delete('/:id', auth, deleteEmployee);

module.exports = router;
