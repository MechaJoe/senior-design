import Avatar from '@mui/material/Avatar'
import { Button } from '@mui/material'

export default function RequestCard(props) {
  const {
    firstName, lastName, emailAddress, profileImageUrl, year, majors, schools,
  } = props

  const majorList = majors.split(',')
  const schoolList = schools.split(',')

  return (
    <div className="rounded-xl bg-tan/5 max-w-sm p-6 text-center border-4 border-gunmetal">
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
      <div className="px-6 p-6">
        <span className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{year}</span>
        {schoolList.map((school) => (
          <span key={school} className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{school}</span>
        ))}
        {majorList.map((major) => (
          <span key={major} className="inline-block bg-tan rounded-full px-3 py-1 text-sm font-sans font-semibold text-gunmetal mr-2 mb-2">{major}</span>
        ))}
      </div>
      <div className="p-6">
        <div className="font-sans text-xl font-semibold">
          {firstName}
          {' '}
          {lastName}
        </div>
        <div className="font-sans text-xl">
          {emailAddress}
        </div>
      </div>
      <div>
        <Button
          variant="contained"
          style={{
            margin: '15px', backgroundColor: 'white', color: 'black',
          }}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          style={{
            margin: '15px', backgroundColor: 'white', color: 'black',
          }}
        >
          Reject
        </Button>
      </div>

    </div>
  )
}
