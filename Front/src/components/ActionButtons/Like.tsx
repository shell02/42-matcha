import { Button } from '@mui/material'
import { useLikeUser } from '../../hooks/queries/userQueries'

interface Props {
  toUserID: number
  type: string
}

function LikeButton({ toUserID, type }: Props) {
  const { refetch } = useLikeUser(type, toUserID)

  const handleLike = async () => {
    refetch()
  }

  return (
    <>
      <Button onClick={handleLike}>Like</Button>
    </>
  )
}

export default LikeButton
