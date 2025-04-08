import { useState } from "react";
import { useSelector } from "react-redux";

const EmailVerificationCard = ({ user }) => {
  const [showCard, setShowCard] = useState(true);


  const getMailProviderUrl = (email) => {
    if (!email) return "#";
    if (email.includes("gmail.com")) return "https://mail.google.com/";
    if (email.includes("outlook.com") || email.includes("hotmail.com"))
      return "https://outlook.live.com/mail/";
    if (email.includes("yahoo.com")) return "https://mail.yahoo.com/";
    return "mailto:" + email;
  };

  if (user?.isVerified || !showCard) return null;

  return (
    <div className="flex items-center justify-center mb-4">
      <div className="card bg-neutral text-neutral-content w-6xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Verify Your Email!</h2>
          <p>
            We noticed that you haven't verified your email yet. Go to your
            inbox and confirm the link we sent you. If it doesn't appear,
            check your spam folder.
          </p>
          <div className="card-actions justify-end">
            <a
              href={getMailProviderUrl(user?.email)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="btn btn-primary">Ir al correo</button>
            </a>
            <button
              className="btn btn-ghost"
              onClick={() => setShowCard(false)}
            >
              Deny
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationCard;
