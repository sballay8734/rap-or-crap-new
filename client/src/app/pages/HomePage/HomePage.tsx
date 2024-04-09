// TODO: Move requests to Api to handle loading states (signOut)
// TODO: Modal animation
// TODO: Modal should accept a duration so you can more easily control it
// TODO: Buttons need hover & active effects and stuff

import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

import { IoMdSettings } from "react-icons/io"
import { FaPlay } from "react-icons/fa"
import { ImSpinner11 } from "react-icons/im"
import { showConfirmModal } from "../../redux/features/modals/confirmModalSlice"
import { useSignoutMutation } from "../../redux/features/auth/authApi"
import { useFetchActiveGameQuery } from "../../redux/features/game/gameApi"
import { setResponseMessage } from "../../redux/features/modals/responseModalSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

export default function HomePage() {
  const [signout] = useSignoutMutation()
  const user = useSelector((state: RootState) => state.user.user)

  const modalVisible = useSelector(
    (state: RootState) =>
      (state.notifyModals.modalsToRender["signin"]?.isVisible ||
        state.notifyModals.modalsToRender["fetchActiveGame"]?.isVisible) ??
      false
  )

  // HACK: localGameId is a temporary workaround for poor query structure
  const localGameId = useSelector((state: RootState) => state.game.localGameId)

  const { data: activeGame, isLoading } = useFetchActiveGameQuery({
    gameId: localGameId,
    flag: "skip"
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleResumeGame() {
    if (activeGame !== null) {
      navigate("/game")
    } else {
      dispatch(
        setResponseMessage({
          successResult: false,
          message: "Hmmm... You shouldn't be able to do that..."
        })
      )
    }
  }

  function handleNewGame() {
    if (activeGame) {
      dispatch(
        showConfirmModal({
          details:
            "Starting a new game will delete your previous game forever!",
          message: "Are you sure you want to do this?"
        })
      )
      return
    }

    // If active game is null/undefined go to game setup, don't show modal
    navigate("/game-setup")
  }

  async function handleSignout() {
    try {
      const res = await signout()
      if ("data" in res) {
        navigate("/signin")
      }
    } catch (error) {
      console.error("Something went wrong")
    }
  }

  // TODO: Refactor this entire section and add transitions/animations
  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center px-8 py-10 text-white">
      <div className="flex h-1/2 flex-col items-center">
        <p className="text-xl font-extralight tracking-wider text-gray-600">
          Hi {user?.displayName}!
        </p>
        <h1 className="flex flex-grow items-center text-center text-7xl">
          RAP OR CRAP
        </h1>
      </div>
      {isLoading === true ? (
        <div>Loading...</div>
      ) : activeGame !== null && activeGame !== undefined ? (
        <div className="flex w-full flex-col items-center gap-4">
          <button
            onClick={handleResumeGame}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-primary text-primary px-4 py-3"
          >
            Resume Game <ImSpinner11 className="absolute right-4" />
          </button>
          <button
            onClick={handleNewGame}
            className="relative flex w-full items-center justify-center rounded-sm bg-primary text-black px-4 py-3"
          >
            New Game <FaPlay className="absolute right-4" />
          </button>
          <button className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-primary text-primary px-4 py-3">
            Rules <IoMdSettings size={18} className="absolute right-4" />
          </button>
          <button
            onClick={handleSignout}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-transparent text-black bg-error px-4 py-3 h-12"
            type="submit"
            disabled={modalVisible}
          >
            {modalVisible ? (
              <span className="animate-spin">
                <AiOutlineLoading3Quarters size={18} />
              </span>
            ) : (
              "SIGN OUT"
            )}
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-4">
          <button
            onClick={handleNewGame}
            className="relative flex w-full items-center justify-center rounded-sm bg-primary text-black px-4 py-3"
          >
            New Game <FaPlay className="absolute right-4" />
          </button>
          <button className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-primary text-primary px-4 py-3">
            Rules <IoMdSettings size={18} className="absolute right-4" />
          </button>
          <button
            onClick={handleSignout}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-transparent text-black bg-error px-4 py-3 h-12"
            type="submit"
            disabled={modalVisible}
          >
            {modalVisible ? (
              <span className="animate-spin">
                <AiOutlineLoading3Quarters size={18} />
              </span>
            ) : (
              "SIGN OUT"
            )}
          </button>
        </div>
      )}
    </div>
  )
}