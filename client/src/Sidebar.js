/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

function Sidebar({ classCode, className, instructors }) {
  return (
    <div>
      <h1>
        {' '}
        {classCode}
        {' '}
      </h1>
      <h3>
        {className}
      </h3>

      <h2> Instructors </h2>
      {
        instructors ? instructors.map((instructor) => (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <AccountCircleOutlinedIcon />
            <h3>
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

export default Sidebar
