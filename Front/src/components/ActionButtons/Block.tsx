import { Button } from '@mui/material'

interface Props {
  toUserID: number
  type: string
}

function BlockButton({ toUserID }: Props) {
  const handleBlock = async () => {
    console.log('block', toUserID)
  }

  return (
    <>
      <Button onClick={handleBlock}>Like</Button>
    </>
  )
}

export default BlockButton
