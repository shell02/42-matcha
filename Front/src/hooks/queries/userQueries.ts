/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuth from '../context/useAuth'
import { refreshToken } from '../../components/RefreshToken'
import { NotificationType } from '../../utils/types'

export const useGetUser = () => {
  const { authToken, id } = useAuth()

  return useQuery({
    queryKey: ['user', authToken],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/users/findUser?id=${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (!res.ok) {
        throw new Error('Server error')
      }
      return await res.json()
    },
  })
}

export const useGetUserInfo = () => {
  const { authToken, id } = useAuth()

  return useQuery({
    queryKey: ['userInfo', authToken],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3001/users/getUserInfo?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      }
      return await res.json()
    },
  })
}

export const useUpdateUser = () => {
  const { authToken, id } = useAuth()

  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['userUpdate', authToken],
    mutationFn: async (data: any) => {
      const res = await fetch(
        `http://localhost:3001/users/updateAccount?id=${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      }
      return await res.json()
    },
    onSuccess: () => {
      refreshToken()
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export const useUpdateUserInfo = () => {
  const { authToken, id } = useAuth()

  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['userUpdateInfo', authToken],
    mutationFn: async (data: any) => {
      const res = await fetch(
        `http://localhost:3001/users/updateUserInfo?id=${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      }
      return await res.json()
    },
    onSuccess: () => {
      refreshToken()
      queryClient.invalidateQueries({ queryKey: ['userInfo'] })
    },
  })
}

export const useGetPhotos = () => {
  const { authToken, id } = useAuth()

  return useQuery({
    queryKey: ['photos', authToken],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3001/users/getPhotos?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      }
      return await res.json()
    },
  })
}

export const usePostPhoto = () => {
  const { authToken, id } = useAuth()

  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['userPostPhoto', authToken],
    mutationFn: async (data: any) => {
      const img = new FormData()
      img.append('photo', data)
      const res = await fetch(
        `http://localhost:3001/users/postPhoto?id=${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: img,
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      }
      return await res.json()
    },
    onSuccess: () => {
      refreshToken()
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
  })
}

export const useDeletePhoto = () => {
  const { authToken, id } = useAuth()

  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['userDeletePhoto', authToken],
    mutationFn: async (data: any) => {
      const res = await fetch(
        `http://localhost:3001/users/deletePhoto?id=${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      }
      return await res.json()
    },
    onSuccess: () => {
      refreshToken()
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
  })
}

export const useAssignProfilePic = () => {
  const { authToken, id } = useAuth()

  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['userAssignProfilePic', authToken],
    mutationFn: async (data: any) => {
      const res = await fetch(
        `http://localhost:3001/users/assignProfilePic?id=${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      }
      return await res.json()
    },
    onSuccess: () => {
      refreshToken()
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export const useProfileData = (toUserID: number) => {
  const { authToken, id } = useAuth()

  return useQuery({
    queryKey: ['profileData', authToken],
    queryFn: async () => {
      if (toUserID === id || !toUserID) {
        return null
      }
      const res = await fetch(
        `http://localhost:3001/users/profileData?toUserID=${toUserID}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      }
      const json = await res.json()
      console.log(json)
      return {
        liked: json.liked,
        blocked: json.blocked,
        viewed: json.viewed,
        matched: json.matched,
      }
    },
  })
}

export const useLikeUser = (type: string, toUserID: number) => {
  const { authToken, socket, id } = useAuth()
  let fetchURL = ''
  let notifyURL = ''

  if (type === 'like') {
    fetchURL = `http://localhost:3001/users/like?toUserID=${toUserID}`
    notifyURL = `http://localhost:3001/users/notify?toUserID=${toUserID}`
  } else if (type === 'unlike') {
    fetchURL = `http://localhost:3001/users/unlike?toUserID=${toUserID}`
    notifyURL = `http://localhost:3001/users/notify?toUserID=${toUserID}&type=${NotificationType.Unliked}`
  }
  return useQuery({
    queryKey: ['likeUser', type],
    queryFn: async () => {
      const res = await fetch(fetchURL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (!res.ok) {
        throw new Error('Server error')
      } else {
        const json = await res.json()
        if (json.notify === 'like') {
          notifyURL += `&type=${NotificationType.LikeReceived}`
        } else if (json.notify === 'likeBack') {
          notifyURL += `&type=${NotificationType.LikedBack}`
        }
        const res2 = await fetch(notifyURL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        if (!res2.ok) {
          throw new Error('Server error')
        }
        socket.emit(json.notify, { id, toUserID })
        return await res.json()
      }
    },
    enabled: false,
  })
}

export const useAddView = (toUserID: number, addView: boolean) => {
  const { authToken, socket, id } = useAuth()

  return useQuery({
    queryKey: ['viewUser', authToken],
    queryFn: async () => {
      if (!addView) {
        return null
      }
      const res = await fetch(
        `http://localhost:3001/users/view?toUserID=${toUserID}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      if (!res.ok) {
        throw new Error('Server error')
      } else {
        const res2 = await fetch(
          `http://localhost:3001/notify?toUserID=${toUserID}&type=${NotificationType.ProfileViewed}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        )
        if (!res2.ok) {
          throw new Error('Server error')
        }
        socket.emit('view', { id, toUserID })
        return await res.json()
      }
    },
    enabled: false,
  })
}
