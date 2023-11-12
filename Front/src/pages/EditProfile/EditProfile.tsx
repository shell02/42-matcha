import AccountForm from '../../components/AccountForm/AccountForm'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import ProfileForm from '../../components/ProfileForm/ProfileForm'

function EditProfile() {
  return (
    <div className='editProfileContainer'>
      <div className='photosContainer'>
        <h1>Photos</h1>
        <PhotoGallery />
      </div>
      <div className='profileContainer'>
        <h1>Profile</h1>
        <ProfileForm />
      </div>
      <div className='accountContainer'>
        <h1>Account</h1>
        <AccountForm />
      </div>
    </div>
  )
}

export default EditProfile
