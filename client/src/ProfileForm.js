import React, { useState } from 'react'
import axios from 'axios'
import { Select, MenuItem, FormHelperText, FormControl, InputLabel, Chip } from '@material-ui/core';
import React, { useState } from 'react';


const ProfileForm = ({ userObj }) => {
    const { emailAddress, user, firstName, lastName } = userObj
    const [year, setYear] = useState(userObj.year)
    const [majors, setMajors] = useState([])
    const [school, setSchool] = useState([])

    const handleSave = async () => {
        if (!year || majors.length == 0 || school.length == 0) {
            alert('Please complete all fields')
            return
        }
        const { data } = await axios.post('/profile', {
            emailAddress, username, firstName, lastName, year, profileImageUrl, majors, school,
        })
        if (data === 'success') {
            // window.location.reload()
            navigate('/dashboard', { replace: true })
        }
    }
    return (
        <>
            <h3> Welcome, {user.firstName} </h3>
            <h5> Let's start your profile to help you find your team! </h5>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={year}
                    label="Year"
                    onChange={e => setYear(e.target.value)}
                >
                    <MenuItem value={2023}>2023</MenuItem>
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2025}>2025</MenuItem>
                    <MenuItem value={2026}>2026</MenuItem>
                </Select>
                <FormHelperText>Select your year</FormHelperText>
            </FormControl>

            <FormControl style={{ marginTop: 100, marginLeft: 100 }}>
                <InputLabel>Major(s)</InputLabel>
                <Select
                    multiple
                    value={majors}
                    onChange={e => setMajors(e.target.value)}
                    renderValue={(majors) => (
                        <div>
                            {majors.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </div>
                    )}
                >
                    <MenuItem value={'CIS'}>CIS</MenuItem>
                    <MenuItem value={'EE'}>EE</MenuItem>
                    <MenuItem value={'ASAM'}>ASAM</MenuItem>
                    <MenuItem value={'BE'}>BE</MenuItem>
                    <MenuItem value={'MATH'}>MATH</MenuItem>
                </Select>
                <FormHelperText>Select your major(s)</FormHelperText>
            </FormControl>

            <FormControl style={{ marginTop: 100, marginLeft: 100 }}>
                <InputLabel>School(s)</InputLabel>
                <Select
                    multiple
                    value={schools}
                    onChange={e => setSchool(e.target.value)}
                    renderValue={(school) => (
                        <div>
                            {school.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </div>
                    )}
                >
                    <MenuItem value={'SEAS'}>SEAS</MenuItem>
                    <MenuItem value={'SAS'}>SAS</MenuItem>
                    <MenuItem value={'WHARTON'}>WHARTON</MenuItem>
                    <MenuItem value={'NURSING'}>NURSING</MenuItem>
                </Select>
                <FormHelperText>Select your school(s)</FormHelperText>
            </FormControl>

            <button type="button" className="btn btn-primary" onClick={handleSave}> Next </button>
        </>
    )
}

export default ProfileForm