import { Dispatch } from "@reduxjs/toolkit"

import {
  hideLoadingModal,
  showLoadingModal
} from "../features/modals/loadingModalSlice"
import {
  addModal,
  initializeModal,
  removeModal
} from "../features/modals/handleModalsSlice"

interface ModalCascadeProps {
  start: (
    dispatch: Dispatch,
    shouldShowLoadingModal: boolean,
    modalKey: string
  ) => void
  endWithSuccess: (
    dispatch: Dispatch,
    notifyUser: boolean,
    modalId: string
  ) => void
  endWithError: (
    dispatch: Dispatch,
    notifyUser: boolean,
    modalId: string,
    msg?: string
  ) => void
}

const startMsgMap: { [key: string]: string } = {
  fetchActiveGame: "Checking for existing game...",
  deleteGame: "Clearing your old data...",
  initializeGame: "Initializing a new game...",
  updateGame: "Checking your answers...",
  gettingNewLyric: "Getting new lyric...",
  clearSeenIds: "Clearing cache...",
  signup: "Signing you up...",
  signin: "Signing you in...",
  signout: "Signing out..."
}

const sucMsgMap: { [key: string]: string } = {
  fetchActiveGame: "Existing game found!",
  deleteGame: "Data cleared!",
  initializeGame: "Game initialized!",
  clearSeenIds: "Cache cleared!",
  updateGame: "",
  signup: "Account creation successful!",
  signin: "You are logged in!",
  signout: "You are signed out!"
}

const defaultErr = "Something went wrong."

// NOTE: Modal is initialized before this function is called.
export function modalCascade(): ModalCascadeProps {
  return {
    start: (dispatch, shouldShowLoadingModal, modalKey) => {
      const msg = startMsgMap[modalKey] || "Loading..."
      shouldShowLoadingModal && dispatch(showLoadingModal(msg))
      dispatch(initializeModal(modalKey))
    },
    endWithSuccess: (dispatch, notifyUser, modalId) => {
      const data = { isSuccess: true, message: sucMsgMap[modalId] }
      dispatch(hideLoadingModal())
      !notifyUser && dispatch(removeModal(modalId))
      notifyUser && dispatch(addModal({ modalId, data }))
    },
    endWithError: (dispatch, notifyUser, modalId, msg = defaultErr) => {
      const data = { isSuccess: false, message: msg }
      dispatch(hideLoadingModal())
      !notifyUser && dispatch(removeModal(modalId))
      notifyUser && dispatch(addModal({ modalId, data }))
    }
  }
}
