export const success = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, ...data })
}

export const error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const payload = { success: false, message }
  if (errors) payload.errors = errors
  return res.status(statusCode).json(payload)
}

export const created = (res, data = {}, message = 'Created successfully') => {
  return success(res, data, message, 201)
}
