import { Alert, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'

interface Props {
  message: string
  severity: 'success' | 'info' | 'warning' | 'error'
}

function MySnackBar(props: Props) {
  const [open, setOpen] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => {
      setOpen(false)
    }, 4000)
  }, [])

  return (
    <>
      <Snackbar open={open}>
        <Alert severity={props.severity}>{props.message}</Alert>
      </Snackbar>
    </>
  )
}

export default MySnackBar
