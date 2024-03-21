import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setResponseMessage } from "../serverResponseSlice"
import { isCustomApiResponse } from "../../helpers/errorReform"

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
  gameStartDate: string
  playersObject: PlayersObject
}

// ! NOTE: Manually triggered queries must be of type "lazy" while manually triggered mutations do not

export const gameHandlingApi = createApi({
  reducerPath: "gameHandlingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/api/game/" }),
  tagTypes: ["ActiveGame"],
  endpoints: (builder) => ({
    // first is response, second is req obj
    fetchActiveGame: builder.query<IGameInstance, void>({
      query: () => "active-game",
      providesTags: ["ActiveGame"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
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
    initializeGame: builder.mutation<IGameInstance, IGameInstance>({
      query: (body) => ({ url: "initialize-game", method: "POST", body }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(
            setResponseMessage({
              successResult: false,
              message: "An error occured while trying to start the game."
            })
          )
        }
      }
    })
  })
})

export const { useInitializeGameMutation, useFetchActiveGameQuery } =
  gameHandlingApi
