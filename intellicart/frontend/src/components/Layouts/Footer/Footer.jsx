import { useEffect, useState } from 'react';
import WorkIcon from '@mui/icons-material/Work';
import StarsIcon from '@mui/icons-material/Stars';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HelpIcon from '@mui/icons-material/Help';
import paymentMethods from '../../../assets/images/payment-methods.svg';
import { useLocation } from 'react-router-dom';

const footerLinks = [
  {
    title: "about",
    links: [
      { name: "Contact Us", redirect: "/contact" },
      { name: "About Intelli-Cart", redirect: "/about" },
      { name: "Careers", redirect: "/careers" },
      { name: "Intelli-Cart Stories", redirect: "/stories" },
      { name: "Press", redirect: "/press" },
      { name: "Intelli-Cart Wholesale", redirect: "/wholesale" },
      { name: "Corporate Information", redirect: "/corporate" },
    ]
  },
  {
    title: "help",
    links: [
      { name: "Payments", redirect: "/payments" },
      { name: "Shipping", redirect: "/shipping" },
      { name: "Cancellation & Returns", redirect: "/returns" },
      { name: "FAQ", redirect: "/faq" }
    ]
  },
  {
    title: "policy",
    links: [
      { name: "Return Policy", redirect: "/return-policy" },
      { name: "Terms Of Use", redirect: "/terms" },
      { name: "Security", redirect: "/security" },
      { name: "Privacy", redirect: "/privacy" },
      { name: "Sitemap", redirect: "/sitemap" },
      { name: "EPR Compliance", redirect: "/epr" },
    ]
  },
  {
    title: "social",
    links: [
      { name: "Facebook", redirect: "https://facebook.com" },
      { name: "Twitter", redirect: "https://twitter.com" },
      { name: "YouTube", redirect: "https://youtube.com" }
    ]
  }
];

const Footer = () => {

  const location = useLocation();
  const [adminRoute, setAdminRoute] = useState(false);

  useEffect(() => {
    setAdminRoute(location.pathname.split("/", 2).includes("admin"))
  }, [location]);

  return (
    <>
      {!adminRoute && (
        <>
          <footer className="mt-20 w-full py-1 sm:py-4 px-4 sm:px-12 bg-primary-darkBlue text-white text-xs border-b border-gray-600 flex flex-col sm:flex-row overflow-hidden">
            <div className="w-full sm:w-7/12 flex flex-col sm:flex-row">

              {footerLinks.map((el, i) => (
                <div className="w-full sm:w-1/5 flex flex-col gap-2 my-3 sm:my-6 ml-5" key={i}>
                  <h2 className="text-primary-grey mb-2 uppercase">{el.title}</h2>
                  {el.links.map((item, i) => (
                    <a href={item.redirect} className="hover:underline" key={i}>{item.name}</a>
                  ))}
                </div>
              ))}

            </div>

            <div className="border-gray-600 h-36 w-1 border-l mr-5 mt-6 hidden sm:block"></div>

            <div className="w-full sm:w-5/12 my-6 mx-5 sm:mx-0 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
              <div className="w-full sm:w-1/2">
                <h2 className="text-primary-grey">Mail Us:</h2>
                <p className="mt-2 leading-5">
                  For any queries or support, reach us at:<br />
                  <a
                    href="mailto:tiwariraushan60@gmail.com"
                    className="text-primary-blue"
                  >
                    tiwariraushan60@gmail.com
                  </a>
                </p>
              </div>


              <div className="w-full sm:w-1/2">
                <h2 className="text-primary-grey">Registered Office Address:</h2>
                <p className="mt-2 leading-5">
                  Orbique Technologies Private Limited,<br />
                  Sector 58,<br />
                  Noida – 201301,<br />
                  Uttar Pradesh, India<br />
                  Telephone:{" "}
                  <a className="text-primary-blue" href="tel:+919999999999">
                    +91 99999 99999
                  </a>
                </p>
              </div>
            </div>

          </footer>

          <div className="px-16 py-6 w-full bg-primary-darkBlue hidden sm:flex justify-between items-center text-sm text-white">
            <a href="/sell" className="flex items-center gap-2">
              <span className="text-yellow-400"><WorkIcon sx={{ fontSize: "20px" }} /></span> Sell On Intelli-Cart
            </a>
            <a href="/advertise" className="flex items-center gap-2">
              <span className="text-yellow-400"><StarsIcon sx={{ fontSize: "20px" }} /></span> Advertise
            </a>
            <a href="/gift-cards" className="flex items-center gap-2">
              <span className="text-yellow-400"><CardGiftcardIcon sx={{ fontSize: "20px" }} /></span> Gift Cards
            </a>
            <a href="/help" className="flex items-center gap-2">
              <span className="text-yellow-400"><HelpIcon sx={{ fontSize: "20px" }} /></span> Help Center
            </a>

            <span>&copy; 2007-{new Date().getFullYear()} Intelli-Cart.com</span>

            <img draggable="false" src={paymentMethods} alt="Card Payment" />
          </div>
        </>
      )}
    </>
  )
};

export default Footer;
