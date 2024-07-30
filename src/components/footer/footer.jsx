import React from 'react';
import './footer.css';
import { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer py-5 bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-white">About Us</a></li>
              <li><a href="contactus" className="text-white">Contact Us</a></li>
              <li><a href="/privacypolicy" className="text-white">Privacy Policy</a></li>
              <li><a href="/termsandconditions" className="text-white">Terms & Conditions</a></li>
              <li><a href="/faqs" className="text-white">FAQs & Help</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Contact</h5>
            <p>123 Street, Bhuj-Kutch, India </p>
            <p>+012 345 67890</p>
            <p><a href="mailto:mail@domain.com" className="text-white">mail@domain.com</a></p>
            <div>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-white me-2"><FaFacebookSquare size={24} /></a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-white me-2"><FaTwitterSquare size={24} /></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-white"><FaInstagramSquare size={24} /></a>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Gallery</h5>
            <div className="row g-2">
              <div className="col-4">
                <img src="https://bsmedia.business-standard.com/_media/bs/img/article/2021-12/03/full/1638506038-4213.jpg?im=FeatureCrop,size=(826,465)" alt='' className='img-fluid' />
              </div>
              <div className="col-4">
                <img src="https://t3.ftcdn.net/jpg/03/88/97/92/360_F_388979227_lKgqMJPO5ExItAuN4tuwyPeiknwrR7t2.jpg" alt='' className='img-fluid' />
              </div>
              <div className="col-4">
                <img src="https://assets.telegraphindia.com/telegraph/2022/Sep/1663916165_college-students.jpg" alt='' className='img-fluid' />
              </div>
              <div className="col-4">
                <img src="https://t4.ftcdn.net/jpg/05/39/10/47/360_F_539104776_BchIZKRhIUXDY0ZaVHxaoIDvRa2eAG3d.jpg" alt='' className='img-fluid' />
              </div>
              <div className="col-4">
                <img src="https://img.freepik.com/free-photo/smiling-students-with-backpacks_1098-1220.jpg" alt='' className='img-fluid' />
              </div>
              <div className="col-4">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2O888RN-XsTtJSLufs6jQI7K0YNDuBIT0elwNoDbknCLI_cacarUZ69Q5TiEc5e5Y9B4&usqp=CAU" alt='' className='img-fluid' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
