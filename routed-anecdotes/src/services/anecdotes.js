const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  return await response.json()
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content)
  }
  const response = await fetch(baseUrl, options)
  return await response.json()
}

const remove = async (id) => {
  const options = {
    method: 'DELETE'
  }
  const response = await fetch(`${baseUrl}/${id}`, options)
  return await response.json()
}

export default {
  getAll,
  createNew,
  remove
}