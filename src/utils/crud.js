export const getOne = model => async (req, res) => {
  const id = req.params.id
  const userId = req.user._id

  const doc = await model.findOne({ _id: id, createdBy: userId }).exec()
  if (doc) {
    return res.status(200).json({ data: doc })
  } else {
    return res.status(400).end()
  }
}

export const getMany = model => async (req, res) => {
  const userId = req.user._id

  const objectList = await model.find({ createdBy: userId }).exec()
  if (objectList) {
    return res.status(200).json({ data: objectList })
  } else {
    return res.status(404).end()
  }
}

export const createOne = model => async (req, res) => {
  const userId = req.user._id
  const body = req.body

  const newObj = await model.create({ createdBy: userId, ...body })

  return res.status(201).json({ data: newObj })
}

export const updateOne = model => async (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  const body = req.body

  const updated = await model
    .findOneAndUpdate({ _id: id, createdBy: userId }, body, {
      new: true
    })
    .exec()

  if (updated) {
    res.status(200).json({ data: updated })
  } else {
    res.status(400).end()
  }
}

export const removeOne = model => async (req, res) => {
  const id = req.params.id
  const userId = req.user._id

  const removed = await model
    .findOneAndRemove({ _id: id, createdBy: userId })
    .exec()

  if (removed) {
    res.status(200).json({ data: removed })
  } else {
    res.status(400).end()
  }
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
