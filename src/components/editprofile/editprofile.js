import React, { useEffect, useState } from 'react';
import { useAuth } from '../authprovider';
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState({ fullname: '', email: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "Users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("User data does not exist");
          }
        } catch (error) {
          setError("Error fetching user data");
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("User is not logged in");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "Users", currentUser.uid);
      await updateDoc(docRef, userDetails);
      navigate('/profile');
    } catch (error) {
      setError("Error updating profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4 mb-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">
              <h4>Edit Profile</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullname" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    name="fullname"
                    value={userDetails.fullname}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
