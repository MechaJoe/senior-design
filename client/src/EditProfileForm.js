import axios from 'axios'
import { Select, MenuItem, FormHelperText, FormControl, InputLabel, Chip } from '@material-ui/core';
import React, { useState } from 'react';


const EditProfileForm = ({ userObj }) => {
    const { emailAddress, user, firstName, lastName } = userObj
    const [year, setYear] = useState(userObj.year)
    const [majors, setMajors] = useState([])
    const [school, setSchool] = useState([])

    const handleSave = async () => {
        if (!year || !majors || !school) {
            alert('Please complete all fields')
            return
        }
        const { data } = await axios.post('/profile/edit', {
            emailAddress, username, firstName, lastName, year, profileImageUrl, majors, school,
        })
        if (data === 'success') {
            window.location.reload()
            // navigate('/dashboard', { replace: true })
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

            <p style={{ color: '#8C55AA' }}>Name</p>
            <div className="input-group mb-3">
                <input type="text" value={name} className="form-control" onChange={e => setName(e.target.value)} placeholder="Enter name" />
            </div>
            <p style={{ color: '#8C55AA' }}>Bio</p>
            <div className="input-group mb-3">
                <input type="text" value={bio} className="form-control" onChange={e => setBio(e.target.value)} placeholder="Enter Bio" />
            </div>
            <p style={{ color: '#8C55AA' }}>Img1</p>
            <div className="input-group mb-3">
                <input type="text" value={img1} className="form-control" onChange={e => setImg1(e.target.value)} placeholder="Enter image URL" />
            </div>
            <p style={{ color: '#8C55AA' }}>Caption 1</p>
            <div className="input-group mb-3">
                <input type="text" value={caption1} className="form-control" onChange={e => setCaption1(e.target.value)} placeholder="Caption the image above" />
            </div>
            <p style={{ color: '#8C55AA' }}>Img2</p>
            <div className="input-group mb-3">
                <input type="text" value={img2} className="form-control" onChange={e => setImg2(e.target.value)} placeholder="Enter image URL" />
            </div>
            <p style={{ color: '#8C55AA' }}>Caption 2</p>
            <div className="input-group mb-3">
                <input type="text" value={caption2} className="form-control" onChange={e => setCaption2(e.target.value)} placeholder="Caption the image above" />
            </div>
            <p style={{ color: '#8C55AA' }}>Img3</p>
            <div className="input-group mb-3">
                <input type="text" value={img3} className="form-control" onChange={e => setImg3(e.target.value)} placeholder="Enter image URL" />
            </div>
            <p style={{ color: '#8C55AA' }}>Caption 3</p>
            <div className="input-group mb-3">
                <input type="text" value={caption3} className="form-control" onChange={e => setCaption3(e.target.value)} placeholder="Caption the image above" />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleSave}> Save </button>
        </>
    )
}

export default EditProfileForm