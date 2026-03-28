import { useState } from "react";
import Onboarding from "./components/Onboarding";
import Feed from "./components/Feed";

function App() {
  const [userProfile, setUserProfile] = useState(null);

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
  };

  const handleResetProfile = () => {
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen">
      {!userProfile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Feed userProfile={userProfile} onResetProfile={handleResetProfile} />
      )}
    </div>
  );
}

export default App;
