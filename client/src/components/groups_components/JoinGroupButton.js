import { joinGroup } from '../../infoHelpers'

export default function JoinGroupButton(props) {
  const { classCode, assignmentId, groupId } = props

  return (
    <button
      type="button"
      className="rounded-2xl w-32 h-32 bg-gray-100 border-dashed border border-gunmetal"
      onClick={joinGroup(classCode, assignmentId, groupId)}
      onKeyDown={joinGroup}
    >
      +

    </button>
  )
}
