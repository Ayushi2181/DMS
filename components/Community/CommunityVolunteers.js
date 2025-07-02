import React from 'react'

export const CommunityVolunteers = () => {
  return (
    <div>
        <h1>Here's the list of volunteers in this community :</h1>
        <table style={{
          display: 'table'
          

        }}>
          <tr>
            <th>UserID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Availability</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Demo user 1</td>
            <td>user1@gmail.com</td>
            <td>9977665522</td>
            <td>Dehradun , Uttarakhand</td>
            <td>true</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Demo User 2</td>
            <td>user2@gmail.com</td>
            <td>8899223355</td>
            <td>Haridwar , Uttarakhand</td>
            <td>false</td>
          </tr>
        </table>
    </div>
  )
}
