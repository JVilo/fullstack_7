import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    reset,
    inputProps: {
      type,
      value,
      onChange
    }
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => {
      setAnecdotes(data)
    })
  }, [])

  const addAnecdote = (newAnecdote) => {
    anecdoteService.createNew(newAnecdote).then(returnedAnecdote => {
      setAnecdotes(anecdotes.concat(returnedAnecdote))
    })
  }

  const deleteAnecdote = (id) => {
    anecdoteService.deleteAnecdote(id).then(() => {
      setAnecdotes(anecdotes.filter(anecdote => anecdote.id !== id))
    })
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}