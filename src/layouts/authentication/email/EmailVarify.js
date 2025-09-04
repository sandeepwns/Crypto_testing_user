import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "services/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then((res) => {
          setMessage(res.data.message || "Email verified ✅");
          setStatus("success");

          // Redirect after 2 seconds
          setTimeout(() => navigate("/authentication/sign-in"), 4000);
        })
        .catch((err) => {
          console.log(err, "Email verification error");
          setMessage(err.response?.data?.message || "Verification failed ❌");
          setStatus("error");
        });
    } else {
      setMessage("Invalid verification link.");
      setStatus("error");
    }
  }, [token, navigate]);
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-50"
      style={{ marginTop: "190px", display: "flex", justifyContent: "center" }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
        {status === "success" && (
          <>
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-700">{message}</h2>
            <p className="text-gray-500 mt-2">Redirecting to login page...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-700">{message}</h2>
            <p className="text-gray-500 mt-2">Please try again or contact support.</p>
          </>
        )}

        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4 border-gray-200 mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-700">Verifying your email...</h2>
            <p className="text-gray-500 mt-2">Please wait a moment.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
