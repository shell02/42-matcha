/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuth from '../context/useAuth'

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
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
