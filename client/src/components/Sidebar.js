import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

export default function Sidebar(props) {
  const { classCode, className, instructors } = props

  return (
    <div className="bg-gunmetal w-1/6 h-screen font-sans text-white">
      <h1 className="text-4xl font-bold px-6 pt-12">
        {' '}
        {classCode}
        {' '}
      </h1>
      <h3 className="text-xl font-bold px-6 pt-2">
        {className}
      </h3>

      <h2 className="px-6 pt-6 text-xl"> Instructors </h2>
      {
      instructors ? instructors.map((instructor) => (
        <div key={instructor.firstName + instructor.lastName} className="px-6 pt-2" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <AccountCircleOutlinedIcon />
          <h3>
            &nbsp;
            {instructor.firstName}
            &nbsp;
            {instructor.lastName}
          </h3>
        </div>
      )) : null
    }
    </div>
  )
}
