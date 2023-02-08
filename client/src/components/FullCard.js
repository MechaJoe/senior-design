export default function FullCard(props) {
  // TODO: include all necessary properties, like firstName, lastName, profileImageUrl, etc.
  const { username } = props

  return (
    <div className="font-sans text-xl font-semibold rounded-lg shadow-lg bg-white max-w-sm p-6">
      {username}
    </div>
  )
}
