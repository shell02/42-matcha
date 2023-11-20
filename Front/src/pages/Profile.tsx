import { useParams } from 'react-router-dom'
import LikeButton from '../components/ActionButtons/Like'
import { useAddView, useProfileData } from '../hooks/queries/userQueries'

function Profile() {
  const { userId } = useParams()
  let toUserID: number = 0

  if (userId) {
    toUserID = Number(userId)
  }
  console.log('toUserID', userId)

  const { data } = useProfileData(toUserID)
  const showLike = data ? !data.liked : false
  const showUnlike = data ? data.liked : false
  const showProfile = data ? !data.blocked : true

  const addView = data ? !data.viewed : false
  useAddView(toUserID, addView)

  console.log('data', data)

  return (
    <>
      {showProfile && (
        <div>
          <p>Hello, I am user number {toUserID}</p>
          {showLike && <LikeButton toUserID={toUserID} type='like' />}
          {showUnlike && <LikeButton toUserID={toUserID} type='unlike' />}
        </div>
      )}
      {!showProfile && <p>User not found</p>}
    </>
  )
}

export default Profile
