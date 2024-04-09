import { useSelector } from "react-redux"

import { RootState } from "../../redux/store"
import NotificationModal from "../reusable/NotificationModal"

export function RenderModals() {
  const notifyModals = useSelector(
    (state: RootState) => state.notifyModals.modalsToRender
  )
  // Transform notifyModals to an array
  const modalsToRender = Object.entries(notifyModals).map(
    ([modalId, data]) => ({ modalId, ...data })
  )

  return modalsToRender.map((notification) => {
    const modalId = notification.modalId
    const isVisible = notification.isVisible
    const isSuccess = notification.isSuccess
    const message = notification.message
    const modalIndex = notification.index

    return (
      <NotificationModal
        key={modalId}
        modalId={modalId}
        isVisible={isVisible}
        isSuccess={isSuccess}
        message={message}
        modalIndex={modalIndex}
      />
    )
  })
}
