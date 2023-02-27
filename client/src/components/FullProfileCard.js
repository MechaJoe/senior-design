import Avatar from '@mui/material/Avatar'

export default function FullProfileCard(props) {
  const {
    firstName, lastName, emailAddress, profileImageUrl, year, majors, schools, grayed,
  } = props

  const majorList = majors.split(',')
  const schoolList = schools.split(',')

  return (
    <div className={`rounded-2xl w-[330px] h-[360px] p-6 text-center border-[6px] ${grayed ? 'bg-gray-200 border-gray-300' : 'bg-tan/5 border-gunmetal'}`}>
      {profileImageUrl
        ? <img className="w-32 h-32 mx-auto" src={profileImageUrl} alt="profile" />
        : (
          <Avatar
            sx={{
              width: 130, height: 130, font: 'Montserrat', fontSize: '3rem',
            }}
            className="mx-auto"
            alt="profile"
          >
            {firstName[0] + lastName[0]}
          </Avatar>
        )}
      <div className="p-3">
        <span className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{year}</span>
        {schoolList.map((school) => (
          <span key={school} className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{school}</span>
        ))}
        {majorList.map((major) => (
          <span key={major} className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{major}</span>
        ))}
      </div>
      <div className="p-1">
        <div className="font-sans text-l font-semibold">
          {firstName}
          {' '}
          {lastName}
        </div>
        <div className="font-sans text-l">
          {emailAddress}
        </div>
      </div>
    </div>
  )
}
