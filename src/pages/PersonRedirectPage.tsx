import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function PersonRedirectPage() {
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    navigate(params.slug ? `/people?member=${params.slug}` : '/people', { replace: true })
  }, [navigate, params.slug])

  return null
}
