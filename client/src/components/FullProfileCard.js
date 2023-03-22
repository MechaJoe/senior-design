import Avatar from '@mui/material/Avatar'

export default function FullProfileCard(props) {
  const {
    firstName, lastName, emailAddress, profileImageUrl, year, majors, schools, grayed, requested,
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
      <div className="">
        <div className="font-sans text-l font-semibold">
          {firstName}
          {' '}
          {lastName}
        </div>
        <div className="font-sans text-l">
          {emailAddress}
        </div>
        {grayed
          ? (
            <div className="justify-items-center items-center p-4 font-sans">
              <button type="button" className=" bg-buttonblue text-white rounded w-24">Chat</button>
            </div>
          )
          : (
            <div className="grid grid-cols-2 gap-4 justify-items-center p-4 font-sans">
              <button type="button" className=" bg-buttonblue text-white rounded w-24">Chat</button>
              {requested ? <button type="button" className="bg-gray-400 text-white rounded w-24">Request</button>
                : <button type="button" className=" bg-buttongreen text-white rounded w-24">Request</button>}
            </div>
          )}
      </div>
    </div>
  )
}
