import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setResponseMessage } from "../serverResponseSlice"
import { isCustomApiResponse } from "../../helpers/errorReform"
import logClient from "../../helpers/logFormatter"

interface PlayerStats {
  cCorrect: number
  cWrong: number
  cDrinksTaken: number
  cDrinksGiven: number
  cCorrectStreak: number
  cWrongStreak: number
}

export interface PlayersObject {
  [playerName: string]: PlayerStats
}

export interface IGameInstance {
  _id?: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate?: string
  playersObject: PlayersObject
}

// ! NOTE: Manually triggered queries must be of type "lazy" while manually triggered mutations do not

export const gameHandlingApi = createApi({
  reducerPath: "gameHandlingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api/game/",
    credentials: "include"
  }),
  tagTypes: ["ActiveGame"],
  endpoints: (builder) => ({
    // first is response, second is req obj
    fetchActiveGame: builder.query<IGameInstance, void>({
      query: () => "active-game",
      providesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled
          if (res.data === null) return
        } catch (err) {
          if (isCustomApiResponse(err)) {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: err.error.data.message
              })
            )
          } else {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: "Something went wrong searching for an active game."
              })
            )
          }
        }
      }
    }),
    deleteGame: builder.mutation<IGameInstance, void>({
      query: () => ({ url: "delete-game", method: "DELETE" }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled
          logClient("gameHandlingApi/delete-game", res)
        } catch (err) {
          if (isCustomApiResponse(err)) {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: err.error.data.message
              })
            )
          } else {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: "Something went wrong searching for an active game."
              })
            )
          }
        }
      }
    }),
    // Initialize new game AND overwrite "active game" with new id
    initializeGame: builder.mutation<IGameInstance, IGameInstance>({
      query: (body) => ({ url: "initialize-game", method: "POST", body }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled
          logClient("gameHandlingApi/initialize-game", res)
        } catch (err) {
          if (isCustomApiResponse(err)) {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: err.error.data.message
              })
            )
          } else {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: "Something went wrong searching for an active game."
              })
            )
          }
        }
      }
    })
  })
})

export const {
  useInitializeGameMutation,
  useFetchActiveGameQuery,
  useDeleteGameMutation
} = gameHandlingApi
