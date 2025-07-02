import React, { useState } from 'react'
import '../assets/CSS/Incidents.css';
import locicon from '../assets/images/location.png';
import { Map } from '../components';
import { useDispatch } from "react-redux";
import { changeRole, remove } from '../store/roleSlice';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export const Incidents = () => {
  const { token } = useAuth();
    const navigate = useNavigate();
    
    // Add this at the beginning of the component
    useEffect(() => {
        // Redirect to login if not authenticated
        if (!token) {
            navigate('/auth/login');
        }
    }, [token, navigate]);
    const dispatch = useDispatch();
   // const [AllLocations, setAllLocations] = useState(null);
    const [ incidents, setIncidents] = useState(null);
    const [ locations , setLocations] = useState(null);

    

    const [DistrictIndex, setDistrictIndex] = useState(0);
    const [StateIndex, setStateIndex] = useState(0);
const States = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Districts = [
  // Andhra Pradesh
  ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],

  // Arunachal Pradesh
  ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],

  // Assam
  ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],

  // Bihar
  ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],

  // Chhattisgarh
  ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],

  // Goa
  ["North Goa", "South Goa"],

  // Gujarat
  ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],

  // Haryana
  ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],

  // Himachal Pradesh
  ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],

  // Jharkhand
  ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],

  // Karnataka
  ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],

  // we have to add more here
];



    const [locateOn,setlocateOn] = useState(false);
    const [myLocation, setMyLocation] = useState(null);
    
    const [longitude, setLongitude] = useState(78.9629);
    const [latitude, setLatitude] = useState(20.5937);
    

    const getMyLocation = () => {
        if (locateOn) setlocateOn(false);
        else setlocateOn(true);
        console.log('hi');
     }

     const iconClick= () => {
        if (locateOn) setlocateOn(false);
        else {
          setMyLocation(null);
          setlocateOn(true);
        }
        dispatch(changeRole({
          isAdmin : true,
          role : "admin",
          loggedIn : true 
        }))

     }

     const submitIncident = async () => {
        const incidentType = document.getElementById('IncidentType').value;
        const incidentDate = document.getElementById('IncidentDate').value;
        const incidentDescription = document.getElementById('IncidentDescription').value;
        const affected = document.getElementById('Affected').value;
        const incidentStatus = document.getElementById('IncidentStatus').value;
        const urgency = document.getElementById('Urgency').value;
        
        // Get location coordinates from state
        const location = {
          type: 'Point',
          coordinates: [longitude, latitude] // Note: GeoJSON uses [longitude, latitude] order
      };

      let reportedBy = null;
    try {
        const userData = JSON.parse(localStorage.getItem('user'));
        reportedBy = userData?.UserID;
    } catch (e) {
        console.error('Error parsing user data:', e);
    }
        
    const incident = {
      Location: location,
      IncidentType: incidentType,
      Description: incidentDescription,
      CommunityID: null, // Add if needed
      ReportedBy: reportedBy,
      DateReported: incidentDate || new Date().toISOString(),
      Urgency: urgency,
      Status: incidentStatus,
      ApproximateaffectedCount: parseInt(affected) || 0
  };

        try {
          const response = await fetch('http://localhost:5001/api/v1/incident/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if authentication is required
          },
          body: JSON.stringify(incident)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Network response was not ok');
        }
    
        const data = await response.json();
        console.log('Incident created:', data);
        
        // Refresh the incidents list
        fetchIncidents();
        
        // Close the modal if it's open
        const modal = document.getElementById("locationModal");
        if (modal) modal.style.display = "none";
        
        // Show success message
        alert('Incident reported successfully!');
        } catch (error) {
          console.error('Error creating incident:', error);
          alert('Failed to create incident. Please try again.');
        }
      }

      const fetchIncidents = () => {
        fetch('http://localhost:5001/api/v1/incident/')
            .then(res => res.json())
            .then(data => {
                if (data.incidents) {
                    setIncidents(data.incidents);
                    const Maplocations = data.incidents.map(incident => {
                        if (incident.Location && incident.Location.coordinates) {
                            return {
                                position: [incident.Location.coordinates[1], incident.Location.coordinates[0]],
                                popupText: `${incident.IncidentType}: ${incident.Description}`
                            };
                        }
                        return null;
                    }).filter(location => location !== null);
                    
                    // Add current location marker if available
                    if (latitude && longitude) {
                        Maplocations.push({position: [latitude, longitude], popupText: "You are here"});
                    }
                    setLocations(Maplocations);
                }
            })
            .catch(error => console.error('Error fetching incidents:', error));
    }

      useEffect(() => {
        fetchIncidents();
      }, []);

      
     

      const seelocationid=()=>{
        var modal = document.getElementById("locationModal");
        var span = document.getElementsByClassName("close-btn")[0];
        modal.style.display = "block";
        span.onclick = function() {
          modal.style.display = "none";
        }
        window.onclick = function(event) {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        }
      }


     const setLocation=()=>{
        
        var ExLoc= document.getElementById("ExLoc").value +", " + document.getElementById("Village").value +", "+
        document.getElementById("Union").value+", "+document.getElementById("Upazila").value+", "
        + document.getElementById("District").value;
        setMyLocation(ExLoc);
        iconClick();
     }

  return (
    <div className='inc-container'>

        <h1 className='section-header' > Your Location </h1>
        <div className="location-box">
            <div className="location-bar">
              <img className='loc-icon' src={locicon} onClick={iconClick} alt="location icon" />             
                <div className="locator">
                {
                  myLocation? myLocation : <button className="locate" onClick={getMyLocation}>locate</button>
                }
                </div>
          </div>
        <form id='location-form' className='location-form' style={{ display : locateOn? "inline-block": "none"}} >
            <div className="form-item">
            <label htmlFor="latitude">Latitude</label>
            <input type='number' id="latitude" name="latitude" onChange={(e)=>{
                setLatitude(e.target.value);
                
            }} style={{ marginLeft: "55px"}} />
            </div>
            <div className="form-item">
            <label htmlFor="longitude">Longitude</label>
            <input type="number" id="longitude" name="longitude" onChange={(e)=> setLongitude(e.target.value)} style={{ marginLeft: "40px"}} />
            </div>
            <div className="form-item">
            <label htmlFor="Division">Division</label>
            <select id="Division" name="Division" onChange={()=> {
              setDistrictIndex(document.getElementById('Division').selectedIndex); 
            }} style={{ marginLeft: "57px"}}>
                {States.map((division) => {
                  return <option value={division}>{division}</option>
                })}
            </select>
                </div>
                <div className="form-item">
            <label htmlFor="District">District</label>
            <select id="District" name="District" style={{ marginLeft: "64px"}}>
                {Districts[DistrictIndex].map((district) =>{
                  return <option value={district}>{district}</option>
                })}
            </select>
              </div>
              <div className="form-item">
            <label htmlFor="Upazila">Upazila</label>
            <input type="text" id="Upazila" name="Upazila" style={{ marginLeft: "63px"}} />
            </div>
            <div className="form-item">
            <label htmlFor="Union">Union</label>
            <input type="text" id="Union" name="Union" style={{ marginLeft: "76px"}} />
            </div>
            <div className="form-item">
            <label htmlFor="Village">Village</label>
            <input type="text" id="Village" name="Village" style={{ marginLeft: "69px"}} />
            </div>
            <div className="form-item">
            <label htmlFor="ExLoc">Exact Location</label>
            <input type="text" id="ExLoc" name="ExLoc"  />
            </div>
            
            <button className='submit-btn' onClick={(e)=>{
              e.preventDefault()
              setLocation();
            }} >Submit</button>
        </form>
    </div>

    { myLocation &&
      <div className="alert-box">
        <h1 >Alert !</h1>
        <p className='alert'>There are some incidents reported in your area. Please stay safe.</p>
    </div>
    }

    <form className='location-form' style={{display:"inline-block"}}>
        <h1 className='section-header'>Report an Incident</h1>
        <div className="form-item">
            <label htmlFor="IncidentType">Incident Type</label>
            <select id="IncidentType" name="IncidentType" style={{marginLeft:"66px"}}>
                <option value="Flood">Flood</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Fire">Fire</option>
                <option value="Cyclone">Cyclone</option>
                <option value="Accident">Accident</option>
                <option value="Others">Others</option>
            </select>
        </div>
        <div className="form-item">
            <label htmlFor="IncidentDate" >Incident Date</label>
            <input type="datetime-local" id="IncidentDate" name="IncidentDate" style={{marginLeft:"66px"}} />
        </div>
        <div className="form-item">
            <label htmlFor="LocationID">Location ID</label>
            <input type="number" id="LocationID" name="LocationID" style={{marginLeft:"82px"}} />
            
          </div>
        <div className="form-item">
            
            <label htmlFor="IncidentLocation">Incident Location</label>
            <input type="text" id="IncidentLocation" name="IncidentLocation" style={{marginLeft:"34px"}} />
            </div>
            
        <div className="form-item">
            
            <label htmlFor="IncidentDescription">Incident Description</label>
            <input id="IncidentDescription" name="IncidentDescription" style={{marginLeft:"10px"}}  />
        </div>
        <div className="form-item">
            <label htmlFor="Affected">Affected Individuals</label>
            <input type="number" id="Affected" name="Affected" style={{marginLeft:"12px"}} />
        </div>
        <div className="form-item">
            <label htmlFor="IncidentStatus">Incident Status</label>
            <select id="IncidentStatus" name="IncidentStatus" style={{marginLeft:"51px"}}>
              <option value="Running">Running</option>
              <option value="Expired">Expired</option>
            </select>
        </div>
        <div className="form-item">
            <label htmlFor="Urgency">Urgency</label>  
            <select id="Urgency" name="Urgency" style={{marginLeft:"107px"}}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
        </div>
        <button type='button' className='submit-btn' onClick={()=>{
          submitIncident();
          
        }}>Submit</button>
    </form>
    
    

    
    <h1 className='section-header'>Scan your area</h1>
        
        { locations &&
          <Map locations={locations} longitude={longitude} latitude={latitude} defaultZoom={12.5} />
        }



<h1 className='section-header' >
  Recent List of Incidents </h1> 
<table className='incident-table' >
  <tr>
    <th>Incident ID</th>
    <th>Incident Type</th>
    <th>Incident Date</th>
    <th>Incident Location</th>
    <th>Incident Description</th>
    <th>Incident Status</th>
    <th>Urgency</th>
  </tr>
  {
    incidents && incidents.map(incident => (
      <tr key={incident.IncidentID}>
        <td>{incident.IncidentID}</td>
        <td>{incident.IncidentType}</td>
        <td>{incident.DateReported}</td>
        <td>{incident.Location ? JSON.stringify(incident.Location.coordinates) : 'N/A'}</td>
        <td>{incident.Description}</td>
        <td>{incident.Status}</td>
        <td>{incident.Urgency}</td>
      </tr>
    ))
  }
</table>

            </div>
  )
}
