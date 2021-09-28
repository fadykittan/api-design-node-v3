import { Router } from 'express'

const controller = (req, res) => {
  if (req.params.id) {
    res.send({
      id: req.params.id,
      message: 'OK'
    })
  } else {
    res.send({ message: 'OK' })
  }
}

const router = Router()

// /api/item
router
  .route('/')
  .get(controller)
  .post(controller)

// /api/item/:id
router
  .route('/:id')
  .get(controller)
  .put(controller)
  .delete(controller)

export default router
