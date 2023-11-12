import { Button, ImageList, ImageListItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import {
  useAssignProfilePic,
  useDeletePhoto,
  useGetPhotos,
  useGetUser,
  usePostPhoto,
} from '../../hooks/queries/userQueries'
import { ChangeEvent, useEffect, useState } from 'react'
import './PhotoGallery.scss'

interface Photos {
  pictureID: number
  path: string
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
  const { data: user } = useGetUser()
  const { data: photos } = useGetPhotos()
  const postPhoto = usePostPhoto()
  const assignPhoto = useAssignProfilePic()
  const deletePhoto = useDeletePhoto()
  const [profilePicId, setProfilePicId] = useState(0)
  const [photoSelected, setPhotoSelected] = useState(0)

  useEffect(() => {
    if (user) {
      setProfilePicId(user.profilePicId)
    }
  }, [user])

  const onFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) postPhoto.mutateAsync(e.target.files[0])
  }

  const handleProfilePicture = () => {
    assignPhoto.mutateAsync({ pictureID: photoSelected })
  }

  const handleDeletePhoto = () => {
    deletePhoto.mutateAsync({ pictureID: photoSelected })
  }

  return (
    <div>
      <ImageList cols={3}>
        {!!photos &&
          photos.map((item: Photos) => (
            <ImageListItem key={item.pictureID}>
              <img
                src={`http://localhost:3001/${item.path}?w=164&h=164&fit=crop&auto=format`}
                loading='lazy'
                className={`image ${
                  profilePicId === item.pictureID ? 'isProfilePicture' : ''
                }
                ${photoSelected === item.pictureID ? 'isSelected' : ''}`}
                onClick={() => setPhotoSelected(item.pictureID)}
              />
            </ImageListItem>
          ))}
      </ImageList>
      <Button
        component='label'
        variant='contained'
        endIcon={<AddToPhotosIcon />}
      >
        Add Photo
        <VisuallyHiddenInput type='file' onChange={onFileUpload} />
      </Button>
      <Button
        variant='contained'
        endIcon={<StarIcon />}
        disabled={!photoSelected}
        onClick={handleProfilePicture}
      >
        Assign to profile photo
      </Button>
      <Button
        variant='contained'
        endIcon={<DeleteIcon />}
        disabled={!photoSelected}
        onClick={handleDeletePhoto}
      >
        Delete Photo
      </Button>
    </div>
  )
}

export default PhotoGallery
