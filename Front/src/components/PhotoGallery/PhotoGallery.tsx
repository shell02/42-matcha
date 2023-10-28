import { Button, ImageList, ImageListItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface Photos {
  img: string
  title: string
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

function PhotoGallery() {
  const itemData: Photos[] = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
  ]

  const onFileUpload = () => {
    console.log('onFileUpload')
  }

  return (
    <div>
      <ImageList cols={3}>
        {!!itemData.length &&
          itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading='lazy'
              />
            </ImageListItem>
          ))}
      </ImageList>
      <Button
        component='label'
        variant='contained'
        endIcon={<CloudUploadIcon />}
      >
        Upload new image
        <VisuallyHiddenInput type='file' onClick={onFileUpload} />
      </Button>
    </div>
  )
}

export default PhotoGallery
